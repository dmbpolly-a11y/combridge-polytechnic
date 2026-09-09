# Authentication & Role-Based Access Control Guide

## Overview

The Combridge School Management System implements a comprehensive Role-Based Access Control (RBAC) system using Laravel's authentication features combined with custom middleware for role and permission checks.

---

## System Architecture

### Authentication Stack
- **Framework**: Laravel 9.x/10.x Authentication
- **Guard**: Web (Session-based)
- **Provider**: Eloquent (Users table)
- **Password Hashing**: Bcrypt
- **Remember Me**: Supported
- **API Tokens**: Laravel Sanctum (optional)

### Authorization Stack
- **RBAC Model**: Role-Permission-User
- **Middleware**: Custom role and permission middleware
- **Trait**: HasPermissions for User model
- **Database**: Pivot tables for many-to-many relationships

---

## Roles Defined

### System Roles

1. **Administrator**
   - **Access**: Full system access
   - **Permissions**: All permissions
   - **Can**: Manage users, roles, settings, view all data
   - **Route Prefix**: `/admin/*`

2. **Principal**
   - **Access**: School-wide management
   - **Permissions**: Academic and administrative
   - **Can**: Manage students, teachers, view reports
   - **Route Prefix**: `/admin/*`

3. **Director**
   - **Access**: Academic oversight
   - **Permissions**: Academic operations
   - **Can**: Manage academic programs, view analytics
   - **Route Prefix**: `/admin/*`

4. **Dean**
   - **Access**: Department management
   - **Permissions**: Department-specific
   - **Can**: Manage department staff and programs
   - **Route Prefix**: `/admin/*`

5. **Bursar**
   - **Access**: Financial management
   - **Permissions**: Fee management
   - **Can**: Collect fees, generate financial reports
   - **Route Prefix**: `/admin/fees/*`

6. **Teacher**
   - **Access**: Teaching functions
   - **Permissions**: Class management
   - **Can**: Mark attendance, enter marks, view assigned classes
   - **Route Prefix**: `/teacher/*`

7. **Student**
   - **Access**: Student portal
   - **Permissions**: View own data
   - **Can**: View results, fees, attendance, timetable
   - **Route Prefix**: `/student/*`

8. **Librarian**
   - **Access**: Library management
   - **Permissions**: Library operations
   - **Can**: Issue books, manage inventory
   - **Route Prefix**: `/admin/library/*`

---

## Middleware Implementation

### 1. CheckRole Middleware

**File**: `app/Http/Middleware/CheckRole.php`

**Purpose**: Verify user has required role(s)

**Usage**:
```php
// Single role
Route::middleware(['auth', 'role:administrator'])->group(function () {
    // Admin-only routes
});

// Multiple roles
Route::middleware(['auth', 'role:administrator,principal'])->group(function () {
    // Admin or Principal routes
});
```

**Implementation**:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized access.');
    }
}
```

### 2. CheckPermission Middleware

**File**: `app/Http/Middleware/CheckPermission.php`

**Purpose**: Verify user has specific permission

**Usage**:
```php
Route::middleware(['auth', 'permission:manage_students'])->group(function () {
    // Routes requiring manage_students permission
});
```

**Implementation**:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if (!$request->user()->hasPermission($permission)) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
```

### 3. CheckStatus Middleware

**File**: `app/Http/Middleware/CheckStatus.php`

**Purpose**: Verify user account is active

**Usage**:
```php
Route::middleware(['auth', 'status'])->group(function () {
    // Routes requiring active status
});
```

