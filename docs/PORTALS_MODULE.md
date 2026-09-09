# Student and Teacher Portals Documentation

## Overview

The Student and Teacher Portals provide role-specific interfaces for students and teachers to access their academic information, track progress, manage attendance, view results, and interact with the school management system.

---

## STUDENT PORTAL

### Features

#### 1. Dashboard
- **Personal Statistics**:
  - Attendance percentage
  - Pending fees balance
  - Current GPA
  - Books issued count
- **Today's Schedule**: Classes for the current day
- **Recent Activity**: Latest attendance and fee payments
- **Announcements**: Important updates and notices
- **Quick Actions**: Navigate to key features

#### 2. Profile Management
- View personal information
- Student details (admission number, contact, etc.)
- Class and programme information
- Emergency contact details
- Profile photo (future)

#### 3. Attendance Tracking
- **View Records**: Monthly attendance history
- **Statistics**:
  - Total days
  - Present days
  - Late arrivals
  - Absences
  - Excused absences
  - Attendance percentage
- **Filters**: Filter by month/year
- **Status Indicators**: Color-coded attendance status
- **Export**: Download attendance records (future)

#### 4. Exam Results
- View all exam results by semester/year
- **Detailed Results**:
  - Subject-wise marks
  - Grades and remarks
  - Maximum marks
  - Percentage
- **Performance Analytics**:
  - Overall GPA
  - Grade distribution
  - Subject performance trends
- **Filters**: By academic year and semester
- **Report Cards**: View and download (when published)

#### 5. Fee Management
- **Fee Statement**: Complete financial overview
- **Statistics**:
  - Total fees
  - Amount paid
  - Pending balance
  - Last payment date
- **Payment History**: Chronological payment records
- **Receipt Download**: PDF receipts for each payment
- **Payment Methods**: View payment method used
- **Fee Structure**: Breakdown of fees by type

#### 6. Timetable Access
- **Weekly View**: Complete class schedule
- **Today's Schedule**: Current day classes
- **Details**:
  - Subject name
  - Teacher name
  - Room/location
  - Time slots
- **Print/Export**: Printable timetable format

#### 7. Library Services
- **Current Borrowed Books**:
  - Book details
  - Issue date
  - Return date
  - Overdue status
- **Borrowing History**: Past book issues
- **Fine Tracking**: Overdue fines calculation
- **Statistics**:
  - Total books borrowed
  - Books returned
  - Overdue books count
  - Total fines

#### 8. Announcements
- View published announcements
- Filter by date/category
- Read detailed announcement content
- Mark as read (future)
- Push notifications (future)

### Controllers

#### StudentPortalController

**Methods:**
1. `dashboard()` - Main student dashboard with stats
2. `profile()` - View student profile
3. `attendance()` - View attendance records with filters
4. `examResults()` - View exam results with GPA calculation
5. `feeStatement()` - View fee balance and payments
6. `downloadReceipt($paymentId)` - Download fee receipt
7. `timetable()` - View class timetable
8. `library()` - View borrowed books and history
9. `announcements()` - View all announcements
10. `viewAnnouncement($id)` - View single announcement

**Helper Methods:**
- `getAuthenticatedStudent()` - Get current student record
- `getAttendancePercentage($student)` - Calculate attendance %
- `getPendingFees($student)` - Get outstanding balance
- `getCurrentGPA($student)` - Calculate current GPA
- `getBooksIssued($student)` - Count borrowed books

### Routes (Prefix: /student)

```php
GET    /student/dashboard                    - student.dashboard
GET    /student/profile                      - student.profile
GET    /student/attendance                   - student.attendance
GET    /student/results                      - student.results
GET    /student/fees                         - student.fees
GET    /student/fees/receipt/{payment}       - student.fees.receipt
GET    /student/timetable                    - student.timetable
GET    /student/library                      - student.library
GET    /student/announcements                - student.announcements
GET    /student/announcements/{announcement} - student.announcements.view
```

### Access Control
- **Middleware**: `role:student`
- **Authentication**: Required
- **Data Scope**: Students can only view their own data
- **Privacy**: Cannot access other students' information

---

## TEACHER PORTAL

### Features

#### 1. Dashboard
- **Personal Statistics**:
  - Classes assigned count
  - Total students taught
  - Attendance status today
  - Pending marks entry
