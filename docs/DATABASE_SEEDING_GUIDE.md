# Database Seeding Guide
## Combridge Centre for Polytechnic Studies

This guide provides comprehensive information about database seeding for the Combridge Polytechnic Management System.

---

## Table of Contents

1. [Overview](#overview)
2. [Seeder Files](#seeder-files)
3. [Running Seeders](#running-seeders)
4. [Sample Data Details](#sample-data-details)
5. [Default Login Credentials](#default-login-credentials)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Database seeding populates your database with initial data for testing and development. The system includes comprehensive seeders that create:

- **Roles & Permissions** (RBAC system)
- **Departments & Programmes**
- **Users** (Admin, Principal, Teachers, Students)
- **Academic Data** (Classes, Subjects, Grading)
- **Financial Data** (Fee structures, Payments)
- **Library Data** (Books, Issues)
- **Infrastructure** (Rooms, Facilities)

### Total Records Created
- 8 System Roles
- 44 Permissions
- 5 Departments
- 10 Academic Programmes
- 20 Subjects
- 6 Grading Levels
- 120+ Users (5 admin + 15 teachers + 100 students)
- ~17 Classes
- ~50 Fee Payment Records
- 18 Library Books
- 15 Rooms

---

## Seeder Files

### 1. RoleSeeder.php
**Purpose**: Creates system roles

**Roles Created**:
- `administrator` - Full system access
- `principal` - Institutional leadership
- `director` - Academic oversight
- `dean` - Department leadership
- `bursar` - Financial management
- `teacher` - Teaching staff
- `student` - Enrolled students
- `librarian` - Library management

### 2. PermissionSeeder.php
**Purpose**: Creates permissions and assigns them to roles

**Permission Categories**:
- Academic Management (5 permissions)
- Student Management (4 permissions)
- Teacher Management (3 permissions)
- Attendance Management (3 permissions)
- Examination Management (5 permissions)
- Financial Management (5 permissions)
- Library Management (4 permissions)
- Timetable Management (3 permissions)
- Communication (4 permissions)
- Reports & Analytics (3 permissions)
- System Administration (5 permissions)

**Total**: 44 permissions with role assignments

### 3. DepartmentSeeder.php
**Purpose**: Creates academic departments

**Departments**:
1. Information Technology (IT)
2. Business Studies (BUS)
3. Technical Studies (TECH)
4. Science (SCI)
5. General Studies (GEN)

### 4. ProgrammeSeeder.php
**Purpose**: Creates academic programmes

**IT Programmes**:
- Diploma in Information Technology (DIT) - 2 years
- Certificate in Computer Applications (CCA) - 1 year
- Diploma in Software Engineering (DSE) - 2 years

**Business Programmes**:
- Diploma in Business Administration (DBA) - 2 years
- Certificate in Accounting (CAC) - 1 year
- Diploma in Marketing and Sales (DMS) - 2 years

**Technical Programmes**:
- Diploma in Electrical Engineering (DEE) - 2 years
- Certificate in Automotive Mechanics (CAM) - 1 year
- Diploma in Civil Engineering (DCE) - 2 years
- Certificate in Welding and Fabrication (CWF) - 1 year

### 5. SubjectSeeder.php
**Purpose**: Creates subjects across all departments

**Subject Distribution**:
- IT Subjects: 5 (Programming, Database, Networks, Web Dev, System Analysis)
- Business Subjects: 5 (Management, Accounting, Marketing, Math, Entrepreneurship)
- Technical Subjects: 4 (Circuits, Drawing, Workshop, Mechanics)
- Science Subjects: 3 (Mathematics, Physics, Chemistry)
- General Subjects: 3 (English, Computer Literacy, Life Skills)

### 6. GradingSystemSeeder.php
**Purpose**: Creates grading scale

**Grading Scale**:
- A: 80-100 (5.0 GPA) - Distinction
- B: 70-79 (4.0 GPA) - Credit
- C: 60-69 (3.0 GPA) - Pass
- D: 50-59 (2.0 GPA) - Pass
- E: 40-49 (1.0 GPA) - Pass
- F: 0-39 (0.0 GPA) - Fail

### 7. UserSeeder.php
**Purpose**: Creates administrative users

**Users Created**:
1. System Administrator
2. Principal (Dr. James Mugisha)
3. Director of Studies (Sarah Namukasa)
4. Bursar (David Okello)
5. Librarian (Grace Nakato)

### 8. TeacherSeeder.php
**Purpose**: Creates 15 teachers across departments

**Distribution**:
- IT Department: 3 teachers (1 dean)
- Business Department: 3 teachers (1 dean)
- Technical Department: 3 teachers (1 dean)
- Science Department: 3 teachers (1 dean)
- General Studies: 3 teachers (1 dean)

**Details**: Each teacher has qualification, specialization, employee number

### 9. ClassSeeder.php
**Purpose**: Creates class groups for each programme

**Logic**:
- Year 1 class for all programmes
- Year 2 class for diploma programmes (2-year duration)
- Each class assigned a class teacher
- Capacity ranges: 35-40 students

### 10. StudentSeeder.php
**Purpose**: Creates 100 sample students

**Student Details**:
- Randomized names (Ugandan names)
- Student numbers: STD0001 - STD0100
- Email format: firstname.lastname[number]@student.combridgecentre.ac.ug
- Random distribution across all classes
- Emergency contact information
- District information (Ugandan districts)

### 11. FeeStructureSeeder.php
**Purpose**: Creates fee structures and sample payments

**Fee Structures**:
- Diploma programmes: 1,500,000 UGX per semester
- Certificate programmes: 800,000 UGX per semester
- Breakdown includes: Tuition, Registration, Examination, Library, Medical, Sports, Development fees

**Sample Payments**:
- 50 payment records created
- Mix of full and partial payments (50-100%)
- Receipt format: RCP-2024-NNNNNN
- Payment methods: Cash, Bank Transfer, Mobile Money

### 12. BookSeeder.php
**Purpose**: Creates library books and sample issues

**Books Created**: 18 books across categories
- IT Books: 4
- Business Books: 4
- Technical Books: 4
- Science Books: 3
- General Books: 3

**Book Issues**:
- 10 currently issued books
- 5 returned books
- Realistic issue/due dates

### 13. RoomSeeder.php
**Purpose**: Creates rooms and facilities

**Room Types**:
- Lecture Rooms: 4 (capacity 45-60)
- Computer Labs: 3 (capacity 30-40)
- Workshops: 3 (Electrical, Automotive, Welding)
- Science Labs: 2 (Physics, Chemistry)
- Special Rooms: 3 (Library, Exam Hall, Conference Room)

**Total**: 15 rooms with facilities and capacity

---

## Running Seeders

### Prerequisites

1. **Database configured** in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=combridge_polytechnic
DB_USERNAME=root
DB_PASSWORD=your_password
```

2. **Migrations completed**:
```bash
php artisan migrate
```

### Commands

#### 1. Run All Seeders
```bash
php artisan db:seed
```

#### 2. Run Specific Seeder
```bash
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=StudentSeeder
```

#### 3. Fresh Migration with Seeding
**⚠️ WARNING: This drops all tables and recreates them!**
```bash
php artisan migrate:fresh --seed
```

#### 4. Refresh Database (Development Only)
```bash
php artisan migrate:refresh --seed
```

### Execution Order

The DatabaseSeeder runs seeders in this order:
1. RoleSeeder (must be first)
2. PermissionSeeder (assigns to roles)
3. DepartmentSeeder
4. ProgrammeSeeder (needs departments)
5. SubjectSeeder (needs departments)
6. GradingSystemSeeder
7. UserSeeder (needs roles)
8. TeacherSeeder (needs departments, roles)
9. ClassSeeder (needs programmes, teachers)
10. StudentSeeder (needs classes, roles)
11. FeeStructureSeeder (needs programmes, students)
12. BookSeeder
13. RoomSeeder

**Important**: Do not change this order as there are dependencies!

---

## Sample Data Details

### User Accounts Summary

| Role | Count | Email Pattern | Password |
|------|-------|---------------|----------|
| Administrator | 1 | admin@combridgecentre.ac.ug | password123 |
| Principal | 1 | principal@combridgecentre.ac.ug | password123 |
| Director | 1 | dos@combridgecentre.ac.ug | password123 |
| Bursar | 1 | bursar@combridgecentre.ac.ug | password123 |
| Librarian | 1 | librarian@combridgecentre.ac.ug | password123 |
| Teachers | 15 | [firstname].[lastname]@combridgecentre.ac.ug | password123 |
| Students | 100 | [firstname].[lastname][num]@student.combridgecentre.ac.ug | password123 |

### Academic Structure

```
Combridge Centre for Polytechnic Studies
├── IT Department (3 teachers)
│   ├── DIT (Year 1, Year 2)
│   ├── CCA (Year 1)
│   └── DSE (Year 1, Year 2)
├── Business Department (3 teachers)
│   ├── DBA (Year 1, Year 2)
│   ├── CAC (Year 1)
│   └── DMS (Year 1, Year 2)
├── Technical Department (3 teachers)
│   ├── DEE (Year 1, Year 2)
│   ├── CAM (Year 1)
│   ├── DCE (Year 1, Year 2)
│   └── CWF (Year 1)
├── Science Department (3 teachers)
└── General Studies (3 teachers)
```

### Financial Data

- **Fee Structures**: ~30 records (per programme, semester, year)
- **Payments**: 50 sample payments
- **Total Revenue (Sample)**: ~60-70 million UGX
- **Payment Methods**: Cash (40%), Bank Transfer (30%), Mobile Money (30%)

### Library Data

- **Total Books**: 18
- **Total Copies**: 340+
- **Currently Issued**: 10 books
- **Available**: 330+ books
- **Categories**: IT, Business, Technical, Science, General

---

## Default Login Credentials

### Administrative Accounts

```
Administrator
Email: admin@combridgecentre.ac.ug
Password: password123
Access: Full system access

Principal
Email: principal@combridgecentre.ac.ug
Password: password123
Access: Administrative oversight

Director of Studies
Email: dos@combridgecentre.ac.ug
Password: password123
Access: Academic management

Bursar
Email: bursar@combridgecentre.ac.ug
Password: password123
Access: Financial management

Librarian
Email: librarian@combridgecentre.ac.ug
Password: password123
Access: Library management
```

### Teacher Accounts (Examples)

```
IT Department Dean
Email: r.ssebunya@combridgecentre.ac.ug
Password: password123

Business Department Dean
Email: p.auma@combridgecentre.ac.ug
Password: password123

Technical Department Dean
Email: c.okumu@combridgecentre.ac.ug
Password: password123
```

### Student Accounts (Examples)

```
Student 1
Email: john.mugisha1@student.combridgecentre.ac.ug
Password: password123
Student Number: STD0001

Student 2
Email: mary.namukasa2@student.combridgecentre.ac.ug
Password: password123
Student Number: STD0002
```

**Note**: All teacher and student emails follow predictable patterns. Check the database for specific credentials.

---

## Customization

### Modifying Sample Data

#### Change Number of Students
Edit `StudentSeeder.php`:
```php
$studentsToCreate = 200; // Change from 100 to 200
```

#### Add More Programmes
Edit `ProgrammeSeeder.php` and add to the `$programmes` array:
```php
[
    'name' => 'Diploma in Data Science',
    'code' => 'DDS',
    'department_id' => $itDept->id,
    'duration_years' => 2,
    'description' => 'Data analytics and machine learning',
    'requirements' => 'O-Level with Math',
    'status' => 'active',
]
```

#### Change Default Password
Edit individual seeders and change:
```php
'password' => Hash::make('your_new_password'),
```

#### Adjust Fee Amounts
Edit `FeeStructureSeeder.php`:
```php
$baseFee = 2000000; // Change diploma fees
```

#### Add More Books
Edit `BookSeeder.php` and add to the `$books` array.

### Creating Custom Seeders

1. **Generate seeder**:
```bash
php artisan make:seeder CustomDataSeeder
```

2. **Add to DatabaseSeeder**:
```php
$this->call(CustomDataSeeder::class);
```

---

## Troubleshooting

### Common Issues

#### 1. Foreign Key Constraint Errors
**Cause**: Running seeders out of order

**Solution**:
```bash
# Always use DatabaseSeeder which runs in correct order
php artisan db:seed
```

#### 2. Duplicate Entry Errors
**Cause**: Running seeders multiple times

**Solution**:
```bash
# Clear database and reseed
php artisan migrate:fresh --seed
```

#### 3. User Already Exists
**Cause**: Email addresses already in database

**Solution**:
```bash
# Truncate users table or use fresh migration
php artisan migrate:fresh --seed
```

#### 4. Class Not Found
**Cause**: Seeder not autoloaded

**Solution**:
```bash
composer dump-autoload
php artisan db:seed
```

#### 5. Memory Limit Exceeded
**Cause**: Creating too many records at once

**Solution**:
```bash
# Increase PHP memory limit
php -d memory_limit=512M artisan db:seed
```

### Validation

After seeding, verify data:

```bash
# Check record counts
php artisan tinker

# In tinker:
\App\Models\User::count();           // Should be 120
\App\Models\Student::count();        // Should be 100
\App\Models\Teacher::count();        // Should be 15
\App\Models\Programme::count();      // Should be 10
\App\Models\SchoolClass::count();    // Should be ~17
\App\Models\Book::count();           // Should be 18
\App\Models\Room::count();           // Should be 15
```

### Debugging

Enable detailed output:
```bash
php artisan db:seed --verbose
```

Check specific seeder:
```bash
php artisan db:seed --class=StudentSeeder --verbose
```

---

## Best Practices

### Development Environment

1. **Use seeding liberally** for testing
2. **Run fresh migrations** regularly to test schema changes
3. **Customize sample data** to match real scenarios
4. **Keep seeders updated** when models change

### Production Environment

⚠️ **DO NOT RUN SEEDERS IN PRODUCTION**

1. **Never use** `migrate:fresh` in production
2. **Never seed** production databases with test data
3. **Always backup** before any database operations
4. **Change all default passwords** immediately

### Maintenance

1. **Update seeders** when adding new features
2. **Test seeders** after schema changes
3. **Document custom modifications**
4. **Version control** all seeder files

---

## Additional Resources

- [Laravel Seeding Documentation](https://laravel.com/docs/seeding)
- [Database Testing Guide](https://laravel.com/docs/database-testing)
- [Faker Library](https://fakerphp.github.io/) - For generating realistic data

---

## Support

For issues or questions:
- Email: combridgecentre@gmail.com
- Phone: +256 393 258 879, +256 414 674 018
- Location: Isingiro District, Uganda

---

**Last Updated**: <?php echo date('F Y'); ?>

**Version**: 1.0.0

**Status**: ✅ Production Ready
