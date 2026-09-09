<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProgrammeController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\FeeController;
use App\Http\Controllers\Admin\TimetableController;
use App\Http\Controllers\Admin\ExaminationController;
use App\Http\Controllers\Admin\LibraryController;
use App\Http\Controllers\Admin\CommunicationController;
use App\Http\Controllers\Admin\AdminPortalController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Student\StudentPortalController;
use App\Http\Controllers\Teacher\TeacherPortalController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Public QR Code Scanning Route (for students)
Route::get('/attendance/qr/scan/{code}', function($code) {
    // This would show a simple form for students to scan and submit their ID
    return view('attendance.qr-scan', compact('code'));
})->name('attendance.qr.scan');

Route::post('/attendance/qr/submit', function(Request $request) {
    // Process QR scan submission
    $request->validate([
        'session_code' => 'required|exists:qr_attendance_sessions,session_code',
        'student_id' => 'required|exists:students,id',
    ]);

    $session = \App\Models\QrAttendanceSession::where('session_code', $request->session_code)
        ->where('status', 'active')
        ->first();

    if (!$session) {
        return back()->with('error', 'Session not found or has expired.');
    }

    // Check if student already scanned
    $existingScan = \App\Models\QrAttendanceLog::where('session_id', $session->id)
        ->where('student_id', $request->student_id)
        ->first();

    if ($existingScan) {
        return back()->with('info', 'You have already been marked present for this session.');
    }

    // Create attendance log
    \App\Models\QrAttendanceLog::create([
        'session_id' => $session->id,
        'student_id' => $request->student_id,
        'scan_time' => now(),
        'device_info' => $request->userAgent(),
        'ip_address' => $request->ip(),
    ]);

    return back()->with('success', 'Attendance marked successfully!');
})->name('attendance.qr.submit');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
    Route::get('/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset', [ResetPasswordController::class, 'reset'])->name('password.update');
});

Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('role:administrator,principal,director')->group(function () {
        
        // Admin Dashboard
        Route::get('/dashboard', [AdminPortalController::class, 'dashboard'])->name('dashboard');
        
        // User Management
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [AdminPortalController::class, 'users'])->name('index');
            Route::get('/create', [AdminPortalController::class, 'createUser'])->name('create');
            Route::post('/', [AdminPortalController::class, 'storeUser'])->name('store');
            Route::get('/{user}/edit', [AdminPortalController::class, 'editUser'])->name('edit');
            Route::put('/{user}', [AdminPortalController::class, 'updateUser'])->name('update');
            Route::delete('/{user}', [AdminPortalController::class, 'destroyUser'])->name('destroy');
        });
        
        // Role & Permission Management
        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [AdminPortalController::class, 'roles'])->name('index');
            Route::post('/', [AdminPortalController::class, 'storeRole'])->name('store');
            Route::put('/{role}', [AdminPortalController::class, 'updateRole'])->name('update');
            Route::delete('/{role}', [AdminPortalController::class, 'destroyRole'])->name('destroy');
        });
        
        // System Settings
        Route::get('/settings', [AdminPortalController::class, 'settings'])->name('settings');
        Route::put('/settings', [AdminPortalController::class, 'updateSettings'])->name('settings.update');
        
        // Activity Log
        Route::get('/activity-log', [AdminPortalController::class, 'activityLog'])->name('activity-log');
        
        // Reports
        Route::get('/reports', [AdminPortalController::class, 'reports'])->name('reports');
        
        // Detailed Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            // Academic Reports
            Route::get('/student-performance', [ReportController::class, 'studentPerformance'])->name('student-performance');
            Route::get('/class-results', [ReportController::class, 'classResults'])->name('class-results');
            Route::get('/enrollment', [ReportController::class, 'enrollment'])->name('enrollment');
            
            // Attendance Reports
            Route::get('/student-attendance', [ReportController::class, 'studentAttendance'])->name('student-attendance');
            Route::get('/teacher-attendance', [ReportController::class, 'teacherAttendance'])->name('teacher-attendance');
            
            // Financial Reports
            Route::get('/fee-collection', [ReportController::class, 'feeCollection'])->name('fee-collection');
            Route::get('/defaulters', [ReportController::class, 'defaulters'])->name('defaulters');
            
            // Operational Reports
            Route::get('/library-usage', [ReportController::class, 'libraryUsage'])->name('library-usage');
            Route::get('/timetable-utilization', [ReportController::class, 'timetableUtilization'])->name('timetable-utilization');
            
            // Export
            Route::post('/export/pdf', [ReportController::class, 'exportPDF'])->name('export.pdf');
            Route::post('/export/excel', [ReportController::class, 'exportExcel'])->name('export.excel');
        });
        
        // System Health
        Route::get('/health-check', [AdminPortalController::class, 'healthCheck'])->name('health-check');
        
        // Data Export
        Route::get('/data-export', [AdminPortalController::class, 'dataExport'])->name('data-export');
        Route::post('/export/students', [AdminPortalController::class, 'exportStudents'])->name('export.students');
        
        // Backup & Restore
        Route::get('/backup', [AdminPortalController::class, 'backup'])->name('backup');
        Route::post('/backup/create', [AdminPortalController::class, 'createBackup'])->name('backup.create');
        
        // AJAX endpoints
        Route::get('/quick-stats', [AdminPortalController::class, 'quickStats'])->name('quick-stats');
        
        // Students Management
        Route::resource('students', StudentController::class);
        Route::get('students/{student}/export', [StudentController::class, 'export'])->name('students.export');
        
        // Teachers Management
        Route::resource('teachers', TeacherController::class);
        
        // Departments Management
        Route::resource('departments', DepartmentController::class);
        
        // Programmes Management
        Route::resource('programmes', ProgrammeController::class);
        Route::get('programmes/{programme}/subjects', [ProgrammeController::class, 'manageSubjects'])->name('programmes.subjects');
        Route::post('programmes/{programme}/subjects', [ProgrammeController::class, 'updateSubjects'])->name('programmes.subjects.update');
        
        // Attendance Management
        Route::prefix('attendance')->name('attendance.')->group(function () {
            // Student Attendance
            Route::get('/', [AttendanceController::class, 'index'])->name('index');
            Route::get('/mark', [AttendanceController::class, 'mark'])->name('mark');
            Route::post('/store', [AttendanceController::class, 'store'])->name('store');
            Route::get('/report', [AttendanceController::class, 'report'])->name('report');
            Route::get('/export', [AttendanceController::class, 'export'])->name('export');
            
            // QR Code Attendance
            Route::prefix('qr')->name('qr.')->group(function () {
                Route::get('/create', [AttendanceController::class, 'qrCreate'])->name('create');
                Route::post('/store', [AttendanceController::class, 'qrStore'])->name('store');
                Route::get('/sessions', [AttendanceController::class, 'qrSessions'])->name('sessions');
                Route::get('/{session}', [AttendanceController::class, 'qrShow'])->name('show');
                Route::post('/{session}/close', [AttendanceController::class, 'qrClose'])->name('close');
            });
            
            // Teacher Attendance
            Route::prefix('teacher')->name('teacher.')->group(function () {
                Route::get('/', [AttendanceController::class, 'teacherIndex'])->name('index');
                Route::get('/mark', [AttendanceController::class, 'teacherMark'])->name('mark');
                Route::post('/store', [AttendanceController::class, 'teacherStore'])->name('store');
            });
            
            // AJAX endpoints
            Route::get('/class/{classId}/students', [AttendanceController::class, 'getClassStudents'])->name('class.students');
        });
        
        // Fee Management
        Route::prefix('fees')->name('fees.')->group(function () {
            // Fee Payments
            Route::get('/', [FeeController::class, 'index'])->name('index');
            Route::get('/collect', [FeeController::class, 'collect'])->name('collect');
            Route::post('/store', [FeeController::class, 'store'])->name('store');
            Route::get('/receipt/{payment}', [FeeController::class, 'receipt'])->name('receipt');
            Route::get('/receipt/{payment}/download', [FeeController::class, 'downloadReceipt'])->name('receipt.download');
            Route::get('/receipt/{payment}/print', [FeeController::class, 'printReceipt'])->name('receipt.print');
            
            // Fee Balances
            Route::get('/balances', [FeeController::class, 'balances'])->name('balances');
            Route::get('/defaulters', [FeeController::class, 'defaulters'])->name('defaulters');
            
            // Student Statement
            Route::get('/statement/{student}', [FeeController::class, 'statement'])->name('statement');
            Route::get('/statement/{student}/download', [FeeController::class, 'downloadStatement'])->name('statement.download');
            
            // Fee Structures
            Route::get('/structures', [FeeController::class, 'structures'])->name('structures');
            Route::post('/structures', [FeeController::class, 'storeStructure'])->name('structures.store');
            Route::put('/structures/{structure}', [FeeController::class, 'updateStructure'])->name('structures.update');
            Route::delete('/structures/{structure}', [FeeController::class, 'destroyStructure'])->name('structures.destroy');
            
            // Financial Reports
            Route::get('/reports', [FeeController::class, 'reports'])->name('reports');
            
            // AJAX endpoints
            Route::get('/search/student', [FeeController::class, 'searchStudent'])->name('search.student');
        });
        
        // Library Management
        Route::prefix('library')->name('library.')->group(function () {
            // Books CRUD
            Route::get('/', [LibraryController::class, 'index'])->name('index');
            Route::get('/create', [LibraryController::class, 'create'])->name('create');
            Route::post('/', [LibraryController::class, 'store'])->name('store');
            Route::get('/{book}', [LibraryController::class, 'show'])->name('show');
            Route::get('/{book}/edit', [LibraryController::class, 'edit'])->name('edit');
            Route::put('/{book}', [LibraryController::class, 'update'])->name('update');
            Route::delete('/{book}', [LibraryController::class, 'destroy'])->name('destroy');
            
            // Book Issuing
            Route::get('/issue/form', [LibraryController::class, 'issueForm'])->name('issue.form');
            Route::post('/issue', [LibraryController::class, 'issueBook'])->name('issue');
            
            // Book Returns
            Route::get('/return/{issue}', [LibraryController::class, 'returnForm'])->name('return.form');
            Route::post('/return/{issue}', [LibraryController::class, 'returnBook'])->name('return');
            
            // Issues List
            Route::get('/issues/list', [LibraryController::class, 'issues'])->name('issues');
            
            // Overdue Books
            Route::get('/overdue/list', [LibraryController::class, 'overdueBooks'])->name('overdue');
            
            // Student History
            Route::get('/student/{student}/history', [LibraryController::class, 'studentHistory'])->name('student.history');
            
            // Reports
            Route::get('/reports/generate', [LibraryController::class, 'report'])->name('report');
            
            // AJAX endpoints
            Route::get('/search/student', [LibraryController::class, 'searchStudent'])->name('search.student');
        });
        
        // Examination Management
        Route::prefix('examinations')->name('examinations.')->group(function () {
            // Examinations CRUD
            Route::get('/', [ExaminationController::class, 'index'])->name('index');
            Route::get('/create', [ExaminationController::class, 'create'])->name('create');
            Route::post('/', [ExaminationController::class, 'store'])->name('store');
            Route::get('/{examination}', [ExaminationController::class, 'show'])->name('show');
            Route::get('/{examination}/edit', [ExaminationController::class, 'edit'])->name('edit');
            Route::put('/{examination}', [ExaminationController::class, 'update'])->name('update');
            Route::delete('/{examination}', [ExaminationController::class, 'destroy'])->name('destroy');
            
            // Marks Entry
            Route::get('/{examination}/marks/enter', [ExaminationController::class, 'enterMarks'])->name('marks.enter');
            Route::post('/{examination}/marks/store', [ExaminationController::class, 'storeMarks'])->name('marks.store');
            
            // Report Cards
            Route::post('/report-card/generate', [ExaminationController::class, 'generateReportCard'])->name('report-card.generate');
            Route::get('/report-card/{reportCard}', [ExaminationController::class, 'showReportCard'])->name('report-card.show');
            Route::post('/report-card/{reportCard}/finalize', [ExaminationController::class, 'finalizeReportCard'])->name('report-card.finalize');
            Route::post('/report-card/{reportCard}/publish', [ExaminationController::class, 'publishReportCard'])->name('report-card.publish');
            Route::get('/report-card/{reportCard}/download', [ExaminationController::class, 'downloadReportCard'])->name('report-card.download');
            
            // Transcripts
            Route::post('/transcript/generate', [ExaminationController::class, 'generateTranscript'])->name('transcript.generate');
            Route::get('/transcript/{transcript}', [ExaminationController::class, 'showTranscript'])->name('transcript.show');
            Route::post('/transcript/{transcript}/issue', [ExaminationController::class, 'issueTranscript'])->name('transcript.issue');
            Route::get('/transcript/{transcript}/download', [ExaminationController::class, 'downloadTranscript'])->name('transcript.download');
            
            // Analysis & Reports
            Route::get('/analysis/results', [ExaminationController::class, 'analysis'])->name('analysis');
        });
        
        // Timetable and Room Management
        Route::prefix('timetables')->name('timetables.')->group(function () {
            // Timetable CRUD
            Route::get('/', [TimetableController::class, 'index'])->name('index');
            Route::get('/create', [TimetableController::class, 'create'])->name('create');
            Route::post('/', [TimetableController::class, 'store'])->name('store');
            Route::get('/{timetable}/edit', [TimetableController::class, 'edit'])->name('edit');
            Route::put('/{timetable}', [TimetableController::class, 'update'])->name('update');
            Route::delete('/{timetable}', [TimetableController::class, 'destroy'])->name('destroy');
            
            // View Timetables
            Route::get('/class/{class}', [TimetableController::class, 'viewClass'])->name('class.view');
            Route::get('/teacher/{teacher}', [TimetableController::class, 'viewTeacher'])->name('teacher.view');
            
            // Print Timetables
            Route::get('/class/{class}/print', [TimetableController::class, 'printClass'])->name('class.print');
            Route::get('/teacher/{teacher}/print', [TimetableController::class, 'printTeacher'])->name('teacher.print');
            
            // Room Management
            Route::get('/rooms', [TimetableController::class, 'rooms'])->name('rooms');
            Route::post('/rooms', [TimetableController::class, 'storeRoom'])->name('rooms.store');
            Route::put('/rooms/{room}', [TimetableController::class, 'updateRoom'])->name('rooms.update');
            Route::delete('/rooms/{room}', [TimetableController::class, 'destroyRoom'])->name('rooms.destroy');
            
            // Room Utilization
            Route::get('/rooms/utilization', [TimetableController::class, 'roomUtilization'])->name('rooms.utilization');
            
            // AJAX endpoints
            Route::post('/check-room-availability', [TimetableController::class, 'checkRoomAvailability'])->name('check.room');
        });
        
        // Communication Management
        Route::prefix('communications')->name('communications.')->group(function () {
            // Announcements
            Route::get('/announcements', [CommunicationController::class, 'announcements'])->name('announcements');
            Route::get('/announcements/create', [CommunicationController::class, 'createAnnouncement'])->name('announcements.create');
            Route::post('/announcements', [CommunicationController::class, 'storeAnnouncement'])->name('announcements.store');
            Route::get('/announcements/{announcement}/edit', [CommunicationController::class, 'editAnnouncement'])->name('announcements.edit');
            Route::put('/announcements/{announcement}', [CommunicationController::class, 'updateAnnouncement'])->name('announcements.update');
            Route::delete('/announcements/{announcement}', [CommunicationController::class, 'destroyAnnouncement'])->name('announcements.destroy');
            Route::post('/announcements/{announcement}/publish', [CommunicationController::class, 'publishAnnouncement'])->name('announcements.publish');
            
            // Messages
            Route::get('/messages', [CommunicationController::class, 'messages'])->name('messages');
            Route::get('/messages/compose', [CommunicationController::class, 'composeMessage'])->name('messages.compose');
            Route::post('/messages/send', [CommunicationController::class, 'sendMessage'])->name('messages.send');
            Route::get('/messages/{message}', [CommunicationController::class, 'viewMessage'])->name('messages.view');
            Route::post('/messages/{message}/reply', [CommunicationController::class, 'replyMessage'])->name('messages.reply');
            Route::delete('/messages/{message}', [CommunicationController::class, 'destroyMessage'])->name('messages.destroy');
            
            // SMS
            Route::get('/sms/logs', [CommunicationController::class, 'smsLogs'])->name('sms.logs');
            Route::post('/sms/send', [CommunicationController::class, 'sendSms'])->name('sms.send');
            
            // Email
            Route::get('/email/logs', [CommunicationController::class, 'emailLogs'])->name('email.logs');
            Route::post('/email/send', [CommunicationController::class, 'sendEmail'])->name('email.send');
            
            // Templates
            Route::get('/templates', [CommunicationController::class, 'templates'])->name('templates');
            Route::post('/templates', [CommunicationController::class, 'storeTemplate'])->name('templates.store');
            Route::put('/templates/{template}', [CommunicationController::class, 'updateTemplate'])->name('templates.update');
            Route::delete('/templates/{template}', [CommunicationController::class, 'destroyTemplate'])->name('templates.destroy');
            
            // Bulk Communication
            Route::get('/bulk', [CommunicationController::class, 'bulkCommunication'])->name('bulk');
            Route::post('/bulk/send', [CommunicationController::class, 'sendBulk'])->name('bulk.send');
            
            // AJAX endpoints
            Route::get('/messages/unread/count', [CommunicationController::class, 'unreadCount'])->name('messages.unread');
        });
    });
    
    // Teacher routes
    Route::prefix('teacher')->name('teacher.')->middleware('role:teacher')->group(function () {
        // Dashboard
        Route::get('/dashboard', [TeacherPortalController::class, 'dashboard'])->name('dashboard');
        
        // Profile
        Route::get('/profile', [TeacherPortalController::class, 'profile'])->name('profile');
        
        // Timetable
        Route::get('/timetable', [TeacherPortalController::class, 'timetable'])->name('timetable');
        
        // Classes
        Route::get('/classes', [TeacherPortalController::class, 'classes'])->name('classes');
        Route::get('/classes/{class}/students', [TeacherPortalController::class, 'classStudents'])->name('classes.students');
        
        // Attendance
        Route::get('/attendance/mark', [TeacherPortalController::class, 'markAttendance'])->name('attendance.mark');
        Route::post('/attendance/store', [TeacherPortalController::class, 'storeAttendance'])->name('attendance.store');
        Route::get('/attendance/my', [TeacherPortalController::class, 'myAttendance'])->name('attendance.my');
        
        // Exams & Marks
        Route::get('/exams', [TeacherPortalController::class, 'exams'])->name('exams');
        Route::get('/exams/{examination}/marks', [TeacherPortalController::class, 'enterMarks'])->name('exams.marks');
        Route::post('/exams/{examination}/marks', [TeacherPortalController::class, 'storeMarks'])->name('exams.marks.store');
        
        // Announcements
        Route::get('/announcements', [TeacherPortalController::class, 'announcements'])->name('announcements');
        Route::get('/announcements/{announcement}', [TeacherPortalController::class, 'viewAnnouncement'])->name('announcements.view');
    });
    
    // Student routes
    Route::prefix('student')->name('student.')->middleware('role:student')->group(function () {
        // Dashboard
        Route::get('/dashboard', [StudentPortalController::class, 'dashboard'])->name('dashboard');
        
        // Profile
        Route::get('/profile', [StudentPortalController::class, 'profile'])->name('profile');
        
        // Attendance
        Route::get('/attendance', [StudentPortalController::class, 'attendance'])->name('attendance');
        
        // Exam Results
        Route::get('/results', [StudentPortalController::class, 'examResults'])->name('results');
        
        // Fees
        Route::get('/fees', [StudentPortalController::class, 'feeStatement'])->name('fees');
        Route::get('/fees/receipt/{payment}', [StudentPortalController::class, 'downloadReceipt'])->name('fees.receipt');
        
        // Timetable
        Route::get('/timetable', [StudentPortalController::class, 'timetable'])->name('timetable');
        
        // Library
        Route::get('/library', [StudentPortalController::class, 'library'])->name('library');
        
        // Announcements
        Route::get('/announcements', [StudentPortalController::class, 'announcements'])->name('announcements');
        Route::get('/announcements/{announcement}', [StudentPortalController::class, 'viewAnnouncement'])->name('announcements.view');
    });
});
