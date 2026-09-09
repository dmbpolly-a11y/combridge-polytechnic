<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('headOfDepartment')->latest()->paginate(20);
        return view('admin.departments.index', compact('departments'));
    }

    public function create()
    {
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['hod', 'administrator']);
        })->get();
        return view('admin.departments.create', compact('users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments',
            'description' => 'nullable|string',
            'head_of_department_id' => 'nullable|exists:users,id',
        ]);

        Department::create($request->all());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function show(Department $department)
    {
        $department->load('programmes', 'subjects', 'teachers');
        return view('admin.departments.show', compact('department'));
    }

    public function edit(Department $department)
    {
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['hod', 'administrator']);
        })->get();
        return view('admin.departments.edit', compact('department', 'users'));
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code,' . $department->id,
            'description' => 'nullable|string',
            'head_of_department_id' => 'nullable|exists:users,id',
            'status' => 'required|in:active,inactive',
        ]);

        $department->update($request->all());

        return redirect()->route('admin.departments.show', $department)
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return redirect()->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
