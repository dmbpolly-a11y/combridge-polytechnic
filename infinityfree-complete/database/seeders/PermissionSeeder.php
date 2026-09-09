<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User Management
            ['name' => 'users.view', 'display_name' => 'View Users', 'module' => 'users'],
            ['name' => 'users.create', 'display_name' => 'Create Users', 'module' => 'users'],
            ['name' => 'users.edit', 'display_name' => 'Edit Users', 'module' => 'users'],
            ['name' => 'users.delete', 'display_name' => 'Delete Users', 'module' => 'users'],

            // Student Management
            ['name' => 'students.view', 'display_name' => 'View Students', 'module' => 'students'],
            ['name' => 'students.create', 'display_name' => 'Create Students', 'module' => 'students'],
            ['name' => 'students.edit', 'display_name' => 'Edit Students', 'module' => 'students'],
            ['name' => 'students.delete', 'display_name' => 'Delete Students', 'module' => 'students'],

            // Teacher Management
            ['name' => 'teachers.view', 'display_name' => 'View Teachers', 'module' => 'teachers'],
            ['name' => 'teachers.create', 'display_name' => 'Create Teachers', 'module' => 'teachers'],
            ['name' => 'teachers.edit', 'display_name' => 'Edit Teachers', 'module' => 'teachers'],
            ['name' => 'teachers.delete', 'display_name' => 'Delete Teachers', 'module' => 'teachers'],

            // Department Management
            ['name' => 'departments.view', 'display_name' => 'View Departments', 'module' => 'departments'],
            ['name' => 'departments.create', 'display_name' => 'Create Departments', 'module' => 'departments'],
            ['name' => 'departments.edit', 'display_name' => 'Edit Departments', 'module' => 'departments'],
            ['name' => 'departments.delete', 'display_name' => 'Delete Departments', 'module' => 'departments'],

            // Programme Management
            ['name' => 'programmes.view', 'display_name' => 'View Programmes', 'module' => 'programmes'],
            ['name' => 'programmes.create', 'display_name' => 'Create Programmes', 'module' => 'programmes'],
            ['name' => 'programmes.edit', 'display_name' => 'Edit Programmes', 'module' => 'programmes'],
            ['name' => 'programmes.delete', 'display_name' => 'Delete Programmes', 'module' => 'programmes'],

            // Subject Management
            ['name' => 'subjects.view', 'display_name' => 'View Subjects', 'module' => 'subjects'],
            ['name' => 'subjects.create', 'display_name' => 'Create Subjects', 'module' => 'subjects'],
            ['name' => 'subjects.edit', 'display_name' => 'Edit Subjects', 'module' => 'subjects'],
            ['name' => 'subjects.delete', 'display_name' => 'Delete Subjects', 'module' => 'subjects'],

            // Class Management
            ['name' => 'classes.view', 'display_name' => 'View Classes', 'module' => 'classes'],
            ['name' => 'classes.create', 'display_name' => 'Create Classes', 'module' => 'classes'],
            ['name' => 'classes.edit', 'display_name' => 'Edit Classes', 'module' => 'classes'],
            ['name' => 'classes.delete', 'display_name' => 'Delete Classes', 'module' => 'classes'],

            // Attendance Management
            ['name' => 'attendance.view', 'display_name' => 'View Attendance', 'module' => 'attendance'],
            ['name' => 'attendance.mark', 'display_name' => 'Mark Attendance', 'module' => 'attendance'],
            ['name' => 'attendance.edit', 'display_name' => 'Edit Attendance', 'module' => 'attendance'],

            // Examination Management
            ['name' => 'examinations.view', 'display_name' => 'View Examinations', 'module' => 'examinations'],
            ['name' => 'examinations.create', 'display_name' => 'Create Examinations', 'module' => 'examinations'],
            ['name' => 'examinations.edit', 'display_name' => 'Edit Examinations', 'module' => 'examinations'],
            ['name' => 'examinations.delete', 'display_name' => 'Delete Examinations', 'module' => 'examinations'],
            ['name' => 'marks.enter', 'display_name' => 'Enter Marks', 'module' => 'examinations'],
            ['name' => 'marks.edit', 'display_name' => 'Edit Marks', 'module' => 'examinations'],

            // Fee Management
            ['name' => 'fees.view', 'display_name' => 'View Fees', 'module' => 'fees'],
            ['name' => 'fees.collect', 'display_name' => 'Collect Fees', 'module' => 'fees'],
            ['name' => 'fees.edit', 'display_name' => 'Edit Fee Records', 'module' => 'fees'],
            ['name' => 'fees.reports', 'display_name' => 'View Fee Reports', 'module' => 'fees'],

            // Library Management
            ['name' => 'library.view', 'display_name' => 'View Library', 'module' => 'library'],
            ['name' => 'library.manage', 'display_name' => 'Manage Library', 'module' => 'library'],
            ['name' => 'books.issue', 'display_name' => 'Issue Books', 'module' => 'library'],
            ['name' => 'books.return', 'display_name' => 'Return Books', 'module' => 'library'],

            // Timetable Management
            ['name' => 'timetable.view', 'display_name' => 'View Timetable', 'module' => 'timetable'],
            ['name' => 'timetable.create', 'display_name' => 'Create Timetable', 'module' => 'timetable'],
            ['name' => 'timetable.edit', 'display_name' => 'Edit Timetable', 'module' => 'timetable'],

            // Announcements
            ['name' => 'announcements.view', 'display_name' => 'View Announcements', 'module' => 'announcements'],
            ['name' => 'announcements.create', 'display_name' => 'Create Announcements', 'module' => 'announcements'],
            ['name' => 'announcements.edit', 'display_name' => 'Edit Announcements', 'module' => 'announcements'],
            ['name' => 'announcements.delete', 'display_name' => 'Delete Announcements', 'module' => 'announcements'],

            // Reports
            ['name' => 'reports.view', 'display_name' => 'View Reports', 'module' => 'reports'],
            ['name' => 'reports.generate', 'display_name' => 'Generate Reports', 'module' => 'reports'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        // Assign permissions to Administrator role (all permissions)
        $adminRole = Role::where('name', 'administrator')->first();
        if ($adminRole) {
            $allPermissions = Permission::all();
            $adminRole->permissions()->sync($allPermissions->pluck('id'));
        }

        // Assign permissions to Director role
        $directorRole = Role::where('name', 'director')->first();
        if ($directorRole) {
            $directorPermissions = Permission::whereIn('module', [
                'users', 'students', 'teachers', 'departments', 'programmes',
                'subjects', 'classes', 'reports', 'announcements'
            ])->get();
            $directorRole->permissions()->sync($directorPermissions->pluck('id'));
        }

        // Assign permissions to Dean role
        $deanRole = Role::where('name', 'dean')->first();
        if ($deanRole) {
            $deanPermissions = Permission::whereIn('module', [
                'students', 'teachers', 'programmes', 'subjects', 'classes',
                'examinations', 'attendance', 'reports'
            ])->get();
            $deanRole->permissions()->sync($deanPermissions->pluck('id'));
        }

        // Assign permissions to HOD role
        $hodRole = Role::where('name', 'hod')->first();
        if ($hodRole) {
            $hodPermissions = Permission::whereIn('module', [
                'teachers', 'subjects', 'classes', 'attendance', 'timetable'
            ])->where('name', 'not like', '%.delete')->get();
            $hodRole->permissions()->sync($hodPermissions->pluck('id'));
        }

        // Assign permissions to Bursar role
        $bursarRole = Role::where('name', 'bursar')->first();
        if ($bursarRole) {
            $bursarPermissions = Permission::where('module', 'fees')->get();
            $bursarRole->permissions()->sync($bursarPermissions->pluck('id'));
        }

        // Assign permissions to Teacher role
        $teacherRole = Role::where('name', 'teacher')->first();
        if ($teacherRole) {
            $teacherPermissions = Permission::whereIn('name', [
                'students.view', 'attendance.view', 'attendance.mark',
                'examinations.view', 'marks.enter', 'timetable.view',
                'announcements.view'
            ])->get();
            $teacherRole->permissions()->sync($teacherPermissions->pluck('id'));
        }

        // Assign permissions to Librarian role
        $librarianRole = Role::where('name', 'librarian')->first();
        if ($librarianRole) {
            $librarianPermissions = Permission::where('module', 'library')->get();
            $librarianRole->permissions()->sync($librarianPermissions->pluck('id'));
        }

        // Assign permissions to Student role
        $studentRole = Role::where('name', 'student')->first();
        if ($studentRole) {
            $studentPermissions = Permission::whereIn('name', [
                'attendance.view', 'examinations.view', 'fees.view',
                'library.view', 'timetable.view', 'announcements.view'
            ])->get();
            $studentRole->permissions()->sync($studentPermissions->pluck('id'));
        }

        $this->command->info('Permissions seeded and assigned successfully!');
    }
}