- **Today's Schedule**: Teaching schedule for current day
- **Recent Attendance**: Personal attendance records
- **Upcoming Exams**: Scheduled examinations
- **Announcements**: Staff notices and updates
- **Quick Actions**: Navigate to key features

#### 2. Profile Management
- View personal information
- Employee details (employee ID, contact)
- Department information
- Qualifications
- Profile photo (future)

#### 3. Teaching Schedule
- **Weekly Timetable**: Complete teaching schedule
- **Details**:
  - Class name
  - Subject taught
  - Room/location
  - Time slots
- **Multiple Classes**: View all assigned classes
- **Print/Export**: Printable schedule

#### 4. Class Management
- **View Assigned Classes**: List of classes taught
- **Class Details**:
  - Programme information
  - Student count
  - Class schedule
- **Student Lists**: View students in each class
- **Class Resources**: Access class materials (future)

#### 5. Attendance Management
- **Mark Attendance**:
  - Select class and date
  - Mark present/absent/late/excused
  - Bulk marking interface
  - Update existing attendance
- **Verification**: Teachers can only mark for assigned classes
- **History**: View past attendance records
- **Reports**: Attendance summaries per class

#### 6. Marks Entry
- **View Exams**: List of examinations for assigned classes
- **Enter Marks**:
  - Subject-wise marks entry
  - Individual student marks
  - Max marks validation
  - Auto-grade calculation
- **Edit Marks**: Update existing marks
- **Verification**: Only for classes taught
- **Batch Entry**: Enter marks for entire class
- **Progress Tracking**: See completed vs pending marks

#### 7. Personal Attendance
- **View Own Attendance**: Monthly attendance records
- **Statistics**:
  - Total working days
  - Present days
  - Late arrivals
  - Absences
  - Attendance percentage
- **Check-in/Check-out**: Time tracking (if enabled)
- **Leave Requests**: View leave history (future)

#### 8. Student Information
- **View Student Lists**: Students in assigned classes
- **Student Details**:
  - Personal information
  - Academic performance
  - Attendance records
  - Contact information
- **Performance Tracking**: Monitor student progress

#### 9. Announcements
- View staff announcements
- Important notices
- School events
- Policy updates

### Controllers

#### TeacherPortalController

**Methods:**
1. `dashboard()` - Main teacher dashboard with stats
2. `profile()` - View teacher profile
3. `timetable()` - View teaching schedule
4. `classes()` - View assigned classes
5. `classStudents($classId)` - View students in a class
6. `markAttendance()` - Show attendance marking form
7. `storeAttendance()` - Save attendance records
8. `exams()` - View examinations for marking
9. `enterMarks($examId)` - Show marks entry form
10. `storeMarks($examId)` - Save exam marks
11. `myAttendance()` - View personal attendance
12. `announcements()` - View all announcements
13. `viewAnnouncement($id)` - View single announcement

**Helper Methods:**
- `getAuthenticatedTeacher()` - Get current teacher record
- `getClassesAssigned($teacher)` - Count assigned classes
- `getTotalStudents($teacher)` - Count total students taught
- `getAttendanceToday($teacher)` - Check today's attendance
- `getPendingMarksEntry($teacher)` - Count pending marks

### Routes (Prefix: /teacher)

```php
GET    /teacher/dashboard                       - teacher.dashboard
GET    /teacher/profile                         - teacher.profile
GET    /teacher/timetable                       - teacher.timetable
GET    /teacher/classes                         - teacher.classes
GET    /teacher/classes/{class}/students        - teacher.classes.students
GET    /teacher/attendance/mark                 - teacher.attendance.mark
POST   /teacher/attendance/store                - teacher.attendance.store
GET    /teacher/attendance/my                   - teacher.attendance.my
GET    /teacher/exams                           - teacher.exams
GET    /teacher/exams/{examination}/marks       - teacher.exams.marks
POST   /teacher/exams/{examination}/marks       - teacher.exams.marks.store
GET    /teacher/announcements                   - teacher.announcements
GET    /teacher/announcements/{announcement}    - teacher.announcements.view
```

### Access Control
- **Middleware**: `role:teacher`
- **Authentication**: Required
- **Data Scope**: Teachers can only access their assigned classes
- **Verification**: Class assignment checked before granting access
- **Marks Entry**: Restricted to subjects they teach

