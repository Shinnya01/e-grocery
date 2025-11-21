<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display the current user's cart.
     */
    public function index()
    {
        $cartItems = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($cartItems);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $userId = Auth::id();
        $productId = $request->product_id;

        $cartItem = Cart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += 1;
            $cartItem->save();
        } else {
            Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => 1,
            ]);
        }

        return back()->with('success', 'successfully added to cart!');
    }


    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, Cart $cart)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Ensure the cart belongs to the current user
        if ($cart->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $cart->update([
            'quantity' => $request->quantity,
        ]);

        return back();
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Cart $cart)
    {
        // Ensure the cart belongs to the current user
        if ($cart->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $cart->delete();

        return response()->json([
            'message' => 'Item removed from cart',
        ]);
    }
}
