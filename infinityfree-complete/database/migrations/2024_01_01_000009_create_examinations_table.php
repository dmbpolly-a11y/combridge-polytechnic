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
        Schema::create('examinations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "End of Semester Exam"
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->enum('exam_type', ['quiz', 'mid_term', 'final', 'practical', 'assignment'])->default('final');
            $table->date('exam_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->integer('total_marks')->default(100);
            $table->integer('passing_marks')->default(50);
            $table->string('room')->nullable();
            $table->text('instructions')->nullable();
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('examination_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->decimal('marks_obtained', 5, 2);
            $table->string('grade')->nullable(); // A, B, C, D, F
            $table->text('remarks')->nullable();
            $table->boolean('is_absent')->default(false);
            $table->foreignId('entered_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['examination_id', 'student_id']);
        });

        Schema::create('grading_systems', function (Blueprint $table) {
            $table->id();
            $table->string('grade'); // A, B, C, D, F
            $table->integer('min_marks');
            $table->integer('max_marks');
            $table->decimal('grade_point', 3, 2); // GPA value
            $table->text('description')->nullable(); // Excellent, Good, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grading_systems');
        Schema::dropIfExists('exam_results');
        Schema::dropIfExists('examinations');
    }
};