---

## Common Features

### 1. Authentication & Authorization
- **Role-based Access**: Separate portals by user role
- **Session Management**: Secure login sessions
- **Permission Checks**: Verify access to resources
- **Data Isolation**: Users see only their own data

### 2. Responsive Design
- **Mobile-Friendly**: Works on all devices
- **Touch-Optimized**: Easy navigation on tablets
- **Progressive Web App**: Installable on mobile (future)

### 3. Notifications
- **In-App Notifications**: Bell icon with count
- **Email Notifications**: Important updates (future)
- **SMS Alerts**: Critical information (future)
- **Push Notifications**: Mobile alerts (future)

### 4. Search & Filters
- **Date Filters**: Filter by date ranges
- **Academic Year**: Filter by year/semester
- **Status Filters**: Filter by status types
- **Quick Search**: Find records quickly

### 5. Export & Print
- **PDF Generation**: Download reports as PDF
- **Excel Export**: Export data to spreadsheets (future)
- **Print-Friendly**: Optimized print layouts
- **Batch Downloads**: Multiple documents (future)

---

## Business Rules

### Student Portal Rules
1. Students can only view their own data
2. Published results only (drafts hidden)
3. Finalized report cards only
4. Current academic year data by default
5. Overdue fines calculated automatically
6. Receipt download requires valid payment ID
7. Announcements filtered by target audience

### Teacher Portal Rules
1. Can only mark attendance for assigned classes
2. Can only enter marks for subjects they teach
3. Must verify class assignment before access
4. Cannot modify finalized results
5. Attendance date cannot be future date
6. Marks must be within max marks range
7. Auto-grade based on percentage

### Data Access Rules
1. Authentication required for all portal pages
2. Role middleware enforces access control
3. Student/Teacher record must exist
4. Active status required for most operations
5. Academic year defaults to current year
6. Semester filtering available

---

## Security Features

### 1. Authentication
- Secure login with password hashing
- Session timeout after inactivity
- Remember me option (optional)
- Password reset functionality

### 2. Authorization
- Role-based access control (RBAC)
- Permission verification per action
- Middleware protection on all routes
- Resource ownership validation

### 3. Data Protection
- SQL injection prevention
- XSS protection
- CSRF tokens on forms
- Input validation and sanitization

### 4. Privacy
- Students cannot see others' data
- Teachers limited to assigned classes
- Personal information protected
- Secure file downloads

---

## User Workflows

### Student: Check Attendance
```
1. Login → Student Dashboard
2. Click "Attendance" in menu
3. Select month (optional)
4. View attendance records with statistics
5. Export/print if needed
```

### Student: View Exam Results
```
1. Login → Student Dashboard
2. Click "Results" in menu
3. Select academic year/semester
4. View results with GPA
5. Download report card (if published)
```

### Student: Check Fees
```
1. Login → Student Dashboard
2. Click "Fees" in menu
3. View fee balance and payment history
4. Download receipt for specific payment
```

### Teacher: Mark Attendance
```
1. Login → Teacher Dashboard
2. Click "Mark Attendance"
3. Select class and date
4. Mark each student (present/absent/late/excused)
5. Submit attendance
6. Confirmation message displayed
```

### Teacher: Enter Marks
```
1. Login → Teacher Dashboard
2. Click "Exams"
3. Select examination
4. Click "Enter Marks"
5. Enter marks for each student
6. Grades auto-calculated
7. Submit marks
```

---

## Dashboard Statistics

### Student Dashboard
- **Attendance Percentage**: Current year attendance
- **Pending Fees**: Outstanding balance
- **Current GPA**: Semester GPA
- **Books Issued**: Active borrowings

### Teacher Dashboard
- **Classes Assigned**: Unique classes taught
- **Students Count**: Total students across all classes
- **Attendance Today**: Check-in status
- **Pending Marks**: Exams awaiting marks entry

---

## Integration Points

### Integrates With:
1. **Attendance Module**: View/mark attendance
2. **Examination Module**: Results and marks
3. **Fee Module**: Payments and balances
4. **Library Module**: Book issues and returns
5. **Timetable Module**: Class schedules
6. **Communication Module**: Announcements

