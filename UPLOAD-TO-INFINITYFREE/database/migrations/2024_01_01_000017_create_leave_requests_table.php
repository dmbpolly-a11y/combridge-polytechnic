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
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Sick Leave", "Annual Leave"
            $table->text('description')->nullable();
            $table->integer('max_days')->default(30);
            $table->boolean('requires_document')->default(false);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained()->onDelete('restrict');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days');
            $table->text('reason');
            $table->string('document_path')->nullable(); // Medical certificate, etc.
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('admin_remarks')->nullable();
            $table->timestamps();
        });

        // For teachers/staff to mark when they take leave
        Schema::create('teacher_leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('leave_request_id')->constrained()->onDelete('cascade');
            $table->date('leave_date');
            $table->foreignId('substitute_teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->text('classes_affected')->nullable(); // JSON or comma-separated class IDs
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_leaves');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('leave_types');
    }
};
