<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'administrator',
                'display_name' => 'Administrator',
                'description' => 'Full system access and control'
            ],
            [
                'name' => 'director',
                'display_name' => 'College Director',
                'description' => 'Oversees college operations and management'
            ],
            [
                'name' => 'dean',
                'display_name' => 'Dean',
                'description' => 'Manages academic affairs and programmes'
            ],
            [
                'name' => 'hod',
                'display_name' => 'Head of Department',
                'description' => 'Manages department activities and staff'
            ],
            [
                'name' => 'bursar',
                'display_name' => 'Bursar',
                'description' => 'Manages financial operations and fee collection'
            ],
            [
                'name' => 'teacher',
                'display_name' => 'Teacher',
                'description' => 'Teaches subjects and manages student assessments'
            ],
            [
                'name' => 'librarian',
                'display_name' => 'Librarian',
                'description' => 'Manages library resources and book circulation'
            ],
            [
                'name' => 'student',
                'display_name' => 'Student',
                'description' => 'Enrolled student with access to learning resources'
            ],
            [
                'name' => 'parent',
                'display_name' => 'Parent/Guardian',
                'description' => 'Monitors student progress and receives updates'
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }

        $this->command->info('Roles seeded successfully!');
    }
}
