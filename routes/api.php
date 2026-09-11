<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminApiController;

/*
|--------------------------------------------------------------------------
| API Routes — consumed by the Vite + React frontend
|--------------------------------------------------------------------------
| All routes here are automatically prefixed with /api
| by the RouteServiceProvider.
*/

// ── CSRF Cookie (Sanctum) ────────────────────────────────────────────────────
// The React app hits GET /sanctum/csrf-cookie before any state-changing request.

// ── Auth ─────────────────────────────────────────────────────────────────────
Route::post('/login',  [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me',      [AuthController::class, 'me'])->middleware('auth:sanctum');

// ── Admin API ─────────────────────────────────────────────────────────────────
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:administrator,principal'])
    ->group(function () {
        Route::get('/stats',             [AdminApiController::class, 'stats']);
        Route::get('/attendance/today',  [AdminApiController::class, 'attendanceToday']);
        Route::get('/financial-summary', [AdminApiController::class, 'financialSummary']);
        Route::get('/recent-students',   [AdminApiController::class, 'recentStudents']);
        Route::get('/announcements',     [AdminApiController::class, 'announcements']);
        Route::get('/upcoming-exams',    [AdminApiController::class, 'upcomingExams']);
    });
