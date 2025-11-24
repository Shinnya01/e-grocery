<?php

use Inertia\Inertia;
use App\Models\Product;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\ManageUserController;
use App\Http\Controllers\OrderHistoryController;


Route::get('/', function () {
    if(auth()->check() && auth()->user()->role === 'admin'){
        return redirect()->route('dashboard');
    }
    
    return redirect()->route('products.index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::middleware('role:admin')->group(function () {
        Route::get('dashboard', function () {

        $sales = Product::where('sales', '>', 0)->orderBy('sales', 'desc')->take(5)->get();

        return Inertia::render('dashboard', compact('sales'));
        })->name('dashboard');
        
        Route::resource('manage-users', UsersController::class);
        Route::resource('manageUser', ManageUserController::class);
        // Report endpoint: total sales (JSON)
        Route::get('reports/total-sales', [OrderController::class, 'totalSales'])->name('reports.total-sales');
        // Report endpoint: total orders counts (JSON)
        Route::get('reports/total-orders', [OrderController::class, 'totalOrders'])->name('reports.total-orders');
        // Report endpoint: total products counts (JSON)
        Route::get('reports/total-products', [ProductController::class, 'totalProducts'])->name('reports.total-products');
        // Report endpoint: total customers counts (JSON)
        Route::get('reports/total-customers', [ManageUserController::class, 'totalCustomers'])->name('reports.total-customers');
        // Report endpoint: sales by day (last 7 days) for line chart
        Route::get('reports/sales-by-day', [OrderController::class, 'salesByDay'])->name('reports.sales-by-day');
    });
    
    Route::resource('products', ProductController::class);
    Route::resource('order-history', OrderHistoryController::class);

    Route::resource('cart', CartController::class);

    Route::resource('order', OrderController::class);
        
});



require __DIR__.'/settings.php';
