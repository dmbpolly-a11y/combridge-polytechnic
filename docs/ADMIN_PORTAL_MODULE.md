# Admin Portal Documentation

## Overview

The Admin Portal provides comprehensive administrative controls for managing the entire school management system, including user management, role/permission controls, system settings, reports, and monitoring tools.

---

## Features

### 1. Administrative Dashboard
- **Comprehensive Statistics**:
  - Total active students
  - Total active teachers
  - Active classes count
  - Active programmes count
- **Attendance Overview**:
  - Students present today
  - Teachers present today
  - Attendance percentage
- **Financial Summary**:
  - Total fees collected (current year)
  - Pending fees balance
  - Payments today
- **Library Statistics**:
  - Books currently issued
  - Overdue books count
- **Recent Activities**:
  - Latest student registrations
  - Recent fee payments
  - Published announcements
- **Upcoming Events**:
  - Scheduled examinations
  - Important dates
- **Monthly Trends**:
  - Student enrollment trends (6 months)
  - Revenue trends (6 months)
  - Attendance patterns

### 2. User Management
- **User CRUD Operations**:
  - Create new users
  - Update user details
  - Activate/deactivate users
  - Delete users (with protection)
- **User Attributes**:
  - Name, email, phone
  - Password management
  - Status (active/inactive/suspended)
  - Multiple role assignment
- **User Filters**:
  - Filter by role
  - Filter by status
  - Search by name/email
- **Bulk Operations**: (Future)
  - Bulk user creation
  - Bulk status update
  - Bulk role assignment

### 3. Role & Permission Management
- **Role Management**:
  - Create custom roles
  - Update role details
  - Assign permissions to roles
  - Delete non-system roles
- **System Roles** (Protected):
  - Administrator
  - Principal
  - Teacher
  - Student
- **Permission Matrix**:
  - Granular permission control
  - Permission categories
  - Role-permission mapping
- **User Count**: View users per role

### 4. System Settings
- **School Information**:
  - School name
  - Contact email
  - Phone numbers
  - Physical address
- **Academic Settings**:
  - Current academic year
  - Semester configuration
  - Term dates
- **System Configuration**:
  - Date/time formats
  - Currency settings
  - Language preferences
- **Email/SMS Settings**:
  - SMTP configuration
  - SMS gateway settings
  - Default templates

### 5. Activity Logging
- **User Actions**: Track all user activities
- **System Events**: Log system events
- **Audit Trail**: Complete audit history
- **Filters**:
  - By user
  - By action type
  - By date range
  - By module

### 6. Reports Center
- **Academic Reports**:
  - Student performance
  - Class results analysis
  - Attendance reports
  - Examination analysis
- **Financial Reports**:
  - Fee collection summary
  - Defaulters list
  - Daily collections
  - Revenue analysis
- **Operational Reports**:
  - Staff attendance
  - Library usage
  - Timetable utilization
  - Room allocation
- **Export Options**:
  - PDF format
  - Excel format
  - CSV format

### 7. System Health Monitoring
- **Database Status**: Connection check
- **Storage Status**: Disk space and writability
- **Cache Status**: Cache functionality
- **Queue Status**: Job queue health
- **Performance Metrics**:
  - Response times
  - Memory usage
  - Database queries
- **Error Tracking**: System errors log

### 8. Data Management
- **Data Export**:
  - Export students data
  - Export teachers data
  - Export financial records
  - Custom data exports
- **Data Import**:
  - Bulk student import
  - Bulk teacher import
  - CSV/Excel import
- **Data Validation**: Pre-import validation

### 9. Backup & Restore
- **Database Backup**:
  - Manual backup creation
  - Scheduled backups
  - Backup history
- **File Backup**:
  - Uploads backup
  - System files backup
- **Restore Options**:
  - Full system restore
  - Selective restore
  - Point-in-time recovery

---

## Database Requirements

### Users Table Extensions
```sql
- status (enum: active, inactive, suspended)
- last_login_at (datetime)
- last_login_ip (string)
```

