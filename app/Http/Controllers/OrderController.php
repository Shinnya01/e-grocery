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
        if(auth()->user()->role == 'admin'){
            $orders = Order::with('user')->get();
            return Inertia::render('manage-order', compact('orders'));
        }
    }

    /**
     * Return total sales (sum of total_amount across orders) as JSON.
     */
    public function totalSales()
    {
        // Sum all orders' total_amount. You can scope by status if needed (e.g. only 'delivered').
        $total = Order::sum('total_amount');

        return response()->json(['total_sales' => (float) $total]);
    }

    /**
     * Return total orders counts as JSON.
     *
     * Response: { total_orders: int, pending: int, completed: int }
     */
    public function totalOrders()
    {
        $total = Order::count();

        // pending
        $pending = Order::where('status', 'pending')->count();

        // treat accepted/delivered/received as completed
        $completed = Order::whereIn('status', ['accepted', 'delivered', 'received'])->count();

        return response()->json([
            'total_orders' => $total,
            'pending' => $pending,
            'completed' => $completed,
        ]);
    }

    /**
     * Return sales totals for the last 7 days (date, total) as JSON.
     * Response: [{ date: '2025-11-18', total: 123.45 }, ...]
     */
    public function salesByDay()
    {
        // Get sums grouped by date for the last 7 days
        $start = now()->subDays(6)->startOfDay();

        $rows = Order::where('created_at', '>=', $start)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->map(fn($r) => (float) $r->total)
            ->toArray();

        // ensure every day in the range is present (fill zeros)
        $result = [];
        for ($i = 0; $i < 7; $i++) {
            $d = $start->copy()->addDays($i)->toDateString();
            $result[] = [
                'date' => $d,
                'total' => $rows[$d] ?? 0,
            ];
        }

        return response()->json($result);
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

        // ADD THE SALE UPDATE HERE
        foreach ($cart as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            $product->sales += $item['quantity'];
            $product->save();
        }

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
    /**
 * Update the specified resource in storage.
 */
    public function update(Request $request, Order $order)
    {
        $user = $request->user();

        // Validate status
        $request->validate([
            'status' => 'required|string'
        ]);

        $newStatus = $request->status;

        // Admin can set accepted or delivered
        if ($user->role === 'admin') {
            if (!in_array($newStatus, ['accepted', 'delivered'])) {
                return back()->with('error', 'Invalid status.');
            }
        }
        // Regular user can only mark their own order as received
        else {
            if ($newStatus !== 'received' || $order->user_id !== $user->id) {
                return back()->with('error', 'You cannot update this order.');
            }
        }

        $order->update(['status' => $newStatus]);

        return back()->with('success', 'Order updated successfully.');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
