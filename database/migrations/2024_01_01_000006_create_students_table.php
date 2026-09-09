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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('admission_number')->unique();
            $table->foreignId('programme_id')->constrained()->onDelete('restrict');
            $table->foreignId('class_id')->nullable()->constrained()->onDelete('set null');
            $table->date('admission_date');
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_email')->nullable();
            $table->text('guardian_address')->nullable();
            $table->string('previous_school')->nullable();
            $table->string('national_id')->nullable();
            $table->string('passport_number')->nullable();
            $table->enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable();
            $table->text('medical_conditions')->nullable();
            $table->text('emergency_contact')->nullable();
            $table->enum('student_status', ['active', 'graduated', 'suspended', 'withdrawn', 'deferred'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
