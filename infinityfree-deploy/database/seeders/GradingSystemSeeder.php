<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GradingSystem;

class GradingSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gradingSystem = [
            [
                'grade' => 'A',
                'min_marks' => 80,
                'max_marks' => 100,
                'grade_point' => 5.00,
                'description' => 'Excellent'
            ],
            [
                'grade' => 'B',
                'min_marks' => 70,
                'max_marks' => 79,
                'grade_point' => 4.00,
                'description' => 'Very Good'
            ],
            [
                'grade' => 'C',
                'min_marks' => 60,
                'max_marks' => 69,
                'grade_point' => 3.00,
                'description' => 'Good'
            ],
            [
                'grade' => 'D',
                'min_marks' => 50,
                'max_marks' => 59,
                'grade_point' => 2.00,
                'description' => 'Pass'
            ],
            [
                'grade' => 'F',
                'min_marks' => 0,
                'max_marks' => 49,
                'grade_point' => 0.00,
                'description' => 'Fail'
            ],
        ];

        foreach ($gradingSystem as $grade) {
            GradingSystem::updateOrCreate(
                ['grade' => $grade['grade']],
                $grade
            );
        }

        $this->command->info('Grading system seeded successfully!');
    }
}
