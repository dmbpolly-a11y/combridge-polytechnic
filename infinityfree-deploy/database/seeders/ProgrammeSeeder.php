<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgrammeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = DB::table('departments')->get();
        
        $itDept = $departments->firstWhere('code', 'IT');
        $busDept = $departments->firstWhere('code', 'BUS');
        $techDept = $departments->firstWhere('code', 'TECH');

        $programmes = [
            // IT Programmes
            [
                'name' => 'Diploma in Information Technology',
                'code' => 'DIT',
                'department_id' => $itDept->id,
                'duration_years' => 2,
                'description' => 'Comprehensive program covering software development, networking, and database management',
                'requirements' => 'O-Level Certificate with credits in Mathematics and English',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Certificate in Computer Applications',
                'code' => 'CCA',
                'department_id' => $itDept->id,
                'duration_years' => 1,
                'description' => 'Basic computer skills, office applications, and internet usage',
                'requirements' => 'O-Level Certificate',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Diploma in Software Engineering',
                'code' => 'DSE',
                'department_id' => $itDept->id,
                'duration_years' => 2,
                'description' => 'Advanced programming, software design, and system development',
                'requirements' => 'O-Level Certificate with credits in Mathematics',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Business Programmes
            [
                'name' => 'Diploma in Business Administration',
                'code' => 'DBA',
                'department_id' => $busDept->id,
                'duration_years' => 2,
                'description' => 'Comprehensive business management, accounting, and entrepreneurship',
                'requirements' => 'O-Level Certificate with credits in Mathematics and English',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Certificate in Accounting',
                'code' => 'CAC',
                'department_id' => $busDept->id,
                'duration_years' => 1,
                'description' => 'Basic accounting principles, bookkeeping, and financial management',
                'requirements' => 'O-Level Certificate with credit in Mathematics',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Diploma in Marketing and Sales',
                'code' => 'DMS',
                'department_id' => $busDept->id,
                'duration_years' => 2,
                'description' => 'Marketing strategies, sales techniques, and customer relations',
                'requirements' => 'O-Level Certificate',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Technical Programmes
            [
                'name' => 'Diploma in Electrical Engineering',
                'code' => 'DEE',
                'department_id' => $techDept->id,
                'duration_years' => 2,
                'description' => 'Electrical systems, power distribution, and electronics',
                'requirements' => 'O-Level Certificate with credits in Mathematics and Physics',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Certificate in Automotive Mechanics',
                'code' => 'CAM',
                'department_id' => $techDept->id,
                'duration_years' => 1,
                'description' => 'Vehicle maintenance, repair, and diagnostics',
                'requirements' => 'O-Level Certificate',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Diploma in Civil Engineering',
                'code' => 'DCE',
                'department_id' => $techDept->id,
                'duration_years' => 2,
                'description' => 'Construction, surveying, and structural design',
                'requirements' => 'O-Level Certificate with credits in Mathematics and Physics',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Certificate in Welding and Fabrication',
                'code' => 'CWF',
                'department_id' => $techDept->id,
                'duration_years' => 1,
                'description' => 'Metal working, welding techniques, and fabrication',
                'requirements' => 'O-Level Certificate',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('programmes')->insert($programmes);
    }
}
