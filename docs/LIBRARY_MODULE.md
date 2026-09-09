# Library Management Module Documentation

## Overview

The Library Management Module provides comprehensive functionality for managing the school library, including book inventory, issuing/returning books, tracking overdue items, fine management, and reporting.

## Features

### 1. Book Management
- **CRUD Operations**: Create, Read, Update, Delete books
- **Book Information**:
  - Title, Author, Publisher
  - ISBN (unique identifier)
  - Publication Year
  - Category (Computer Science, Mathematics, etc.)
  - Subject association
  - Total copies and available copies
  - Price
  - Description
  - Shelf location
  - Status (available/unavailable)

### 2. Book Issuing System
- Issue books to students
- Track issue date and due date
- Automatic copy management (decreases available copies)
- Check for:
  - Book availability
  - Duplicate issues to same student
- Record who issued the book

### 3. Book Return System
- Return issued books
- Calculate overdue fines automatically
- Fine structure: 1000 UGX per day overdue
- Track fine payment status
- Record who received the return
- Automatic copy management (increases available copies)

### 4. Overdue Management
- Automatic detection of overdue books
- Status change from 'issued' to 'overdue'
- Fine calculation based on days overdue
- Overdue notifications (can be extended)

### 5. Student Borrowing History
- Complete borrowing history per student
- Statistics:
  - Total books borrowed
  - Currently issued
  - Overdue count
  - Total fines
  - Unpaid fines
- View current and past issues

### 6. Search and Filtering
- Search books by:
  - Title
  - Author
  - ISBN
  - Category
- Filter by:
  - Category
  - Subject
  - Status (available/unavailable)
- Search students for issuing

### 7. Reports and Analytics
- Library statistics dashboard
- Popular books (most borrowed)
- Active borrowers (top borrowers)
- Financial reports (fines collected/pending)
- Period-based reports
- Book circulation statistics

## Database Tables

### books
Stores book inventory information.

```sql
- id (primary key)
- title (string)
- isbn (string, unique, nullable)
- author (string)
- publisher (string, nullable)
- publication_year (year, nullable)
- category (string)
- subject_id (foreign key, nullable)
- total_copies (integer)
- available_copies (integer)
- price (decimal)
- description (text, nullable)
- shelf_location (string, nullable)
- status (enum: available, unavailable)
- timestamps
- soft deletes
```

### book_issues
Tracks book borrowing and returns.

```sql
- id (primary key)
- book_id (foreign key)
- student_id (foreign key)
- issue_date (date)
- due_date (date)
- return_date (date, nullable)
- status (enum: issued, returned, overdue, lost)
- fine_amount (decimal, default 0)
- fine_paid (boolean, default false)
- remarks (text, nullable)
- issued_by (foreign key to users)
- returned_to (foreign key to users, nullable)
- timestamps
```

## Controller Methods

### LibraryController

#### Book Management
1. **index()** - List all books with filters
2. **create()** - Show create book form
3. **store()** - Save new book
4. **show()** - Display book details
5. **edit()** - Show edit book form
6. **update()** - Update book information
7. **destroy()** - Delete book (if no active issues)

#### Issue Management
8. **issueForm()** - Show book issue form
9. **issueBook()** - Process book issuing
10. **issues()** - List all book issues
11. **returnForm()** - Show book return form
12. **returnBook()** - Process book return

#### Reports & Analytics
13. **overdueBooks()** - List overdue books
14. **studentHistory()** - Student borrowing history
15. **report()** - Generate library reports

#### AJAX Endpoints
16. **searchStudent()** - Search students for issuing

## Routes

### Admin Routes (Prefix: /admin/library)

```php
// Books CRUD
GET    /admin/library                    - library.index
GET    /admin/library/create             - library.create
POST   /admin/library                    - library.store
GET    /admin/library/{book}             - library.show
GET    /admin/library/{book}/edit        - library.edit
PUT    /admin/library/{book}             - library.update
DELETE /admin/library/{book}             - library.destroy

// Book Issuing
GET    /admin/library/issue/form         - library.issue.form
POST   /admin/library/issue              - library.issue

// Book Returns
GET    /admin/library/return/{issue}     - library.return.form
POST   /admin/library/return/{issue}     - library.return

// Issues & Reports
GET    /admin/library/issues/list        - library.issues
GET    /admin/library/overdue/list       - library.overdue
GET    /admin/library/reports/generate   - library.report
GET    /admin/library/student/{student}/history - library.student.history

// AJAX
GET    /admin/library/search/student     - library.search.student
```

### Student Routes
```php
GET    /student/library/history          - student.library.history
```

## Models

### Book Model

**Relationships:**
- `belongsTo` Subject
- `hasMany` BookIssues
- `hasMany` currentlyIssued (scoped)

**Methods:**
- `isAvailable()` - Check if book can be issued
- `issue()` - Decrease available copies
- `returnBook()` - Increase available copies

**Scopes:**
- `available()` - Get available books
- `byCategory($category)` - Filter by category
- `bySubject($subjectId)` - Filter by subject

### BookIssue Model

**Relationships:**
- `belongsTo` Book
- `belongsTo` Student
- `belongsTo` User (issuedBy)
- `belongsTo` User (returnedTo)

**Methods:**
- `isOverdue()` - Check if book is overdue
- `calculateFine($finePerDay)` - Calculate fine amount
- `getDaysOverdueAttribute()` - Get overdue days

**Scopes:**
- `issued()` - Get currently issued books
- `returned()` - Get returned books
- `overdue()` - Get overdue books
- `withUnpaidFine()` - Get books with unpaid fines

