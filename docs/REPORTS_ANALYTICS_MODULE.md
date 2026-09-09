# Reports & Analytics System Documentation

## Overview

The Reports & Analytics System provides comprehensive reporting capabilities across all modules of the school management system, enabling data-driven decision making and strategic planning.

---

## Report Categories

### 1. Academic Reports

#### Student Performance Report
- **Purpose**: Analyze individual student academic achievement
- **Data Points**:
  - Total marks obtained
  - Maximum marks possible
  - Percentage score
  - GPA calculation
  - Letter grade
  - Subject count
- **Filters**: Academic year, semester, programme
- **Sorting**: By percentage (highest first)
- **Use Cases**: Merit list, performance tracking, academic counseling

#### Class Results Analysis
- **Purpose**: Compare class-wise performance
- **Data Points**:
  - Class average percentage
  - Class average GPA
  - Student count
  - Total exams taken
- **Filters**: Academic year
- **Use Cases**: Programme evaluation, resource allocation

#### Subject Performance
- **Purpose**: Identify difficult subjects and pass rates
- **Data Points**:
  - Subject-wise pass rates
  - Average marks per subject
  - Grade distribution
- **Filters**: Academic year, semester
- **Use Cases**: Curriculum improvement, teacher support

#### Enrollment Report
- **Purpose**: Track student enrollment by programme
- **Data Points**:
  - Programme-wise enrollment
  - Enrollment trends
  - Programme popularity
- **Filters**: Academic year
- **Use Cases**: Capacity planning, marketing strategies

### 2. Attendance Reports

#### Student Attendance Report
- **Purpose**: Monitor student attendance patterns
- **Data Points**:
  - Total attendance days
  - Present days count
  - Absent days count
  - Late arrivals
  - Attendance percentage
- **Filters**: Date range, class
- **Use Cases**: Early intervention, parent communication

#### Teacher Attendance Report
- **Purpose**: Track staff attendance
- **Data Points**:
  - Working days
  - Present days
  - Absent days
  - Late arrivals
  - Attendance percentage
- **Filters**: Date range, department
- **Use Cases**: HR management, payroll processing

#### Class Attendance Summary
- **Purpose**: Class-level attendance overview
- **Data Points**:
  - Class attendance rate
  - Daily attendance patterns
  - Best/worst performing classes
- **Use Cases**: Class monitoring, intervention planning

#### Absenteeism Report
- **Purpose**: Identify chronic absenteeism
- **Data Points**:
  - Students with low attendance
  - Absence patterns
  - Duration of absences
- **Filters**: Minimum threshold
- **Use Cases**: Student support, dropout prevention

### 3. Financial Reports

#### Fee Collection Report
- **Purpose**: Track revenue collection
- **Data Points**:
  - Total amount collected
  - Payment method breakdown
  - Daily collection trends
  - Receipt count
- **Filters**: Date range
- **Use Cases**: Financial planning, cash flow management

#### Defaulters Report
- **Purpose**: Identify students with outstanding fees
- **Data Points**:
  - Student details
  - Outstanding balance
  - Aging analysis
  - Contact information
- **Filters**: Minimum balance
- **Sorting**: By balance amount (highest first)
- **Use Cases**: Collection follow-up, financial aid identification

#### Payment Method Analysis
- **Purpose**: Analyze preferred payment channels
- **Data Points**:
  - Payment method distribution
  - Success rates per method
  - Transaction volumes
- **Use Cases**: Payment gateway optimization

#### Revenue Forecast
- **Purpose**: Project future revenue
- **Data Points**:
  - Historical trends
  - Expected enrollment
  - Fee structure changes
- **Use Cases**: Budget planning, financial strategy

### 4. Operational Reports

#### Library Usage Report
- **Purpose**: Monitor library circulation
- **Data Points**:
  - Total book issues
  - Books returned
  - Overdue books
  - Return rate
  - Popular books
- **Filters**: Date range
- **Use Cases**: Book procurement, library policies

#### Timetable Utilization
- **Purpose**: Analyze resource utilization
- **Data Points**:
  - Teacher workload (schedules count)
  - Room utilization rates
  - Free periods analysis
- **Use Cases**: Load balancing, hiring decisions

