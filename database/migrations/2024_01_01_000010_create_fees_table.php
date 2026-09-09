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
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Tuition Fee", "Library Fee"
            $table->foreignId('programme_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('year')->nullable(); // Which year this fee applies to
            $table->decimal('amount', 10, 2);
            $table->enum('frequency', ['one_time', 'per_semester', 'per_year'])->default('per_semester');
            $table->enum('fee_type', ['tuition', 'library', 'lab', 'sports', 'exam', 'other'])->default('tuition');
            $table->boolean('is_mandatory')->default(true);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('fee_structure_id')->constrained()->onDelete('restrict');
            $table->string('receipt_number')->unique();
            $table->decimal('amount_paid', 10, 2);
            $table->date('payment_date');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'mobile_money', 'cheque', 'card'])->default('cash');
            $table->string('transaction_reference')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('collected_by')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('completed');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('fee_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('academic_year');
            $table->decimal('total_fee', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('balance', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['student_id', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_balances');
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_structures');
    }
};
