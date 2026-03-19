<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\SupplierProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SupplierManagementController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = User::where('role', 'supplier')
            ->withCount('supplierProducts')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Suppliers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
        ]);

        $supplier = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'supplier',
            'is_active' => true,
        ]);

        ActivityLog::log('supplier.created', $supplier);

        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier account created.');
    }

    public function show(User $supplier)
    {
        abort_if($supplier->role !== 'supplier', 404);

        $supplier->load(['supplierProducts' => fn ($q) => $q->latest()]);

        return Inertia::render('Admin/Suppliers/Show', [
            'supplier' => $supplier,
        ]);
    }

    public function pendingProducts(Request $request)
    {
        $products = SupplierProduct::where('approval_status', 'pending')
            ->with(['user', 'category'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/SupplierProducts/Pending', [
            'products' => $products,
        ]);
    }

    public function approveProduct(Request $request, SupplierProduct $supplierProduct)
    {
        $supplierProduct->update([
            'approval_status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        ActivityLog::log('supplier_product.approved', $supplierProduct);

        return back()->with('success', 'Product approved.');
    }

    public function rejectProduct(Request $request, SupplierProduct $supplierProduct)
    {
        $request->validate(['rejection_reason' => 'required|string|max:500']);

        $supplierProduct->update([
            'approval_status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        ActivityLog::log('supplier_product.rejected', $supplierProduct, [
            'reason' => $request->rejection_reason,
        ]);

        return back()->with('success', 'Product rejected.');
    }
}