#### Programme Enrollment
- **Purpose**: Track programme popularity
- **Data Points**:
  - Enrollment per programme
  - Capacity utilization
  - Growth trends
- **Use Cases**: Programme development, marketing

#### System Usage Report
- **Purpose**: Monitor platform usage
- **Data Points**:
  - Active users
  - Login frequency
  - Feature utilization
- **Use Cases**: Training needs, system improvements

---

## Controller Methods

### ReportController

#### Report Overview
1. `index()` - Reports dashboard with all categories

#### Academic Reports (4 methods)
2. `studentPerformance()` - Individual student performance analysis
3. `classResults()` - Class-wise results comparison
4. `subjectPerformance()` - Subject difficulty analysis
5. `enrollment()` - Programme enrollment tracking

#### Attendance Reports (4 methods)
6. `studentAttendance()` - Student attendance analysis
7. `teacherAttendance()` - Staff attendance tracking
8. `classAttendance()` - Class attendance summary
9. `absenteeism()` - Chronic absenteeism report

#### Financial Reports (4 methods)
10. `feeCollection()` - Revenue collection report
11. `defaulters()` - Outstanding fees report
12. `paymentMethods()` - Payment channel analysis
13. `revenueForecast()` - Financial projections

#### Operational Reports (4 methods)
14. `libraryUsage()` - Library circulation report
15. `timetableUtilization()` - Resource utilization
16. `programmeEnrollment()` - Programme analysis
17. `systemUsage()` - Platform usage statistics

#### Export Functions (2 methods)
18. `exportPDF()` - Export report to PDF
19. `exportExcel()` - Export report to Excel

---

## Routes

### Admin Routes (Prefix: /admin/reports)

```php
// Reports Overview
GET    /admin/reports                              - admin.reports

// Academic Reports
GET    /admin/reports/student-performance          - admin.reports.student-performance
GET    /admin/reports/class-results                - admin.reports.class-results
GET    /admin/reports/enrollment                   - admin.reports.enrollment

// Attendance Reports
GET    /admin/reports/student-attendance           - admin.reports.student-attendance
GET    /admin/reports/teacher-attendance           - admin.reports.teacher-attendance

// Financial Reports
GET    /admin/reports/fee-collection               - admin.reports.fee-collection
GET    /admin/reports/defaulters                   - admin.reports.defaulters

// Operational Reports
GET    /admin/reports/library-usage                - admin.reports.library-usage
GET    /admin/reports/timetable-utilization        - admin.reports.timetable-utilization

// Export
POST   /admin/reports/export/pdf                   - admin.reports.export.pdf
POST   /admin/reports/export/excel                 - admin.reports.export.excel
```

---

## Data Analysis Examples

### Student Performance Calculation

```php
// Get all results for a student
$results = ExamResult::where('student_id', $studentId)
    ->whereHas('examination', function($q) {
        $q->where('academic_year', BrandingHelper::academicYear());
    })
    ->get();

// Calculate total performance
$totalMarks = $results->sum('marks_obtained');
$totalMaxMarks = $results->sum('max_marks');
$percentage = ($totalMarks / $totalMaxMarks) * 100;
$gpa = BrandingHelper::calculateGPA($percentage);
$grade = BrandingHelper::getGrade($percentage);
```

### Attendance Rate Calculation

```php
// Get attendance records
$attendanceRecords = StudentAttendance::where('student_id', $studentId)
    ->whereBetween('date', [$startDate, $endDate])
    ->get();

// Calculate rates
$totalDays = $attendanceRecords->count();
$presentDays = $attendanceRecords->whereIn('status', ['present', 'late'])->count();
$attendancePercentage = ($presentDays / $totalDays) * 100;
```

### Fee Collection Summary

```php
// Get payments for period
$payments = FeePayment::whereBetween('payment_date', [$startDate, $endDate])
    ->get();

// Group by payment method
$byMethod = $payments->groupBy('payment_method');
foreach ($byMethod as $method => $methodPayments) {
    $amount = $methodPayments->sum('amount_paid');
    $count = $methodPayments->count();
}

// Daily collections
$dailyCollections = $payments->groupBy(function($payment) {
    return Carbon::parse($payment->payment_date)->format('Y-m-d');
});
```

