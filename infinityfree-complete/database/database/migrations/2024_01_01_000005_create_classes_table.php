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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Year 1 A", "Year 2 B"
            $table->string('code')->unique();
            $table->foreignId('programme_id')->constrained()->onDelete('cascade');
            $table->integer('year')->default(1); // Academic year (1, 2, 3, etc.)
            $table->integer('semester')->default(1); // Semester (1 or 2)
            $table->string('academic_year'); // e.g., "2024/2025"
            $table->foreignId('class_teacher_id')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('capacity')->default(50); // Maximum students
            $table->enum('status', ['active', 'inactive', 'completed'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
