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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->text('description')->nullable();
            $table->integer('credit_hours')->default(3);
            $table->enum('type', ['core', 'elective', 'practical'])->default('core');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });

        // Pivot table for programme-subject relationship
        Schema::create('programme_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('programme_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->integer('year')->default(1); // Which year this subject is taught
            $table->integer('semester')->default(1); // Which semester
            $table->boolean('is_required')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programme_subject');
        Schema::dropIfExists('subjects');
    }
};
