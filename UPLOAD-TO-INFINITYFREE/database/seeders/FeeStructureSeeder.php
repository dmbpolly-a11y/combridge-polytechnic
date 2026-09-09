<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeeStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programmes = DB::table('programmes')->get();

        $feeStructures = [];

        foreach ($programmes as $programme) {
            // Determine fees based on programme type
            $baseFee = 0;
            if (str_contains($programme->code, 'D')) { // Diploma
                $baseFee = 1500000; // 1.5M UGX per semester
            } else { // Certificate
                $baseFee = 800000; // 800K UGX per semester
            }

            // Semester 1
            $feeStructures[] = [
                'programme_id' => $programme->id,
                'academic_year' => '2024/2025',
                'semester' => 1,
                'year_level' => 1,
                'tuition_fee' => $baseFee,
                'registration_fee' => 50000,
                'examination_fee' => 100000,
                'library_fee' => 30000,
                'identity_card_fee' => 20000,
                'medical_fee' => 50000,
                'sports_fee' => 20000,
                'development_fee' => 100000,
                'total_amount' => $baseFee + 370000,
                'due_date' => now()->addMonths(2)->format('Y-m-d'),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Semester 2
            $feeStructures[] = [
                'programme_id' => $programme->id,
                'academic_year' => '2024/2025',
                'semester' => 2,
                'year_level' => 1,
                'tuition_fee' => $baseFee,
                'registration_fee' => 0, // Already paid in sem 1
                'examination_fee' => 100000,
                'library_fee' => 30000,
                'identity_card_fee' => 0, // Already paid
                'medical_fee' => 50000,
                'sports_fee' => 20000,
                'development_fee' => 0, // Already paid
                'total_amount' => $baseFee + 200000,
                'due_date' => now()->addMonths(8)->format('Y-m-d'),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Year 2 fees (for diploma programs)
            if ($programme->duration_years >= 2) {
                $feeStructures[] = [
                    'programme_id' => $programme->id,
                    'academic_year' => '2024/2025',
                    'semester' => 1,
                    'year_level' => 2,
                    'tuition_fee' => $baseFee,
                    'registration_fee' => 50000,
                    'examination_fee' => 100000,
                    'library_fee' => 30000,
                    'identity_card_fee' => 0,
                    'medical_fee' => 50000,
                    'sports_fee' => 20000,
                    'development_fee' => 0,
                    'total_amount' => $baseFee + 250000,
                    'due_date' => now()->addMonths(14)->format('Y-m-d'),
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('fee_structures')->insert($feeStructures);
        
        // Create sample fee payments for some students
        $this->createSamplePayments();
    }

    /**
     * Create sample fee payments
     */
    private function createSamplePayments(): void
    {
        $students = DB::table('students')->limit(50)->get();
        $feeStructures = DB::table('fee_structures')->get();

        $paymentCounter = 1;

        foreach ($students as $student) {
            // Find fee structure for this student's programme
            $feeStructure = $feeStructures->where('programme_id', $student->programme_id)
                ->where('semester', 1)
                ->where('year_level', 1)
                ->first();

            if (!$feeStructure) {
                continue;
            }

            // Random payment amount (some full, some partial)
            $paymentPercentage = rand(50, 100);
            $amountPaid = ($feeStructure->total_amount * $paymentPercentage) / 100;
            $balance = $feeStructure->total_amount - $amountPaid;

            $receiptNumber = 'RCP-2024-' . str_pad($paymentCounter, 6, '0', STR_PAD_LEFT);

            // Create payment record
            DB::table('fee_payments')->insert([
                'student_id' => $student->id,
                'fee_structure_id' => $feeStructure->id,
                'receipt_number' => $receiptNumber,
                'amount_paid' => $amountPaid,
                'payment_method' => ['cash', 'bank_transfer', 'mobile_money'][array_rand(['cash', 'bank_transfer', 'mobile_money'])],
                'payment_date' => now()->subDays(rand(1, 60))->format('Y-m-d'),
                'transaction_reference' => 'TXN' . time() . rand(1000, 9999),
                'received_by' => 'Bursar Office',
                'remarks' => $balance > 0 ? 'Partial payment' : 'Full payment',
                'status' => 'confirmed',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create fee balance record
            DB::table('fee_balances')->insert([
                'student_id' => $student->id,
                'fee_structure_id' => $feeStructure->id,
                'total_fee' => $feeStructure->total_amount,
                'amount_paid' => $amountPaid,
                'balance' => $balance,
                'last_payment_date' => now()->subDays(rand(1, 60))->format('Y-m-d'),
                'status' => $balance > 0 ? 'partial' : 'paid',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $paymentCounter++;
        }
    }
}
