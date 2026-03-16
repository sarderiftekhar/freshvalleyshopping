<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/product/{slug}', [ShopController::class, 'show'])->name('product.show');
Route::get('/cart', fn() => Inertia::render('Cart'))->name('cart');
Route::get('/proposal', fn() => Inertia::render('Proposal'))->name('proposal');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Supplier Panel
Route::middleware(['auth', 'verified', 'supplier'])->prefix('supplier')->name('supplier.')->group(function () {
    Route::get('/', [SupplierController::class, 'dashboard'])->name('dashboard');

    // Products
    Route::get('/products', [SupplierController::class, 'products'])->name('products');
    Route::get('/products/create', [SupplierController::class, 'createProduct'])->name('products.create');
    Route::post('/products', [SupplierController::class, 'storeProduct'])->name('products.store');
    Route::get('/products/{supplierProduct}/edit', [SupplierController::class, 'editProduct'])->name('products.edit');
    Route::put('/products/{supplierProduct}', [SupplierController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{supplierProduct}', [SupplierController::class, 'destroyProduct'])->name('products.destroy');
    Route::patch('/products/{supplierProduct}/quick', [SupplierController::class, 'quickUpdate'])->name('products.quick');

    // Categories
    Route::get('/categories', [SupplierController::class, 'categories'])->name('categories');
    Route::post('/categories', [SupplierController::class, 'storeCategory'])->name('categories.store');
    Route::put('/categories/{supplierCategory}', [SupplierController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{supplierCategory}', [SupplierController::class, 'destroyCategory'])->name('categories.destroy');
});

require __DIR__.'/auth.php';
