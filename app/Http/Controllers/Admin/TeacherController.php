<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Role;
use App\Models\Department;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers.
     */
    public function index(Request $request)
    {
        $query = Teacher::with('user', 'department');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('staff_id', 'like', "%{$search}%");
        }

        // Filter by department
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('teacher_status', $request->status);
        }

        // Filter by employee type
        if ($request->filled('employee_type')) {
            $query->where('employee_type', $request->employee_type);
        }

        $teachers = $query->latest()->paginate(20);
        $departments = Department::active()->get();

        return view('admin.teachers.index', compact('teachers', 'departments'));
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create()
    {
        $departments = Department::active()->get();
        $subjects = Subject::active()->get();

        return view('admin.teachers.create', compact('departments', 'subjects'));
    }

    /**
     * Store a newly created teacher.
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
            
            'staff_id' => 'required|string|unique:teachers',
            'department_id' => 'required|exists:departments,id',
            'join_date' => 'required|date',
            'qualification' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'experience' => 'nullable|string',
            'salary' => 'nullable|numeric|min:0',
            'employee_type' => 'required|in:full-time,part-time,contract',
            'subjects' => 'nullable|array',
            'subjects.*' => 'exists:subjects,id',
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
                $path = $request->file('profile_photo')->store('teachers', 'public');
                $user->profile_photo = $path;
                $user->save();
            }

            // Assign teacher role
            $teacherRole = Role::where('name', 'teacher')->first();
            if ($teacherRole) {
                $user->roles()->attach($teacherRole->id);
            }

            // Create teacher record
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'staff_id' => $request->staff_id,
                'department_id' => $request->department_id,
                'join_date' => $request->join_date,
                'qualification' => $request->qualification,
                'specialization' => $request->specialization,
                'experience' => $request->experience,
                'salary' => $request->salary,
                'employee_type' => $request->employee_type,
                'teacher_status' => 'active',
            ]);

            // Attach subjects
            if ($request->filled('subjects')) {
                $teacher->subjects()->attach($request->subjects, [
                    'academic_year' => date('Y') . '/' . (date('Y') + 1)
                ]);
            }

            DB::commit();

            return redirect()->route('admin.teachers.index')
                ->with('success', 'Teacher created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating teacher: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified teacher.
     */
    public function show(Teacher $teacher)
    {
        $teacher->load('user', 'department', 'subjects', 'classesAsClassTeacher', 'timetables');

        $attendanceRate = $teacher->getAttendancePercentage();

        return view('admin.teachers.show', compact('teacher', 'attendanceRate'));
    }

    /**
     * Show the form for editing the teacher.
     */
    public function edit(Teacher $teacher)
    {
        $teacher->load('user', 'subjects');
        $departments = Department::active()->get();
        $subjects = Subject::active()->get();

        return view('admin.teachers.edit', compact('teacher', 'departments', 'subjects'));
    }

    /**
     * Update the specified teacher.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $teacher->user_id,
            'phone' => 'nullable|string|max:20',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            
            'staff_id' => 'required|string|unique:teachers,staff_id,' . $teacher->id,
            'department_id' => 'required|exists:departments,id',
            'join_date' => 'required|date',
            'qualification' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'experience' => 'nullable|string',
            'salary' => 'nullable|numeric|min:0',
            'employee_type' => 'required|in:full-time,part-time,contract',
            'teacher_status' => 'required|in:active,on_leave,retired,terminated',
            'subjects' => 'nullable|array',
            'subjects.*' => 'exists:subjects,id',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // Update user account
            $teacher->user->update([
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
                if ($teacher->user->profile_photo) {
                    \Storage::disk('public')->delete($teacher->user->profile_photo);
                }
                $path = $request->file('profile_photo')->store('teachers', 'public');
                $teacher->user->profile_photo = $path;
                $teacher->user->save();
            }

            // Update teacher record
            $teacher->update([
                'staff_id' => $request->staff_id,
                'department_id' => $request->department_id,
                'join_date' => $request->join_date,
                'qualification' => $request->qualification,
                'specialization' => $request->specialization,
                'experience' => $request->experience,
                'salary' => $request->salary,
                'employee_type' => $request->employee_type,
                'teacher_status' => $request->teacher_status,
            ]);

            // Update subjects
            if ($request->has('subjects')) {
                $teacher->subjects()->sync(
                    collect($request->subjects)->mapWithKeys(function ($subjectId) {
                        return [$subjectId => ['academic_year' => date('Y') . '/' . (date('Y') + 1)]];
                    })
                );
            }

            DB::commit();

            return redirect()->route('admin.teachers.show', $teacher)
                ->with('success', 'Teacher updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating teacher: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy(Teacher $teacher)
    {
        try {
            DB::beginTransaction();

            // Delete profile photo
            if ($teacher->user->profile_photo) {
                \Storage::disk('public')->delete($teacher->user->profile_photo);
            }

            // Delete teacher and user records
            $teacher->delete();
            $teacher->user->delete();

            DB::commit();

            return redirect()->route('admin.teachers.index')
                ->with('success', 'Teacher deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting teacher: ' . $e->getMessage());
        }
    }
}
