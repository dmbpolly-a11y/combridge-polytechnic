<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Home') - {{ config('branding.school_name') }}</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('images/combridge.jpeg') }}">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom Branding CSS -->
    <link href="{{ asset('css/branding.css') }}" rel="stylesheet">
    
    <!-- Additional Styles -->
    @stack('styles')
    
    <style>
        /* MUS-Style Sticky Header */
        .top-bar {
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            padding: 8px 0;
            font-size: 0.875rem;
        }
        
        .main-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #0a4d33 100%);
            color: white;
            padding: 15px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo-img {
            height: 70px;
            width: auto;
        }
        
        .school-badge {
            height: 60px;
            width: auto;
        }
        
        .school-name {
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin: 0;
        }
        
        .school-motto {
            font-size: 0.9rem;
            opacity: 0.9;
            font-style: italic;
        }
        
        .main-nav {
            background: var(--primary-color);
            padding: 0;
        }
        
        .main-nav .nav-link {
            color: white !important;
            padding: 15px 20px;
            border-right: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .main-nav .nav-link:hover,
        .main-nav .nav-link.active {
            background: rgba(255,255,255,0.2);
        }
        
        .dropdown-menu {
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            padding: 40px 0 20px;
            margin-top: 60px;
        }
        
        .footer-links a {
            color: #ecf0f1;
            text-decoration: none;
            display: block;
            padding: 5px 0;
        }
        
        .footer-links a:hover {
            color: var(--light-green);
        }
        
        .social-links a {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            margin: 0 5px;
            color: white;
            transition: all 0.3s;
        }
        
        .social-links a:hover {
            background: var(--light-green);
            transform: translateY(-3px);
        }
        
        .hero-section {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--rust-blue) 100%);
            color: white;
            padding: 80px 0;
            margin-bottom: 40px;
        }
        
        .content-section {
            padding: 40px 0;
        }
        
        .card {
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        
        .card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            transform: translateY(-5px);
        }
        
        .btn-primary {
            background: var(--primary-color);
            border: none;
        }
        
        .btn-primary:hover {
            background: var(--light-green);
        }
        
        .alert {
            border-radius: 8px;
            border: none;
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <div class="top-bar d-none d-md-block">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <i class="fas fa-envelope"></i> {{ config('branding.contact.email') }}
                    <span class="ms-3"><i class="fas fa-phone"></i> {{ config('branding.contact.phone') }}</span>
                </div>
                <div class="col-md-6 text-end">
                    @auth
                        <span class="me-3">
                            <i class="fas fa-user-circle"></i> {{ Auth::user()->name }}
                        </span>
                        <form action="{{ route('logout') }}" method="POST" class="d-inline">
                            @csrf
                            <button type="submit" class="btn btn-sm btn-link text-decoration-none">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="text-decoration-none me-3">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </a>
                        <a href="{{ route('register') }}" class="text-decoration-none">
                            <i class="fas fa-user-plus"></i> Register
                        </a>
                    @endauth
                </div>
            </div>
        </div>
    </div>

    <!-- Main Header -->
    <header class="main-header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="{{ asset('images/combridge.jpeg') }}" alt="Logo" class="logo-img">
                </div>
                <div class="col-md-8">
                    <h1 class="school-name">{{ config('branding.school_name') }}</h1>
                    <p class="school-motto mb-0">{{ config('branding.motto') }}</p>
                    <p class="mb-0"><small>{{ config('branding.location') }}</small></p>
                </div>
                <div class="col-md-2 text-end">
                    <img src="{{ asset('images/badge.png') }}" alt="Badge" class="school-badge">
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="main-nav sticky-header">
        <div class="container">
            <ul class="nav justify-content-start">
                <li class="nav-item">
                    <a class="nav-link {{ request()->is('/') ? 'active' : '' }}" href="{{ route('home') }}">
                        <i class="fas fa-home"></i> Home
                    </a>
                </li>
                
                @auth
                    @if(Auth::user()->hasRole('administrator') || Auth::user()->hasRole('principal'))
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                <i class="fas fa-cog"></i> Admin
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route('admin.dashboard') }}">Dashboard</a></li>
                                <li><a class="dropdown-item" href="{{ route('admin.students.index') }}">Students</a></li>
                                <li><a class="dropdown-item" href="{{ route('admin.teachers.index') }}">Teachers</a></li>
                                <li><a class="dropdown-item" href="{{ route('admin.attendance.index') }}">Attendance</a></li>
                                <li><a class="dropdown-item" href="{{ route('admin.examinations.index') }}">Examinations</a></li>
                                <li><a class="dropdown-item" href="{{ route('admin.fees.index') }}">Fees</a></li>
                                <li><a class="dropdown-item" href="{{ route('admin.library.index') }}">Library</a></li>
                            </ul>
                        </li>
                    @endif
                    
                    @if(Auth::user()->hasRole('teacher'))
                        <li class="nav-item">
                            <a class="nav-link {{ request()->is('teacher/*') ? 'active' : '' }}" href="{{ route('teacher.dashboard') }}">
                                <i class="fas fa-chalkboard-teacher"></i> Teacher Portal
                            </a>
                        </li>
                    @endif
                    
                    @if(Auth::user()->hasRole('student'))
                        <li class="nav-item">
                            <a class="nav-link {{ request()->is('student/*') ? 'active' : '' }}" href="{{ route('student.dashboard') }}">
                                <i class="fas fa-user-graduate"></i> Student Portal
                            </a>
                        </li>
                    @endif
                @endauth
                
                <li class="nav-item">
                    <a class="nav-link" href="#about">
                        <i class="fas fa-info-circle"></i> About Us
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#programmes">
                        <i class="fas fa-graduation-cap"></i> Programmes
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#admissions">
                        <i class="fas fa-file-alt"></i> Admissions
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contact">
                        <i class="fas fa-envelope"></i> Contact
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Flash Messages -->
    @if(session('success'))
        <div class="container mt-3">
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle"></i> {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    @endif

    @if(session('error'))
        <div class="container mt-3">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle"></i> {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    @endif

    @if($errors->any())
        <div class="container mt-3">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                <ul class="mb-0">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    @endif

    <!-- Main Content -->
    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="mb-3">{{ config('branding.school_name') }}</h5>
                    <p>{{ config('branding.vision') }}</p>
                    <div class="social-links mt-3">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5 class="mb-3">Quick Links</h5>
                    <div class="footer-links">
                        <a href="{{ route('home') }}">Home</a>
                        <a href="#about">About Us</a>
                        <a href="#programmes">Programmes</a>
                        <a href="#admissions">Admissions</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5 class="mb-3">Contact Information</h5>
                    <p>
                        <i class="fas fa-map-marker-alt"></i> {{ config('branding.contact.address') }}<br>
                        <i class="fas fa-phone"></i> {{ config('branding.contact.phone') }}<br>
                        <i class="fas fa-envelope"></i> {{ config('branding.contact.email') }}
                    </p>
                </div>
            </div>
            <hr class="my-4" style="border-color: rgba(255,255,255,0.1)">
            <div class="row">
                <div class="col-md-12 text-center">
                    <p class="mb-0">&copy; {{ date('Y') }} {{ config('branding.school_name') }}. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- jQuery (if needed) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- Additional Scripts -->
    @stack('scripts')
</body>
</html>
