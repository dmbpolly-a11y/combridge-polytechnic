<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use App\Models\Room;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TimetableController extends Controller
{
    /**
     * Display timetable overview
     */
    public function index(Request $request)
    {
        $query = Timetable::with(['class', 'subject', 'teacher.user', 'room']);

        // Filters
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->filled('day_of_week')) {
            $query->where('day_of_week', $request->day_of_week);
        }

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        } else {
            $query->where('academic_year', BrandingHelper::academicYear());
        }

        $timetables = $query->orderBy('day_of_week')
            ->orderBy('start_time')
            ->paginate(50);

        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $teachers = Teacher::with('user')->where('teacher_status', 'active')->get();

        $stats = [
            'total_schedules' => Timetable::where('status', 'active')->count(),
            'active_classes' => SchoolClass::where('status', 'active')->count(),
            'total_rooms' => Room::where('status', 'available')->count(),
        ];

        return view('admin.timetables.index', compact('timetables', 'classes', 'teachers', 'stats'));
    }

    /**
     * Show timetable creation form
     */
    public function create()
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        $teachers = Teacher::with('user')->where('teacher_status', 'active')->get();
        $rooms = Room::where('status', 'available')->orderBy('name')->get();

        return view('admin.timetables.create', compact('classes', 'subjects', 'teachers', 'rooms'));
    }

    /**
     * Store new timetable entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'nullable|exists:rooms,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'semester' => 'required|integer|in:1,2,3',
        ]);

        // Check for conflicts
        $conflicts = $this->checkConflicts(
            $validated['class_id'],
            $validated['teacher_id'],
            $validated['room_id'],
            $validated['day_of_week'],
            $validated['start_time'],
            $validated['end_time'],
            BrandingHelper::academicYear(),
            $validated['semester']
        );

        if (!empty($conflicts)) {
            return redirect()->back()
                ->with('error', 'Scheduling conflict detected: ' . implode(', ', $conflicts))
                ->withInput();
        }

        $validated['academic_year'] = BrandingHelper::academicYear();
        $validated['status'] = 'active';

        Timetable::create($validated);

        return redirect()->route('admin.timetables.index')
            ->with('success', 'Timetable entry created successfully.');
    }

    /**
     * Show timetable edit form
     */
    public function edit(Timetable $timetable)
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        $teachers = Teacher::with('user')->where('teacher_status', 'active')->get();
        $rooms = Room::where('status', 'available')->orderBy('name')->get();

        return view('admin.timetables.edit', compact('timetable', 'classes', 'subjects', 'teachers', 'rooms'));
    }

    /**
     * Update timetable entry
     */
    public function update(Request $request, Timetable $timetable)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'nullable|exists:rooms,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'semester' => 'required|integer|in:1,2,3',
            'status' => 'required|in:active,inactive',
        ]);

        // Check for conflicts (excluding current timetable)
        $conflicts = $this->checkConflicts(
            $validated['class_id'],
            $validated['teacher_id'],
            $validated['room_id'],
            $validated['day_of_week'],
            $validated['start_time'],
            $validated['end_time'],
            $timetable->academic_year,
            $validated['semester'],
            $timetable->id
        );

        if (!empty($conflicts)) {
            return redirect()->back()
                ->with('error', 'Scheduling conflict detected: ' . implode(', ', $conflicts))
                ->withInput();
        }

        $timetable->update($validated);

        return redirect()->route('admin.timetables.index')
            ->with('success', 'Timetable entry updated successfully.');
    }

    /**
     * Delete timetable entry
     */
    public function destroy(Timetable $timetable)
    {
        $timetable->delete();

        return redirect()->route('admin.timetables.index')
            ->with('success', 'Timetable entry deleted successfully.');
    }

    /**
     * Check for scheduling conflicts
     */
    private function checkConflicts($classId, $teacherId, $roomId, $dayOfWeek, $startTime, $endTime, $academicYear, $semester, $excludeId = null)
    {
        $conflicts = [];

        // Check class conflict
        $classConflict = Timetable::where('class_id', $classId)
            ->where('day_of_week', $dayOfWeek)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('status', 'active')
            ->where(function($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function($q) use ($startTime, $endTime) {
                          $q->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                      });
            });

        if ($excludeId) {
            $classConflict->where('id', '!=', $excludeId);
        }

        if ($classConflict->exists()) {
            $conflicts[] = 'Class already has a session at this time';
        }

        // Check teacher conflict
        $teacherConflict = Timetable::where('teacher_id', $teacherId)
            ->where('day_of_week', $dayOfWeek)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('status', 'active')
            ->where(function($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function($q) use ($startTime, $endTime) {
                          $q->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                      });
            });

        if ($excludeId) {
            $teacherConflict->where('id', '!=', $excludeId);
        }

        if ($teacherConflict->exists()) {
            $conflicts[] = 'Teacher already assigned to another class at this time';
        }

        // Check room conflict (if room specified)
        if ($roomId) {
            $roomConflict = Timetable::where('room_id', $roomId)
                ->where('day_of_week', $dayOfWeek)
                ->where('academic_year', $academicYear)
                ->where('semester', $semester)
                ->where('status', 'active')
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('start_time', [$startTime, $endTime])
                          ->orWhereBetween('end_time', [$startTime, $endTime])
                          ->orWhere(function($q) use ($startTime, $endTime) {
                              $q->where('start_time', '<=', $startTime)
                                ->where('end_time', '>=', $endTime);
                          });
                });

            if ($excludeId) {
                $roomConflict->where('id', '!=', $excludeId);
            }

            if ($roomConflict->exists()) {
                $conflicts[] = 'Room already booked at this time';
            }
        }

        return $conflicts;
    }

    /**
     * View class timetable
     */
    public function viewClass(SchoolClass $class)
    {
        $class->load(['programme']);
        
        $timetables = Timetable::where('class_id', $class->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['subject', 'teacher.user', 'room'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return view('admin.timetables.view-class', compact('class', 'timetables', 'days'));
    }

    /**
     * View teacher timetable
     */
    public function viewTeacher(Teacher $teacher)
    {
        $teacher->load(['user', 'department']);
        
        $timetables = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['class', 'subject', 'room'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return view('admin.timetables.view-teacher', compact('teacher', 'timetables', 'days'));
    }

    /**
     * Print class timetable
     */
    public function printClass(SchoolClass $class)
    {
        $timetables = Timetable::where('class_id', $class->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['subject', 'teacher.user', 'room'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return view('admin.timetables.print-class', compact('class', 'timetables', 'days'));
    }

    /**
     * Print teacher timetable
     */
    public function printTeacher(Teacher $teacher)
    {
        $timetables = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['class', 'subject', 'room'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return view('admin.timetables.print-teacher', compact('teacher', 'timetables', 'days'));
    }

    /**
     * Room Management - List all rooms
     */
    public function rooms()
    {
        $rooms = Room::orderBy('name')->paginate(20);

        $stats = [
            'total_rooms' => Room::count(),
            'available' => Room::where('status', 'available')->count(),
            'maintenance' => Room::where('status', 'maintenance')->count(),
            'total_capacity' => Room::sum('capacity'),
        ];

        return view('admin.timetables.rooms', compact('rooms', 'stats'));
    }

    /**
     * Store new room
     */
    public function storeRoom(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_number' => 'required|string|unique:rooms,room_number',
            'room_type' => 'required|in:classroom,laboratory,library,auditorium,other',
            'capacity' => 'required|integer|min:1',
            'facilities' => 'nullable|string',
        ]);

        $validated['status'] = 'available';

        Room::create($validated);

        return redirect()->route('admin.timetables.rooms')
            ->with('success', 'Room created successfully.');
    }

    /**
     * Update room
     */
    public function updateRoom(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_number' => 'required|string|unique:rooms,room_number,' . $room->id,
            'room_type' => 'required|in:classroom,laboratory,library,auditorium,other',
            'capacity' => 'required|integer|min:1',
            'facilities' => 'nullable|string',
            'status' => 'required|in:available,maintenance,unavailable',
        ]);

        $room->update($validated);

        return redirect()->route('admin.timetables.rooms')
            ->with('success', 'Room updated successfully.');
    }

    /**
     * Delete room
     */
    public function destroyRoom(Room $room)
    {
        // Check if room is in use
        if ($room->timetables()->where('status', 'active')->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete room that is currently in use.');
        }

        $room->delete();

        return redirect()->route('admin.timetables.rooms')
            ->with('success', 'Room deleted successfully.');
    }

    /**
     * Room utilization report
     */
    public function roomUtilization()
    {
        $rooms = Room::where('status', 'available')->get();
        
        $utilizationData = [];
        $academicYear = BrandingHelper::academicYear();

        foreach ($rooms as $room) {
            $totalSlots = 6 * 5; // 6 days * 5 periods per day (example)
            $bookedSlots = Timetable::where('room_id', $room->id)
                ->where('academic_year', $academicYear)
                ->where('status', 'active')
                ->count();

            $utilizationPercentage = $totalSlots > 0 ? round(($bookedSlots / $totalSlots) * 100, 2) : 0;

            $utilizationData[] = [
                'room' => $room,
                'total_slots' => $totalSlots,
                'booked_slots' => $bookedSlots,
                'available_slots' => $totalSlots - $bookedSlots,
                'utilization_percentage' => $utilizationPercentage,
            ];
        }

        // Sort by utilization percentage
        usort($utilizationData, function($a, $b) {
            return $b['utilization_percentage'] <=> $a['utilization_percentage'];
        });

        return view('admin.timetables.room-utilization', compact('utilizationData'));
    }

    /**
     * Check room availability (AJAX)
     */
    public function checkRoomAvailability(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $conflicts = Timetable::where('room_id', $request->room_id)
            ->where('day_of_week', $request->day_of_week)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->where(function($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
            })
            ->with(['class', 'subject'])
            ->get();

        return response()->json([
            'available' => $conflicts->isEmpty(),
            'conflicts' => $conflicts,
        ]);
    }
}