### Library Statistics

```php
// Get book issues
$bookIssues = BookIssue::whereBetween('issue_date', [$startDate, $endDate])
    ->get();

// Calculate metrics
$totalIssues = $bookIssues->count();
$returned = $bookIssues->where('status', 'returned')->count();
$returnRate = ($returned / $totalIssues) * 100;

// Popular books
$popularBooks = $bookIssues->groupBy('book_id')
    ->map(function($issues) {
        return [
            'book' => $issues->first()->book,
            'count' => $issues->count(),
        ];
    })
    ->sortByDesc('count')
    ->take(10);
```

---

## Visualization Recommendations

### Charts to Implement

#### Academic Analytics
- **Bar Chart**: Class-wise average performance
- **Line Graph**: Performance trends over time
- **Pie Chart**: Grade distribution
- **Scatter Plot**: Marks vs attendance correlation

#### Attendance Analytics
- **Line Graph**: Daily attendance trends
- **Heat Map**: Attendance by day of week
- **Bar Chart**: Attendance by class
- **Gauge**: Overall attendance percentage

#### Financial Analytics
- **Line Graph**: Daily collection trends
- **Pie Chart**: Payment method distribution
- **Bar Chart**: Monthly revenue comparison
- **Area Chart**: Revenue forecast

#### Operational Analytics
- **Bar Chart**: Teacher workload distribution
- **Pie Chart**: Programme enrollment
- **Line Graph**: Library circulation trends
- **Donut Chart**: Room utilization

### Chart Libraries
- **Chart.js** - Recommended for web
- **ApexCharts** - Advanced interactive charts
- **Google Charts** - Simple and quick
- **D3.js** - Complex custom visualizations

---

## Export Formats

### PDF Export

**Use Cases:**
- Official reports for management
- Printable documents
- Archival purposes

**Implementation:**
```php
use Barryvdh\DomPDF\Facade\Pdf;

public function exportPDF($reportData)
{
    $pdf = PDF::loadView('admin.reports.pdf-template', [
        'data' => $reportData,
        'generated_at' => now(),
    ]);
    
    return $pdf->download('report-' . date('Y-m-d') . '.pdf');
}
```

### Excel Export

**Use Cases:**
- Data analysis in Excel
- Further processing
- Data sharing

**Implementation:**
```php
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;

public function exportExcel($reportData)
{
    return Excel::download(
        new ReportExport($reportData),
        'report-' . date('Y-m-d') . '.xlsx'
    );
}
```

### CSV Export

**Use Cases:**
- Data import to other systems
- Simple data exchange
- Lightweight format

**Implementation:**
```php
public function exportCSV($reportData)
{
    $filename = 'report-' . date('Y-m-d') . '.csv';
    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => 'attachment; filename="' . $filename . '"',
    ];

    $callback = function() use ($reportData) {
        $file = fopen('php://output', 'w');
        fputcsv($file, array_keys($reportData[0])); // Header
        foreach ($reportData as $row) {
            fputcsv($file, $row);
        }
        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}
```

---

## Key Performance Indicators (KPIs)

### Academic KPIs
- **Overall Pass Rate**: % of students passing exams
- **Average GPA**: School-wide GPA
- **Subject Pass Rates**: Per-subject success rates
- **Improvement Rate**: Year-over-year growth

### Attendance KPIs
- **Student Attendance Rate**: Target >85%
- **Teacher Attendance Rate**: Target >95%
- **Chronic Absenteeism**: Students <75% attendance
- **Punctuality Rate**: On-time arrivals

### Financial KPIs
- **Collection Rate**: % of fees collected
- **Default Rate**: % of outstanding fees
- **Collection Efficiency**: Days to collect
- **Revenue Growth**: YoY revenue increase

### Operational KPIs
- **Library Circulation Rate**: Books issued per student
- **Room Utilization**: % of time rooms used
- **Teacher Workload**: Average classes per teacher
- **System Adoption**: % of active users

---

## Automated Reporting

### Scheduled Reports

