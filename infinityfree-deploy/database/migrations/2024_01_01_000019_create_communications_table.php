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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->string('attachment_path')->nullable();
            $table->foreignId('parent_message_id')->nullable()->constrained('messages')->onDelete('cascade'); // For replies
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number');
            $table->text('message');
            $table->enum('message_type', ['notification', 'alert', 'reminder', 'announcement'])->default('notification');
            $table->enum('status', ['pending', 'sent', 'failed', 'delivered'])->default('pending');
            $table->string('sms_id')->nullable(); // From SMS provider
            $table->text('error_message')->nullable();
            $table->foreignId('sent_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('subject');
            $table->text('body');
            $table->enum('email_type', ['notification', 'alert', 'reminder', 'announcement', 'report'])->default('notification');
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->foreignId('sent_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('sent_at')->nullable();
            $table->json('attachments')->nullable(); // Array of attachment paths
            $table->timestamps();
        });

        Schema::create('communication_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Fee Reminder", "Exam Notification"
            $table->string('slug')->unique();
            $table->enum('type', ['sms', 'email', 'both'])->default('both');
            $table->string('subject')->nullable(); // For emails
            $table->text('content'); // Template with placeholders
            $table->json('placeholders')->nullable(); // Available placeholders
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communication_templates');
        Schema::dropIfExists('email_logs');
        Schema::dropIfExists('sms_logs');
        Schema::dropIfExists('messages');
    }
};
