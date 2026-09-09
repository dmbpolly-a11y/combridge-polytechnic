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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth');
            $table->text('address');
            $table->string('district')->nullable();
            $table->string('nationality')->default('Ugandan');
            
            // Programme information
            $table->foreignId('programme_id')->constrained()->onDelete('restrict');
            $table->string('previous_school')->nullable();
            $table->string('previous_qualification')->nullable();
            $table->year('completion_year')->nullable();
            
            // Guardian information
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_email')->nullable();
            $table->string('guardian_relationship')->nullable();
            
            // Documents
            $table->string('photo_path')->nullable();
            $table->string('certificate_path')->nullable();
            $table->string('transcript_path')->nullable();
            $table->string('id_document_path')->nullable();
            
            // Application status
            $table->enum('status', ['pending', 'under_review', 'accepted', 'rejected', 'enrolled'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->date('application_date');
            $table->string('academic_year');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
