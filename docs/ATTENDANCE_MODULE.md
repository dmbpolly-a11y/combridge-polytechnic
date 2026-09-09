# Attendance Management System Documentation

## Overview

The Attendance Management System provides comprehensive functionality for tracking student and teacher attendance using both traditional manual marking and modern QR code scanning methods.

## Features

### 1. Traditional Student Attendance
- **Manual Marking**: Mark attendance class-by-class
- **Batch Operations**: Mark multiple students at once
- **Status Types**:
  - Present
  - Absent
  - Late
  - Excused
- **Subject-wise Tracking**: Optional subject-specific attendance
- **Date-based Recording**: Historical attendance data
- **Remarks/Notes**: Add comments for each attendance record

### 2. QR Code Attendance System
- **Session-based Scanning**: Create time-limited QR sessions
- **Real-time Tracking**: Live scan monitoring
- **Automatic Status**: Auto-determines late/present based on scan time
- **Device Information**: Captures device and IP for audit
- **Multiple Scans**: Prevents duplicate scans per session
- **Session Management**: Active, closed, expired statuses

#### Late Threshold
- Default: 15 minutes after session start time
- Students scanning after threshold are marked "late"
- Configurable per session

### 3. Teacher Attendance
- **Check-in/Check-out**: Time tracking
- **Status Types**:
  - Present
  - Absent
  - Half Day
  - On Leave
- **Daily Records**: One record per teacher per day
- **Automated Notifications**: (can be implemented)

### 4. Reporting and Analytics
- **Period Reports**: Date range analysis
- **Class Reports**: Per-class attendance statistics
- **Individual Reports**: Student-specific history
- **Statistics**:
  - Total attendance days
  - Present/Absent/Late counts
  - Attendance percentage
  - Average class attendance
- **Export Functionality**: CSV/Excel export (to be implemented)

### 5. Search and Filtering
- Filter by:
  - Class
  - Subject
  - Date/Date range
  - Status
  - Student/Teacher
- Real-time search
- AJAX-powered class student loading

## Database Tables

### student_attendance
```sql
- id
- student_id (FK to students)
- class_id (FK to classes)
- subject_id (FK to subjects, nullable)
- attendance_date (date)
- status (enum: present, absent, late, excused)
- remarks (text, nullable)
- marked_by (FK to users)
- timestamps
- UNIQUE(student_id, attendance_date, subject_id)
```

### teacher_attendance
```sql
- id
- teacher_id (FK to teachers)
- attendance_date (date)
- check_in_time (time, nullable)
- check_out_time (time, nullable)
- status (enum: present, absent, half_day, on_leave)
- remarks (text, nullable)
- timestamps
- UNIQUE(teacher_id, attendance_date)
```

### qr_attendance_sessions
```sql
- id
- class_id (FK to classes)
- subject_id (FK to subjects, nullable)
- teacher_id (FK to teachers)
- session_code (string, unique)
- session_date (date)
- start_time (time)
- end_time (time, nullable)
- status (enum: active, closed, expired)
- total_scans (integer, default 0)
- timestamps
```

### qr_attendance_logs
```sql
- id
- session_id (FK to qr_attendance_sessions)
- student_id (FK to students)
- scan_time (timestamp)
- device_info (string, nullable)
- ip_address (string, nullable)
- location (point, nullable) - GPS coordinates
- status (enum: present, late)
- timestamps
- INDEX(session_id, student_id, scan_time)
```

## Controller Methods

### AttendanceController

#### Student Attendance
1. **index()** - Attendance dashboard with filters and statistics
2. **mark()** - Show attendance marking form
3. **store()** - Save attendance records
4. **report()** - Generate attendance reports
5. **export()** - Export attendance data
6. **getClassStudents()** - AJAX: Get students for a class

#### QR Code Attendance
7. **qrCreate()** - Show QR session creation form
8. **qrStore()** - Create new QR session
9. **qrShow()** - Display QR code and monitor scans
10. **qrClose()** - Close session and finalize attendance
11. **qrSessions()** - List all QR sessions

#### Teacher Attendance
12. **teacherIndex()** - Teacher attendance list
13. **teacherMark()** - Mark teacher attendance
14. **teacherStore()** - Save teacher attendance

## Routes

### Admin Routes (Prefix: /admin/attendance)

```php
// Student Attendance
GET    /admin/attendance                    - attendance.index
GET    /admin/attendance/mark               - attendance.mark
POST   /admin/attendance/store              - attendance.store
GET    /admin/attendance/report             - attendance.report
GET    /admin/attendance/export             - attendance.export

// QR Code Attendance
GET    /admin/attendance/qr/create          - attendance.qr.create
POST   /admin/attendance/qr/store           - attendance.qr.store
GET    /admin/attendance/qr/sessions        - attendance.qr.sessions
GET    /admin/attendance/qr/{session}       - attendance.qr.show
POST   /admin/attendance/qr/{session}/close - attendance.qr.close

// Teacher Attendance
GET    /admin/attendance/teacher            - attendance.teacher.index
GET    /admin/attendance/teacher/mark       - attendance.teacher.mark
POST   /admin/attendance/teacher/store      - attendance.teacher.store

// AJAX
GET    /admin/attendance/class/{classId}/students - attendance.class.students
```

