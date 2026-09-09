<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('qr_attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->string('session_code')->unique(); // Unique QR code for the session
            $table->date('session_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->enum('status', ['active', 'closed', 'expired'])->default('active');
            $table->integer('total_scans')->default(0);
            $table->timestamps();
        });

        Schema::create('qr_attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('qr_attendance_sessions')->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->timestamp('scan_time');
            $table->string('device_info')->nullable(); // Device used for scanning
            $table->string('ip_address')->nullable();
            $table->point('location')->nullable(); // GPS coordinates
            $table->enum('status', ['present', 'late'])->default('present');
            $table->timestamps();

            // Allow multiple scans but track each one
            $table->index(['session_id', 'student_id', 'scan_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_attendance_logs');
        Schema::dropIfExists('qr_attendance_sessions');
    }
};
