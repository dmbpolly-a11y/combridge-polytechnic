@extends('layouts.app')

@section('title', 'Admin Dashboard')

@section('content')
<div class="container-fluid py-4">
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--rust-blue) 100%); color: white;">
                <div class="card-body py-4">
                    <h2 class="mb-2">
                        <i class="fas fa-tachometer-alt"></i> Admin Dashboard
                    </h2>
                    <p class="mb-0">Welcome back, {{ Auth::user()->name }}! Academic Year: {{ \App\Helpers\BrandingHelper::academicYear() }}</p>
                    <small>Last login: {{ Auth::user()->last_login_at ?? 'First time' }}</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="row mb-4">
        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Total Students</h6>
                            <h2 class="mb-0 fw-bold" style="color: var(--primary-color)">{{ $stats['total_students'] }}</h2>
                            <small class="text-success"><i class="fas fa-arrow-up"></i> Active</small>
                        </div>
                        <div>
                            <div class="rounded-circle p-3" style="background: rgba(12, 92, 62, 0.1);">
                                <i class="fas fa-user-graduate fa-2x" style="color: var(--primary-color)"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-light border-0">
                    <a href="{{ route('admin.students.index') }}" class="btn btn-sm btn-outline-primary w-100">
                        <i class="fas fa-eye"></i> View Students
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Total Teachers</h6>
                            <h2 class="mb-0 fw-bold text-success">{{ $stats['total_teachers'] }}</h2>
                            <small class="text-success"><i class="fas fa-arrow-up"></i> Active</small>
                        </div>
                        <div>
                            <div class="rounded-circle p-3" style="background: rgba(70, 170, 106, 0.1);">
                                <i class="fas fa-chalkboard-teacher fa-2x text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-light border-0">
                    <a href="{{ route('admin.teachers.index') }}" class="btn btn-sm btn-outline-success w-100">
                        <i class="fas fa-eye"></i> View Teachers
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Active Classes</h6>
                            <h2 class="mb-0 fw-bold text-info">{{ $stats['total_classes'] }}</h2>
                            <small class="text-muted">{{ $stats['total_programmes'] }} Programmes</small>
                        </div>
                        <div>
                            <div class="rounded-circle p-3" style="background: rgba(13, 202, 240, 0.1);">
                                <i class="fas fa-door-open fa-2x text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-light border-0">
                    <a href="{{ route('admin.programmes.index') }}" class="btn btn-sm btn-outline-info w-100">
                        <i class="fas fa-eye"></i> View Classes
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Fees Collected</h6>
                            <h2 class="mb-0 fw-bold text-warning">{{ \App\Helpers\BrandingHelper::formatCurrency($financialStats['total_fees_collected']) }}</h2>
                            <small class="text-success"><i class="fas fa-arrow-up"></i> This Year</small>
                        </div>
                        <div>
                            <div class="rounded-circle p-3" style="background: rgba(255, 193, 7, 0.1);">
                                <i class="fas fa-money-bill-wave fa-2x text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-light border-0">
                    <a href="{{ route('admin.fees.index') }}" class="btn btn-sm btn-outline-warning w-100">
                        <i class="fas fa-eye"></i> View Fees
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Attendance & Finance Row -->
    <div class="row mb-4">
        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-calendar-check text-primary"></i> Today's Attendance</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <div class="text-center p-3 rounded" style="background: rgba(12, 92, 62, 0.05);">
                                <h6 class="text-muted mb-2">Students Present</h6>
                                <h3 class="mb-0 fw-bold" style="color: var(--primary-color)">{{ $attendanceStats['student_present_today'] }}</h3>
                                <small class="text-muted">out of {{ $stats['total_students'] }}</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="text-center p-3 rounded" style="background: rgba(70, 170, 106, 0.05);">
                                <h6 class="text-muted mb-2">Teachers Present</h6>
                                <h3 class="mb-0 fw-bold text-success">{{ $attendanceStats['teacher_present_today'] }}</h3>
                                <small class="text-muted">out of {{ $stats['total_teachers'] }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="{{ route('admin.attendance.index') }}" class="btn btn-primary w-100">
                            <i class="fas fa-clipboard-list"></i> View Full Attendance
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-chart-line text-warning"></i> Financial Summary</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Total Collected (Year)</span>
                            <strong style="color: var(--primary-color)">{{ \App\Helpers\BrandingHelper::formatCurrency($financialStats['total_fees_collected']) }}</strong>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar" style="width: 70%; background: var(--primary-color)"></div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Pending Fees</span>
                            <strong class="text-danger">{{ \App\Helpers\BrandingHelper::formatCurrency($financialStats['pending_fees']) }}</strong>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-danger" style="width: 30%"></div>
                        </div>
                    </div>
                    
                    <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle"></i> <strong>{{ $financialStats['payments_today'] }}</strong> payments received today
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="row mb-4">
        <div class="col-md-8 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-clock text-info"></i> Recent Activity</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        @foreach($recentStudents as $student)
                        <li class="list-group-item px-0">
                            <div class="d-flex align-items-center">
                                <div class="rounded-circle bg-primary text-white p-2 me-3">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <strong>{{ $student->user->name }}</strong> registered as a new student
                                    <br><small class="text-muted">{{ $student->admission_number }} - {{ $student->created_at->diffForHumans() }}</small>
                                </div>
                            </div>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        <div class="col-md-4 mb-3">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-bolt text-warning"></i> Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <a href="{{ route('admin.students.create') }}" class="btn btn-outline-primary text-start">
                            <i class="fas fa-user-plus"></i> Add Student
                        </a>
                        <a href="{{ route('admin.attendance.mark') }}" class="btn btn-outline-success text-start">
                            <i class="fas fa-clipboard-check"></i> Mark Attendance
                        </a>
                        <a href="{{ route('admin.fees.collect') }}" class="btn btn-outline-warning text-start">
                            <i class="fas fa-money-bill"></i> Collect Fees
                        </a>
                        <a href="{{ route('admin.communications.announcements.create') }}" class="btn btn-outline-info text-start">
                            <i class="fas fa-bullhorn"></i> New Announcement
                        </a>
                        <a href="{{ route('admin.reports') }}" class="btn btn-outline-secondary text-start">
                            <i class="fas fa-file-alt"></i> Generate Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Announcements & Upcoming Events -->
    <div class="row">
        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-bullhorn text-danger"></i> Latest Announcements</h5>
                </div>
                <div class="card-body">
                    @forelse($recentAnnouncements as $announcement)
                    <div class="mb-3 pb-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-{{ $announcement->priority === 'urgent' ? 'danger' : ($announcement->priority === 'high' ? 'warning' : 'info') }}">
                                {{ ucfirst($announcement->priority) }}
                            </span>
                            <small class="text-muted">{{ $announcement->published_at?->diffForHumans() }}</small>
                        </div>
                        <h6 class="fw-bold mb-2">{{ $announcement->title }}</h6>
                        <p class="mb-0 text-muted small">{{ Str::limit($announcement->content, 100) }}</p>
                    </div>
                    @empty
                    <p class="text-muted text-center mb-0">No recent announcements</p>
                    @endforelse
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-calendar-alt text-success"></i> Upcoming Exams</h5>
                </div>
                <div class="card-body">
                    @forelse($upcomingExams as $exam)
                    <div class="mb-3 pb-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-info">{{ ucfirst($exam->exam_type) }}</span>
                            <small class="text-muted">{{ $exam->exam_date->format('M d, Y') }}</small>
                        </div>
                        <h6 class="fw-bold mb-1">{{ $exam->subject->name }}</h6>
                        <p class="mb-0 text-muted small">{{ $exam->class->name }} - {{ $exam->start_time }} to {{ $exam->end_time }}</p>
                    </div>
                    @empty
                    <p class="text-muted text-center mb-0">No upcoming exams scheduled</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .card {
        transition: all 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
    }
</style>
@endpush
