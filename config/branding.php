<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Institution Branding Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains all branding information for Combridge Centre for
    | Polytechnic Studies including colors, contact information, and identity.
    |
    */

    'name' => 'COMBRIDGE CENTRE FOR POLYTECHNIC STUDIES',
    'short_name' => 'Combridge',
    'tagline' => 'Development through Skills and Innovation',
    'motto' => 'ENRICHING THE FUTURES AND POTENTIALS',
    
    /*
    |--------------------------------------------------------------------------
    | Vision, Mission, and Core Values
    |--------------------------------------------------------------------------
    */
    
    'vision' => 'Empower African and Global Higher Education to Fuel Skilled, Productive Workforces Globally',
    
    'mission' => 'Partner With Institutions to Boost Education Quality, Employability and Economic Growth',
    
    'core_values' => [
        'Integrity',
        'Innovation',
        'Inclusion',
        'Collaboration for Sustainable Human Capital Development'
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Strategic Goals
    |--------------------------------------------------------------------------
    */
    
    'strategic_goals' => [
        'Achieve A Strong Alignment Between Graduates\' Skills, Competencies And The Labour Market Needs',
        'Ensure Graduates Achieve Skills And Financial Independence For Lifelong Success'
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Brand Colors
    |--------------------------------------------------------------------------
    | Primary: Deep Green (for headers, buttons, main elements)
    | Light Green: Accent color
    | Yellow: Highlight color
    | Rust Blue: Footer and special elements
    */
    
    'colors' => [
        'primary' => '#0C5C3E',      // Deep Green (Primary)
        'primary_dark' => '#094A32',  // Darker shade for hover states
        'light_green' => '#46AA6A',   // Light Green (Accent)
        'yellow' => '#E1F7C3',        // Yellow/Light Yellow Green
        'rust_blue' => '#051566',     // Rust Blue (Footer, titles)
        'secondary' => '#E27032',     // Orange accent
        'success' => '#46AA6A',
        'danger' => '#DC3545',
        'warning' => '#FFC107',
        'info' => '#17A2B8',
        'light' => '#F8F9FA',
        'dark' => '#343A40',
        'white' => '#FFFFFF',
        'background' => '#F5F5F5'
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Contact Information
    |--------------------------------------------------------------------------
    */
    
    'contact' => [
        'email' => 'combridgecentre@gmail.com',
        'phone' => [
            '+256 393 258 879',
            '+256 414 674 018'
        ],
        'whatsapp' => '+256 787 803 099',
        'po_box' => 'P.O BOX 177267, MBARARA',
        'website' => 'www.combridge.ac.ug',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Physical Location
    |--------------------------------------------------------------------------
    */
    
    'location' => [
        'street' => 'Kitooma 2, Kyeera Birere',
        'district' => 'Isingiro District',
        'city' => 'Nyamityobora, Kaboba Mbarara City',
        'landmark' => '200 meters off Mbarara Masaka Highway',
        'full_address' => 'Kitooma 2, Kyeera Birere, Isingiro District, Nyamityobora, Kaboba Mbarara City, 200 meters off Mbarara Masaka Highway',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Logo and Badge Configuration
    |--------------------------------------------------------------------------
    */
    
    'logo' => [
        'path' => 'images/combridge.jpeg',
        'badge_path' => 'images/badge.png',
        'badge_ext' => 'EXAC',  // Badge extension type
        'size' => [
            'header' => ['width' => '180px', 'height' => 'auto'],
            'footer' => ['width' => '120px', 'height' => 'auto'],
            'badge' => ['width' => '80px', 'height' => '80px'],
        ],
        'sticky_header' => true, // Sticky header logo behavior
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Cloning References (for design consistency)
    |--------------------------------------------------------------------------
    */
    
    'design_reference' => [
        'mus_style' => true,  // Use MUS (Mbarara University of Science) top bar sticky logo badge
        'header_style' => 'sticky_logo_badge',
        'navigation_type' => 'horizontal',
        'show_academic_calendar' => true,
        'show_time_date' => true,
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Portal Configuration
    |--------------------------------------------------------------------------
    */
    
    'portals' => [
        'student' => [
            'enabled' => true,
            'url' => '/student/portal',
            'features' => ['timetable', 'marks', 'attendance', 'fees']
        ],
        'teacher' => [
            'enabled' => true,
            'url' => '/teacher/portal',
            'password_required' => true,
        ],
        'admin' => [
            'enabled' => true,
            'url' => '/admin',
            'features' => [
                'bug_list',
                'control_unit',
                'score',
                'action_point'
            ]
        ]
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Attendance System Configuration
    |--------------------------------------------------------------------------
    */
    
    'attendance' => [
        'qr_scanning' => true,
        'login_required' => true,
        'multiple_scans_same_name' => true,  // Allow duplicate name but map to same student
        'faculty_list' => true,  // Show list among fellow students
        'rules' => [
            'allow_late_mark' => true,
            'late_threshold_minutes' => 15,
            'combine_similar_students' => true, // Combine students with same course unit
        ]
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Database Configuration
    |--------------------------------------------------------------------------
    */
    
    'database' => [
        'students' => [
            'fields' => ['reg_no', 'full_name', 'email', 'phone', 'course', 'faculty', 
                        'current_unit', 'password_hash'],
        ],
        'teachers' => [
            'fields' => ['id', 'user_id', 'name', 'faculty_name', 'current_unit', 'password_hash'],
        ],
        'marks' => [
            'fields' => ['student_reg_no', 'course_unit_id', 'score', 'grade', 
                        'sched_by_admin'],
        ],
        'attendance_logs' => [
            'fields' => ['id', 'student_reg_no', 'course_unit', 'sched_path', 'date_time', 'status'],
        ],
        'applications' => [
            'fields' => ['id', 'full_name', 'email', 'phone', 'sched_path', 'date_status'],
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Folder Structure (As per requirements)
    |--------------------------------------------------------------------------
    */
    
    'folder_structure' => [
        'controllers' => 'app/Http/Controllers',
        'models' => 'app/Models',
        'views' => 'resources/views',
        'public' => 'public',
        'assets' => [
            'css' => 'public/css',
            'js' => 'public/js',
            'images' => 'public/images',
        ],
        'admin' => 'resources/views/admin',
        'student' => 'resources/views/student',
        'teacher' => 'resources/views/teacher',
        'auth' => 'resources/views/auth',
        'dashboard' => 'resources/views/dashboard',
        'portal' => 'resources/views/portal',
        'registration' => 'resources/views/registration',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Academic Configuration
    |--------------------------------------------------------------------------
    */
    
    'academic' => [
        'academic_year_format' => 'Y/Y+1', // e.g., 2024/2025
        'semesters' => ['Semester 1', 'Semester 2', 'Recess Term'],
        'grading_system' => [
            'A' => ['min' => 80, 'max' => 100, 'gpa' => 5.0],
            'B' => ['min' => 70, 'max' => 79, 'gpa' => 4.0],
            'C' => ['min' => 60, 'max' => 69, 'gpa' => 3.0],
            'D' => ['min' => 50, 'max' => 59, 'gpa' => 2.0],
            'F' => ['min' => 0, 'max' => 49, 'gpa' => 0.0],
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | System Features
    |--------------------------------------------------------------------------
    */
    
    'features' => [
        'online_application' => true,
        'qr_attendance' => true,
        'online_results' => true,
        'fee_payment_online' => true,
        'library_management' => true,
        'timetable_generation' => true,
        'sms_notifications' => true,
        'email_notifications' => true,
        'parent_portal' => true,
        'mobile_app_api' => false,
    ],
    
    /*
    |--------------------------------------------------------------------------
    | PDF Report Configuration
    |--------------------------------------------------------------------------
    */
    
    'pdf' => [
        'header_image' => 'images/header.png',
        'show_logo' => true,
        'show_badge' => true,
        'watermark' => 'COMBRIDGE',
        'footer_text' => 'Combridge Centre for Polytechnic Studies - Excellence in Education',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Social Media & Online Presence
    |--------------------------------------------------------------------------
    */
    
    'social' => [
        'facebook' => '',
        'twitter' => '',
        'instagram' => '',
        'linkedin' => '',
        'youtube' => '',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | System Settings
    |--------------------------------------------------------------------------
    */
    
    'system' => [
        'timezone' => 'Africa/Kampala',
        'currency' => 'UGX',
        'language' => 'en',
        'date_format' => 'd/m/Y',
        'time_format' => 'H:i',
        'items_per_page' => 20,
    ],
];