### Public Routes (for QR Scanning)

```php
GET    /attendance/qr/scan/{code}           - attendance.qr.scan
POST   /attendance/qr/submit                - attendance.qr.submit
```

## Models

### StudentAttendance Model

**Relationships:**
- `belongsTo` Student
- `belongsTo` SchoolClass
- `belongsTo` Subject
- `belongsTo` User (markedBy)

**Scopes:**
- `present()` - Filter present students
- `absent()` - Filter absent students
- `late()` - Filter late students
- `byDate($date)` - Filter by specific date
- `byDateRange($start, $end)` - Filter by date range
- `byClass($classId)` - Filter by class
- `bySubject($subjectId)` - Filter by subject

### TeacherAttendance Model

**Relationships:**
- `belongsTo` Teacher

**Scopes:**
- `present()` - Filter present teachers
- `absent()` - Filter absent teachers
- `onLeave()` - Filter teachers on leave
- `forDate($date)` - Filter by date

### QrAttendanceSession Model

**Relationships:**
- `belongsTo` SchoolClass
- `belongsTo` Subject
- `belongsTo` Teacher
- `hasMany` QrAttendanceLogs

**Methods:**
- `isActive()` - Check if session is active
- `isExpired()` - Check if session has expired
- `incrementScans()` - Increase scan count

**Scopes:**
- `active()` - Get active sessions
- `closed()` - Get closed sessions
- `forDate($date)` - Filter by date
- `forClass($classId)` - Filter by class

### QrAttendanceLog Model

**Relationships:**
- `belongsTo` QrAttendanceSession
- `belongsTo` Student

**Methods:**
- `isLate()` - Check if scan was late

**Scopes:**
- `forSession($sessionId)` - Filter by session
- `forStudent($studentId)` - Filter by student
- `late()` - Get late scans
- `present()` - Get on-time scans

**Events:**
- `creating` - Auto-determines status, increments session scan count

## Usage Examples

### Marking Traditional Attendance

```php
// Controller
$attendances = [
    ['student_id' => 1, 'status' => 'present'],
    ['student_id' => 2, 'status' => 'absent', 'remarks' => 'Sick'],
    ['student_id' => 3, 'status' => 'late'],
];

foreach ($attendances as $attendance) {
    StudentAttendance::updateOrCreate(
        [
            'student_id' => $attendance['student_id'],
            'attendance_date' => '2024-01-15',
            'subject_id' => null,
        ],
        [
            'class_id' => 1,
            'status' => $attendance['status'],
            'remarks' => $attendance['remarks'] ?? null,
            'marked_by' => auth()->id(),
        ]
    );
}
```

### Creating QR Attendance Session

```php
$session = QrAttendanceSession::create([
    'class_id' => 1,
    'subject_id' => 5,
    'teacher_id' => 2,
    'session_code' => Str::upper(Str::random(8)), // e.g., "ABC12XYZ"
    'session_date' => today(),
    'start_time' => '08:00:00',
    'end_time' => '10:00:00',
    'status' => 'active',
]);

// Generate QR code URL
$qrUrl = route('attendance.qr.scan', ['code' => $session->session_code]);
```

### Student Scanning QR Code

```php
// Student scans QR, opens URL in browser
// System creates attendance log
QrAttendanceLog::create([
    'session_id' => $session->id,
    'student_id' => $studentId,
    'scan_time' => now(),
    'device_info' => request()->userAgent(),
    'ip_address' => request()->ip(),
]);

// Status automatically determined based on scan time
// 'present' if within 15 minutes of start
// 'late' if after 15 minutes
```

### Closing QR Session

```php
// When session is closed, convert QR logs to regular attendance
$session->update(['status' => 'closed']);

$logs = $session->logs;

foreach ($logs as $log) {
    StudentAttendance::updateOrCreate(
        [
            'student_id' => $log->student_id,
            'attendance_date' => $session->session_date,
            'subject_id' => $session->subject_id,
        ],
        [
            'class_id' => $session->class_id,
            'status' => $log->status,
            'remarks' => 'Via QR Code Scan',
            'marked_by' => $session->teacher->user_id,
        ]
    );
}
```

### Generating Attendance Report

```php
$students = Student::where('class_id', $classId)->get();
$startDate = '2024-01-01';
$endDate = '2024-01-31';

foreach ($students as $student) {
    $records = StudentAttendance::where('student_id', $student->id)
        ->whereBetween('attendance_date', [$startDate, $endDate])
        ->get();

    $total = $records->count();
    $present = $records->where('status', 'present')->count();
    $absent = $records->where('status', 'absent')->count();
    $late = $records->where('status', 'late')->count();
    
    $percentage = $total > 0 ? round(($present / $total) * 100, 2) : 0;
    
    // Display or export data
}
```

### Teacher Attendance

```php
TeacherAttendance::updateOrCreate(
    [
        'teacher_id' => $teacherId,
        'attendance_date' => today(),
    ],
    [
        'check_in_time' => '08:00:00',
        'check_out_time' => '16:00:00',
        'status' => 'present',
    ]
);
```

