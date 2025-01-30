<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

use function Illuminate\Events\queueable;

class EmployeeControllers extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search', '');
        $filterBy = $request->input('filterBy', 'first_name');

        $employees = DB::table('employees')
            ->join('dept_emp', 'employees.emp_no', '=', 'dept_emp.emp_no')
            ->join('departments', 'dept_emp.dept_no', '=', 'departments.dept_no')
            ->when($query, function ($queryBuilder, $query) use ($filterBy) {
                $queryBuilder->where("employees.{$filterBy}", 'like', "%{$query}%");
            })
            ->select(
                'employees.emp_no',
                'employees.first_name',
                'employees.last_name',
                'employees.gender',
                'employees.birth_date',
                'departments.dept_name',
                'employees.image_path'
            )
            ->orderBy('employees.emp_no') // เรียงตาม emp_no โดยข้อมูลใหม่อยู่ด้านบน
            ->paginate(10);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'query' => $query,
            'filterBy' => $filterBy,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        return Inertia::render('Employees/Create', ['departments' => $departments]);
    }
    public function store(Request $request)
    {
        // รับข้อมูลจากฟอร์ม พร้อมตรวจสอบความถูกต้อง
        $validated = $request->validate([
            "birth_date" => "required|date",
            "first_name" => "required|string|max:255",
            "last_name"  => "required|string|max:255",
            'gender' => 'required|in:M,F',
            "hire_date"  => "required|date",
            "dept_no" => "required|exists:departments,dept_no",
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        try {
            // ใช้ Database Transaction เพื่อความปลอดภัย
            DB::transaction(function () use ($validated, $request) {
                // 1. หาค่า emp_no ล่าสุด
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
                $newEmpNo = $latestEmpNo + 1; // เพิ่มค่า emp_no ทีละ 1

                Log::info("New Employee Number: " . $newEmpNo);

                if ($request->hasFile('photo')) {
                    $photoPath = $request->file('photo')->store('employee_photos', 'public');
                } else {
                    $photoPath = null;
                }

                // 2. เพิ่มข้อมูลลงในฐานข้อมูลอย่างถูกต้อง
                DB::table("employees")->insert([
                    "emp_no"     => $newEmpNo,
                    "first_name" => $validated['first_name'],
                    "last_name"  => $validated['last_name'],
                    "gender"     => $validated['gender'],
                    "birth_date" => $validated['birth_date'],
                    "hire_date"  => $validated['hire_date'],
                    'image_path' => $photoPath,
                ]);

                // 3. เพิ่มข้อมูลลงในตาราง dept_emp
                DB::table("dept_emp")->insert([
                    "emp_no" => $newEmpNo,
                    "dept_no" => $validated['dept_no'],
                    "from_date" => now(),
                    "to_date" => '9999-01-01',

                ]);
            });

            // ส่งข้อความตอบกลับเมื่อสำเร็จ
            return redirect()->route('employees.index')
                ->with('success', 'Employee created successfully.');
        } catch (\Exception $e) {
            Log::error('Employee creation failed: ' . $e->getMessage());

            // ส่งข้อความตอบกลับเมื่อไม่สำเร็จ
            return Redirect::back()->withErrors(['error' => 'An error occurred while creating employee. Please try again.'])
                                ->withInput(); // คืนค่าข้อมูลที่กรอกไว้
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
