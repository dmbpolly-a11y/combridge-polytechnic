<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectSeeder extends Seeder
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
        $sciDept = $departments->firstWhere('code', 'SCI');
        $genDept = $departments->firstWhere('code', 'GEN');

        $subjects = [
            // IT Subjects
            ['name' => 'Programming Fundamentals', 'code' => 'IT101', 'department_id' => $itDept->id, 'credits' => 4, 'description' => 'Introduction to programming concepts', 'status' => 'active'],
            ['name' => 'Database Management Systems', 'code' => 'IT102', 'department_id' => $itDept->id, 'credits' => 4, 'description' => 'Database design and SQL', 'status' => 'active'],
            ['name' => 'Computer Networks', 'code' => 'IT103', 'department_id' => $itDept->id, 'credits' => 3, 'description' => 'Network fundamentals and protocols', 'status' => 'active'],
            ['name' => 'Web Development', 'code' => 'IT104', 'department_id' => $itDept->id, 'credits' => 4, 'description' => 'HTML, CSS, JavaScript, and PHP', 'status' => 'active'],
            ['name' => 'System Analysis and Design', 'code' => 'IT105', 'department_id' => $itDept->id, 'credits' => 3, 'description' => 'Software development lifecycle', 'status' => 'active'],
            
            // Business Subjects
            ['name' => 'Principles of Management', 'code' => 'BUS101', 'department_id' => $busDept->id, 'credits' => 3, 'description' => 'Management theories and practices', 'status' => 'active'],
            ['name' => 'Financial Accounting', 'code' => 'BUS102', 'department_id' => $busDept->id, 'credits' => 4, 'description' => 'Accounting principles and practices', 'status' => 'active'],
            ['name' => 'Marketing Management', 'code' => 'BUS103', 'department_id' => $busDept->id, 'credits' => 3, 'description' => 'Marketing strategies and consumer behavior', 'status' => 'active'],
            ['name' => 'Business Mathematics', 'code' => 'BUS104', 'department_id' => $busDept->id, 'credits' => 3, 'description' => 'Quantitative methods in business', 'status' => 'active'],
            ['name' => 'Entrepreneurship', 'code' => 'BUS105', 'department_id' => $busDept->id, 'credits' => 3, 'description' => 'Business planning and startups', 'status' => 'active'],
            
            // Technical Subjects
            ['name' => 'Electrical Circuits', 'code' => 'TECH101', 'department_id' => $techDept->id, 'credits' => 4, 'description' => 'Circuit analysis and design', 'status' => 'active'],
            ['name' => 'Engineering Drawing', 'code' => 'TECH102', 'department_id' => $techDept->id, 'credits' => 3, 'description' => 'Technical drawing and CAD', 'status' => 'active'],
            ['name' => 'Workshop Technology', 'code' => 'TECH103', 'department_id' => $techDept->id, 'credits' => 4, 'description' => 'Machine tools and fabrication', 'status' => 'active'],
            ['name' => 'Mechanics', 'code' => 'TECH104', 'department_id' => $techDept->id, 'credits' => 4, 'description' => 'Statics and dynamics', 'status' => 'active'],
            
            // Science Subjects
            ['name' => 'Mathematics', 'code' => 'SCI101', 'department_id' => $sciDept->id, 'credits' => 4, 'description' => 'Advanced mathematics', 'status' => 'active'],
            ['name' => 'Physics', 'code' => 'SCI102', 'department_id' => $sciDept->id, 'credits' => 4, 'description' => 'General physics', 'status' => 'active'],
            ['name' => 'Chemistry', 'code' => 'SCI103', 'department_id' => $sciDept->id, 'credits' => 4, 'description' => 'General chemistry', 'status' => 'active'],
            
            // General Studies
            ['name' => 'English Communication', 'code' => 'GEN101', 'department_id' => $genDept->id, 'credits' => 2, 'description' => 'Communication skills', 'status' => 'active'],
            ['name' => 'Computer Literacy', 'code' => 'GEN102', 'department_id' => $genDept->id, 'credits' => 2, 'description' => 'Basic computer skills', 'status' => 'active'],
            ['name' => 'Life Skills', 'code' => 'GEN103', 'department_id' => $genDept->id, 'credits' => 2, 'description' => 'Personal development', 'status' => 'active'],
        ];

        foreach ($subjects as &$subject) {
            $subject['created_at'] = now();
            $subject['updated_at'] = now();
        }

        DB::table('subjects')->insert($subjects);
    }
}