### Activity Logs Table
```sql
- id
- user_id (FK to users)
- action (string)
- model_type (string, nullable)
- model_id (integer, nullable)
- description (text)
- ip_address (string)
- user_agent (text)
- created_at
```

### System Settings Table
```sql
- id
- key (string, unique)
- value (text)
- type (enum: string, integer, boolean, json)
- group (string)
- updated_by (FK to users)
- timestamps
```

---

## Controller Methods

### AdminPortalController

#### Dashboard (1 method)
1. `dashboard()` - Main admin dashboard with comprehensive stats

#### User Management (6 methods)
2. `users()` - List all users with filters
3. `createUser()` - Show user creation form
4. `storeUser()` - Create new user
5. `editUser()` - Show user edit form
6. `updateUser()` - Update user details
7. `destroyUser()` - Delete user (with protection)

#### Role Management (4 methods)
8. `roles()` - List all roles with permissions
9. `storeRole()` - Create new role
10. `updateRole()` - Update role and permissions
11. `destroyRole()` - Delete role (protect system roles)

#### Settings (2 methods)
12. `settings()` - View system settings
13. `updateSettings()` - Update system settings

#### Monitoring (2 methods)
14. `activityLog()` - View activity logs
15. `healthCheck()` - System health status

#### Reports (1 method)
16. `reports()` - Reports overview

#### Data Management (2 methods)
17. `dataExport()` - Show export options
18. `exportStudents()` - Export students data

#### Backup (2 methods)
19. `backup()` - Show backup options
20. `createBackup()` - Create system backup

#### Helpers (5 methods)
21. `getMonthlyTrends()` - Calculate trends (private)
22. `checkDatabaseConnection()` - DB health (private)
23. `checkStorageWritable()` - Storage health (private)
24. `checkCacheWorking()` - Cache health (private)
25. `checkQueueWorking()` - Queue health (private)
26. `quickStats()` - Quick statistics (AJAX)

---

## Routes

### Admin Portal Routes (Prefix: /admin)

```php
// Dashboard
GET    /admin/dashboard                   - admin.dashboard

// User Management
GET    /admin/users                       - admin.users.index
GET    /admin/users/create                - admin.users.create
POST   /admin/users                       - admin.users.store
GET    /admin/users/{user}/edit           - admin.users.edit
PUT    /admin/users/{user}                - admin.users.update
DELETE /admin/users/{user}                - admin.users.destroy

// Role Management
GET    /admin/roles                       - admin.roles.index
POST   /admin/roles                       - admin.roles.store
PUT    /admin/roles/{role}                - admin.roles.update
DELETE /admin/roles/{role}                - admin.roles.destroy

// Settings
GET    /admin/settings                    - admin.settings
PUT    /admin/settings                    - admin.settings.update

// Activity Log
GET    /admin/activity-log                - admin.activity-log

// Reports
GET    /admin/reports                     - admin.reports

// Health Check
GET    /admin/health-check                - admin.health-check

// Data Export
GET    /admin/data-export                 - admin.data-export
POST   /admin/export/students             - admin.export.students

// Backup
GET    /admin/backup                      - admin.backup
POST   /admin/backup/create               - admin.backup.create

// AJAX
GET    /admin/quick-stats                 - admin.quick-stats
```

---

## Usage Examples

### Creating User

```php
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => Hash::make('password123'),
    'phone_number' => '+256701234567',
    'status' => 'active',
]);

// Assign role
$role = Role::where('name', 'teacher')->first();
$user->roles()->attach($role->id);
```

### Creating Custom Role

```php
$role = Role::create([
    'name' => 'accountant',
    'display_name' => 'Accountant',
    'description' => 'Manages financial records',
]);

// Assign permissions
$permissions = Permission::whereIn('name', [
    'view_fees',
    'collect_fees',
    'view_reports',
])->pluck('id');

$role->permissions()->sync($permissions);
```

### Updating System Settings

```php
// Store settings
config(['branding.school_name' => 'New School Name']);

// Or in database
SystemSetting::updateOrCreate(
    ['key' => 'school_name'],
    [
        'value' => 'New School Name',
        'type' => 'string',
        'group' => 'general',
        'updated_by' => Auth::id(),
    ]
);
```

