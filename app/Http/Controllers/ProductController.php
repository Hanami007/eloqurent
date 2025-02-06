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
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'Pname' => $product->name,
                    'price' => $product->price,
                    'stock' => $product->stock,
                ];
            }),
            'orders' => $orders->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'customer_id' => $order->customer_id, // เพิ่ม customer_id
                    'order_details' => $order->orderDetails->map(function ($detail) {
                        return [
                            'product_id' => $detail->product_id,
                            'quantity' => $detail->quantity,
                            'price' => $detail->price,
                        ];
                    }),
                ];
            }),
            'customers' => $customers->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'Cname' => $customer->name,
                    'email' => $customer->email,
                ];
            }),
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
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'order_details' => 'required|array',
            'order_details.*.customer_id' => 'required|exists:customers,id',
            'order_details.*.quantity' => 'required|integer',
            'order_details.*.price' => 'required|numeric',
        ]);

        try {
            // Use a database transaction for data integrity
            DB::transaction(function () use ($validated) {
                // Create the product
                $product = Product::create([
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'price' => $validated['price'],
                    'stock' => $validated['stock'],
                ]);

                // Create the order and order details
                foreach ($validated['order_details'] as $detail) {
                    $order = Order::create([
                        'customer_id' => $detail['customer_id'],
                    ]);

                    $order->orderDetails()->create([
                        'product_id' => $product->id,
                        'quantity' => $detail['quantity'],
                        'price' => $detail['price'],
                    ]);
                }
            });

            return redirect()->route('products.index')
                ->with('success', 'Product and order details created successfully.');
        } catch (\Exception $e) {
            Log::error('Product creation failed: ' . $e->getMessage());

            return Redirect::back()->withErrors(['error' => 'An error occurred while creating the product. Please try again.'])
                ->withInput();
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
