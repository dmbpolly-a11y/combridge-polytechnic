# Timetable and Room Allocation System Documentation

## Overview

The Timetable and Room Allocation System provides comprehensive functionality for scheduling classes, managing rooms, detecting conflicts, and generating printable timetables for classes and teachers.

## Features

### 1. Timetable Management
- **Schedule Creation**: Create class schedules
- **Week-based Scheduling**: Monday through Sunday
- **Time Slots**: Flexible start and end times
- **Semester-based**: Different schedules per semester
- **Academic Year Tracking**: Per-year timetables
- **Status Management**: Active/Inactive schedules

### 2. Conflict Detection
- **Class Conflicts**: Prevent double-booking of classes
- **Teacher Conflicts**: Ensure teachers aren't scheduled twice
- **Room Conflicts**: Avoid room double-booking
- **Real-time Validation**: Check conflicts before saving
- **Overlap Detection**: Identify time overlaps

### 3. Room Management
- **Room Inventory**: Complete room catalog
- **Room Types**:
  - Classroom
  - Laboratory
  - Library
  - Auditorium
  - Other
- **Capacity Tracking**: Maximum occupancy per room
- **Facilities Management**: Track room amenities
- **Status Control**: Available, Maintenance, Unavailable

### 4. Timetable Views
- **Class Timetables**: View by class
- **Teacher Timetables**: View by teacher
- **Weekly Calendar**: Week-at-a-glance view
- **Printable Formats**: Print-friendly layouts
- **PDF Export**: (to be implemented)

### 5. Room Utilization
- **Usage Statistics**: Room booking analytics
- **Utilization Percentage**: How often rooms are used
- **Available Slots**: Free time slots
- **Optimization Reports**: Underutilized rooms

### 6. Search and Filtering
- Filter by:
  - Class
  - Teacher
  - Day of week
  - Academic year
  - Semester
  - Room
- Real-time search
- Quick access to specific schedules

## Database Tables

### timetables
```sql
- id
- class_id (FK to classes)
- subject_id (FK to subjects)
- teacher_id (FK to teachers)
- room_id (FK to rooms, nullable)
- day_of_week (enum: monday, tuesday, wednesday, thursday, friday, saturday, sunday)
- start_time (time)
- end_time (time)
- academic_year (string)
- semester (integer)
- status (enum: active, inactive)
- timestamps
```

### rooms
```sql
- id
- name (string)
- room_number (string, unique)
- room_type (enum: classroom, laboratory, library, auditorium, other)
- capacity (integer)
- facilities (text, nullable)
- status (enum: available, maintenance, unavailable)
- timestamps
```

## Controller Methods

### TimetableController

#### Timetable Management
1. **index()** - List all timetable entries with filters
2. **create()** - Show timetable creation form
3. **store()** - Save new timetable entry
4. **edit()** - Show edit form
5. **update()** - Update timetable entry
6. **destroy()** - Delete timetable entry
7. **checkConflicts()** - Detect scheduling conflicts (private)

#### Timetable Views
8. **viewClass()** - Display class timetable
9. **viewTeacher()** - Display teacher timetable
10. **printClass()** - Print-friendly class timetable
11. **printTeacher()** - Print-friendly teacher timetable

#### Room Management
12. **rooms()** - List all rooms
13. **storeRoom()** - Create new room
14. **updateRoom()** - Update room details
15. **destroyRoom()** - Delete room
16. **roomUtilization()** - Room usage analytics

#### AJAX
17. **checkRoomAvailability()** - Check room booking status

## Routes

### Admin Routes (Prefix: /admin/timetables)

```php
// Timetable CRUD
GET    /admin/timetables                           - timetables.index
GET    /admin/timetables/create                    - timetables.create
POST   /admin/timetables                           - timetables.store
GET    /admin/timetables/{timetable}/edit          - timetables.edit
PUT    /admin/timetables/{timetable}               - timetables.update
DELETE /admin/timetables/{timetable}               - timetables.destroy

// View Timetables
GET    /admin/timetables/class/{class}             - timetables.class.view
GET    /admin/timetables/teacher/{teacher}         - timetables.teacher.view

// Print Timetables
GET    /admin/timetables/class/{class}/print       - timetables.class.print
GET    /admin/timetables/teacher/{teacher}/print   - timetables.teacher.print

// Room Management
GET    /admin/timetables/rooms                     - timetables.rooms
POST   /admin/timetables/rooms                     - timetables.rooms.store
PUT    /admin/timetables/rooms/{room}              - timetables.rooms.update
DELETE /admin/timetables/rooms/{room}              - timetables.rooms.destroy

// Room Utilization
GET    /admin/timetables/rooms/utilization         - timetables.rooms.utilization

// AJAX
POST   /admin/timetables/check-room-availability   - timetables.check.room
```

## Models

### Timetable Model

