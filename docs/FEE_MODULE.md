# Fee Management System Documentation

## Overview

The Fee Management System provides comprehensive functionality for managing school fees including fee structure setup, payment collection, receipt generation, balance tracking, defaulter management, and financial reporting.

## Features

### 1. Fee Structure Management
- **Define Fee Types**:
  - Tuition fees
  - Library fees
  - Laboratory fees
  - Sports fees
  - Examination fees
  - Other fees
- **Programme-based**: Different fees per programme
- **Year-specific**: Fees can vary by academic year
- **Frequency Options**:
  - One-time payment
  - Per semester
  - Per year
- **Mandatory/Optional**: Mark fees as required or optional
- **Active/Inactive**: Enable or disable fee structures

### 2. Payment Collection
- **Multiple Payment Methods**:
  - Cash
  - Bank Transfer
  - Mobile Money (MTN, Airtel, etc.)
  - Cheque
  - Card
- **Transaction Tracking**: Reference numbers for digital payments
- **Receipt Generation**: Automatic unique receipt numbers
- **Batch Processing**: Quick payment entry
- **Remarks**: Add notes for each payment

### 3. Receipt Management
- **Unique Receipt Numbers**: Auto-generated (RCP-YYYY-NNNNNN)
- **Professional Format**: Branded receipts
- **PDF Export**: Download/Print receipts
- **Digital Records**: Searchable receipt database
- **Reprint**: Access historical receipts

### 4. Balance Tracking
- **Real-time Balances**: Automatic calculation
- **Academic Year-based**: Track balances per year
- **Programme-wise**: View by programme
- **Student Dashboard**: Individual balance view
- **Payment History**: Complete transaction log

### 5. Financial Reporting
- **Collection Reports**:
  - Daily/Monthly/Yearly
  - By payment method
  - By fee type
  - By programme
- **Trend Analysis**: Collection patterns
- **Collector Performance**: Staff collection stats
- **Export Options**: PDF/Excel (to be implemented)

### 6. Defaulter Management
- **Outstanding Balances**: List students with arrears
- **Sorting**: By amount owed
- **Filtering**: By programme, year
- **Reminder System**: Send payment reminders (to be implemented)
- **Restriction Rules**: Link to access control (to be implemented)

### 7. Student Statements
- **Complete History**: All payments
- **Balance Summary**: Current standing
- **Period-based**: Filter by date range
- **PDF Export**: Official statement
- **Email Distribution**: Send to students/parents (to be implemented)

## Database Tables

### fee_structures
```sql
- id
- name (string)
- programme_id (FK to programmes, nullable)
- year (integer, nullable) - Which year fee applies to
- amount (decimal 10,2)
- frequency (enum: one_time, per_semester, per_year)
- fee_type (enum: tuition, library, lab, sports, exam, other)
- is_mandatory (boolean)
- status (enum: active, inactive)
- timestamps
```

### fee_payments
```sql
- id
- student_id (FK to students)
- fee_structure_id (FK to fee_structures)
- receipt_number (string, unique)
- amount_paid (decimal 10,2)
- payment_date (date)
- payment_method (enum: cash, bank_transfer, mobile_money, cheque, card)
- transaction_reference (string, nullable)
- remarks (text, nullable)
- collected_by (FK to users)
- status (enum: completed, pending, cancelled)
- timestamps
- soft deletes
```

### fee_balances
```sql
- id
- student_id (FK to students)
- academic_year (string)
- total_fee (decimal 10,2)
- paid_amount (decimal 10,2)
- balance (decimal 10,2)
- timestamps
- UNIQUE(student_id, academic_year)
```

## Controller Methods

### FeeController

#### Payment Management
1. **index()** - List all payments with filters
2. **collect()** - Show payment collection form
3. **store()** - Record new payment
4. **generateReceiptNumber()** - Generate unique receipt (private)

#### Receipt Management
5. **receipt()** - Display receipt
6. **downloadReceipt()** - Export receipt as PDF
7. **printReceipt()** - Printer-friendly receipt

#### Balance Management
8. **balances()** - View all student balances
9. **defaulters()** - List students with outstanding balances
10. **statement()** - Student fee statement
11. **downloadStatement()** - Export statement as PDF

