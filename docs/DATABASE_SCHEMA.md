# Combridge Polytechnic System - Database Schema Documentation

## Overview

This document provides a comprehensive overview of the database schema for the Combridge School Management System. The system uses MySQL/MariaDB and is built with Laravel migrations.

## Database Design Principles

- **Normalization**: All tables are normalized to 3NF
- **Foreign Keys**: Referential integrity enforced with foreign key constraints
- **Soft Deletes**: Important tables use soft deletes for data recovery
- **Timestamps**: All tables include created_at and updated_at timestamps
- **Indexes**: Strategic indexes on frequently queried columns
- **Polymorphic Relations**: Used for flexible relationships (file uploads, activity logs)

## Total Tables: 41

### 1. Core System Tables (5)

#### users
Primary user account table for all system users.
- **Fields**: id, first_name, last_name, email, password, phone, gender, date_of_birth, address, profile_photo, status
- **Relationships**: Has many students, teachers, roles, permissions
- **Status**: active, inactive, suspended

#### roles
User roles (Administrator, Principal, Dean, Teacher, Student, etc.)
- **Fields**: id, name, display_name, description
- **Relationships**: Belongs to many users, permissions

#### permissions
Granular permissions for role-based access control
- **Fields**: id, name, display_name, module, description
- **Modules**: students, teachers, academics, finances, library, etc.

#### role_user (Pivot)
Many-to-many relationship between roles and users

#### permission_role (Pivot)
Many-to-many relationship between permissions and roles

---

### 2. Academic Structure Tables (5)

#### departments
Academic departments (e.g., Engineering, Business)
- **Fields**: id, name, code, description, head_of_department_id, status
- **Relationships**: Has many programmes, subjects, teachers

#### programmes
Academic programmes/courses (e.g., Diploma in IT)
- **Fields**: id, name, code, department_id, description, duration_years, level, tuition_fee, status
- **Level**: certificate, diploma, degree, masters, phd
- **Relationships**: Belongs to department, has many classes, students, subjects

#### subjects
Course units/subjects taught
- **Fields**: id, name, code, department_id, description, credit_hours, type, status
- **Type**: core, elective, practical
- **Relationships**: Belongs to department, has many teachers, classes

#### programme_subject (Pivot)
Maps subjects to programmes with year and semester
- **Fields**: programme_id, subject_id, year, semester, is_required

#### classes
Academic classes/cohorts
- **Fields**: id, name, code, programme_id, year, semester, academic_year, class_teacher_id, capacity, status
- **Relationships**: Belongs to programme, has many students, timetables

---

### 3. Student Management Tables (2)

#### students
Student profiles extending user accounts
- **Fields**: id, user_id, admission_number, programme_id, class_id, admission_date, guardian_name, guardian_phone, guardian_email, guardian_address, previous_school, national_id, passport_number, blood_group, medical_conditions, emergency_contact, student_status
- **Status**: active, graduated, suspended, withdrawn, deferred
- **Relationships**: Belongs to user, programme, class

#### applications
Student admission applications
- **Fields**: id, application_number, first_name, last_name, email, phone, gender, date_of_birth, address, district, nationality, programme_id, previous_school, previous_qualification, completion_year, guardian_name, guardian_phone, guardian_email, guardian_relationship, photo_path, certificate_path, transcript_path, id_document_path, status, rejection_reason, reviewed_by, reviewed_at, application_date, academic_year
- **Status**: pending, under_review, accepted, rejected, enrolled

---

### 4. Teacher/Staff Management Tables (3)

#### teachers
Teacher/staff profiles extending user accounts
- **Fields**: id, user_id, staff_id, department_id, join_date, qualification, specialization, experience, salary, employee_type, teacher_status
- **Employee Type**: full-time, part-time, contract
- **Status**: active, on_leave, retired, terminated
- **Relationships**: Belongs to user, department, has many subjects, classes

#### subject_teacher (Pivot)
Maps teachers to subjects and classes they teach
- **Fields**: teacher_id, subject_id, class_id, academic_year

#### teacher_leaves
Tracks teacher leave dates and substitutes
- **Fields**: id, teacher_id, leave_request_id, leave_date, substitute_teacher_id, classes_affected

---

### 5. Attendance System Tables (4)

#### student_attendance
Daily student attendance records
- **Fields**: id, student_id, class_id, subject_id, attendance_date, status, remarks, marked_by
- **Status**: present, absent, late, excused
- **Unique**: student_id + attendance_date + subject_id

#### teacher_attendance
Teacher attendance with check-in/out times
- **Fields**: id, teacher_id, attendance_date, check_in_time, check_out_time, status, remarks
- **Status**: present, absent, half_day, on_leave
- **Unique**: teacher_id + attendance_date

#### qr_attendance_sessions
QR code scanning sessions for attendance
- **Fields**: id, class_id, subject_id, teacher_id, session_code, session_date, start_time, end_time, status, total_scans
- **Status**: active, closed, expired

#### qr_attendance_logs
Individual QR code scan logs
- **Fields**: id, session_id, student_id, scan_time, device_info, ip_address, location, status
- **Status**: present, late

