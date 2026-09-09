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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('year_name'); // e.g., "2024/2025"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->enum('status', ['active', 'completed', 'upcoming'])->default('upcoming');
            $table->timestamps();
        });

        Schema::create('academic_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->string('event_name'); // e.g., "Semester 1 Start", "Registration Deadline"
            $table->enum('event_type', [
                'semester_start', 
                'semester_end', 
                'exam_period', 
                'holiday', 
                'registration', 
                'orientation',
                'graduation',
                'other'
            ])->default('other');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->enum('target_audience', ['all', 'students', 'teachers', 'staff'])->default('all');
            $table->boolean('is_holiday')->default(false);
            $table->timestamps();
        });

        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->string('semester_name'); // e.g., "Semester 1", "Semester 2"
            $table->integer('semester_number'); // 1, 2, 3
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->enum('status', ['active', 'completed', 'upcoming'])->default('upcoming');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semesters');
        Schema::dropIfExists('academic_events');
        Schema::dropIfExists('academic_years');
    }
};
