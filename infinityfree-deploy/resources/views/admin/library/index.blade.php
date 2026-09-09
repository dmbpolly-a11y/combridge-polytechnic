@extends('layouts.app')

@section('title', 'Library Management')

@section('content')
<div class="container-fluid">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="text-primary">Library Management</h1>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Library</li>
                </ol>
            </nav>
        </div>
        <div>
            <a href="{{ route('admin.library.create') }}" class="btn-primary">
                <i class="fas fa-plus"></i> Add New Book
            </a>
            <a href="{{ route('admin.library.issue.form') }}" class="btn-secondary">
                <i class="fas fa-book-reader"></i> Issue Book
            </a>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="dashboard-card students">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6>Total Books</h6>
                        <h2 class="text-primary">{{ $stats['total_books'] }}</h2>
                    </div>
                    <i class="fas fa-book fa-3x text-primary"></i>
                </div>
            </div>
        </div>
        
        <div class="col-md-3">
            <div class="dashboard-card teachers">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6>Total Copies</h6>
                        <h2 class="text-success">{{ $stats['total_copies'] }}</h2>
                    </div>
                    <i class="fas fa-books fa-3x text-success"></i>
                </div>
            </div>
        </div>
        
        <div class="col-md-3">
            <div class="dashboard-card attendance">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6>Currently Issued</h6>
                        <h2 class="text-info">{{ $stats['issued_books'] }}</h2>
                    </div>
                    <i class="fas fa-book-open fa-3x text-info"></i>
                </div>
            </div>
        </div>
        
        <div class="col-md-3">
            <div class="dashboard-card fees">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6>Overdue Books</h6>
                        <h2 class="text-danger">{{ $stats['overdue_books'] }}</h2>
                    </div>
                    <i class="fas fa-exclamation-triangle fa-3x text-danger"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Alerts -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            <i class="fas fa-check-circle"></i> {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show">
            <i class="fas fa-exclamation-circle"></i> {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <!-- Quick Links -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="d-flex gap-3 flex-wrap">
                <a href="{{ route('admin.library.issues') }}" class="btn btn-outline-primary">
                    <i class="fas fa-list"></i> View All Issues
                </a>
                <a href="{{ route('admin.library.overdue') }}" class="btn btn-outline-danger">
                    <i class="fas fa-clock"></i> Overdue Books
                </a>
                <a href="{{ route('admin.library.report') }}" class="btn btn-outline-success">
                    <i class="fas fa-chart-bar"></i> Reports
                </a>
            </div>
        </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-4">
        <div class="card-header">
            <i class="fas fa-filter"></i> Filter Books
        </div>
        <div class="card-body">
            <form action="{{ route('admin.library.index') }}" method="GET" class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Search</label>
                    <input type="text" name="search" class="form-control" 
                           placeholder="Search by title, author, ISBN..." 
                           value="{{ request('search') }}">
                </div>
                
                <div class="col-md-3">
                    <label class="form-label">Category</label>
                    <select name="category" class="form-control">
                        <option value="">All Categories</option>
                        @foreach($categories as $category)
                            <option value="{{ $category }}" {{ request('category') == $category ? 'selected' : '' }}>
                                {{ $category }}
                            </option>
                        @endforeach
                    </select>
                </div>
                
                <div class="col-md-2">
                    <label class="form-label">Subject</label>
                    <select name="subject_id" class="form-control">
                        <option value="">All Subjects</option>
                        @foreach($subjects as $subject)
                            <option value="{{ $subject->id }}" {{ request('subject_id') == $subject->id ? 'selected' : '' }}>
                                {{ $subject->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                
                <div class="col-md-2">
                    <label class="form-label">Status</label>
                    <select name="status" class="form-control">
                        <option value="">All</option>
                        <option value="available" {{ request('status') == 'available' ? 'selected' : '' }}>Available</option>
                        <option value="unavailable" {{ request('status') == 'unavailable' ? 'selected' : '' }}>Unavailable</option>
                    </select>
                </div>
                
                <div class="col-md-1 d-flex align-items-end">
                    <button type="submit" class="btn-primary w-100">
                        <i class="fas fa-search"></i> Filter
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Books Table -->
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">
                <i class="fas fa-book"></i> Books Catalog
            </h5>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Category</th>
                            <th>Subject</th>
                            <th>Copies</th>
                            <th>Available</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($books as $book)
                            <tr>
                                <td>{{ $book->id }}</td>
                                <td>
                                    <strong>{{ $book->title }}</strong>
                                    @if($book->publication_year)
                                        <br><small class="text-muted">({{ $book->publication_year }})</small>
                                    @endif
                                </td>
                                <td>{{ $book->author }}</td>
                                <td>{{ $book->isbn ?? 'N/A' }}</td>
                                <td>
                                    <span class="badge badge-info">{{ $book->category }}</span>
                                </td>
                                <td>{{ $book->subject->name ?? 'N/A' }}</td>
                                <td>{{ $book->total_copies }}</td>
                                <td>
                                    <span class="badge {{ $book->available_copies > 0 ? 'badge-success' : 'badge-danger' }}">
                                        {{ $book->available_copies }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge badge-{{ $book->status == 'available' ? 'success' : 'danger' }}">
                                        {{ ucfirst($book->status) }}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <a href="{{ route('admin.library.show', $book) }}" 
                                           class="btn btn-sm btn-info" title="View">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="{{ route('admin.library.edit', $book) }}" 
                                           class="btn btn-sm btn-warning" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <form action="{{ route('admin.library.destroy', $book) }}" 
                                              method="POST" class="d-inline"
                                              onsubmit="return confirm('Are you sure you want to delete this book?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-danger" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="10" class="text-center">
                                    <div class="p-4">
                                        <i class="fas fa-book fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">No books found. Add your first book to get started.</p>
                                        <a href="{{ route('admin.library.create') }}" class="btn-primary">
                                            <i class="fas fa-plus"></i> Add Book
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($books->hasPages())
                <div class="mt-4">
                    {{ $books->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .badge-info {
        background-color: var(--info);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    
    .btn-group {
        display: flex;
        gap: 0.25rem;
    }
    
    .btn-group .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
</style>
@endpush