**Relationships:**
- `belongsTo` SchoolClass
- `belongsTo` Subject
- `belongsTo` Teacher
- `belongsTo` Room

**Methods:**
- `hasConflict($params)` - Check for scheduling conflicts
- `isActive()` - Check if schedule is active
- `getFormattedTime()` - Format time display

**Scopes:**
- `active()` - Filter active schedules
- `forClass($classId)` - Filter by class
- `forTeacher($teacherId)` - Filter by teacher
- `forDay($day)` - Filter by day of week
- `forAcademicYear($year)` - Filter by year
- `forSemester($semester)` - Filter by semester

### Room Model

**Relationships:**
- `hasMany` Timetables

**Methods:**
- `isAvailable()` - Check if room is available
- `getCapacity()` - Get room capacity
- `getFacilitiesList()` - Get parsed facilities

**Scopes:**
- `available()` - Filter available rooms
- `byType($type)` - Filter by room type
- `withCapacity($min)` - Filter by minimum capacity

## Usage Examples

### Creating Timetable Entry

```php
// Check for conflicts first
$conflicts = $this->checkConflicts(
    classId: 1,
    teacherId: 5,
    roomId: 10,
    dayOfWeek: 'monday',
    startTime: '08:00',
    endTime: '10:00',
    academicYear: '2024/2025',
    semester: 1
);

if (empty($conflicts)) {
    $timetable = Timetable::create([
        'class_id' => 1,
        'subject_id' => 3,
        'teacher_id' => 5,
        'room_id' => 10,
        'day_of_week' => 'monday',
        'start_time' => '08:00',
        'end_time' => '10:00',
        'academic_year' => '2024/2025',
        'semester' => 1,
        'status' => 'active',
    ]);
}
```

### Conflict Detection Logic

```php
// Check class conflict
$classConflict = Timetable::where('class_id', $classId)
    ->where('day_of_week', $dayOfWeek)
    ->where('academic_year', $academicYear)
    ->where('semester', $semester)
    ->where('status', 'active')
    ->where(function($query) use ($startTime, $endTime) {
        // Time between existing start and end
        $query->whereBetween('start_time', [$startTime, $endTime])
              ->orWhereBetween('end_time', [$startTime, $endTime])
              // Existing time encompasses new time
              ->orWhere(function($q) use ($startTime, $endTime) {
                  $q->where('start_time', '<=', $startTime)
                    ->where('end_time', '>=', $endTime);
              });
    })
    ->exists();
```

### Getting Class Timetable

```php
$class = SchoolClass::find($classId);

$timetables = Timetable::where('class_id', $class->id)
    ->where('academic_year', BrandingHelper::academicYear())
    ->where('status', 'active')
    ->with(['subject', 'teacher.user', 'room'])
    ->orderBy('day_of_week')
    ->orderBy('start_time')
    ->get()
    ->groupBy('day_of_week');

// Group by day for calendar view
$calendar = [];
$days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

foreach ($days as $day) {
    $calendar[$day] = $timetables->get($day, collect());
}
```

### Creating Room

```php
$room = Room::create([
    'name' => 'Computer Lab 1',
    'room_number' => 'LAB-101',
    'room_type' => 'laboratory',
    'capacity' => 40,
    'facilities' => 'Computers, Projector, Air Conditioning, Whiteboard',
    'status' => 'available',
]);
```

### Room Utilization Calculation

```php
$room = Room::find($roomId);

// Calculate total available slots (example: 6 days * 8 hours = 48 slots)
$totalSlots = 6 * 8;

// Count booked slots
$bookedSlots = Timetable::where('room_id', $room->id)
    ->where('academic_year', BrandingHelper::academicYear())
    ->where('status', 'active')
    ->count();

$utilizationPercentage = ($bookedSlots / $totalSlots) * 100;

$availableSlots = $totalSlots - $bookedSlots;
```

### Checking Room Availability (AJAX)

```javascript
// JavaScript example
fetch('/admin/timetables/check-room-availability', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({
        room_id: roomId,
        day_of_week: 'monday',
        start_time: '08:00',
        end_time: '10:00'
    })
})
.then(response => response.json())
.then(data => {
    if (data.available) {
        alert('Room is available!');
    } else {
        alert('Room is booked. Conflicts: ' + data.conflicts.length);
    }
});
```

## Business Rules

### Scheduling Rules
1. End time must be after start time
2. Cannot schedule same class twice at same time
3. Cannot assign teacher to multiple classes simultaneously
4. Cannot double-book rooms
5. Must specify class, subject, teacher, and time
6. Room is optional but recommended
7. One academic year and semester per entry

### Conflict Resolution
1. Check all three conflict types (class, teacher, room)
2. Prevent saving if any conflict exists
3. Show specific conflict details to user
4. Suggest alternative times/rooms
5. Allow override with proper authorization (future)

