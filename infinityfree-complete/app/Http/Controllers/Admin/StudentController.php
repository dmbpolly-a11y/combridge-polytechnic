<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Models\Role;
use App\Models\Programme;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request)
    {
        $query = Student::with('user', 'programme', 'class');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('admission_number', 'like', "%{$search}%");
        }

        // Filter by programme
        if ($request->filled('programme_id')) {
            $query->where('programme_id', $request->programme_id);
        }

        // Filter by class
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('student_status', $request->status);
        }

        $students = $query->latest()->paginate(20);
        $programmes = Programme::active()->get();
        $classes = SchoolClass::active()->get();

        return view('admin.students.index', compact('students', 'programmes', 'classes'));
    }

    /**
     * Show the form for creating a new student.
     */
    public function create()
    {
        $programmes = Programme::active()->get();
        $classes = SchoolClass::active()->get();

        return view('admin.students.create', compact('programmes', 'classes'));
    }

    /**
     * Store a newly created student.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
            
            'admission_number' => 'required|string|unique:students',
            'programme_id' => 'required|exists:programmes,id',
            'class_id' => 'nullable|exists:classes,id',
            'admission_date' => 'required|date',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_address' => 'nullable|string',
            'previous_school' => 'nullable|string|max:255',
            'national_id' => 'nullable|string|max:50',
            'blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            // Handle profile photo upload
            if ($request->hasFile('profile_photo')) {
                $path = $request->file('profile_photo')->store('students', 'public');
                $user->profile_photo = $path;
                $user->save();
            }

            // Assign student role
            $studentRole = Role::where('name', 'student')->first();
            if ($studentRole) {
                $user->roles()->attach($studentRole->id);
            }

            // Create student record
            $student = Student::create([
                'user_id' => $user->id,
                'admission_number' => $request->admission_number,
                'programme_id' => $request->programme_id,
                'class_id' => $request->class_id,
                'admission_date' => $request->admission_date,
                'guardian_name' => $request->guardian_name,
                'guardian_phone' => $request->guardian_phone,
                'guardian_email' => $request->guardian_email,
                'guardian_address' => $request->guardian_address,
                'previous_school' => $request->previous_school,
                'national_id' => $request->national_id,
                'blood_group' => $request->blood_group,
                'student_status' => 'active',
            ]);

            DB::commit();

            return redirect()->route('admin.students.index')
                ->with('success', 'Student created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating student: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified student.
     */
    public function show(Student $student)
    {
        $student->load('user', 'programme', 'class', 'attendanceRecords', 'examResults', 'feePayments');

        $attendanceRate = $student->getAttendancePercentage();
        $feeBalance = $student->getCurrentBalance(date('Y'));

        return view('admin.students.show', compact('student', 'attendanceRate', 'feeBalance'));
    }

    /**
     * Show the form for editing the student.
     */
    public function edit(Student $student)
    {
        $student->load('user');
        $programmes = Programme::active()->get();
        $classes = SchoolClass::active()->get();

        return view('admin.students.edit', compact('student', 'programmes', 'classes'));
    }

    /**
     * Update the specified student.
     */
    public function update(Request $request, Student $student)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $student->user_id,
            'phone' => 'nullable|string|max:20',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            
            'admission_number' => 'required|string|unique:students,admission_number,' . $student->id,
            'programme_id' => 'required|exists:programmes,id',
            'class_id' => 'nullable|exists:classes,id',
            'admission_date' => 'required|date',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_address' => 'nullable|string',
            'previous_school' => 'nullable|string|max:255',
            'national_id' => 'nullable|string|max:50',
            'blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'student_status' => 'required|in:active,graduated,suspended,withdrawn,deferred',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // Update user account
            $student->user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
            ]);

            // Handle profile photo upload
            if ($request->hasFile('profile_photo')) {
                // Delete old photo if exists
                if ($student->user->profile_photo) {
                    \Storage::disk('public')->delete($student->user->profile_photo);
                }
                $path = $request->file('profile_photo')->store('students', 'public');
                $student->user->profile_photo = $path;
                $student->user->save();
            }

            // Update student record
            $student->update([
                'admission_number' => $request->admission_number,
                'programme_id' => $request->programme_id,
                'class_id' => $request->class_id,
                'admission_date' => $request->admission_date,
                'guardian_name' => $request->guardian_name,
                'guardian_phone' => $request->guardian_phone,
                'guardian_email' => $request->guardian_email,
                'guardian_address' => $request->guardian_address,
                'previous_school' => $request->previous_school,
                'national_id' => $request->national_id,
                'blood_group' => $request->blood_group,
                'student_status' => $request->student_status,
            ]);

            DB::commit();

            return redirect()->route('admin.students.show', $student)
                ->with('success', 'Student updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating student: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified student.
     */
    public function destroy(Student $student)
    {
        try {
            DB::beginTransaction();

            // Delete profile photo
            if ($student->user->profile_photo) {
                \Storage::disk('public')->delete($student->user->profile_photo);
            }

            // Delete student and user records (cascade will handle related records)
            $student->delete();
            $student->user->delete();

            DB::commit();

            return redirect()->route('admin.students.index')
                ->with('success', 'Student deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting student: ' . $e->getMessage());
        }
    }

    /**
     * Export students data.
     */
    public function export(Request $request)
    {
        // Implement export functionality (Excel/PDF)
        // You can use maatwebsite/excel package
        return back()->with('info', 'Export functionality coming soon.');
    }
}
