"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Apple, Candy, Croissant, CupSoda, Drumstick, Fish, Milk, MinusIcon, PillBottle, PlusIcon, Search, ShoppingCart, Snowflake, Wheat } from "lucide-react";
import { toast } from "sonner";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string | null;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

const categories = [
  { name: "Fruits & Vegetables", icon: Apple },
  { name: "Meat & Poultry", icon: Drumstick },
  { name: "Seafood", icon: Fish },
  { name: "Dairy & Eggs", icon: Milk },
  { name: "Bakery", icon: Croissant },
  { name: "Snacks & Confectionery", icon: Candy },
  { name: "Beverages", icon: CupSoda },
  { name: "Grains & Pasta", icon: Wheat },
  { name: "Frozen Foods", icon: Snowflake },
  { name: "Condiments & Spices", icon: PillBottle },
]


export default function Products({ carts, products }: { carts: CartItem[], products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>(carts || []);

  

  const handleView = (product: Product) => {
    router.visit(`/products/${product.id}`);
  };

const handleAddToCart = (product: Product) => {
  // Update local state
  setCart((prev) => {
    const existing = prev.find((item) => item.product.id === product.id);
    if (existing) {
      return prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prev, { id: Date.now(), product, quantity: 1 }];
  });

  // Post to backend
  router.post('/cart', { product_id: product.id });
};



  return (
    <AppLayout>
      <Head title="Products" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex-1 grid grid-cols-4 gap-4">
          {/* MAIN CONTENT */}
          <div className="col-span-3 h-fit space-y-4">
            {/* Search Bar */}
            <InputGroup className="max-w-lg">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">{products.length} results</InputGroupAddon>
            </InputGroup>

            {/* Categories placeholder */}
            <ScrollArea className="w-full rounded-md ">
            <div className="flex w-max space-x-4 pb-4">
              {categories.map((item, i) => {
                const Icon = item.icon
                return (
                  <Card
                    key={i}
                    className="p-4 rounded-lg flex flex-col items-center justify-start hover:bg-zinc-900 w-28 h-28 cursor-pointer transition shrink-0 gap-0 "
                  >
                    <Icon className="size-10 text-white shrink-0" />

                    <span className="text-xs mt-2 text-center break-words">
                      {item.name}
                    </span>
                  </Card>

                )
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

            {/* Product Grid */}
            <div className="grid grid-cols-5 gap-2">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="p-0 flex rounded-lg overflow-hidden gap-0 cursor-pointer"
                 
                >
                  {product.image ? (
                    <img
                      src={`/storage/${product.image}`}
                      alt={product.name}
                      className="min-h-30 h-30 w-full object-cover"
                    />
                  ) : (
                    <div className="min-h-30 h-30 w-full bg-gray-100" />
                  )}

                  <div className="grid grid-cols-[1fr_auto] items-end p-2 w-full">
                    <div>
                      <h3 className="text-base font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart />
                    </Button>

                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CART */}
          <Card className="flex-1 h-132 sticky top-20 self-start gap-0">
            <CardHeader className="p-2">
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-2">
              {cart.length === 0 ? (
                <>
                  <p>🍪</p>
                  <p>Your cart is empty.</p>
                </>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-2  p-2 rounded-lg"
                    >
                      {/* Thumbnail */}
                      {item.product.image ? (
                        <img
                          src={`/storage/${item.product.image}`}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md" />
                      )}

                      {/* Name & Price */}
                      <div className="flex flex-col text-left">
                        <h3 className="text-sm font-medium">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">${ (item.product.price * item.quantity).toFixed(2) }</p>
                      </div>

                      {/* Quantity controls */}
                      <ButtonGroup>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            if (item.quantity === 1) {
                              // Remove item from cart
                              setCart((prev) => prev.filter((i) => i.product.id !== item.product.id));
                              router.delete(`/cart/${item.id}`);
                            } else {
                              // Decrease quantity
                              setCart((prev) =>
                                prev.map((i) =>
                                  i.product.id === item.product.id
                                    ? { ...i, quantity: i.quantity - 1 }
                                    : i
                                )
                              );
                              router.patch(`/cart/${item.id}`, { quantity: item.quantity - 1 });
                            }
                          }}
                        >
                          <MinusIcon />
                        </Button>
                        <Button variant="secondary">{item.quantity}</Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            setCart((prev) =>
                              prev.map((i) =>
                                i.product.id === item.product.id
                                  ? { ...i, quantity: i.quantity + 1 }
                                  : i
                              )
                            );
                            router.patch(`/cart/${item.id}`, { quantity: item.quantity + 1 });
                          }}
                        >
                          <PlusIcon />
                        </Button>
                      </ButtonGroup>
                    </div>
                  ))}
                  
                </div>
              )}
            </CardContent>

          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