### Room Rules
1. Room number must be unique
2. Capacity must be positive
3. Cannot delete rooms in active use
4. Maintenance status prevents booking
5. Unavailable status hides from selection

### Time Slot Rules
1. Standard periods (e.g., 8:00-9:00, 9:00-10:00)
2. Break times not scheduled
3. Lunch break consideration
4. No night classes (optional rule)
5. Weekend classes optional

## Timetable Layout Example

### Class Timetable Format

```
Class: Year 1A - Diploma in IT
Academic Year: 2024/2025 | Semester: 1

┌─────────┬──────────────────────────────────────────────────────┐
│ Time    │ Monday    Tuesday   Wednesday Thursday  Friday       │
├─────────┼──────────────────────────────────────────────────────┤
│ 08:00   │ Math      English   Physics   Chemistry Programming │
│ - 10:00 │ R-101     R-102     LAB-A     LAB-B    COMP-1       │
│         │ Mr. Doe   Ms. Jane  Dr. Sam   Dr. Kim  Mr. Tech     │
├─────────┼──────────────────────────────────────────────────────┤
│ 10:00   │ BREAK     BREAK     BREAK     BREAK    BREAK        │
│ - 10:15 │           │
├─────────┼──────────────────────────────────────────────────────┤
│ 10:15   │ Database  Networks  Web Dev   Systems  Project      │
│ - 12:15 │ COMP-2    COMP-3    COMP-1    R-105    LAB-C        │
│         │ Dr. DB    Mr. Net   Ms. Web   Dr. OS   Prof. PM     │
└─────────┴──────────────────────────────────────────────────────┘
```

### Teacher Timetable Format

```
Teacher: Mr. John Doe (Mathematics Department)
Academic Year: 2024/2025 | Semester: 1

┌─────────┬────────────────────────────────────────────┐
│ Time    │ Classes Assigned                           │
├─────────┼────────────────────────────────────────────┤
│ Monday  │                                            │
│ 08:00   │ Year 1A - Mathematics - Room 101          │
│ 10:00   │ Year 2B - Statistics - Room 103           │
│ 14:00   │ Year 1C - Mathematics - Room 105          │
├─────────┼────────────────────────────────────────────┤
│ Tuesday │                                            │
│ 08:00   │ Year 3A - Calculus - Room 201             │
│ 10:00   │ Year 1A - Mathematics - Room 101          │
└─────────┴────────────────────────────────────────────┘
```

## Statistics Available

### Timetable Statistics
- Total schedule entries
- Entries per class
- Entries per teacher
- Entries per day
- Entries per semester

### Room Statistics
- Total rooms
- Available rooms
- Rooms in maintenance
- Total capacity
- Average capacity
- Rooms by type

### Utilization Statistics
- Room utilization percentage
- Most/least used rooms
- Peak usage times
- Available time slots
- Teacher workload distribution

## Permissions Required

### Admin/Principal
- Create/modify all timetables
- Manage rooms
- Override conflicts
- View all schedules
- Generate reports

### Academic Dean/HOD
- Create timetables for department
- View department schedules
- Suggest room changes
- Monitor conflicts

### Teacher
- View own timetable
- Request timetable changes
- View class schedules they teach

### Student
- View class timetable
- Download/print timetable
- Receive timetable updates

## Future Enhancements

1. **Automated Scheduling**
   - AI-powered timetable generation
   - Optimization algorithms
   - Constraint satisfaction
   - Load balancing

2. **Interactive Calendar**
   - Drag-and-drop scheduling
   - Visual conflict indicators
   - Color-coded subjects
   - Quick rescheduling

3. **Mobile Integration**
   - Mobile app access
   - Push notifications for changes
   - Offline timetable viewing
   - Location-based reminders

4. **Advanced Analytics**
   - Teacher workload analysis
   - Room optimization recommendations
   - Historical trends
   - Predictive scheduling

5. **Integration**
   - Sync with Google Calendar
   - Export to iCal
   - SMS notifications
   - Email updates

6. **Room Booking System**
   - Ad-hoc room reservations
   - Meeting room booking
   - Equipment reservations
   - QR code room check-in

7. **Attendance Integration**
   - Link with attendance system
   - Automatic attendance sessions
   - Class change notifications

## Testing

### Unit Tests
```bash
php artisan test --filter TimetableTest
```

### Test Cases
- Create timetable entry
- Detect class conflict
- Detect teacher conflict
- Detect room conflict
- View class timetable
- View teacher timetable
- Create room
- Calculate utilization
- Check room availability

## Troubleshooting

### Common Issues

**Issue**: Conflicts not detected
- Solution: Verify time comparison logic and database time format

**Issue**: Wrong day grouping
- Solution: Check day_of_week enum values and groupBy key

**Issue**: Room shows as unavailable incorrectly
- Solution: Check room status and active timetable count

**Issue**: Print layout broken
- Solution: Verify CSS print media queries

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