**Implementation**:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckStatus
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if ($request->user()->status !== 'active') {
            Auth::logout();
            return redirect()->route('login')
                ->with('error', 'Your account has been suspended. Please contact administration.');
        }

        return $next($request);
    }
}
```

---

## Middleware Registration

### Register in `app/Http/Kernel.php`

```php
<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // ... existing code ...

    /**
     * The application's route middleware.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \App\Http\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        
        // Custom middleware
        'role' => \App\Http\Middleware\CheckRole::class,
        'permission' => \App\Http\Middleware\CheckPermission::class,
        'status' => \App\Http\Middleware\CheckStatus::class,
    ];
}
```

---

## Service Provider Registration

### Register BrandingServiceProvider in `config/app.php`

```php
<?php

return [
    // ... existing configuration ...

    'providers' => [
        // Laravel Framework Service Providers...
        Illuminate\Auth\AuthServiceProvider::class,
        Illuminate\Broadcasting\BroadcastServiceProvider::class,
        // ... other providers ...

        // Application Service Providers
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\BroadcastServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
        
        // Custom Service Provider
        App\Providers\BrandingServiceProvider::class,
    ],
];
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    address TEXT,
    profile_photo VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Permissions Table
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Pivot Tables
```sql
-- Role-User Relationship
CREATE TABLE role_user (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Role-Permission Relationship
CREATE TABLE role_permission (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT UNSIGNED,
    permission_id BIGINT UNSIGNED,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

---

## HasPermissions Trait

**File**: `app/Traits/HasPermissions.php`

```php
<?php

namespace App\Traits;

use App\Models\Permission;

trait HasPermissions
{
    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        return $this->permissions()->whereIn('name', $permissions)->exists();
    }

    /**
     * Check if user has all given permissions
     */
    public function hasAllPermissions(array $permissions): bool
    {
        $userPermissions = $this->permissions()->pluck('name')->toArray();
        return empty(array_diff($permissions, $userPermissions));
    }

    /**
     * Get all user permissions (through roles)
     */
    public function permissions()
    {
        return Permission::whereHas('roles', function ($query) {
            $query->whereIn('roles.id', $this->roles->pluck('id'));
        });
    }

    /**
     * Assign role to user
     */
    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = \App\Models\Role::where('name', $role)->firstOrFail();
        }

        return $this->roles()->syncWithoutDetaching([$role->id]);
    }

    /**
     * Remove role from user
     */
    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = \App\Models\Role::where('name', $role)->firstOrFail();
        }

        return $this->roles()->detach($role->id);
    }
}
```

---

## Authentication Workflow

### 1. Login Process

```
User submits credentials
    ↓
Validate email/password
    ↓
Check account status (active/suspended)
    ↓
Load user roles and permissions
    ↓
Create session
    ↓
Redirect to appropriate dashboard
    ↓
Apply role-based middleware on routes
```

### 2. Route Protection

```
User requests protected route
    ↓
Auth middleware: Check authentication
    ↓
Status middleware: Verify active status
    ↓
Role middleware: Check required role(s)
    ↓
Permission middleware: Check required permission(s)
    ↓
Grant or deny access
```

---

## Usage Examples

### Protecting Routes

```php
// Single role requirement
Route::middleware(['auth', 'role:administrator'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
});

// Multiple roles (any)
Route::middleware(['auth', 'role:administrator,principal'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});

// Role + Permission
Route::middleware(['auth', 'role:teacher', 'permission:enter_marks'])->group(function () {
    Route::post('/marks/store', [MarksController::class, 'store']);
});

// Status check
Route::middleware(['auth', 'status'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
});
```

### Checking in Controllers

```php
// Check role
if (Auth::user()->hasRole('administrator')) {
    // Admin-only code
}

// Check permission
if (Auth::user()->hasPermission('manage_students')) {
    // Permission-specific code
}

// Check multiple roles
if (Auth::user()->hasAnyRole(['administrator', 'principal'])) {
    // Code for admins or principals
}
```

### Checking in Blade Templates

```blade
@auth
    @if(Auth::user()->hasRole('administrator'))
        <a href="{{ route('admin.dashboard') }}">Admin Dashboard</a>
    @endif

    @if(Auth::user()->hasRole('teacher'))
        <a href="{{ route('teacher.dashboard') }}">Teacher Portal</a>
    @endif

    @if(Auth::user()->hasRole('student'))
        <a href="{{ route('student.dashboard') }}">Student Portal</a>
    @endif
