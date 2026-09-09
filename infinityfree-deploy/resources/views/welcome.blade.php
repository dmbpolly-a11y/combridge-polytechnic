@extends('layouts.app')

@section('title', 'Home')

@section('content')

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-8">
                <h1 class="display-4 fw-bold mb-3">Welcome to {{ config('branding.school_name') }}</h1>
                <p class="lead mb-4">{{ config('branding.vision') }}</p>
                <div class="d-flex gap-3">
                    <a href="#programmes" class="btn btn-light btn-lg">
                        <i class="fas fa-graduation-cap"></i> Our Programmes
                    </a>
                    <a href="#admissions" class="btn btn-outline-light btn-lg">
                        <i class="fas fa-file-alt"></i> Apply Now
                    </a>
                </div>
            </div>
            <div class="col-md-4 text-center d-none d-md-block">
                <img src="{{ asset('images/badge.png') }}" alt="School Badge" style="max-height: 250px;">
            </div>
        </div>
    </div>
</section>

<!-- Quick Stats -->
<section class="content-section bg-light">
    <div class="container">
        <div class="row text-center">
            <div class="col-md-3 mb-4">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <i class="fas fa-users fa-3x text-primary mb-3"></i>
                        <h3 class="fw-bold">500+</h3>
                        <p class="text-muted">Active Students</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <i class="fas fa-chalkboard-teacher fa-3x text-success mb-3"></i>
                        <h3 class="fw-bold">50+</h3>
                        <p class="text-muted">Qualified Teachers</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <i class="fas fa-book-open fa-3x text-info mb-3"></i>
                        <h3 class="fw-bold">20+</h3>
                        <p class="text-muted">Programmes</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <i class="fas fa-trophy fa-3x text-warning mb-3"></i>
                        <h3 class="fw-bold">15+</h3>
                        <p class="text-muted">Years of Excellence</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="content-section">
    <div class="container">
        <div class="row">
            <div class="col-md-6 mb-4">
                <h2 class="fw-bold mb-3" style="color: var(--primary-color)">About Us</h2>
                <p class="lead">{{ config('branding.mission') }}</p>
                <p>Located in {{ config('branding.location') }}, {{ config('branding.school_name') }} is a leading institution dedicated to providing quality technical and vocational education.</p>
                <ul class="list-unstyled">
                    <li class="mb-2"><i class="fas fa-check-circle text-success"></i> Accredited Programmes</li>
                    <li class="mb-2"><i class="fas fa-check-circle text-success"></i> Modern Facilities</li>
                    <li class="mb-2"><i class="fas fa-check-circle text-success"></i> Experienced Faculty</li>
                    <li class="mb-2"><i class="fas fa-check-circle text-success"></i> Industry Partnerships</li>
                </ul>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title fw-bold">Why Choose Us?</h4>
                        <div class="mt-3">
                            <h6 class="fw-bold"><i class="fas fa-star text-warning"></i> Quality Education</h6>
                            <p>Our programmes are designed to meet international standards and industry requirements.</p>
                            
                            <h6 class="fw-bold mt-3"><i class="fas fa-briefcase text-primary"></i> Career-Focused</h6>
                            <p>We prepare students for successful careers through practical training and internships.</p>
                            
                            <h6 class="fw-bold mt-3"><i class="fas fa-certificate text-success"></i> Recognized Certificates</h6>
                            <p>Our certificates and diplomas are nationally and internationally recognized.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Programmes Section -->
<section id="programmes" class="content-section bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="fw-bold" style="color: var(--primary-color)">Our Programmes</h2>
            <p class="lead">Choose from our wide range of technical and vocational programmes</p>
        </div>
        <div class="row">
            <!-- Programme Categories -->
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <i class="fas fa-laptop-code fa-3x" style="color: var(--primary-color)"></i>
                        </div>
                        <h5 class="card-title fw-bold text-center">Information Technology</h5>
                        <ul class="list-unstyled mt-3">
                            <li class="mb-2"><i class="fas fa-angle-right text-primary"></i> Diploma in IT</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-primary"></i> Software Development</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-primary"></i> Computer Networks</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-primary"></i> Web Design</li>
                        </ul>
                        <a href="#admissions" class="btn btn-primary w-100 mt-3">Apply Now</a>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <i class="fas fa-calculator fa-3x" style="color: var(--light-green)"></i>
                        </div>
                        <h5 class="card-title fw-bold text-center">Business Studies</h5>
                        <ul class="list-unstyled mt-3">
                            <li class="mb-2"><i class="fas fa-angle-right text-success"></i> Business Administration</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-success"></i> Accounting</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-success"></i> Marketing</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-success"></i> Entrepreneurship</li>
                        </ul>
                        <a href="#admissions" class="btn btn-success w-100 mt-3">Apply Now</a>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <i class="fas fa-tools fa-3x" style="color: var(--rust-blue)"></i>
                        </div>
                        <h5 class="card-title fw-bold text-center">Technical Trades</h5>
                        <ul class="list-unstyled mt-3">
                            <li class="mb-2"><i class="fas fa-angle-right text-info"></i> Electrical Engineering</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-info"></i> Mechanical Engineering</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-info"></i> Civil Engineering</li>
                            <li class="mb-2"><i class="fas fa-angle-right text-info"></i> Plumbing & Welding</li>
                        </ul>
                        <a href="#admissions" class="btn btn-info w-100 mt-3 text-white">Apply Now</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Admissions Section -->