#### Fee Structure Management
12. **structures()** - List fee structures
13. **storeStructure()** - Create fee structure
14. **updateStructure()** - Update fee structure
15. **destroyStructure()** - Delete fee structure

#### Reporting
16. **reports()** - Financial reports dashboard

#### AJAX
17. **searchStudent()** - Search students for payment

## Routes

### Admin Routes (Prefix: /admin/fees)

```php
// Fee Payments
GET    /admin/fees                              - fees.index
GET    /admin/fees/collect                      - fees.collect
POST   /admin/fees/store                        - fees.store
GET    /admin/fees/receipt/{payment}            - fees.receipt
GET    /admin/fees/receipt/{payment}/download   - fees.receipt.download
GET    /admin/fees/receipt/{payment}/print      - fees.receipt.print

// Fee Balances
GET    /admin/fees/balances                     - fees.balances
GET    /admin/fees/defaulters                   - fees.defaulters

// Student Statement
GET    /admin/fees/statement/{student}          - fees.statement
GET    /admin/fees/statement/{student}/download - fees.statement.download

// Fee Structures
GET    /admin/fees/structures                   - fees.structures
POST   /admin/fees/structures                   - fees.structures.store
PUT    /admin/fees/structures/{structure}       - fees.structures.update
DELETE /admin/fees/structures/{structure}       - fees.structures.destroy

// Financial Reports
GET    /admin/fees/reports                      - fees.reports

// AJAX
GET    /admin/fees/search/student               - fees.search.student
```

## Models

### FeeStructure Model

**Relationships:**
- `belongsTo` Programme
- `hasMany` FeePayments

**Scopes:**
- `active()` - Filter active structures
- `mandatory()` - Filter mandatory fees
- `forProgramme($programmeId)` - Filter by programme
- `byType($type)` - Filter by fee type

### FeePayment Model

**Relationships:**
- `belongsTo` Student
- `belongsTo` FeeStructure
- `belongsTo` User (collectedBy)

**Methods:**
- `getFormattedAmount()` - Format with currency
- `isCompleted()` - Check if payment completed

**Scopes:**
- `completed()` - Filter completed payments
- `pending()` - Filter pending payments
- `byDateRange($start, $end)` - Filter by date range
- `byMethod($method)` - Filter by payment method

### FeeBalance Model

**Relationships:**
- `belongsTo` Student

**Methods:**
- `updateBalance($amount)` - Update after payment
- `isFullyPaid()` - Check if no balance
- `hasBalance()` - Check if balance exists

**Scopes:**
- `withBalance()` - Students with outstanding balance
- `fullyPaid()` - Students fully paid
- `byAcademicYear($year)` - Filter by year

## Usage Examples

### Creating Fee Structure

```php
$feeStructure = FeeStructure::create([
    'name' => 'Tuition Fee - Year 1',
    'programme_id' => 1,
    'year' => 1,
    'amount' => 1500000, // UGX
    'frequency' => 'per_semester',
    'fee_type' => 'tuition',
    'is_mandatory' => true,
    'status' => 'active',
]);
```

### Recording Payment

```php
// Generate receipt number
$receiptNumber = 'RCP-2024-000001';

$payment = FeePayment::create([
    'student_id' => $studentId,
    'fee_structure_id' => $feeStructureId,
    'receipt_number' => $receiptNumber,
    'amount_paid' => 500000,
    'payment_date' => now(),
    'payment_method' => 'mobile_money',
    'transaction_reference' => 'MTN-12345678',
    'collected_by' => auth()->id(),
    'status' => 'completed',
]);

// Update balance
$academicYear = BrandingHelper::academicYear(); // e.g., "2024/2025"
$balance = FeeBalance::firstOrCreate(
    [
        'student_id' => $studentId,
        'academic_year' => $academicYear,
    ],
    [
        'total_fee' => 1500000,
        'paid_amount' => 0,
        'balance' => 1500000,
    ]
);

$balance->paid_amount += 500000;
$balance->balance = $balance->total_fee - $balance->paid_amount;
$balance->save();
```

### Generating Receipt Number

