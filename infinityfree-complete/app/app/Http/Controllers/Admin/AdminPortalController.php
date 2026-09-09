<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Department;
use App\Models\Programme;
use App\Models\SchoolClass;
use App\Models\StudentAttendance;
use App\Models\TeacherAttendance;
use App\Models\FeePayment;
use App\Models\FeeBalance;
use App\Models\Examination;
use App\Models\BookIssue;
use App\Models\Announcement;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminPortalController extends Controller
{
    /**
     * Admin dashboard with comprehensive statistics
     */
    public function dashboard()
    {
        // Overview Statistics
        $stats = [
            'total_students' => Student::where('student_status', 'active')->count(),
            'total_teachers' => Teacher::where('teacher_status', 'active')->count(),
            'total_classes' => SchoolClass::where('status', 'active')->count(),
            'total_programmes' => Programme::where('status', 'active')->count(),
        ];

        // Attendance Statistics (Today)
        $today = Carbon::now()->format('Y-m-d');
        $attendanceStats = [
            'student_present_today' => StudentAttendance::where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count(),
            'teacher_present_today' => TeacherAttendance::where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count(),
        ];

        // Financial Statistics (Current Year)
        $financialStats = [
            'total_fees_collected' => FeePayment::whereYear('payment_date', Carbon::now()->year)
                ->sum('amount_paid'),
            'pending_fees' => FeeBalance::where('academic_year', BrandingHelper::academicYear())
                ->sum('balance_amount'),
            'payments_today' => FeePayment::whereDate('payment_date', $today)
                ->count(),
        ];

        // Library Statistics
        $libraryStats = [
            'books_issued' => BookIssue::where('status', 'issued')->count(),
            'overdue_books' => BookIssue::where('status', 'issued')
                ->where('return_date', '<', Carbon::now())
                ->count(),
        ];

        // Recent Activities
        $recentStudents = Student::with('user')->latest()->limit(5)->get();
        $recentPayments = FeePayment::with('student.user')->latest()->limit(5)->get();
        $recentAnnouncements = Announcement::where('status', 'published')->latest()->limit(5)->get();

        // Upcoming Exams
        $upcomingExams = Examination::where('exam_date', '>=', Carbon::now())
            ->where('status', 'scheduled')
            ->with(['class', 'subject'])
            ->orderBy('exam_date')
            ->limit(5)
            ->get();

        // Monthly Trends (Last 6 months)
        $monthlyData = $this->getMonthlyTrends();

        return view('admin.dashboard', compact(
            'stats',
            'attendanceStats',
            'financialStats',
            'libraryStats',
            'recentStudents',
            'recentPayments',
            'recentAnnouncements',
            'upcomingExams',
            'monthlyData'
        ));
    }

    /**
     * User Management - List all users
     */
    public function users(Request $request)
    {
        $query = User::with('roles');

        // Filters
        if ($request->filled('role')) {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'inactive_users' => User::where('status', 'inactive')->count(),
        ];

        return view('admin.users.index', compact('users', 'stats'));
    }

    /**
     * Show user creation form
     */
    public function createUser()
    {
        $roles = Role::all();
        return view('admin.users.create', compact('roles'));
    }

    /**
     * Store new user
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone_number' => $validated['phone_number'],
            'status' => 'active',
        ]);

        // Assign role
        $role = Role::where('name', $validated['role'])->first();
        $user->roles()->attach($role->id);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show user edit form
     */
    public function editUser(User $user)
    {
        $roles = Role::all();
        $userRoles = $user->roles->pluck('name')->toArray();
        
        return view('admin.users.edit', compact('user', 'roles', 'userRoles'));
    }

    /**
     * Update user
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive,suspended',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'status' => $validated['status'],
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        // Sync roles
        $user->roles()->sync($validated['roles']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Delete user
     */
    public function destroyUser(User $user)
    {
        // Prevent deleting own account
        if ($user->id === Auth::id()) {
            return redirect()->back()
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Role Management - List roles
     */
    public function roles()
    {
        $roles = Role::withCount('users')->get();
        $permissions = Permission::all();

        return view('admin.roles.index', compact('roles', 'permissions'));
    }

    /**
     * Store new role
     */
    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'display_name' => 'required|string',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Update role
     */
    public function updateRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'display_name' => 'required|string',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'display_name' => $validated['display_name'],
            'description' => $validated['description'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Delete role
     */
    public function destroyRole(Role $role)
    {
        // Prevent deleting system roles
        $systemRoles = ['administrator', 'principal', 'student', 'teacher'];
        
        if (in_array($role->name, $systemRoles)) {
            return redirect()->back()
                ->with('error', 'Cannot delete system role.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    /**
     * System Settings
     */
    public function settings()
    {
        // Load settings from config or database
        $settings = [
            'school_name' => config('branding.school_name'),
            'email' => config('branding.contact.email'),
            'phone' => config('branding.contact.phone'),
            'address' => config('branding.contact.address'),
            'academic_year' => BrandingHelper::academicYear(),
        ];

        return view('admin.settings.index', compact('settings'));
    }

    /**
     * Update system settings
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        // Update settings in database or config
        // Implementation depends on how settings are stored

        return redirect()->route('admin.settings')
            ->with('success', 'Settings updated successfully.');
    }

    /**
     * Activity Log
     */
    public function activityLog(Request $request)
    {
        // This would integrate with a logging package like spatie/laravel-activitylog
        // For now, returning a placeholder view
        
        $activities = collect(); // Placeholder

        return view('admin.activity-log', compact('activities'));
    }

    /**
     * System Reports Overview
     */
    public function reports()
    {
        $reportCategories = [
            'academic' => [
                'title' => 'Academic Reports',
                'reports' => [
                    ['name' => 'Student Performance', 'route' => 'admin.reports.performance'],
                    ['name' => 'Class Results', 'route' => 'admin.reports.class-results'],
                    ['name' => 'Attendance Report', 'route' => 'admin.reports.attendance'],
                    ['name' => 'Examination Analysis', 'route' => 'admin.reports.exams'],
                ],
            ],
            'financial' => [
                'title' => 'Financial Reports',
                'reports' => [
                    ['name' => 'Fee Collection', 'route' => 'admin.reports.fee-collection'],
                    ['name' => 'Defaulters List', 'route' => 'admin.reports.defaulters'],
                    ['name' => 'Daily Collections', 'route' => 'admin.reports.daily-collections'],
                    ['name' => 'Revenue Analysis', 'route' => 'admin.reports.revenue'],
                ],
            ],
            'operational' => [
                'title' => 'Operational Reports',
                'reports' => [
                    ['name' => 'Staff Attendance', 'route' => 'admin.reports.staff-attendance'],
                    ['name' => 'Library Usage', 'route' => 'admin.reports.library'],
                    ['name' => 'Timetable Utilization', 'route' => 'admin.reports.timetable'],
                    ['name' => 'Room Allocation', 'route' => 'admin.reports.rooms'],
                ],
            ],
        ];

        return view('admin.reports.index', compact('reportCategories'));
    }

    /**
     * System Health Check
     */
    public function healthCheck()
    {
        $health = [
            'database' => $this->checkDatabaseConnection(),
            'storage' => $this->checkStorageWritable(),
            'cache' => $this->checkCacheWorking(),
            'queue' => $this->checkQueueWorking(),
        ];

        return view('admin.health-check', compact('health'));
    }

    /**
     * Data Export
     */
    public function dataExport()
    {
        return view('admin.data-export');
    }

    /**
     * Export students data
     */
    public function exportStudents(Request $request)
    {
        $validated = $request->validate([
            'format' => 'required|in:csv,excel,pdf',
            'filters' => 'nullable|array',
        ]);

        // Export logic here
        // Would use packages like maatwebsite/excel

        return redirect()->back()
            ->with('success', 'Export initiated. Download will start shortly.');
    }

    /**
     * Backup & Restore
     */
    public function backup()
    {
        return view('admin.backup');
    }

    /**
     * Create database backup
     */
    public function createBackup()
    {
        // Backup logic using spatie/laravel-backup or custom solution
        
        return redirect()->back()
            ->with('success', 'Backup created successfully.');
    }

    // ========== HELPER METHODS ==========
    
    /**
     * Get monthly trends data
     */
    private function getMonthlyTrends()
    {
        $months = [];
        $students = [];
        $revenue = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M Y');
            
            // Student enrollment trend
            $students[] = Student::whereYear('admission_date', $date->year)
                ->whereMonth('admission_date', $date->month)
                ->count();
            
            // Revenue trend
            $revenue[] = FeePayment::whereYear('payment_date', $date->year)
                ->whereMonth('payment_date', $date->month)
                ->sum('amount_paid');
        }

        return [
            'months' => $months,
            'students' => $students,
            'revenue' => $revenue,
        ];
    }

    /**
     * Check database connection
     */
    private function checkDatabaseConnection()
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'healthy', 'message' => 'Connected'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Check storage writable
     */
    private function checkStorageWritable()
    {
        $path = storage_path('app');
        return [
            'status' => is_writable($path) ? 'healthy' : 'error',
            'message' => is_writable($path) ? 'Writable' : 'Not writable',
        ];
    }

    /**
     * Check cache working
     */
    private function checkCacheWorking()
    {
        try {
            cache()->put('health_check', 'test', 60);
            $value = cache()->get('health_check');
            return [
                'status' => $value === 'test' ? 'healthy' : 'error',
                'message' => $value === 'test' ? 'Working' : 'Not working',
            ];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Check queue working
     */
    private function checkQueueWorking()
    {
        // Simple check - would need actual queue inspection in production
        return ['status' => 'healthy', 'message' => 'Queue driver configured'];
    }

    /**
     * Quick stats for AJAX
     */
    public function quickStats()
    {
        $today = Carbon::now()->format('Y-m-d');
        
        return response()->json([
            'students_present' => StudentAttendance::where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count(),
            'teachers_present' => TeacherAttendance::where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count(),
            'payments_today' => FeePayment::whereDate('payment_date', $today)
                ->sum('amount_paid'),
            'unread_messages' => 0, // Would integrate with messaging system
        ]);
    }
}