### Logging Activity

```php
ActivityLog::create([
    'user_id' => Auth::id(),
    'action' => 'created',
    'model_type' => 'Student',
    'model_id' => $student->id,
    'description' => 'Created new student: ' . $student->name,
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent(),
]);
```

### Generating Dashboard Statistics

```php
// Get monthly trends
$monthlyData = [];
for ($i = 5; $i >= 0; $i--) {
    $date = Carbon::now()->subMonths($i);
    
    $monthlyData[] = [
        'month' => $date->format('M Y'),
        'students' => Student::whereYear('admission_date', $date->year)
            ->whereMonth('admission_date', $date->month)
            ->count(),
        'revenue' => FeePayment::whereYear('payment_date', $date->year)
            ->whereMonth('payment_date', $date->month)
            ->sum('amount_paid'),
    ];
}
```

---

## Business Rules

### User Management
1. Email must be unique across all users
2. Cannot delete own account
3. Password must be at least 8 characters
4. Active status required for system access
5. Suspended users cannot login
6. Administrator role cannot be removed from last admin

### Role Management
1. System roles cannot be deleted
2. System roles cannot be renamed
3. Role name must be unique
4. Must have at least one administrator role user
5. Deleting role removes from all users
6. Permissions are role-based, not user-based

### Settings
1. Settings validated before save
2. Critical settings require confirmation
3. Changes logged in activity log
4. Some settings require system restart
5. Invalid settings revert to default

### Backup
1. Regular automated backups recommended
2. Manual backups stored for 30 days
3. Restore requires administrator confirmation
4. Test backups before relying on them
5. Encrypt sensitive backup data

---

## Dashboard Statistics Breakdown

### Overview Stats
- **Total Students**: Active students count
- **Total Teachers**: Active teachers count
- **Total Classes**: Active classes count
- **Total Programmes**: Active programmes count

### Attendance Stats (Today)
- **Students Present**: Present + Late count
- **Teachers Present**: Present + Late count
- **Attendance Rate**: Percentage calculation

### Financial Stats (Current Year)
- **Total Fees Collected**: Sum of all payments
- **Pending Fees**: Sum of outstanding balances
- **Payments Today**: Count and amount

### Library Stats
- **Books Issued**: Current issued books
- **Overdue Books**: Books past return date
- **Fine Amount**: Total outstanding fines

---

## Reports Available

### Academic Reports
1. **Student Performance Report**
   - Individual student results
   - GPA trends
   - Subject-wise analysis

2. **Class Results Report**
   - Class average
   - Top performers
   - Pass/fail rates

3. **Attendance Report**
   - Daily/weekly/monthly attendance
   - Absenteeism trends
   - Punctuality analysis

4. **Examination Analysis**
   - Subject difficulty
   - Grade distribution
   - Comparative analysis

### Financial Reports
1. **Fee Collection Report**
   - Collection by period
   - Payment methods breakdown
   - Collector performance

2. **Defaulters Report**
   - Outstanding balances
   - Aging analysis
   - Follow-up tracking

3. **Daily Collections Report**
   - Daily revenue
   - Receipt numbers
   - Reconciliation

4. **Revenue Analysis**
   - Income streams
   - Trends analysis
   - Projections

### Operational Reports
1. **Staff Attendance Report**
   - Teacher attendance rates
   - Late arrivals
   - Leave patterns

2. **Library Usage Report**
   - Borrowing trends
   - Popular books
   - User activity

3. **Timetable Utilization**
   - Room usage
   - Teacher workload
   - Free periods

4. **Room Allocation Report**
   - Capacity utilization
   - Booking patterns
   - Maintenance schedules

---

## System Health Checks

### Database Check
```php
try {
    DB::connection()->getPdo();
    $status = 'healthy';
} catch (\Exception $e) {
    $status = 'error';
}
```

### Storage Check
```php
$writable = is_writable(storage_path('app'));
$freeSpace = disk_free_space(storage_path());
$totalSpace = disk_total_space(storage_path());
```