### Data Sources:
- `students` table
- `teachers` table
- `student_attendance` table
- `teacher_attendance` table
- `exam_results` table
- `fee_balances` table
- `fee_payments` table
- `book_issues` table
- `timetables` table
- `announcements` table

---

## Future Enhancements

### Student Portal
1. **Profile Updates**: Allow students to update contact info
2. **Online Fee Payment**: Integrate payment gateways
3. **Assignment Submission**: Upload assignments
4. **Discussion Forums**: Class discussions
5. **Course Materials**: Download study materials
6. **Attendance QR**: Self-scan attendance
7. **Parent Portal**: Link parent accounts
8. **Notifications**: Real-time alerts
9. **Chat System**: Message teachers
10. **Calendar Integration**: Sync with Google Calendar

### Teacher Portal
1. **Grade Book**: Comprehensive grading system
2. **Lesson Plans**: Create and manage lesson plans
3. **Resource Sharing**: Upload teaching materials
4. **Student Notes**: Add student observations
5. **Performance Analytics**: Detailed insights
6. **Attendance Patterns**: Trend analysis
7. **Automated Reports**: Generate reports
8. **Video Conferencing**: Virtual classes
9. **Quiz Builder**: Create online assessments
10. **Communication**: Direct messaging with students

### Common Enhancements
1. **Mobile Apps**: Native iOS/Android apps
2. **Offline Mode**: Work without internet
3. **Dark Mode**: Theme options
4. **Multi-language**: Language support
5. **Accessibility**: WCAG compliance
6. **API Access**: Mobile/third-party integration
7. **Analytics Dashboard**: Advanced insights
8. **Custom Widgets**: Personalized dashboard
9. **Calendar View**: Visual calendar interface
10. **Social Features**: School community features

---

## Technical Details

### Authentication Flow
```
1. User submits login credentials
2. System validates credentials
3. Check user role (student/teacher)
4. Load corresponding record (Student/Teacher model)
5. Redirect to appropriate portal dashboard
6. Verify record exists and is active
7. Load dashboard with personalized data
```

### Data Loading Strategy
```
Dashboard: Eager loading with relationships
Lists: Pagination with 20 items per page
Details: Load on-demand
Statistics: Cached for 5 minutes (optional)
Real-time: WebSocket updates (future)
```

### Performance Optimization
- Eager loading relationships
- Database query optimization
- Pagination for large datasets
- Caching frequently accessed data
- Lazy loading for heavy content
- CDN for static assets

---

## Testing

### Unit Tests
```bash
php artisan test --filter StudentPortalTest
php artisan test --filter TeacherPortalTest
```

### Test Cases

**Student Portal:**
- View dashboard
- Check attendance records
- View exam results
- Calculate GPA
- View fee statement
- Download receipt
- Access timetable
- View library books
- Read announcements

**Teacher Portal:**
- View dashboard
- Access timetable
- View assigned classes
- Mark student attendance
- Enter exam marks
- View personal attendance
- Access student lists
- Read announcements

---

## Troubleshooting

### Common Issues

**Issue**: Student/Teacher record not found
- **Solution**: Ensure user_id is linked to student/teacher record

**Issue**: Cannot access class
- **Solution**: Verify teacher is assigned to class in timetable

**Issue**: Results not showing
- **Solution**: Check if report cards are published

**Issue**: Attendance not updating
- **Solution**: Verify date format and class assignment

**Issue**: GPA calculation incorrect
- **Solution**: Check BrandingHelper::calculateGPA() logic

---

## Permissions Matrix

| Feature               | Student | Teacher | Admin |
|-----------------------|---------|---------|-------|
| View Own Profile      | ✓       | ✓       | ✓     |
| View Attendance       | ✓ (own) | ✓ (own) | ✓ (all) |
| Mark Attendance       | ✗       | ✓       | ✓     |
| View Results          | ✓ (own) | ✗       | ✓ (all) |
| Enter Marks           | ✗       | ✓       | ✓     |
| View Fees             | ✓ (own) | ✗       | ✓ (all) |
| Download Receipts     | ✓ (own) | ✗       | ✓ (all) |
| View Timetable        | ✓ (class) | ✓ (own) | ✓ (all) |
| View Library Books    | ✓ (own) | ✗       | ✓ (all) |
| View Announcements    | ✓       | ✓       | ✓     |
| View Student Lists    | ✗       | ✓       | ✓     |

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