---

### 6. Examination & Grading Tables (4)

#### examinations
Scheduled examinations
- **Fields**: id, name, class_id, subject_id, exam_type, exam_date, start_time, end_time, total_marks, passing_marks, room, instructions, status
- **Exam Type**: quiz, mid_term, final, practical, assignment
- **Status**: scheduled, ongoing, completed, cancelled

#### exam_results
Student examination marks
- **Fields**: id, examination_id, student_id, marks_obtained, grade, remarks, is_absent, entered_by
- **Unique**: examination_id + student_id

#### grading_systems
Grading scale configuration
- **Fields**: id, grade, min_marks, max_marks, grade_point, description
- **Example**: A (80-100, 5.0), B (70-79, 4.0), etc.

#### report_cards
Semester report cards for students
- **Fields**: id, student_id, academic_year, semester, class_id, total_marks, average_marks, gpa, class_rank, total_students, remarks, head_teacher_remarks, generated_date, generated_by, status
- **Status**: draft, finalized, published
- **Unique**: student_id + academic_year + semester

---

### 7. Fee Management Tables (3)

#### fee_structures
Fee definitions for programmes
- **Fields**: id, name, programme_id, year, amount, frequency, fee_type, is_mandatory, status
- **Fee Type**: tuition, library, lab, sports, exam, other
- **Frequency**: one_time, per_semester, per_year

#### fee_payments
Student fee payment records
- **Fields**: id, student_id, fee_structure_id, receipt_number, amount_paid, payment_date, payment_method, transaction_reference, remarks, collected_by, status
- **Payment Method**: cash, bank_transfer, mobile_money, cheque, card
- **Status**: completed, pending, cancelled

#### fee_balances
Student fee balance tracking
- **Fields**: id, student_id, academic_year, total_fee, paid_amount, balance
- **Unique**: student_id + academic_year

---

### 8. Library Management Tables (2)

#### books
Library book inventory
- **Fields**: id, title, isbn, author, publisher, publication_year, category, subject_id, total_copies, available_copies, price, description, shelf_location, status
- **Status**: available, unavailable

#### book_issues
Book borrowing/return records
- **Fields**: id, book_id, student_id, issue_date, due_date, return_date, status, fine_amount, fine_paid, remarks, issued_by, returned_to
- **Status**: issued, returned, overdue, lost

---

### 9. Timetable Management Tables (2)

#### rooms
Classroom/facility inventory
- **Fields**: id, name, room_number, room_type, capacity, facilities, status
- **Room Type**: classroom, laboratory, library, auditorium, other
- **Status**: available, maintenance, unavailable

#### timetables
Class schedules
- **Fields**: id, class_id, subject_id, teacher_id, room_id, day_of_week, start_time, end_time, academic_year, semester, status
- **Day**: monday through sunday

---

### 10. Communication Tables (6)

#### announcements
School-wide announcements
- **Fields**: id, title, content, target_audience, class_id, posted_by, publish_date, expiry_date, priority, status
- **Target**: all, students, teachers, staff, specific_class
- **Priority**: low, normal, high, urgent
- **Status**: draft, published, expired

#### notifications
User notifications
- **Fields**: id, user_id, title, message, type, is_read, read_at
- **Type**: info, warning, success, error

#### messages
Internal messaging system
- **Fields**: id, sender_id, receiver_id, subject, message, is_read, read_at, attachment_path, parent_message_id

#### sms_logs
SMS sending logs
- **Fields**: id, phone_number, message, message_type, status, sms_id, error_message, sent_by, sent_at
- **Status**: pending, sent, failed, delivered

#### email_logs
Email sending logs
- **Fields**: id, recipient_email, recipient_name, subject, body, email_type, status, error_message, sent_by, sent_at, attachments
- **Status**: pending, sent, failed

#### communication_templates
Reusable message templates
- **Fields**: id, name, slug, type, subject, content, placeholders, status
- **Type**: sms, email, both

---

### 11. Academic Calendar Tables (3)

#### academic_years
Academic year definitions
- **Fields**: id, year_name, start_date, end_date, is_current, status
- **Status**: active, completed, upcoming

#### academic_events
Calendar events
- **Fields**: id, academic_year_id, event_name, event_type, start_date, end_date, description, target_audience, is_holiday
- **Event Type**: semester_start, semester_end, exam_period, holiday, registration, orientation, graduation, other

#### semesters
Semester periods
- **Fields**: id, academic_year_id, semester_name, semester_number, start_date, end_date, is_current, status
- **Status**: active, completed, upcoming

---

### 12. Leave Management Tables (3)

#### leave_types
Leave type definitions
- **Fields**: id, name, description, max_days, requires_document, status

#### leave_requests
Staff/teacher leave requests
- **Fields**: id, user_id, leave_type_id, start_date, end_date, total_days, reason, document_path, status, rejection_reason, approved_by, approved_at, admin_remarks
- **Status**: pending, approved, rejected, cancelled

---

### 13. Inventory Management Tables (3)

#### inventory_categories
Equipment/asset categories
- **Fields**: id, name, description