### Cache Check
```php
cache()->put('health_check', 'test', 60);
$working = cache()->get('health_check') === 'test';
```

### Queue Check
```php
$pendingJobs = DB::table('jobs')->count();
$failedJobs = DB::table('failed_jobs')->count();
```

---

## Security Features

### 1. Access Control
- Role-based access control (RBAC)
- Permission-based actions
- Route middleware protection
- Prevent unauthorized access

### 2. User Protection
- Cannot delete own account
- Cannot remove last administrator
- Prevent deleting system roles
- Password hashing

### 3. Audit Trail
- Log all administrative actions
- Track user activities
- IP address logging
- User agent tracking

### 4. Data Protection
- Encrypted backups
- Secure settings storage
- Input validation
- SQL injection prevention

---

## Performance Optimization

### Dashboard Loading
- Eager load relationships
- Cache statistics (5 minutes)
- Lazy load charts
- Pagination for lists

### Query Optimization
- Index frequently queried fields
- Use database views for complex queries
- Minimize N+1 queries
- Batch operations

### Caching Strategy
- Cache dashboard stats
- Cache role permissions
- Cache system settings
- Clear cache on updates

---

## Future Enhancements

### 1. Advanced Features
- **Two-Factor Authentication**: 2FA for admins
- **IP Whitelisting**: Restrict admin access by IP
- **API Management**: API key management
- **Webhooks**: External integrations
- **Scheduled Tasks**: Cron job management
- **Email Queue**: Monitor email queue
- **SMS Queue**: Monitor SMS queue

### 2. Analytics
- **User Analytics**: User behavior patterns
- **System Performance**: Performance metrics
- **Usage Statistics**: Feature usage tracking
- **Predictive Analytics**: Trend predictions
- **Cost Analysis**: Resource cost tracking

### 3. Automation
- **Auto-Backup**: Scheduled backups
- **Auto-Reports**: Scheduled reports
- **Auto-Cleanup**: Old data cleanup
- **Auto-Notifications**: System alerts
- **Auto-Scaling**: Resource scaling

### 4. Integrations
- **SSO Integration**: Single sign-on
- **LDAP/Active Directory**: Directory services
- **Cloud Storage**: Cloud backup
- **Payment Gateways**: Online payments
- **SMS Gateways**: SMS providers
- **Email Services**: Email providers

---

## Permissions Matrix

| Feature              | Administrator | Principal | HOD | Teacher | Student |
|---------------------|---------------|-----------|-----|---------|---------|
| View Dashboard      | ✓             | ✓         | ✓   | ✗       | ✗       |
| Manage Users        | ✓             | ✓         | ✗   | ✗       | ✗       |
| Manage Roles        | ✓             | ✗         | ✗   | ✗       | ✗       |
| System Settings     | ✓             | ✓         | ✗   | ✗       | ✗       |
| View Activity Log   | ✓             | ✓         | ✗   | ✗       | ✗       |
| Generate Reports    | ✓             | ✓         | ✓   | ✗       | ✗       |
| Health Check        | ✓             | ✗         | ✗   | ✗       | ✗       |
| Data Export         | ✓             | ✓         | ✗   | ✗       | ✗       |
| Backup & Restore    | ✓             | ✗         | ✗   | ✗       | ✗       |

---

## Testing

### Unit Tests
```bash
php artisan test --filter AdminPortalTest
```

### Test Cases
- Create user with role
- Update user details
- Delete user (protection test)
- Create custom role
- Assign permissions
- Update system settings
- Generate dashboard stats
- Check system health
- Create backup
- Export data

---

## Troubleshooting

### Common Issues

**Issue**: Dashboard loading slowly
- **Solution**: Enable caching for statistics

**Issue**: Cannot delete role
- **Solution**: Check if it's a system role or has users assigned

**Issue**: Settings not saving
- **Solution**: Check file permissions and validation rules

**Issue**: Health check failing
- **Solution**: Verify database connection and storage permissions

**Issue**: Export timing out
- **Solution**: Use queue for large exports

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
