<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programmes = DB::table('programmes')->get();
        $teachers = DB::table('teachers')->get();

        $classes = [];
        $classCounter = 1;

        foreach ($programmes as $programme) {
            // Year 1 class
            $classes[] = [
                'name' => $programme->code . ' Year 1',
                'programme_id' => $programme->id,
                'year_level' => 1,
                'academic_year' => '2024/2025',
                'capacity' => 40,
                'class_teacher_id' => $teachers->random()->id,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Year 2 class (for diploma programs)
            if ($programme->duration_years >= 2) {
                $classes[] = [
                    'name' => $programme->code . ' Year 2',
                    'programme_id' => $programme->id,
                    'year_level' => 2,
                    'academic_year' => '2024/2025',
                    'capacity' => 35,
                    'class_teacher_id' => $teachers->random()->id,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('school_classes')->insert($classes);
    }
}
