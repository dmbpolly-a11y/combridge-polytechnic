<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Information Technology',
                'code' => 'IT',
                'description' => 'Department of Information Technology and Computer Science',
                'head_id' => null, // Will be assigned after teachers are seeded
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Business Studies',
                'code' => 'BUS',
                'description' => 'Department of Business Administration and Management',
                'head_id' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Technical Studies',
                'code' => 'TECH',
                'description' => 'Department of Engineering and Technical Studies',
                'head_id' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Science',
                'code' => 'SCI',
                'description' => 'Department of Natural and Applied Sciences',
                'head_id' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'General Studies',
                'code' => 'GEN',
                'description' => 'Department of General and Liberal Studies',
                'head_id' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('departments')->insert($departments);
    }
}
