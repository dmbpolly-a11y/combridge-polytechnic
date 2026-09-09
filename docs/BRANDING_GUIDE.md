# Combridge Polytechnic System - Branding Guide

## Brand Identity

### Institution Information
- **Full Name:** COMBRIDGE CENTRE FOR POLYTECHNIC STUDIES
- **Short Name:** Combridge
- **Tagline:** Development through Skills and Innovation
- **Motto:** ENRICHING THE FUTURES AND POTENTIALS

### Vision
Empower African and Global Higher Education to Fuel Skilled, Productive Workforces Globally

### Mission
Partner With Institutions to Boost Education Quality, Employability and Economic Growth

### Core Values
- Integrity
- Innovation
- Inclusion
- Collaboration for Sustainable Human Capital Development

## Brand Colors

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary (Deep Green) | `#0C5C3E` | Headers, buttons, main elements |
| Primary Dark | `#094A32` | Hover states, footer |
| Light Green | `#46AA6A` | Accent color, secondary elements |
| Yellow | `#E1F7C3` | Highlights, badges |
| Rust Blue | `#051566` | Footer, titles, special sections |
| Secondary (Orange) | `#E27032` | Call-to-action elements |

### Semantic Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Success | `#46AA6A` | Success messages, positive actions |
| Danger | `#DC3545` | Error messages, delete actions |
| Warning | `#FFC107` | Warning messages |
| Info | `#17A2B8` | Information messages |

## Logo and Badge

### Logo Specifications
- **File:** `public/images/combridge_logo.png`
- **Header Size:** 180px width, auto height
- **Footer Size:** 120px width, auto height
- **Format:** PNG with transparent background

### Badge Specifications
- **File:** `public/images/badge.png`
- **Size:** 80px × 80px
- **Shape:** Circular with 3px yellow border
- **Format:** PNG

### Logo Placement
- Top left of header alongside badge
- Footer (smaller version)
- PDF reports header
- Email templates

## Typography

### Font Families
- **Body Text:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings:** Arial, sans-serif

### Font Sizes
- **H1:** 2rem (32px)
- **H2:** 1.5rem (24px)
- **H3:** 1.25rem (20px)
- **Body:** 1rem (16px)
- **Small:** 0.875rem (14px)

## Usage in Code

### PHP/Laravel

#### Using BrandingHelper

```php
use App\Helpers\BrandingHelper;

// Get institution name
$name = BrandingHelper::name(); // Full name
$short = BrandingHelper::name(true); // Short name

// Get colors
$primary = BrandingHelper::color('primary');
$lightGreen = BrandingHelper::color('light_green');

// Get contact info
$email = BrandingHelper::email();
$phone = BrandingHelper::primaryPhone();
$phones = BrandingHelper::phones(); // Array of all phones
$whatsapp = BrandingHelper::whatsapp();

// Get location
$address = BrandingHelper::fullAddress();
$district = BrandingHelper::location('district');

// Format currency
$formatted = BrandingHelper::formatCurrency(500000); // "500,000 UGX"

// Format dates
$date = BrandingHelper::formatDate('2024-01-15'); // "15/01/2024"
$time = BrandingHelper::formatTime('14:30:00'); // "14:30"

// Academic year
$year = BrandingHelper::academicYear(); // "2024/2025"
$year = BrandingHelper::academicYear(2023); // "2023/2024"

// Grades and GPA
$grade = BrandingHelper::getGrade(75); // "B"
$gpa = BrandingHelper::getGPA(75); // 4.0

// Check features
if (BrandingHelper::featureEnabled('qr_attendance')) {
    // QR attendance is enabled
}
```

#### Using Config Directly

```php
// Get any branding config
$vision = config('branding.vision');
$colors = config('branding.colors');
$contact = config('branding.contact');
```

### Blade Templates

#### Blade Directives

```blade
{{-- Display institution name --}}
{{ $institutionName }}
{{ $institutionShortName }}

{{-- Use branding directive --}}
@branding('vision')
@branding('mission')

{{-- Get brand color --}}
<div style="background-color: @brandColor('primary')">
    Content
</div>

{{-- Format currency --}}
<p>Amount: @formatCurrency(500000)</p>

{{-- Format date --}}
<p>Date: @formatDate('2024-01-15')</p>

{{-- Academic year --}}
<p>Academic Year: @academicYear()</p>

{{-- Grade --}}
<p>Grade: @grade(75)</p>
```

#### Using Shared Variables

```blade
{{-- These variables are available in all views --}}
<h1>{{ $institutionName }}</h1>
<p>{{ $tagline }}</p>
<p>{{ $motto }}</p>

{{-- Contact information --}}
<p>Email: {{ $contactInfo['email'] }}</p>
<p>Phone: {{ $contactInfo['phone'][0] }}</p>

{{-- Logo --}}
<img src="{{ asset($logoPath) }}" alt="{{ $institutionName }}">
<img src="{{ asset($badgePath) }}" alt="Badge">
```

### CSS

#### Using CSS Variables

