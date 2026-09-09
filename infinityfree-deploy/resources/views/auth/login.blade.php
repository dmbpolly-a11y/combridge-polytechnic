@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow-lg border-0">
                <div class="card-header text-center py-4" style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--rust-blue) 100%); color: white;">
                    <div class="text-center mb-4">
                    <img src="{{ asset('images/combridge.jpeg') }}" alt="Logo" style="height: 80px;">
                    <h3 class="mt-3 font-weight-bold" style="color: #003366;">{{ config('branding.name', 'COMBRIDGE CENTRE') }}</h3>
                    <p class="text-muted">{{ config('branding.tagline', 'Development through Skills and Innovation') }}</p>
                </div>
                <div class="card-body p-4">
                    <h5 class="text-center mb-4 fw-bold" style="color: var(--primary-color)">Login to Your Account</h5>
                    
                    <form method="POST" action="{{ route('login') }}">
                        @csrf
                        
                        <!-- Email Field -->
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold">
                                <i class="fas fa-envelope"></i> Email Address
                            </label>
                            <input 
                                type="email" 
                                class="form-control form-control-lg @error('email') is-invalid @enderror" 
                                id="email" 
                                name="email" 
                                value="{{ old('email') }}" 
                                required 
                                autofocus
                                placeholder="Enter your email"
                            >
                            @error('email')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Password Field -->
                        <div class="mb-3">
                            <label for="password" class="form-label fw-bold">
                                <i class="fas fa-lock"></i> Password
                            </label>
                            <div class="input-group">
                                <input 
                                    type="password" 
                                    class="form-control form-control-lg @error('password') is-invalid @enderror" 
                                    id="password" 
                                    name="password" 
                                    required
                                    placeholder="Enter your password"
                                >
                                <button class="btn btn-outline-secondary" type="button" onclick="togglePassword()">
                                    <i class="fas fa-eye" id="toggleIcon"></i>
                                </button>
                                @error('password')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <!-- Remember Me -->
                        <div class="mb-3 form-check">
                            <input 
                                type="checkbox" 
                                class="form-check-input" 
                                id="remember" 
                                name="remember"
                                {{ old('remember') ? 'checked' : '' }}
                            >
                            <label class="form-check-label" for="remember">
                                Remember Me
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <div class="d-grid mb-3">
                            <button type="submit" class="btn btn-lg fw-bold" style="background: var(--primary-color); color: white;">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </div>

                        <!-- Links -->
                        <div class="text-center">
                            <a href="{{ route('password.request') }}" class="text-decoration-none" style="color: var(--primary-color)">
                                <i class="fas fa-key"></i> Forgot Your Password?
                            </a>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="text-center">
                            <p class="mb-0">Don't have an account?</p>
                            <a href="{{ route('register') }}" class="btn btn-outline-primary">
                                <i class="fas fa-user-plus"></i> Register Now
                            </a>
                        </div>
                    </form>
                </div>
                <div class="card-footer text-center text-muted py-3 bg-light">
                    <small>
                        <i class="fas fa-shield-alt"></i> Secure Login Portal
                    </small>
                </div>
            </div>
            
            <!-- Quick Access Guide -->
            <div class="card mt-4 border-0 bg-light">
                <div class="card-body">
                    <h6 class="fw-bold mb-3"><i class="fas fa-info-circle"></i> Quick Access Guide</h6>
                    <div class="row">
                        <div class="col-6 mb-2">
                            <small class="text-muted">
                                <i class="fas fa-user-tie text-primary"></i> <strong>Admin</strong><br>
                                Full system access
                            </small>
                        </div>
                        <div class="col-6 mb-2">
                            <small class="text-muted">
                                <i class="fas fa-chalkboard-teacher text-success"></i> <strong>Teacher</strong><br>
                                Marks & attendance
                            </small>
                        </div>
                        <div class="col-6 mb-2">
                            <small class="text-muted">
                                <i class="fas fa-user-graduate text-info"></i> <strong>Student</strong><br>
                                View results & fees
                            </small>
                        </div>
                        <div class="col-6 mb-2">
                            <small class="text-muted">
                                <i class="fas fa-book text-warning"></i> <strong>Librarian</strong><br>
                                Manage library
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function togglePassword() {
        const password = document.getElementById('password');
        const icon = document.getElementById('toggleIcon');
        
        if (password.type === 'password') {
            password.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            password.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
</script>
@endpush
@endsection
