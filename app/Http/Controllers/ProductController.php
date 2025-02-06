<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
                    'name' => $product->name,
                    'price' => $product->price,
                    'stock' => $product->stock,
                ];
            }),
            'orders' => $orders->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'customer_name' => $order->customer->name ?? 'Unknown',
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
                    'name' => $customer->name,
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
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        try {
            Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
            ]);

            return redirect()->route('products.index')
                ->with('success', 'Product created successfully');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->route('products.index')
                ->with('error', 'Product creation failed');
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
