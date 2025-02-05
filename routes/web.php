<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeControllers;
use App\Http\Controllers\ProductController;

Route::get('/employees', [EmployeeControllers::class, 'index'])->middleware(['auth', 'verified'])->name('employees.index');
// Route::resource('employee', EmployeeController::class) ->only(['index']);

Route::get('/employees/create', [EmployeeControllers::class, 'create'])->name('employees.create');
// หน้าฟอร์มสำหรับเพิ่มข้อมูลพนักงาน

Route::post('/employees', [EmployeeControllers::class, 'store'])->name('employees.store');
//function สำหรับบันทึกข้อมูลพนักงาน

Route::get('/products', [ProductController::class, 'index'])->name('products.index'); // แสดงรายการสินค้าจาก ProductController
Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