```css
/* These variables are defined in public/css/branding.css */

.element {
    background-color: var(--primary-color);
    color: var(--white);
    border-color: var(--light-green);
}

.button {
    background: var(--primary-color);
}

.button:hover {
    background: var(--primary-dark);
}
```

#### Using Utility Classes

```html
<!-- Text colors -->
<p class="text-primary">Primary color text</p>
<p class="text-success">Success text</p>
<p class="text-danger">Danger text</p>

<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-light-green">Light green background</div>
<div class="bg-yellow">Yellow background</div>

<!-- Spacing -->
<div class="mt-3">Margin top</div>
<div class="mb-4">Margin bottom</div>
<div class="p-3">Padding all sides</div>

<!-- Layout -->
<div class="d-flex justify-content-between align-items-center">
    Flex container
</div>
```

## Component Examples

### Header

```blade
<header class="header sticky">
    <div class="header-top">
        <div class="container">
            <div class="d-flex justify-content-between">
                <div>
                    <i class="fas fa-envelope"></i> {{ $contactInfo['email'] }}
                </div>
                <div>
                    <i class="fas fa-phone"></i> {{ $contactInfo['phone'][0] }}
                </div>
            </div>
        </div>
    </div>
    
    <div class="header-main">
        <div class="logo-container">
            <img src="{{ asset($badgePath) }}" alt="Badge" class="badge">
            <div>
                <h1 class="institution-name">{{ $institutionName }}</h1>
                <p class="tagline">{{ $tagline }}</p>
            </div>
        </div>
        <nav>
            <!-- Navigation links -->
        </nav>
    </div>
</header>
```

### Dashboard Card

```blade
<div class="dashboard-card students">
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <h3>Total Students</h3>
            <h2 class="text-primary">{{ $totalStudents }}</h2>
        </div>
        <div>
            <i class="fas fa-users fa-3x text-primary"></i>
        </div>
    </div>
</div>
```

### Button

```blade
<button class="btn-primary">
    <i class="fas fa-plus"></i> Add Student
</button>

<button class="btn-secondary">
    <i class="fas fa-edit"></i> Edit
</button>

<button class="btn-danger">
    <i class="fas fa-trash"></i> Delete
</button>
```

### Form

```blade
<form method="POST" action="{{ route('students.store') }}">
    @csrf
    
    <div class="form-group">
        <label class="form-label">First Name</label>
        <input type="text" name="first_name" class="form-control" required>
    </div>
    
    <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" name="email" class="form-control" required>
    </div>
    
    <button type="submit" class="btn-primary">
        <i class="fas fa-save"></i> Save Student
    </button>
</form>
```

### Alert

```blade
@if(session('success'))
    <div class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        {{ session('success') }}
    </div>
@endif

@if(session('error'))
    <div class="alert alert-danger">
        <i class="fas fa-exclamation-circle"></i>
        {{ session('error') }}
    </div>
@endif
```

### Table

```blade
<table class="table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($students as $student)
        <tr>
            <td>{{ $student->id }}</td>
            <td>{{ $student->full_name }}</td>
            <td>{{ $student->email }}</td>
            <td>
                <a href="{{ route('students.edit', $student) }}" class="btn-primary">
                    Edit
                </a>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
```

## PDF Reports

### Header Configuration

```php
use App\Helpers\BrandingHelper;

$pdf->SetHeaderData(
    BrandingHelper::logo('path'),
    30,
    BrandingHelper::name(),
    BrandingHelper::fullAddress() . "\n" . 
    BrandingHelper::email() . " | " . 
    BrandingHelper::primaryPhone()
);
```

## Email Templates

```blade
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .header {
            background-color: {{ BrandingHelper::color('primary') }};
            color: white;
            padding: 20px;
            text-align: center;
        }
        .footer {
            background-color: {{ BrandingHelper::color('rust_blue') }};
            color: white;
            padding: 15px;
            text-align: center;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $institutionName }}</h1>
        <p>{{ $tagline }}</p>
    </div>
    
    <div style="padding: 20px;">
        @yield('content')
    </div>
    
    <div class="footer">
        <p>{{ $contactInfo['email'] }} | {{ $contactInfo['phone'][0] }}</p>
        <p>{{ $locationInfo['full_address'] }}</p>
    </div>
</body>
</html>
```

## Design Reference

The system follows the MUS (Mbarara University of Science) design pattern:
- Sticky header with logo and badge
- Horizontal navigation below header
- Clean, professional layout
- Gradient backgrounds for headers
- Card-based dashboard design

## Responsive Design

All components are responsive and mobile-friendly:
- Breakpoint: 768px
- Mobile: Single column layout
- Desktop: Multi-column grid layouts
- Touch-friendly buttons and inputs

## Accessibility

- Proper color contrast ratios
- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly

## Contact

For branding questions or updates, contact:
- Email: combridgecentre@gmail.com
- Phone: +256 393 258 879
- WhatsApp: +256 787 803 099

---

**Combridge Centre for Polytechnic Studies**
*Development through Skills and Innovation*