**Events:**
- `creating` - Decreases book available copies
- `updated` - Increases book available copies when returned

## Usage Examples

### Adding a New Book

```php
$book = Book::create([
    'title' => 'Introduction to Programming',
    'isbn' => '978-0-123456-78-9',
    'author' => 'John Doe',
    'publisher' => 'Tech Books Ltd',
    'publication_year' => 2023,
    'category' => 'Computer Science',
    'subject_id' => 5,
    'total_copies' => 10,
    'available_copies' => 10,
    'price' => 50000,
    'shelf_location' => 'CS-A-101',
    'status' => 'available',
]);
```

### Issuing a Book

```php
// In Controller
$issue = BookIssue::create([
    'book_id' => $request->book_id,
    'student_id' => $request->student_id,
    'issue_date' => now(),
    'due_date' => now()->addDays(14), // 2 weeks
    'issued_by' => auth()->id(),
    'status' => 'issued',
]);

// Book model will automatically decrease available_copies
```

### Returning a Book

```php
$issue->update([
    'return_date' => now(),
    'status' => 'returned',
    'fine_amount' => $calculatedFine,
    'fine_paid' => $request->fine_paid,
    'returned_to' => auth()->id(),
]);

// Book model will automatically increase available_copies
```

### Calculating Fine

```php
if ($issue->isOverdue()) {
    $daysOverdue = Carbon::parse($issue->due_date)->diffInDays(now());
    $fine = $daysOverdue * 1000; // 1000 UGX per day
}
```

### Getting Student Borrowing History

```php
$history = BookIssue::with(['book', 'issuedBy', 'returnedTo'])
    ->where('student_id', $studentId)
    ->latest()
    ->get();
```

### Finding Overdue Books

```php
// Update status first
BookIssue::where('status', 'issued')
    ->where('due_date', '<', now())
    ->update(['status' => 'overdue']);

// Get overdue books
$overdueBooks = BookIssue::with(['book', 'student.user'])
    ->where('status', 'overdue')
    ->get();
```

## Views Structure

```
resources/views/admin/library/
├── index.blade.php          # Books list
├── create.blade.php         # Add new book form
├── edit.blade.php           # Edit book form
├── show.blade.php           # Book details
├── issue.blade.php          # Issue book form
├── return.blade.php         # Return book form
├── issues.blade.php         # All issues list
├── overdue.blade.php        # Overdue books list
├── student-history.blade.php # Student borrowing history
└── report.blade.php         # Library reports
```

## Business Rules

### Issuing Rules
1. Book must have available copies (available_copies > 0)
2. Book status must be 'available'
3. Student cannot have duplicate active issues for same book
4. Issue date must be current date or earlier
5. Due date must be after issue date

### Return Rules
1. Only books with status 'issued' or 'overdue' can be returned
2. Return date must be current date or earlier
3. If returned late, fine must be calculated and recorded
4. Fine can be marked as paid or unpaid

### Fine Calculation
- Default: 1000 UGX per day overdue
- Configurable in system settings
- Calculated from due date to return date (or current date if not returned)
- Fines can accumulate until paid

### Book Deletion Rules
- Cannot delete book with active issues (status = 'issued' or 'overdue')
- Can delete if all copies returned or lost
- Uses soft deletes for data integrity

## Statistics Available

### Dashboard Statistics
- Total books in library
- Total copies (sum of all copies)
- Available copies
- Currently issued books
- Overdue books count

### Report Statistics
- Books issued in period
- Books returned in period
- Currently issued
- Overdue count
- Lost books count
- Fines collected (with fine_paid = true)
- Pending fines (with fine_paid = false)
- Most borrowed books (top 10)
- Most active borrowers (top 10)

## Permissions Required

### Admin/Librarian
- View all books
- Add/Edit/Delete books
- Issue books to students
- Accept book returns
- View all issues and history
- Generate reports
- Manage fines

### Teacher
- View available books
- Search books
- View own borrowing history (if enabled)

### Student
- View available books
- View own borrowing history
- View issued books
- View fines

## Future Enhancements

1. **Notifications**
   - Email/SMS reminders before due date
   - Overdue notifications
   - Fine payment reminders

2. **Book Reservations**
   - Students can reserve unavailable books
   - Notification when book becomes available

3. **E-books Integration**
   - Digital library management
   - Online reading interface

4. **Barcode/QR Scanning**
   - Quick book identification
   - Fast issuing process

5. **Advanced Search**
   - Full-text search
   - Search by multiple criteria
   - Saved searches

6. **Book Reviews**
   - Student ratings and reviews
   - Popular books based on reviews

7. **Integration with Academic System**
   - Recommend books based on course/subject
   - Required reading lists
   - Link to syllabus

8. **Mobile App**
   - Book search on mobile
   - View borrowing history
   - Receive notifications

## Configuration

### Fine Settings
Can be configured in `config/library.php`:

```php
'fine_per_day' => 1000, // UGX
'max_issue_days' => 14,  // 2 weeks
'max_renewals' => 2,
'max_books_per_student' => 5,
```

## Testing

### Unit Tests
```bash
php artisan test --filter LibraryTest
```

### Feature Tests
- Book CRUD operations
- Issue/Return workflow
- Fine calculation
- Overdue detection
- Student history

## API Endpoints (Optional)

For mobile app integration:

```
GET    /api/library/books              - List books
GET    /api/library/books/{id}         - Book details
GET    /api/library/student/history    - My history
POST   /api/library/search             - Search books
```

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
