# Combridge School Management System - Controllers Guide

## Created Controllers

### 1. Base Controller
**File:** `app/Http/Controllers/Controller.php`
- Base controller with helper methods for JSON responses
- Methods: `successResponse()`, `errorResponse()`

### 2. Dashboard Controller
**File:** `app/Http/Controllers/DashboardController.php`
- Main dashboard that routes users based on their roles
- **Methods:**
  - `index()` - Main entry point
  - `adminDashboard()` - Administrator/Director dashboard with comprehensive statistics
  - `academicDashboard()` - Dean/HOD dashboard with academic focus
  - `teacherDashboard()` - Teacher dashboard with classes and subjects
  - `bursarDashboard()` - Financial dashboard with payment statistics
  - `librarianDashboard()` - Library management dashboard
  - `studentDashboard()` - Student portal with attendance, results, and timetable

### 3. Authentication Controllers
**Directory:** `app/Http/Controllers/Auth/`

#### LoginController.php
- Handles user authentication
- Role-based redirection after login
- Methods: `showLoginForm()`, `login()`, `logout()`, `redirectBasedOnRole()`

#### RegisterController.php
- User registration
- Auto-assigns student role by default
- Methods: `showRegistrationForm()`, `register()`, `validator()`, `create()`

#### ForgotPasswordController.php
- Password reset link requests
- Methods: `showLinkRequestForm()`, `sendResetLinkEmail()`

#### ResetPasswordController.php
- Password reset functionality
- Methods: `showResetForm()`, `reset()`

### 4. Admin Controllers
**Directory:** `app/Http/Controllers/Admin/`

#### StudentController.php
- Complete CRUD for student management
- **Methods:**
  - `index()` - List students with search and filters
  - `create()` - Show create form
  - `store()` - Create new student with user account
  - `show()` - Display student details
  - `edit()` - Show edit form
  - `update()` - Update student information
  - `destroy()` - Delete student
  - `export()` - Export students data

#### TeacherController.php
- Complete CRUD for teacher management
- Subject assignment
- **Methods:**
  - `index()` - List teachers with filters
  - `create()` - Show create form
  - `store()` - Create new teacher with user account
  - `show()` - Display teacher profile
  - `edit()` - Show edit form
  - `update()` - Update teacher information
  - `destroy()` - Delete teacher

#### DepartmentController.php
- Department management
- **Methods:**
  - `index()` - List departments
  - `create()`, `store()` - Create department
  - `show()` - Department details with programmes, subjects, teachers
  - `edit()`, `update()` - Edit department
  - `destroy()` - Delete department

#### ProgrammeController.php
- Programme/Course management
- Subject assignment to programmes
- **Methods:**
  - `index()` - List programmes
  - `create()`, `store()` - Create programme
  - `show()` - Programme details
  - `edit()`, `update()` - Edit programme
  - `destroy()` - Delete programme
  - `manageSubjects()` - Manage programme subjects
  - `updateSubjects()` - Update subject assignments

#### AttendanceController.php
- Student attendance management
- **Methods:**
  - `index()` - View attendance records
  - `mark()` - Show attendance marking form
  - `store()` - Save attendance records
  - `report()` - Generate attendance reports

#### FeeController.php
- Fee collection and management
- **Methods:**
  - `index()` - List fee payments
  - `collect()` - Show fee collection form
  - `store()` - Record payment
  - `receipt()` - Display/print receipt
  - `balances()` - View fee balances

## Controllers to be Created

### 5. Additional Controllers Needed

#### SubjectController.php
```php
- index() - List subjects
- create(), store() - Create subject
- show() - Subject details
- edit(), update() - Edit subject
- destroy() - Delete subject
```

#### ClassController.php
```php
- index() - List classes
- create(), store() - Create class
- show() - Class details with students
- edit(), update() - Edit class
- destroy() - Delete class
- assignStudents() - Assign students to class
```

#### ExaminationController.php
```php
- index() - List examinations
- create(), store() - Create examination
- show() - Exam details
- edit(), update() - Edit examination
- destroy() - Delete examination
- enterMarks() - Enter/edit marks
- results() - View results
- reportCard() - Generate report cards
```

#### LibraryController.php
```php
- index() - List books
- create(), store() - Add book
- edit(), update() - Edit book
- destroy() - Delete book
- issue() - Issue book to student
- return() - Return book
- overdueBooks() - List overdue books
```