```php
// In Laravel Scheduler (app/Console/Kernel.php)
protected function schedule(Schedule $schedule)
{
    // Daily reports
    $schedule->call(function () {
        // Generate daily attendance report
        Mail::to('admin@school.com')
            ->send(new DailyAttendanceReport());
    })->dailyAt('18:00');

    // Weekly reports
    $schedule->call(function () {
        // Generate weekly performance report
        Mail::to('principal@school.com')
            ->send(new WeeklyPerformanceReport());
    })->weeklyOn(5, '17:00'); // Friday 5 PM

    // Monthly reports
    $schedule->call(function () {
        // Generate monthly financial report
        Mail::to('bursar@school.com')
            ->send(new MonthlyFinancialReport());
    })->monthlyOn(1, '08:00'); // 1st day of month
}
```

### Email Reports

```php
// Mailable class example
class DailyAttendanceReport extends Mailable
{
    public function build()
    {
        $attendanceData = $this->getAttendanceData();
        
        return $this->view('emails.reports.daily-attendance')
            ->with(['data' => $attendanceData])
            ->subject('Daily Attendance Report - ' . date('Y-m-d'));
    }
}
```

---

## Dashboard Integration

### Real-Time Analytics

```javascript
// Fetch live statistics
function updateDashboard() {
    fetch('/admin/quick-stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('students-present').innerText = data.students_present;
            document.getElementById('teachers-present').innerText = data.teachers_present;
            document.getElementById('payments-today').innerText = data.payments_today;
        });
}

// Update every 30 seconds
setInterval(updateDashboard, 30000);
```

### Chart.js Integration

```javascript
// Revenue trend chart
const ctx = document.getElementById('revenueChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: monthLabels,
        datasets: [{
            label: 'Revenue',
            data: revenueData,
            borderColor: '#0C5C3E',
            backgroundColor: 'rgba(12, 92, 62, 0.1)',
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Revenue Trend'
            }
        }
    }
});
```

---

## Security & Access Control

### Report Permissions

```php
// Only specific roles can access reports
Route::middleware(['auth', 'role:administrator,principal,bursar'])
    ->group(function () {
        Route::get('/reports/financial', [ReportController::class, 'financial']);
    });

// Permission-based access
Route::middleware(['auth', 'permission:view_financial_reports'])
    ->group(function () {
        Route::get('/reports/revenue', [ReportController::class, 'revenue']);
    });
```

### Data Privacy

- Mask sensitive information in reports
- Restrict access to personal data
- Audit log for report access
- Secure download links with expiration

---

## Future Enhancements

### Advanced Analytics
1. **Predictive Analytics**: ML models for dropout prediction
2. **Trend Analysis**: Long-term performance trends
3. **Comparative Analysis**: Benchmarking against other institutions
4. **Custom Reports**: User-defined report builder

### Interactive Dashboards
1. **Drill-Down**: Click to see detailed data
2. **Filters**: Dynamic filtering
3. **Real-Time**: Live data updates
4. **Customization**: User-configurable layouts

### Business Intelligence
1. **Data Warehouse**: Centralized data repository
2. **OLAP Cubes**: Multi-dimensional analysis
3. **Data Mining**: Pattern discovery
4. **ETL Processes**: Data transformation pipelines

---

## Testing Reports

### Manual Testing

1. **Data Accuracy**: Verify calculations
2. **Filter Functionality**: Test all filter options
3. **Export Features**: Test PDF/Excel exports
4. **Performance**: Load time for large datasets
5. **Visualization**: Chart rendering

### Automated Testing

```php
public function test_student_performance_report()
{
    $admin = User::factory()->create();
    $admin->assignRole('administrator');

    $response = $this->actingAs($admin)
        ->get('/admin/reports/student-performance');

    $response->assertStatus(200);
    $response->assertViewHas('studentData');
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Report generation timeout
- **Solution**: Implement pagination, use queue for large reports

**Issue**: Incorrect calculations
- **Solution**: Verify data integrity, check calculation logic

**Issue**: Charts not displaying
- **Solution**: Check JavaScript console, verify Chart.js loaded

**Issue**: Export fails
- **Solution**: Check file permissions, verify PDF/Excel library installed

---

**Module Status**: ✅ Completed  
**Last Updated**: 2024  
**Maintained By**: Combridge Centre for Polytechnic Studies
