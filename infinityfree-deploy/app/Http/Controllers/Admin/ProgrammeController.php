<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use App\Models\Department;
use App\Models\Subject;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
{
    public function index()
    {
        $programmes = Programme::with('department')->latest()->paginate(20);
        return view('admin.programmes.index', compact('programmes'));
    }

    public function create()
    {
        $departments = Department::active()->get();
        return view('admin.programmes.create', compact('departments'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:programmes',
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
            'duration_years' => 'required|integer|min:1|max:10',
            'level' => 'required|in:certificate,diploma,degree,masters,phd',
            'tuition_fee' => 'required|numeric|min:0',
        ]);

        Programme::create($request->all());

        return redirect()->route('admin.programmes.index')
            ->with('success', 'Programme created successfully.');
    }

    public function show(Programme $programme)
    {
        $programme->load('department', 'subjects', 'classes', 'students');
        return view('admin.programmes.show', compact('programme'));
    }

    public function edit(Programme $programme)
    {
        $departments = Department::active()->get();
        $subjects = Subject::active()->get();
        return view('admin.programmes.edit', compact('programme', 'departments', 'subjects'));
    }

    public function update(Request $request, Programme $programme)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:programmes,code,' . $programme->id,
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
            'duration_years' => 'required|integer|min:1|max:10',
            'level' => 'required|in:certificate,diploma,degree,masters,phd',
            'tuition_fee' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        $programme->update($request->all());

        return redirect()->route('admin.programmes.show', $programme)
            ->with('success', 'Programme updated successfully.');
    }

    public function destroy(Programme $programme)
    {
        $programme->delete();
        return redirect()->route('admin.programmes.index')
            ->with('success', 'Programme deleted successfully.');
    }

    /**
     * Manage programme subjects.
     */
    public function manageSubjects(Programme $programme)
    {
        $subjects = Subject::active()->get();
        $programmeSubjects = $programme->subjects;

        return view('admin.programmes.subjects', compact('programme', 'subjects', 'programmeSubjects'));
    }

    /**
     * Update programme subjects.
     */
    public function updateSubjects(Request $request, Programme $programme)
    {
        $request->validate([
            'subjects' => 'required|array',
            'subjects.*.subject_id' => 'required|exists:subjects,id',
            'subjects.*.year' => 'required|integer|min:1',
            'subjects.*.semester' => 'required|integer|in:1,2',
            'subjects.*.is_required' => 'boolean',
        ]);

        $syncData = [];
        foreach ($request->subjects as $subject) {
            $syncData[$subject['subject_id']] = [
                'year' => $subject['year'],
                'semester' => $subject['semester'],
                'is_required' => $subject['is_required'] ?? true,
            ];
        }

        $programme->subjects()->sync($syncData);

        return redirect()->route('admin.programmes.show', $programme)
            ->with('success', 'Programme subjects updated successfully.');
    }
}
