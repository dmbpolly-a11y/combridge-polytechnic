<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = DB::table('roles')->get();
        $studentRole = $roles->firstWhere('name', 'student');
        
        $classes = DB::table('school_classes')->get();
        $programmes = DB::table('programmes')->get();

        $firstNames = [
            'John', 'Mary', 'David', 'Sarah', 'James', 'Grace', 'Peter', 'Rebecca',
            'Robert', 'Agnes', 'Samuel', 'Patricia', 'Moses', 'Elizabeth', 'Daniel',
            'Juliet', 'Charles', 'Ruth', 'Michael', 'Joyce', 'Andrew', 'Catherine',
            'Joseph', 'Rose', 'Paul', 'Martha', 'Isaac', 'Margaret', 'Emmanuel', 'Jane',
            'Francis', 'Lydia', 'Stephen', 'Christine', 'Brian', 'Alice', 'Kenneth',
            'Dorothy', 'Richard', 'Sandra', 'Timothy', 'Helen', 'Simon', 'Anna',
            'Lawrence', 'Rachel', 'Patrick', 'Betty', 'Ronald', 'Esther'
        ];

        $lastNames = [
            'Mugisha', 'Namukasa', 'Okello', 'Nakato', 'Ssebunya', 'Nalumansi',
            'Kayongo', 'Auma', 'Musoke', 'Nalwadda', 'Okumu', 'Lwanga', 'Kato',
            'Nakirya', 'Walusimbi', 'Nassali', 'Ssekandi', 'Nambi', 'Mutebi',
            'Kivumbi', 'Nankya', 'Kateregga', 'Nabwire', 'Kizza', 'Nabukenya',
            'Ssebaggala', 'Namanya', 'Bbosa', 'Nakimera', 'Mulumba', 'Nakazzi',
            'Ssebulime', 'Namaganda', 'Kyagulanyi', 'Namusoke', 'Muwanga'
        ];

        $studentCounter = 1;
        $studentsToCreate = 100;

        for ($i = 0; $i < $studentsToCreate; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $class = $classes->random();
            $programme = $programmes->find($class->programme_id);
            
            $studentNumber = 'STD' . str_pad($studentCounter, 4, '0', STR_PAD_LEFT);
            $email = strtolower($firstName . '.' . $lastName . $studentCounter . '@student.combridgecentre.ac.ug');
            
            // Create user account
            $userId = DB::table('users')->insertGetId([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => Hash::make('password123'),
                'phone' => '+2567' . rand(00, 99) . rand(100000, 999999),
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Create student record
            DB::table('students')->insert([
                'user_id' => $userId,
                'student_number' => $studentNumber,
                'programme_id' => $programme->id,
                'class_id' => $class->id,
                'admission_number' => 'ADM/2024/' . str_pad($studentCounter, 4, '0', STR_PAD_LEFT),
                'admission_date' => now()->subMonths(rand(1, 12))->format('Y-m-d'),
                'date_of_birth' => now()->subYears(rand(18, 25))->format('Y-m-d'),
                'gender' => rand(0, 1) ? 'Male' : 'Female',
                'nationality' => 'Ugandan',
                'district' => ['Kampala', 'Wakiso', 'Mukono', 'Mbarara', 'Gulu', 'Jinja'][array_rand(['Kampala', 'Wakiso', 'Mukono', 'Mbarara', 'Gulu', 'Jinja'])],
                'address' => 'Kampala, Uganda',
                'emergency_contact_name' => $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)],
                'emergency_contact_phone' => '+2567' . rand(00, 99) . rand(100000, 999999),
                'emergency_contact_relationship' => ['Parent', 'Guardian', 'Sibling'][array_rand(['Parent', 'Guardian', 'Sibling'])],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Assign student role
            DB::table('role_user')->insert([
                'user_id' => $userId,
                'role_id' => $studentRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $studentCounter++;
        }
    }
}
