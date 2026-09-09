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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('staff_id')->unique();
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->date('join_date');
            $table->string('qualification'); // e.g., "PhD", "Masters", "Bachelor"
            $table->string('specialization')->nullable();
            $table->text('experience')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('employee_type')->default('full-time'); // full-time, part-time, contract
            $table->enum('teacher_status', ['active', 'on_leave', 'retired', 'terminated'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });

        // Pivot table for teacher-subject relationship
        Schema::create('subject_teacher', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('class_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('academic_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subject_teacher');
        Schema::dropIfExists('teachers');
    }
};