@endauth
```

---

## Permissions List

### Academic Permissions
- `view_students` - View student records
- `manage_students` - Create/edit/delete students
- `view_teachers` - View teacher records
- `manage_teachers` - Create/edit/delete teachers
- `view_classes` - View class information
- `manage_classes` - Create/edit/delete classes

### Attendance Permissions
- `view_attendance` - View attendance records
- `mark_attendance` - Mark student attendance
- `view_teacher_attendance` - View teacher attendance
- `manage_attendance` - Full attendance management

### Examination Permissions
- `view_exams` - View examinations
- `manage_exams` - Create/edit/delete exams
- `enter_marks` - Enter exam marks
- `view_results` - View exam results
- `generate_reports` - Generate report cards

### Financial Permissions
- `view_fees` - View fee records
- `collect_fees` - Collect fee payments
- `manage_fee_structures` - Create/edit fee structures
- `view_financial_reports` - View financial reports

### Library Permissions
- `view_books` - View library books
- `manage_books` - Create/edit/delete books
- `issue_books` - Issue books to students
- `manage_library` - Full library management

### Communication Permissions
- `view_announcements` - View announcements
- `create_announcements` - Create announcements
- `send_messages` - Send internal messages
- `send_bulk_sms` - Send bulk SMS
- `send_bulk_email` - Send bulk emails

### System Permissions
- `view_users` - View system users
- `manage_users` - Create/edit/delete users
- `manage_roles` - Manage roles and permissions
- `view_settings` - View system settings
- `manage_settings` - Modify system settings
- `view_logs` - View activity logs
- `manage_backups` - Create/restore backups

---

## Security Best Practices

### 1. Password Policy
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Password hashing using Bcrypt
- Never store plain-text passwords

### 2. Session Security
- Secure session cookies
- HTTPS-only in production
- Session timeout after inactivity
- Regenerate session ID on login

### 3. Protection Against Attacks
- CSRF protection on all forms
- SQL injection prevention (Eloquent ORM)
- XSS protection (Blade escaping)
- Rate limiting on login attempts

### 4. Account Security
- Email verification (optional)
- Password reset functionality
- Two-factor authentication (future)
- Account lockout after failed attempts

### 5. Data Access Control
- Users can only access own data
- Teachers can only access assigned classes
- Role-based data filtering
- Audit logging for sensitive operations

---

## Testing Authentication

### Manual Testing Steps

1. **Register New User**
   - Navigate to `/register`
   - Fill in required fields
   - Submit form
   - Verify user created in database

2. **Login Test**
   - Navigate to `/login`
   - Enter valid credentials
   - Verify redirected to appropriate dashboard
   - Check session created

3. **Role-Based Access Test**
   - Login as admin
   - Verify access to `/admin/*` routes
   - Login as teacher
   - Verify access to `/teacher/*` routes
   - Verify denied access to `/admin/*`

4. **Permission Test**
   - Assign specific permissions to role
   - Login as user with that role
   - Test accessing routes requiring those permissions

5. **Status Test**
   - Suspend user account
   - Attempt login
   - Verify login denied with appropriate message

### Automated Testing

```php
// Feature Test Example
public function test_admin_can_access_dashboard()
{
    $admin = User::factory()->create();
    $adminRole = Role::where('name', 'administrator')->first();
    $admin->roles()->attach($adminRole);

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertStatus(200);
}

public function test_student_cannot_access_admin_dashboard()
{
    $student = User::factory()->create();
    $studentRole = Role::where('name', 'student')->first();
    $student->roles()->attach($studentRole);

    $response = $this->actingAs($student)->get('/admin/dashboard');

    $response->assertStatus(403);
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Middleware not applied
- **Solution**: Check middleware registered in `Kernel.php`

**Issue**: Role check fails
- **Solution**: Verify user has role assigned in `role_user` table

**Issue**: Permission denied despite having role
- **Solution**: Check role has required permissions in `role_permission` table

**Issue**: Session expires immediately
- **Solution**: Check session driver configuration in `.env`

**Issue**: CSRF token mismatch
- **Solution**: Ensure `@csrf` directive in all forms

---

## Migration Guide

### Initial Setup

```bash
# 1. Run migrations
php artisan migrate

# 2. Seed roles and permissions
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder

# 3. Create first admin user
php artisan tinker
>>> $user = User::create([...]);
>>> $user->assignRole('administrator');

# 4. Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## Configuration Files

### Auth Configuration (`config/auth.php`)

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
],

'passwords' => [
    'users' => [
        'provider' => 'users',
        'table' => 'password_reset_tokens',
        'expire' => 60,
        'throttle' => 60,
    ],
],
```

---

**Module Status**: ✅ Ready for Implementation  
**Last Updated**: 2024  
**Maintained By**: Combridge Centre for Polytechnic Studies
