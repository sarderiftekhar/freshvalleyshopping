<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DeliverySlotController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SocialPostController;
use App\Http\Controllers\Admin\SpecialOfferController;
use App\Http\Controllers\Admin\SubscriberController;
use App\Http\Controllers\Admin\SupplierManagementController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// Dashboard (all admin roles: super_admin, admin, editor)
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// Products (all admin roles)
Route::resource('products', ProductController::class)->except(['show']);
Route::post('products/bulk-action', [ProductController::class, 'bulkAction'])->name('products.bulk');
Route::post('products/generate-sku', [ProductController::class, 'generateSku'])->name('products.generate-sku');
Route::get('products-export', [ProductController::class, 'export'])->name('products.export');

// Brands (all admin roles)
Route::resource('brands', BrandController::class)->except(['show']);

// Categories (all admin roles)
Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);
Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');

// Special Offers (all admin roles)
Route::resource('offers', SpecialOfferController::class)->except(['show']);

// Inventory, Orders, Customers, Suppliers, Marketing, Reports (super_admin, admin only)
Route::middleware('role:super_admin,admin')->group(function () {
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('inventory/{product}/adjust', [InventoryController::class, 'adjust'])->name('inventory.adjust');

    // Orders
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/export', [OrderController::class, 'export'])->name('orders.export');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::post('orders/{order}/refund', [OrderController::class, 'refund'])->name('orders.refund');
    Route::post('orders/{order}/note', [OrderController::class, 'addNote'])->name('orders.note');

    // Delivery Slots
    Route::get('delivery-slots', [DeliverySlotController::class, 'index'])->name('delivery-slots.index');
    Route::post('delivery-slots', [DeliverySlotController::class, 'store'])->name('delivery-slots.store');
    Route::put('delivery-slots/{deliverySlot}', [DeliverySlotController::class, 'update'])->name('delivery-slots.update');
    Route::delete('delivery-slots/{deliverySlot}', [DeliverySlotController::class, 'destroy'])->name('delivery-slots.destroy');
    Route::post('delivery-slots/bulk', [DeliverySlotController::class, 'bulkCreate'])->name('delivery-slots.bulk');

    // Customers
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/export', [CustomerController::class, 'export'])->name('customers.export');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::patch('customers/{customer}/toggle-active', [CustomerController::class, 'toggleActive'])->name('customers.toggle');

    // Supplier Management
    Route::get('suppliers', [SupplierManagementController::class, 'index'])->name('suppliers.index');
    Route::get('suppliers/create', [SupplierManagementController::class, 'create'])->name('suppliers.create');
    Route::post('suppliers', [SupplierManagementController::class, 'store'])->name('suppliers.store');
    Route::get('suppliers/{supplier}', [SupplierManagementController::class, 'show'])->name('suppliers.show');
    Route::get('supplier-products/pending', [SupplierManagementController::class, 'pendingProducts'])->name('supplier-products.pending');
    Route::patch('supplier-products/{supplierProduct}/approve', [SupplierManagementController::class, 'approveProduct'])->name('supplier-products.approve');
    Route::patch('supplier-products/{supplierProduct}/reject', [SupplierManagementController::class, 'rejectProduct'])->name('supplier-products.reject');

    // Marketing - Campaigns
    Route::resource('campaigns', CampaignController::class)->except(['show']);
    Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send'])->name('campaigns.send');
    Route::get('campaigns/{campaign}/preview', [CampaignController::class, 'preview'])->name('campaigns.preview');

    // Marketing - Subscribers
    Route::get('subscribers', [SubscriberController::class, 'index'])->name('subscribers.index');
    Route::post('subscribers/import', [SubscriberController::class, 'import'])->name('subscribers.import');
    Route::get('subscribers/export', [SubscriberController::class, 'export'])->name('subscribers.export');
    Route::delete('subscribers/{subscriber}', [SubscriberController::class, 'destroy'])->name('subscribers.destroy');

    // Marketing - Social Posts
    Route::resource('social-posts', SocialPostController::class)->except(['show']);
    Route::post('social-posts/{socialPost}/publish', [SocialPostController::class, 'publish'])->name('social-posts.publish');

    // Reports
    Route::get('reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('reports/products', [ReportController::class, 'products'])->name('reports.products');
    Route::get('reports/customers', [ReportController::class, 'customers'])->name('reports.customers');
});

// Super Admin only
Route::middleware('role:super_admin')->group(function () {
    // Settings
    Route::get('settings/general', [SettingsController::class, 'general'])->name('settings.general');
    Route::post('settings/general', [SettingsController::class, 'updateGeneral'])->name('settings.general.update');
    Route::get('settings/delivery', [SettingsController::class, 'delivery'])->name('settings.delivery');
    Route::post('settings/delivery', [SettingsController::class, 'updateDelivery'])->name('settings.delivery.update');
    Route::get('settings/payment', [SettingsController::class, 'payment'])->name('settings.payment');
    Route::post('settings/payment', [SettingsController::class, 'updatePayment'])->name('settings.payment.update');
    Route::get('settings/email', [SettingsController::class, 'email'])->name('settings.email');
    Route::post('settings/email', [SettingsController::class, 'updateEmail'])->name('settings.email.update');
    Route::post('settings/email/test', [SettingsController::class, 'testEmail'])->name('settings.email.test');

    // Users
    Route::resource('users', UserController::class)->except(['show']);

    // Activity Log
    Route::get('activity', [ActivityLogController::class, 'index'])->name('activity.index');
});
