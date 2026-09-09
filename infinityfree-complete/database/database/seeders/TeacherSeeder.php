<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = DB::table('roles')->get();
        $teacherRole = $roles->firstWhere('name', 'teacher');
        $deanRole = $roles->firstWhere('name', 'dean');
        
        $departments = DB::table('departments')->get();

        $teachers = [
            // IT Department
            [
                'first_name' => 'Robert',
                'last_name' => 'Ssebunya',
                'email' => 'r.ssebunya@combridgecentre.ac.ug',
                'phone' => '+256703456789',
                'department_id' => $departments->firstWhere('code', 'IT')->id,
                'specialization' => 'Software Development',
                'qualification' => 'MSc Computer Science',
                'employee_number' => 'TCH001',
                'is_dean' => true,
            ],
            [
                'first_name' => 'Mary',
                'last_name' => 'Nalumansi',
                'email' => 'm.nalumansi@combridgecentre.ac.ug',
                'phone' => '+256704567890',
                'department_id' => $departments->firstWhere('code', 'IT')->id,
                'specialization' => 'Database Systems',
                'qualification' => 'BSc Information Technology',
                'employee_number' => 'TCH002',
                'is_dean' => false,
            ],
            [
                'first_name' => 'John',
                'last_name' => 'Kayongo',
                'email' => 'j.kayongo@combridgecentre.ac.ug',
                'phone' => '+256705678901',
                'department_id' => $departments->firstWhere('code', 'IT')->id,
                'specialization' => 'Network Administration',
                'qualification' => 'BSc Computer Networks',
                'employee_number' => 'TCH003',
                'is_dean' => false,
            ],
            
            // Business Department
            [
                'first_name' => 'Patricia',
                'last_name' => 'Auma',
                'email' => 'p.auma@combridgecentre.ac.ug',
                'phone' => '+256706789012',
                'department_id' => $departments->firstWhere('code', 'BUS')->id,
                'specialization' => 'Business Administration',
                'qualification' => 'MBA',
                'employee_number' => 'TCH004',
                'is_dean' => true,
            ],
            [
                'first_name' => 'Andrew',
                'last_name' => 'Musoke',
                'email' => 'a.musoke@combridgecentre.ac.ug',
                'phone' => '+256707890123',
                'department_id' => $departments->firstWhere('code', 'BUS')->id,
                'specialization' => 'Accounting',
                'qualification' => 'CPA, BSc Accounting',
                'employee_number' => 'TCH005',
                'is_dean' => false,
            ],
            [
                'first_name' => 'Rebecca',
                'last_name' => 'Nalwadda',
                'email' => 'r.nalwadda@combridgecentre.ac.ug',
                'phone' => '+256708901234',
                'department_id' => $departments->firstWhere('code', 'BUS')->id,
                'specialization' => 'Marketing',
                'qualification' => 'MSc Marketing',
                'employee_number' => 'TCH006',
                'is_dean' => false,
            ],
            
            // Technical Department
            [
                'first_name' => 'Charles',
                'last_name' => 'Okumu',
                'email' => 'c.okumu@combridgecentre.ac.ug',
                'phone' => '+256709012345',
                'department_id' => $departments->firstWhere('code', 'TECH')->id,
                'specialization' => 'Electrical Engineering',
                'qualification' => 'BEng Electrical Engineering',
                'employee_number' => 'TCH007',
                'is_dean' => true,
            ],
            [
                'first_name' => 'Samuel',
                'last_name' => 'Lwanga',
                'email' => 's.lwanga@combridgecentre.ac.ug',
                'phone' => '+256710123456',
                'department_id' => $departments->firstWhere('code', 'TECH')->id,
                'specialization' => 'Automotive Technology',
                'qualification' => 'Diploma Automotive Engineering',
                'employee_number' => 'TCH008',
                'is_dean' => false,
            ],
            [
                'first_name' => 'Moses',
                'last_name' => 'Kato',
                'email' => 'm.kato@combridgecentre.ac.ug',
                'phone' => '+256711234567',
                'department_id' => $departments->firstWhere('code', 'TECH')->id,
                'specialization' => 'Civil Engineering',
                'qualification' => 'BEng Civil Engineering',
                'employee_number' => 'TCH009',
                'is_dean' => false,
            ],
            
            // Science Department
            [
                'first_name' => 'Elizabeth',
                'last_name' => 'Nakirya',
                'email' => 'e.nakirya@combridgecentre.ac.ug',
                'phone' => '+256712345678',
                'department_id' => $departments->firstWhere('code', 'SCI')->id,
                'specialization' => 'Mathematics',
                'qualification' => 'MSc Mathematics',
                'employee_number' => 'TCH010',
                'is_dean' => true,
            ],
            [
                'first_name' => 'Peter',
                'last_name' => 'Walusimbi',
                'email' => 'p.walusimbi@combridgecentre.ac.ug',
                'phone' => '+256713456789',
                'department_id' => $departments->firstWhere('code', 'SCI')->id,
                'specialization' => 'Physics',
                'qualification' => 'BSc Physics',
                'employee_number' => 'TCH011',
                'is_dean' => false,
            ],
            [
                'first_name' => 'Juliet',
                'last_name' => 'Nassali',
                'email' => 'j.nassali@combridgecentre.ac.ug',
                'phone' => '+256714567890',
                'department_id' => $departments->firstWhere('code', 'SCI')->id,
                'specialization' => 'Chemistry',
                'qualification' => 'BSc Chemistry',
                'employee_number' => 'TCH012',
                'is_dean' => false,
            ],
            
            // General Studies Department
            [
                'first_name' => 'Michael',
                'last_name' => 'Ssekandi',
                'email' => 'm.ssekandi@combridgecentre.ac.ug',
                'phone' => '+256715678901',
                'department_id' => $departments->firstWhere('code', 'GEN')->id,
                'specialization' => 'English Language',
                'qualification' => 'BA English Literature',
                'employee_number' => 'TCH013',
                'is_dean' => true,
            ],
            [
                'first_name' => 'Agnes',
                'last_name' => 'Nambi',
                'email' => 'a.nambi@combridgecentre.ac.ug',
                'phone' => '+256716789012',
                'department_id' => $departments->firstWhere('code', 'GEN')->id,
                'specialization' => 'Communication Skills',
                'qualification' => 'BA Communication',
                'employee_number' => 'TCH014',
                'is_dean' => false,
            ],
            [
                'first_name' => 'Daniel',
                'last_name' => 'Mutebi',
                'email' => 'd.mutebi@combridgecentre.ac.ug',
                'phone' => '+256717890123',
                'department_id' => $departments->firstWhere('code', 'GEN')->id,
                'specialization' => 'Life Skills',
                'qualification' => 'BA Social Sciences',
                'employee_number' => 'TCH015',
                'is_dean' => false,
            ],
        ];

        foreach ($teachers as $teacherData) {
            $isDean = $teacherData['is_dean'];
            unset($teacherData['is_dean']);
            
            // Create user account
            $userId = DB::table('users')->insertGetId([
                'first_name' => $teacherData['first_name'],
                'last_name' => $teacherData['last_name'],
                'email' => $teacherData['email'],
                'password' => Hash::make('password123'),
                'phone' => $teacherData['phone'],
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Create teacher record
            $teacherData['user_id'] = $userId;
            $teacherData['date_of_birth'] = now()->subYears(rand(28, 55))->format('Y-m-d');
            $teacherData['gender'] = rand(0, 1) ? 'Male' : 'Female';
            $teacherData['address'] = 'Kampala, Uganda';
            $teacherData['date_joined'] = now()->subYears(rand(1, 10))->format('Y-m-d');
            $teacherData['status'] = 'active';
            $teacherData['created_at'] = now();
            $teacherData['updated_at'] = now();
            
            DB::table('teachers')->insert($teacherData);
            
            // Assign role
            $role = $isDean ? $deanRole : $teacherRole;
            DB::table('role_user')->insert([
                'user_id' => $userId,
                'role_id' => $role->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