## Business Rules

### Student Attendance Rules
1. One attendance record per student per day per subject
2. If no subject specified, tracks general daily attendance
3. Can update existing records (updateOrCreate)
4. Must be marked by authenticated user
5. Cannot mark future dates
6. Status must be one of: present, absent, late, excused

### QR Attendance Rules
1. Session must be active to accept scans
2. Each student can scan only once per session
3. Late threshold: 15 minutes after start time
4. Session expires after end_time if specified
5. Session code must be unique (8 characters, uppercase)
6. Session can only be closed by teacher or admin
7. On closing, QR logs are converted to regular attendance

### Teacher Attendance Rules
1. One record per teacher per day
2. Check-in/out times are optional but recommended
3. Status determines leave/absence
4. Can be marked by admin or self (if enabled)

## Statistics Available

### Dashboard Statistics
- Today's present count
- Today's absent count
- Today's late count
- Total active students
- Attendance percentage
- Class-wise breakdown

### Report Statistics (per student)
- Total attendance days
- Present days
- Absent days
- Late days
- Excused days
- Attendance percentage

### QR Session Statistics
- Total scans
- On-time scans
- Late scans
- Expected vs actual attendance
- Real-time monitoring

## Notifications (Future Enhancement)

### Automated Alerts
1. **Absence Alerts**: Notify parents when student absent
2. **Late Alerts**: Notify when student is late
3. **Low Attendance**: Alert when percentage drops below threshold
4. **Teacher Absence**: Notify HOD/admin
5. **QR Reminders**: Remind students to scan

### Communication Channels
- SMS
- Email
- Push notifications (mobile app)
- In-system notifications

## QR Code Implementation

### Technology Stack
- **QR Generation**: SimpleSoftwareIO/laravel-qrcode
- **Session Codes**: 8-character alphanumeric (uppercase)
- **Security**: Time-limited sessions, one-time scans
- **Mobile Friendly**: Responsive scan page

### QR Code Workflow
1. Teacher creates session → System generates unique code
2. System displays QR code on screen/projector
3. Students scan QR with phone camera
4. Opens URL: `/attendance/qr/scan/{code}`
5. Student enters ID or selects name
6. System validates and records scan
7. Provides instant confirmation
8. Teacher monitors scans in real-time
9. Teacher closes session when done
10. System converts scans to attendance records

### Security Features
- Session expiration
- IP and device logging
- Duplicate scan prevention
- Session status validation
- Teacher-only session management

## Permissions Required

### Admin/Principal
- View all attendance records
- Mark student and teacher attendance
- Create QR sessions
- Generate reports
- Export data
- Modify historical records

### Teacher
- Mark attendance for own classes
- Create QR sessions for own classes
- View own class attendance
- Generate class reports

### Student
- View own attendance history
- Scan QR codes for attendance
- View attendance percentage

### Parent/Guardian
- View child's attendance
- Receive attendance notifications

## Configuration

### System Settings
```php
'attendance' => [
    'late_threshold_minutes' => 15,
    'qr_session_expiry_hours' => 4,
    'minimum_percentage' => 75, // Required attendance
    'notification_enabled' => true,
    'allow_past_date_marking' => false,
    'max_past_days' => 7,
],
```

## Future Enhancements

1. **Biometric Integration**
   - Fingerprint scanning
   - Face recognition

2. **GPS-based Attendance**
   - Location verification for QR scans
   - Geofencing for campus

3. **AI/ML Features**
   - Attendance prediction
   - Pattern detection
   - Risk identification

4. **Mobile App**
   - Native QR scanner
   - Push notifications
   - Offline capability

5. **Integration**
   - Sync with national databases
   - API for third-party systems
   - Parent portal integration

6. **Advanced Reporting**
   - Predictive analytics
   - Trend analysis
   - Custom report builder

7. **Automated Actions**
   - Auto-generate warning letters
   - Attendance-based restrictions
   - Grade impact calculation

## Testing

### Unit Tests
```bash
php artisan test --filter AttendanceTest
```

### Test Cases
- Mark attendance for single student
- Mark batch attendance
- Create QR session
- Student QR scan
- Duplicate scan prevention
- Late detection
- Session expiry
- Report generation
- Teacher attendance
- Date range filtering

## API Endpoints (Optional)

For mobile app integration:

```
POST   /api/attendance/mark              - Mark attendance
GET    /api/attendance/student/{id}      - Get student attendance
POST   /api/attendance/qr/scan           - Submit QR scan
GET    /api/attendance/qr/session/{id}   - Get session details
GET    /api/attendance/report            - Get reports
```

## Troubleshooting

### Common Issues

**Issue**: QR code not generating
- Solution: Install qrcode package: `composer require simplesoftwareio/simple-qrcode`

**Issue**: Duplicate attendance records
- Solution: Check unique constraint on student_id + date + subject_id

**Issue**: Late status not working
- Solution: Verify session start_time and late threshold setting

**Issue**: Students can't scan QR
- Solution: Check session status (must be 'active')

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
