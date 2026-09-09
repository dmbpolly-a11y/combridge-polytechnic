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
        Schema::create('report_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('academic_year');
            $table->integer('semester');
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->decimal('total_marks', 8, 2);
            $table->decimal('average_marks', 5, 2);
            $table->decimal('gpa', 3, 2)->nullable();
            $table->integer('class_rank')->nullable();
            $table->integer('total_students')->nullable();
            $table->text('remarks')->nullable(); // Teacher's remarks
            $table->text('head_teacher_remarks')->nullable();
            $table->date('generated_date');
            $table->foreignId('generated_by')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['draft', 'finalized', 'published'])->default('draft');
            $table->timestamps();

            $table->unique(['student_id', 'academic_year', 'semester']);
        });

        Schema::create('report_card_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_card_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->decimal('marks', 5, 2);
            $table->string('grade');
            $table->decimal('grade_point', 3, 2);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        Schema::create('transcripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('transcript_number')->unique();
            $table->decimal('cumulative_gpa', 3, 2);
            $table->text('courses_completed')->nullable(); // JSON of all courses
            $table->integer('total_credits')->default(0);
            $table->date('issue_date');
            $table->foreignId('issued_by')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['draft', 'issued', 'revoked'])->default('draft');
            $table->timestamps();
        });

        Schema::create('system_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action'); // e.g., "created", "updated", "deleted"
            $table->string('model'); // e.g., "Student", "Teacher"
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['model', 'model_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_logs');
        Schema::dropIfExists('transcripts');
        Schema::dropIfExists('report_card_subjects');
        Schema::dropIfExists('report_cards');
    }
};
