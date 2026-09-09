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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., "school_name", "academic_year"
            $table->text('value')->nullable();
            $table->string('category')->default('general'); // general, academic, financial, etc.
            $table->string('type')->default('text'); // text, number, boolean, json, date
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false); // Can be accessed publicly
            $table->timestamps();
        });

        Schema::create('file_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('original_name');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type'); // image, document, video, etc.
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size'); // in bytes
            $table->string('upload_context')->nullable(); // student_document, announcement_attachment, etc.
            $table->morphs('uploadable'); // Polymorphic relation
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('activity_type'); // login, logout, view, create, update, delete
            $table->string('description');
            $table->morphs('subject'); // The model that was acted upon
            $table->json('properties')->nullable(); // Additional data
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('file_uploads');
        Schema::dropIfExists('system_settings');
    }
};