```php
private function generateReceiptNumber()
{
    $prefix = 'RCP';
    $year = date('Y');
    
    $lastPayment = FeePayment::whereYear('created_at', $year)
        ->orderBy('id', 'desc')
        ->first();

    $number = $lastPayment ? (int) substr($lastPayment->receipt_number, -6) + 1 : 1;

    return $prefix . '-' . $year . '-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    // Example: RCP-2024-000001
}
```

### Getting Student Balance

```php
$student = Student::find($studentId);
$currentYear = BrandingHelper::academicYear();

$balance = FeeBalance::where('student_id', $student->id)
    ->where('academic_year', $currentYear)
    ->first();

if ($balance) {
    $totalFee = $balance->total_fee;
    $paidAmount = $balance->paid_amount;
    $outstanding = $balance->balance;
    $percentage = ($paidAmount / $totalFee) * 100;
}
```

### Financial Report

```php
$startDate = '2024-01-01';
$endDate = '2024-12-31';

$report = [
    'total_collection' => FeePayment::where('status', 'completed')
        ->whereBetween('payment_date', [$startDate, $endDate])
        ->sum('amount_paid'),
        
    'by_method' => FeePayment::where('status', 'completed')
        ->whereBetween('payment_date', [$startDate, $endDate])
        ->select('payment_method', DB::raw('SUM(amount_paid) as total'))
        ->groupBy('payment_method')
        ->get(),
        
    'by_type' => FeePayment::where('status', 'completed')
        ->whereBetween('payment_date', [$startDate, $endDate])
        ->join('fee_structures', 'fee_payments.fee_structure_id', '=', 'fee_structures.id')
        ->select('fee_structures.fee_type', DB::raw('SUM(fee_payments.amount_paid) as total'))
        ->groupBy('fee_structures.fee_type')
        ->get(),
];
```

### Finding Defaulters

```php
$defaulters = FeeBalance::with(['student.user', 'student.programme'])
    ->where('academic_year', BrandingHelper::academicYear())
    ->where('balance', '>', 0)
    ->orderBy('balance', 'desc')
    ->get();

foreach ($defaulters as $record) {
    $student = $record->student;
    $balance = $record->balance;
    $formatted = BrandingHelper::formatCurrency($balance);
    
    // Send reminder, generate report, etc.
}
```

## Business Rules

### Payment Rules
1. Amount paid must be positive
2. Cannot exceed total fee amount (soft limit, can overpay for next semester)
3. Receipt number must be unique
4. Payment date cannot be in future
5. Transaction reference required for digital payments
6. Only authorized users can collect fees

### Balance Rules
1. One balance record per student per academic year
2. Balance = Total Fee - Paid Amount
3. Balance auto-updates on payment
4. Cannot delete payments once recorded (soft delete only)
5. Negative balance indicates overpayment/credit

### Fee Structure Rules
1. Amount must be positive
2. Cannot delete structure with existing payments
3. Inactive structures not available for new payments
4. Can have multiple structures per programme
5. Year-specific fees override general fees

### Receipt Rules
1. Format: RCP-YYYY-NNNNNN
2. Sequential numbering per year
3. Cannot modify receipt after generation
4. Must include all payment details
5. Digital signature/stamp (to be implemented)

## Receipt Format

### Receipt Information Included
- Receipt Number
- Date and Time
- School Name and Logo
- School Address and Contacts
- Student Details (Name, Admission Number, Programme, Class)
- Fee Details (Type, Amount)
- Payment Details (Method, Reference, Amount Paid)
- Collector Name
- Running Balance
- School Seal/Signature
- Terms and Conditions

