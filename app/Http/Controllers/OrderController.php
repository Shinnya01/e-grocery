<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $cart = $request->cart; // array of ['product_id' => int, 'quantity' => int]
    $user = $request->user();

    // Calculate total
    $total = collect($cart)->sum(function ($item) {
        $product = \App\Models\Product::find($item['product_id']);
        return $product->price * $item['quantity'];
    });

    // Create order
    $order = Order::create([
        'user_id' => $user->id,
        'total_amount' => $total,
        'status' => 'pending',
    ]);

    // Create order items
    foreach ($cart as $item) {
        $product = \App\Models\Product::find($item['product_id']);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $item['quantity'],
            'price' => $product->price,
        ]);
    }
    
    Cart::where('user_id', $user->id)->delete();

    // Redirect to order details
    return redirect()->route('order.show', $order->id);
}


    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load('items.product');

        $orderData = [
        'id' => $order->id,
        'order_number' => 'ORD-' . $order->id,
        'placed_at' => $order->created_at->format('Y-m-d'),
        'customer_name' => $order->user->name,
        'customer_email' => $order->user->email,
        'customer_address' => $order->user->address ?? '',
        'payment_method' => 'Visa ending in **** 1234', // adjust if you store real payment method
        'items' => $order->items->map(fn($item) => [
            'id' => $item->id,
            'quantity' => $item->quantity,
            'product' => [
                'id' => $item->product->id,
                'name' => $item->product->name,
                'price' => $item->price,
                'image' => $item->product->image,
            ],
        ]),
        'subtotal' => $order->items->sum(fn($i) => $i->price * $i->quantity),
        'shipping' => 10, // set your shipping logic here
        'total' => $order->items->sum(fn($i) => $i->price * $i->quantity) + 10,
        'status' => $order->status,
        'shipped_at' => $order->shipped_at?->format('Y-m-d'),
    ];

        return Inertia::render('order-info', [
            'order' => $orderData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