#### inventory_items
School inventory/assets
- **Fields**: id, category_id, item_name, item_code, description, quantity, unit_price, supplier, purchase_date, location, condition, status
- **Condition**: new, good, fair, poor, damaged
- **Status**: available, in_use, maintenance, disposed

#### inventory_assignments
Track item assignments to users
- **Fields**: id, item_id, assigned_to, assigned_date, return_date, status, remarks, assigned_by
- **Status**: assigned, returned, lost, damaged

---

### 14. Reporting Tables (3)

#### report_card_subjects
Individual subject marks on report cards
- **Fields**: id, report_card_id, subject_id, marks, grade, grade_point, remarks

#### transcripts
Official academic transcripts
- **Fields**: id, student_id, transcript_number, cumulative_gpa, courses_completed, total_credits, issue_date, issued_by, status
- **Status**: draft, issued, revoked

#### system_logs
System-wide audit logs
- **Fields**: id, user_id, action, model, model_id, old_values, new_values, ip_address, user_agent

---

### 15. System Configuration Tables (3)

#### system_settings
System-wide settings
- **Fields**: id, key, value, category, type, description, is_public
- **Type**: text, number, boolean, json, date
- **Category**: general, academic, financial, etc.

#### file_uploads
File upload tracking
- **Fields**: id, user_id, original_name, file_name, file_path, file_type, mime_type, file_size, upload_context, uploadable_type, uploadable_id

#### activity_logs
User activity tracking
- **Fields**: id, user_id, activity_type, description, subject_type, subject_id, properties, ip_address, user_agent
- **Activity Type**: login, logout, view, create, update, delete

---

## Relationships Summary

### User Relationships
- User → Student (1:1)
- User → Teacher (1:1)
- User → Roles (N:M)
- User → Permissions (through Roles)

### Academic Relationships
- Department → Programmes (1:N)
- Department → Subjects (1:N)
- Department → Teachers (1:N)
- Programme → Classes (1:N)
- Programme → Students (1:N)
- Programme → Subjects (N:M through programme_subject)
- Class → Students (1:N)
- Class → Timetables (1:N)

### Teaching Relationships
- Teacher → Subjects (N:M through subject_teacher)
- Teacher → Classes (N:M through subject_teacher)

### Attendance Relationships
- Student → Student Attendance (1:N)
- Teacher → Teacher Attendance (1:N)
- QR Session → QR Logs (1:N)

### Examination Relationships
- Class → Examinations (1:N)
- Subject → Examinations (1:N)
- Examination → Exam Results (1:N)
- Student → Exam Results (1:N)

### Financial Relationships
- Programme → Fee Structures (1:N)
- Student → Fee Payments (1:N)
- Student → Fee Balances (1:N)

### Library Relationships
- Book → Book Issues (1:N)
- Student → Book Issues (1:N)

## Indexes

### Primary Indexes
- All tables have primary key `id` with auto-increment

### Unique Indexes
- users.email
- students.admission_number
- teachers.staff_id
- departments.code
- programmes.code
- subjects.code
- classes.code
- books.isbn
- rooms.room_number
- fee_payments.receipt_number
- applications.application_number
- applications.email
- transcripts.transcript_number

### Composite Unique Indexes
- student_attendance (student_id, attendance_date, subject_id)
- teacher_attendance (teacher_id, attendance_date)
- exam_results (examination_id, student_id)
- fee_balances (student_id, academic_year)
- report_cards (student_id, academic_year, semester)

### Foreign Key Indexes
All foreign key columns are automatically indexed for performance

## Data Integrity Rules

### Cascade Deletes
- User deletion cascades to student, teacher profiles
- Department deletion cascades to programmes (and their classes)
- Class deletion cascades to student_attendance, timetables
- Examination deletion cascades to exam_results

### Restrict Deletes
- Cannot delete programme if students enrolled
- Cannot delete fee_structure if payments exist
- Cannot delete teacher if assigned to active classes

### Set Null
- Class teacher deleted → class_teacher_id set to null
- HOD deleted → head_of_department_id set to null

### Soft Deletes
Users, students, teachers, departments, programmes, subjects, classes, examinations, books, fee_payments, applications, messages, file_uploads, inventory_items

## Running Migrations

```bash
# Run all migrations
php artisan migrate

# Run migrations with seeding
php artisan migrate --seed

# Rollback last batch
php artisan migrate:rollback

# Rollback all and re-run
php artisan migrate:fresh

# Rollback all, re-run, and seed
php artisan migrate:fresh --seed
```

## Database Backup Strategy

1. **Daily Backups**: Full database backup
2. **Incremental Backups**: Every 6 hours
3. **Retention**: 30 days for daily, 7 days for incremental
4. **Test Restore**: Monthly restore tests

## Performance Considerations

### Optimizations
- Indexes on frequently queried columns
- Eager loading for relationships
- Query caching for static data
- Pagination for large datasets

### Monitoring
- Slow query log enabled
- Regular EXPLAIN analysis
- Index usage monitoring

---

**Combridge Centre for Polytechnic Studies**
*Database Schema Version 1.0*
*Last Updated: 2024*