#### TimetableController.php
```php
- index() - View timetables
- create(), store() - Create timetable entry
- edit(), update() - Edit timetable
- destroy() - Delete entry
- byClass() - Class timetable
- byTeacher() - Teacher timetable
- print() - Print timetable
```

#### AnnouncementController.php
```php
- index() - List announcements
- create(), store() - Create announcement
- show() - View announcement
- edit(), update() - Edit announcement
- destroy() - Delete announcement
```

#### ReportController.php
```php
- index() - Reports dashboard
- studentReport() - Individual student report
- classReport() - Class performance report
- attendanceReport() - Attendance statistics
- financialReport() - Financial reports
- teacherReport() - Teacher performance
- exportPDF() - Export to PDF
- exportExcel() - Export to Excel
```

## Controller Templates

### Basic CRUD Controller Template

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ModelName;
use Illuminate\Http\Request;

class ModelNameController extends Controller
{
    public function index(Request $request)
    {
        $items = ModelName::latest()->paginate(20);
        return view('admin.modelname.index', compact('items'));
    }

    public function create()
    {
        return view('admin.modelname.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // validation rules
        ]);

        ModelName::create($validated);

        return redirect()->route('admin.modelname.index')
            ->with('success', 'Created successfully.');
    }

    public function show(ModelName $modelname)
    {
        return view('admin.modelname.show', compact('modelname'));
    }

    public function edit(ModelName $modelname)
    {
        return view('admin.modelname.edit', compact('modelname'));
    }

    public function update(Request $request, ModelName $modelname)
    {
        $validated = $request->validate([
            // validation rules
        ]);

        $modelname->update($validated);

        return redirect()->route('admin.modelname.show', $modelname)
            ->with('success', 'Updated successfully.');
    }

    public function destroy(ModelName $modelname)
    {
        $modelname->delete();

        return redirect()->route('admin.modelname.index')
            ->with('success', 'Deleted successfully.');
    }
}
```

## Best Practices Implemented

1. **Resource Controllers**: Following Laravel's resource controller pattern
2. **Request Validation**: All user inputs are validated
3. **Database Transactions**: Used for complex operations (student/teacher creation)
4. **Eager Loading**: Relations are eager loaded to prevent N+1 queries
5. **Pagination**: Results are paginated for better performance
6. **Flash Messages**: Success/error messages using session flash
7. **Authorization**: Controllers should use middleware for authorization
8. **File Upload Handling**: Profile photos are handled with proper storage
9. **Soft Deletes**: Records are soft deleted where applicable
10. **Search & Filtering**: Most index methods support search and filtering

## Security Considerations

1. **CSRF Protection**: All forms use @csrf token
2. **Input Validation**: Strict validation on all inputs
3. **Mass Assignment Protection**: Using $fillable in models
4. **Authentication**: All routes require authentication
5. **Authorization**: Role and permission checks via middleware
6. **SQL Injection Prevention**: Using Eloquent ORM
7. **XSS Protection**: Laravel's Blade templating auto-escapes output

## Usage Examples

### Creating a Student
```php
POST /admin/students
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@student.com",
    "admission_number": "STU2024001",
    "programme_id": 1,
    "class_id": 1,
    ...
}
```

### Marking Attendance
```php
POST /admin/attendance
{
    "class_id": 1,
    "attendance_date": "2024-01-15",
    "attendances": [
        {"student_id": 1, "status": "present"},
        {"student_id": 2, "status": "absent"},
        ...
    ]
}
```

### Recording Fee Payment
```php
POST /admin/fees
{
    "student_id": 1,
    "fee_structure_id": 1,
    "amount_paid": 500000,
    "payment_method": "cash",
    "payment_date": "2024-01-15"
}
```

## Testing Controllers

Use Laravel's testing features:

```php
// Feature test example
public function test_can_create_student()
{
    $this->actingAs($admin)
        ->post('/admin/students', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            // ... other fields
        ])
        ->assertRedirect('/admin/students')
        ->assertSessionHas('success');
}
```

## Next Steps

1. Create remaining controllers (Subject, Class, Examination, Library, Timetable, Announcement, Report)
2. Add API controllers if needed for mobile app
3. Implement advanced features (bulk operations, imports, exports)
4. Add unit and feature tests
5. Optimize queries for better performance
6. Add caching where appropriate

---

**Combridge Centre for Polytechnic Studies**