### Receipt Template Structure
```
┌────────────────────────────────────────────┐
│  [LOGO]  COMBRIDGE POLYTECHNIC STUDIES     │
│          FEE PAYMENT RECEIPT               │
├────────────────────────────────────────────┤
│  Receipt No: RCP-2024-000001              │
│  Date: 15/01/2024                         │
├────────────────────────────────────────────┤
│  Student: John Doe                        │
│  Admission No: STU2024001                 │
│  Programme: Diploma in IT                 │
│  Class: Year 1A                          │
├────────────────────────────────────────────┤
│  Fee Type: Tuition Fee                   │
│  Amount Paid: UGX 500,000                │
│  Payment Method: Mobile Money            │
│  Reference: MTN-12345678                 │
├────────────────────────────────────────────┤
│  Total Fee: UGX 1,500,000               │
│  Previously Paid: UGX 0                 │
│  Current Payment: UGX 500,000           │
│  Balance: UGX 1,000,000                 │
├────────────────────────────────────────────┤
│  Collected By: Jane Smith                │
│  [Signature]                [School Seal] │
└────────────────────────────────────────────┘
```

## Statistics Available

### Dashboard Statistics
- Total collection (all time)
- Today's collection
- Monthly collection
- Total number of payments
- Outstanding balances
- Fully paid students
- Collection rate percentage

### Payment Method Analysis
- Cash collections
- Bank transfer totals
- Mobile money transactions
- Cheque payments
- Card payments

### Fee Type Analysis
- Tuition fee collections
- Library fee collections
- Lab fee collections
- Other fee types

### Collector Performance
- Collections per staff member
- Number of transactions
- Average transaction amount

### Programme-wise Analysis
- Collections per programme
- Outstanding per programme
- Payment compliance rate

## Currency Formatting

Using BrandingHelper for consistent formatting:

```php
// Format amount
$formatted = BrandingHelper::formatCurrency(500000);
// Output: "500,000 UGX"

// In Blade
@formatCurrency(500000)
// Output: 500,000 UGX
```

## Permissions Required

### Bursar/Finance Officer
- Collect payments
- Generate receipts
- View all payments
- Access financial reports
- Manage fee structures
- View all balances
- Generate statements

### Admin/Principal
- View all financial data
- Approve fee waivers
- Modify fee structures
- Access reports
- Audit payment records

### Accountant
- Record payments
- Generate receipts
- View balances
- Generate reports

### Student
- View own balance
- View payment history
- Download receipts
- Download statement

### Parent/Guardian
- View child's balance
- View payment history
- Make online payments (if enabled)

## Future Enhancements

1. **Online Payment Integration**
   - Mobile money API (MTN, Airtel)
   - Bank payment gateways
   - Card processing
   - Payment confirmation webhooks

2. **Automated Reminders**
   - SMS reminders for due payments
   - Email notifications
   - Push notifications via mobile app

3. **Payment Plans**
   - Installment setup
   - Automatic payment schedules
   - Late payment penalties

4. **Fee Waivers & Scholarships**
   - Scholarship management
   - Fee waiver approvals
   - Discount application

5. **Advanced Reporting**
   - Predictive analytics
   - Collection forecasting
   - Trend analysis
   - Custom report builder

6. **Integration**
   - Accounting software sync
   - Bank reconciliation
   - Tax reporting
   - Audit trail

7. **Bulk Operations**
   - Bulk fee assignment
   - Mass receipt generation
   - Batch statements

8. **Mobile App Features**
   - Mobile payment
   - Receipt viewing
   - Balance checking
   - Payment notifications

## Security Features

### Payment Security
- Transaction logging
- Audit trail
- Payment verification
- Dual authorization for large amounts
- IP address logging
- Device information capture

### Receipt Security
- Unique numbering
- Tamper-proof records
- Digital signatures
- QR code verification
- Watermarks on PDFs

### Data Protection
- Encrypted financial data
- Access control
- Payment method masking
- Secure transaction references

## Testing

### Unit Tests
```bash
php artisan test --filter FeeTest
```

### Test Cases
- Create fee structure
- Record payment
- Generate receipt number
- Calculate balance
- Update balance on payment
- Generate statement
- Financial reports
- Defaulter list
- Payment validation

## Troubleshooting

### Common Issues

**Issue**: Receipt number duplicates
- Solution: Ensure database transaction handling in generateReceiptNumber()

**Issue**: Balance not updating
- Solution: Check FeeBalance updateBalance() method and database constraints

**Issue**: Payment not appearing
- Solution: Verify status is 'completed' and check soft deletes

**Issue**: Report totals incorrect
- Solution: Check date filters and status filtering in queries

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