<section id="admissions" class="content-section">
    <div class="container">
        <div class="row">
            <div class="col-md-8 mx-auto text-center">
                <h2 class="fw-bold mb-4" style="color: var(--primary-color)">Admissions Open</h2>
                <p class="lead mb-4">Join us and start your journey to professional excellence</p>
                
                <div class="card">
                    <div class="card-body p-4">
                        <h4 class="fw-bold mb-4">Admission Requirements</h4>
                        <div class="row text-start">
                            <div class="col-md-6">
                                <h6 class="fw-bold">Certificate Programmes:</h6>
                                <ul>
                                    <li>UCE or equivalent</li>
                                    <li>Minimum of 5 passes</li>
                                    <li>Application form</li>
                                    <li>Passport photos</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold">Diploma Programmes:</h6>
                                <ul>
                                    <li>UACE or equivalent</li>
                                    <li>Minimum of 2 principal passes</li>
                                    <li>Application form</li>
                                    <li>Academic transcripts</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            @auth
                                <a href="{{ route('dashboard') }}" class="btn btn-primary btn-lg">
                                    <i class="fas fa-tachometer-alt"></i> Go to Dashboard
                                </a>
                            @else
                                <a href="{{ route('register') }}" class="btn btn-primary btn-lg me-2">
                                    <i class="fas fa-user-plus"></i> Register Now
                                </a>
                                <a href="{{ route('login') }}" class="btn btn-outline-primary btn-lg">
                                    <i class="fas fa-sign-in-alt"></i> Login
                                </a>
                            @endauth
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Latest News/Announcements -->
<section class="content-section bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="fw-bold" style="color: var(--primary-color)">Latest News & Announcements</h2>
        </div>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary">New</span>
                            <small class="text-muted">{{ now()->format('M d, Y') }}</small>
                        </div>
                        <h5 class="card-title fw-bold">Academic Year {{ \App\Helpers\BrandingHelper::academicYear() }} Registration</h5>
                        <p class="card-text">Registration for the new academic year is now open. Students can register online through the student portal.</p>
                        <a href="#" class="btn btn-sm btn-outline-primary">Read More</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-success">Event</span>
                            <small class="text-muted">{{ now()->addDays(7)->format('M d, Y') }}</small>
                        </div>
                        <h5 class="card-title fw-bold">Graduation Ceremony</h5>
                        <p class="card-text">The annual graduation ceremony will take place next month. All graduands are encouraged to clear their fees.</p>
                        <a href="#" class="btn btn-sm btn-outline-success">Read More</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-info text-white">Notice</span>
                            <small class="text-muted">{{ now()->subDays(2)->format('M d, Y') }}</small>
                        </div>
                        <h5 class="card-title fw-bold">Library Services</h5>
                        <p class="card-text">The library is now open for extended hours. Students can access resources from 7 AM to 9 PM on weekdays.</p>
                        <a href="#" class="btn btn-sm btn-outline-info">Read More</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="content-section">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="fw-bold" style="color: var(--primary-color)">Contact Us</h2>
            <p class="lead">Get in touch with us for more information</p>
        </div>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="fas fa-map-marker-alt fa-3x text-danger mb-3"></i>
                        <h5 class="fw-bold">Location</h5>
                        <p>{{ config('branding.contact.address') }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="fas fa-phone fa-3x text-success mb-3"></i>
                        <h5 class="fw-bold">Phone</h5>
                        <p>{{ config('branding.contact.phone' )}}<br>
                        {{ config('branding.contact.phone2') }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="fas fa-envelope fa-3x text-primary mb-3"></i>
                        <h5 class="fw-bold">Email</h5>
                        <p>{{ config('branding.contact.email') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection

@push('scripts')
<script>
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
</script>
@endpush
