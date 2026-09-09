<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            // IT Books
            [
                'title' => 'Introduction to Programming with Python',
                'author' => 'John Doe',
                'isbn' => '978-1234567890',
                'publisher' => 'Tech Publishers',
                'publication_year' => 2022,
                'category' => 'Information Technology',
                'edition' => '3rd Edition',
                'total_copies' => 15,
                'available_copies' => 12,
                'shelf_location' => 'IT-A1',
                'description' => 'Comprehensive guide to Python programming',
                'status' => 'available',
            ],
            [
                'title' => 'Database Management Systems',
                'author' => 'Ramez Elmasri',
                'isbn' => '978-0987654321',
                'publisher' => 'Pearson',
                'publication_year' => 2021,
                'category' => 'Information Technology',
                'edition' => '7th Edition',
                'total_copies' => 20,
                'available_copies' => 18,
                'shelf_location' => 'IT-A2',
                'description' => 'Fundamentals of database systems',
                'status' => 'available',
            ],
            [
                'title' => 'Computer Networks',
                'author' => 'Andrew Tanenbaum',
                'isbn' => '978-1122334455',
                'publisher' => 'Prentice Hall',
                'publication_year' => 2020,
                'category' => 'Information Technology',
                'edition' => '5th Edition',
                'total_copies' => 12,
                'available_copies' => 10,
                'shelf_location' => 'IT-A3',
                'description' => 'Computer networks and protocols',
                'status' => 'available',
            ],
            [
                'title' => 'Web Development with HTML, CSS and JavaScript',
                'author' => 'Jane Smith',
                'isbn' => '978-2233445566',
                'publisher' => 'Web Publishers',
                'publication_year' => 2023,
                'category' => 'Information Technology',
                'edition' => '2nd Edition',
                'total_copies' => 18,
                'available_copies' => 15,
                'shelf_location' => 'IT-B1',
                'description' => 'Modern web development techniques',
                'status' => 'available',
            ],
            
            // Business Books
            [
                'title' => 'Principles of Management',
                'author' => 'Peter Drucker',
                'isbn' => '978-3344556677',
                'publisher' => 'Business Press',
                'publication_year' => 2021,
                'category' => 'Business Administration',
                'edition' => '4th Edition',
                'total_copies' => 25,
                'available_copies' => 22,
                'shelf_location' => 'BUS-A1',
                'description' => 'Management theories and practices',
                'status' => 'available',
            ],
            [
                'title' => 'Financial Accounting',
                'author' => 'Warren Buffett',
                'isbn' => '978-4455667788',
                'publisher' => 'Finance Publishers',
                'publication_year' => 2022,
                'category' => 'Accounting',
                'edition' => '6th Edition',
                'total_copies' => 30,
                'available_copies' => 28,
                'shelf_location' => 'BUS-A2',
                'description' => 'Comprehensive accounting guide',
                'status' => 'available',
            ],
            [
                'title' => 'Marketing Management',
                'author' => 'Philip Kotler',
                'isbn' => '978-5566778899',
                'publisher' => 'Marketing Press',
                'publication_year' => 2023,
                'category' => 'Marketing',
                'edition' => '15th Edition',
                'total_copies' => 20,
                'available_copies' => 18,
                'shelf_location' => 'BUS-B1',
                'description' => 'Marketing strategies and consumer behavior',
                'status' => 'available',
            ],
            [
                'title' => 'Entrepreneurship Development',
                'author' => 'Robert Kiyosaki',
                'isbn' => '978-6677889900',
                'publisher' => 'Business Books',
                'publication_year' => 2022,
                'category' => 'Business Administration',
                'edition' => '3rd Edition',
                'total_copies' => 15,
                'available_copies' => 13,
                'shelf_location' => 'BUS-B2',
                'description' => 'Starting and managing a business',
                'status' => 'available',
            ],
            
            // Technical Books
            [
                'title' => 'Electrical Circuit Analysis',
                'author' => 'William Hayt',
                'isbn' => '978-7788990011',
                'publisher' => 'Engineering Press',
                'publication_year' => 2021,
                'category' => 'Electrical Engineering',
                'edition' => '8th Edition',
                'total_copies' => 18,
                'available_copies' => 16,
                'shelf_location' => 'TECH-A1',
                'description' => 'Circuit theory and analysis',
                'status' => 'available',
            ],
            [
                'title' => 'Engineering Drawing',
                'author' => 'ND Bhatt',
                'isbn' => '978-8899001122',
                'publisher' => 'Technical Publishers',
                'publication_year' => 2020,
                'category' => 'Engineering',
                'edition' => '50th Edition',
                'total_copies' => 22,
                'available_copies' => 20,
                'shelf_location' => 'TECH-A2',
                'description' => 'Technical drawing and CAD',
                'status' => 'available',
            ],
            [
                'title' => 'Automotive Technology',
                'author' => 'James Halderman',
                'isbn' => '978-9900112233',
                'publisher' => 'Auto Publishers',
                'publication_year' => 2022,
                'category' => 'Automotive',
                'edition' => '5th Edition',
                'total_copies' => 12,
                'available_copies' => 10,
                'shelf_location' => 'TECH-B1',
                'description' => 'Vehicle systems and maintenance',
                'status' => 'available',
            ],
            [
                'title' => 'Mechanics of Materials',
                'author' => 'Ferdinand Beer',
                'isbn' => '978-0011223344',
                'publisher' => 'McGraw Hill',
                'publication_year' => 2021,
                'category' => 'Engineering',
                'edition' => '7th Edition',
                'total_copies' => 16,
                'available_copies' => 14,
                'shelf_location' => 'TECH-B2',
                'description' => 'Strength of materials and mechanics',
                'status' => 'available',
            ],
            
            // Science Books
            [
                'title' => 'Advanced Mathematics',
                'author' => 'James Stewart',
                'isbn' => '978-1122334455',
                'publisher' => 'Cengage',
                'publication_year' => 2023,
                'category' => 'Mathematics',
                'edition' => '8th Edition',
                'total_copies' => 28,
                'available_copies' => 25,
                'shelf_location' => 'SCI-A1',
                'description' => 'Calculus and advanced mathematics',
                'status' => 'available',
            ],
            [
                'title' => 'University Physics',
                'author' => 'Young and Freedman',
                'isbn' => '978-2233445566',
                'publisher' => 'Pearson',
                'publication_year' => 2022,
                'category' => 'Physics',
                'edition' => '14th Edition',
                'total_copies' => 20,
                'available_copies' => 18,
                'shelf_location' => 'SCI-A2',
                'description' => 'Comprehensive physics textbook',
                'status' => 'available',
            ],
            [
                'title' => 'General Chemistry',
                'author' => 'Raymond Chang',
                'isbn' => '978-3344556677',
                'publisher' => 'McGraw Hill',
                'publication_year' => 2021,
                'category' => 'Chemistry',
                'edition' => '12th Edition',
                'total_copies' => 18,
                'available_copies' => 16,
                'shelf_location' => 'SCI-A3',
                'description' => 'Introduction to chemistry',
                'status' => 'available',
            ],
            
            // General Books
            [
                'title' => 'English Grammar in Use',
                'author' => 'Raymond Murphy',
                'isbn' => '978-4455667788',
                'publisher' => 'Cambridge',
                'publication_year' => 2023,
                'category' => 'Language',
                'edition' => '5th Edition',
                'total_copies' => 35,
                'available_copies' => 32,
                'shelf_location' => 'GEN-A1',
                'description' => 'Grammar reference and practice',
                'status' => 'available',
            ],
            [
                'title' => 'Communication Skills',
                'author' => 'Meenakshi Raman',
                'isbn' => '978-5566778899',
                'publisher' => 'Oxford',
                'publication_year' => 2022,
                'category' => 'Communication',
                'edition' => '3rd Edition',
                'total_copies' => 25,
                'available_copies' => 23,
                'shelf_location' => 'GEN-A2',
                'description' => 'Professional communication skills',
                'status' => 'available',
            ],
            [
                'title' => 'Life Skills and Personal Development',
                'author' => 'Stephen Covey',
                'isbn' => '978-6677889900',
                'publisher' => 'Simon & Schuster',
                'publication_year' => 2021,
                'category' => 'Personal Development',
                'edition' => '2nd Edition',
                'total_copies' => 20,
                'available_copies' => 18,
                'shelf_location' => 'GEN-B1',
                'description' => 'Personal effectiveness and life skills',
                'status' => 'available',
            ],
        ];

        foreach ($books as &$book) {
            $book['created_at'] = now();
            $book['updated_at'] = now();
        }

        DB::table('books')->insert($books);
        
        // Create some book issues
        $this->createBookIssues();
    }

    /**
     * Create sample book issues
     */
    private function createBookIssues(): void
    {
        $students = DB::table('students')->limit(20)->get();
        $books = DB::table('books')->get();

        foreach ($students->take(10) as $student) {
            $book = $books->random();
            
            DB::table('book_issues')->insert([
                'book_id' => $book->id,
                'student_id' => $student->id,
                'teacher_id' => null,
                'issue_date' => now()->subDays(rand(5, 30))->format('Y-m-d'),
                'due_date' => now()->addDays(rand(5, 14))->format('Y-m-d'),
                'return_date' => null,
                'fine_amount' => 0,
                'status' => 'issued',
                'issued_by' => 'Librarian',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Some returned books
        foreach ($students->skip(10)->take(5) as $student) {
            $book = $books->random();
            $issueDate = now()->subDays(rand(20, 40));
            $returnDate = now()->subDays(rand(1, 10));
            
            DB::table('book_issues')->insert([
                'book_id' => $book->id,
                'student_id' => $student->id,
                'teacher_id' => null,
                'issue_date' => $issueDate->format('Y-m-d'),
                'due_date' => $issueDate->addDays(14)->format('Y-m-d'),
                'return_date' => $returnDate->format('Y-m-d'),
                'fine_amount' => 0,
                'status' => 'returned',
                'issued_by' => 'Librarian',
                'returned_to' => 'Librarian',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
