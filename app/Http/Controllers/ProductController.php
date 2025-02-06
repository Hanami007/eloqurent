<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
        $orders = Order::with('orderDetails', 'customer')->get();
        $customers = Customer::all();

        return Inertia::render('Products/Index', [
            'products' => $products->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock,
                'descriptions' => $product->description,
                'timestamp' => $product->created_at->timestamp,
                'date' => $product->created_at->format('Y-m-d'),
            ]),
            'orders' => $orders->map(fn($order) => [
                'order_id' => $order->id,
                'customer_id' => $order->customer_id,
                'order_details' => $order->orderDetails->map(fn($detail) => [
                    'product_id' => $detail->product_id,
                    'quantity' => $detail->quantity,
                    'price' => $detail->price,
                ]),
            ]),
            'customers' => $customers->map(fn($customer) => [
                'id' => $customer->id,
                'Cname' => $customer->name,
                'email' => $customer->email,
            ]),
            'success' => session('success'), // ✅ ส่ง success ไปที่หน้า React
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|max:999999.99',
            'stock' => 'required|integer|max:9999',
        ]);

        try {
            // Use a database transaction for data integrity
            DB::transaction(function () use ($validated) {
                // Create the product
                Product::create([
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'price' => $validated['price'],
                    'stock' => $validated['stock'],
                ]);
            });

            return redirect()->route('products.index')
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->route('products.index')
                ->with('error', 'An error occurred while creating the product.');
        }
    }


    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        try {
            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
            ]);

            return redirect()->route('products.index')
                ->with('success', 'Product updated successfully');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->route('products.index')
                ->with('error', 'Product update failed');
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return redirect()->route('products.index')
                ->with('success', 'Product deleted successfully');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->route('products.index')
                ->with('error', 'Product deletion failed');
        }
    }
}
