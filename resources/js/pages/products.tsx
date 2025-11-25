"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { Apple, Candy, Croissant, CupSoda, Drumstick, Fish, Milk, MinusIcon, PillBottle, PlusIcon, Search, ShoppingCart, Snowflake, Wheat, X } from "lucide-react";
import { toast } from "sonner";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { CartItem, Product, SharedData } from "@/types";

// ShadCN UI imports
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
];

export default function Products({ carts, products }: { carts: CartItem[], products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>(carts || []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleView = (product: Product) => {
    router.visit(`/products/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
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

    // Post to backend — use Inertia callback instead of .then (router.post returns void)
    router.post('/cart', { product_id: product.id }, {
      onSuccess: () => {
        setTimeout(() => {
        window.location.reload();
      }, 500);   
      },
    });
  };

  const handleRemoveItem = (item: CartItem) => {
    setCart((prev) => prev.filter((i) => i.id !== item.id));
    router.delete(`/cart/${item.id}`);
    setIsDialogOpen(false); // Close the dialog after confirming
  };

  const page = usePage<SharedData>();
  const { auth } = page.props;

  return (
    <AppLayout>
      <Head title="Products" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex-1 grid grid-cols-3 gap-4">
          {/* MAIN CONTENT */}
          <div className="col-span-2 h-fit space-y-4">
            {/* Search Bar */}
            <InputGroup className="max-w-lg">
              <InputGroupInput 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">{filteredProducts.length} results</InputGroupAddon>
            </InputGroup>

            {/* Categories placeholder */}
            <ScrollArea className="w-full rounded-md">
              <div className="flex w-max space-x-4 pb-4">
                {categories.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={i}
                      className={`p-4 rounded-lg flex flex-col items-center justify-start w-28 h-28 cursor-pointer transition shrink-0 gap-0
                      ${selectedCategory === item.name ? 'bg-zinc-600' : 'hover:bg-zinc-200'}`}
                      onClick={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                    >
                      <Icon className="size-10  shrink-0" />

                      <span className="text-xs mt-2 text-center break-words">
                        {item.name}
                      </span>
                    </Card>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Product Grid */}
            <div className="grid grid-cols-5 gap-2">
              {filteredProducts.length === 0 && (
                <div className="col-span-5">
                  <p className="text-center text-gray-500">No products found.</p>
                </div>
              )}
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="p-0 flex rounded-lg overflow-hidden gap-0 cursor-pointer"
                >
                  {product.image ? (
                    <img
                      src={`/storage/${product.image}`}
                      alt={product.name}
                      className="min-h-30 h-30 w-full object-cover"
                      onClick={() => handleView(product)}
                    />
                  ) : (
                    <div className="min-h-30 h-30 w-full bg-gray-100" onClick={() => handleView(product)} />
                  )}

                  <div className="grid grid-cols-[1fr_auto] items-end p-2 w-full">
                    <div className="overflow-hidden">
                      <h3 className="text-base font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500">₱{product.price.toFixed(2)}</p>
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
          <Card className="flex-1 h-132 sticky top-20 self-start gap-0 pb-0 overflow-hidden">
            <CardHeader className="p-2">
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-2 flex-1">
              {cart.length === 0 ? (
                <>
                  <p>🍪</p>
                  <p>Your cart is empty.</p>
                </>
              ) : (
                <ScrollArea className="h-90 pr-2"> 
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 p-2 rounded-lg"
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
                          <p className="text-xs text-gray-500">
                            ₱{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <ButtonGroup>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => {
                              if (item.quantity === 1) {
                                setItemToRemove(item);  // Set the item to be removed
                                setIsDialogOpen(true);  // Open the dialog
                              } else {
                                setCart((prev) =>
                                  prev.map((i) =>
                                    i.product.id === item.product.id
                                      ? { ...i, quantity: i.quantity - 1 }
                                      : i
                                  )
                                );
                                router.patch(`/cart/${item.id}`, {
                                  quantity: item.quantity - 1,
                                });
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
                              router.patch(`/cart/${item.id}`, {
                                quantity: item.quantity + 1,
                              });
                            }}
                          >
                            <PlusIcon />
                          </Button>
                        </ButtonGroup>

                        {/* Remove button */}
                        <Button variant="destructive" size="icon-sm" onClick={() => {
                          setItemToRemove(item);
                          setIsDialogOpen(true);
                        }}>
                          <X />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>

            {cart.length > 0 && (
              <CardFooter className="p-0 mt-auto flex flex-col gap-2">
                <div className="flex justify-between p-2 w-full">
                  <span className="font-medium">Total:</span>
                  <span className="font-normal">
                    ₱{cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => {
                    if (cart.length === 0) {
                      toast.error("Cart is empty");
                      return;
                    }
                    if (!auth.user.address) {
                      toast.error(
                        <span>
                          Please set your address in your profile before checking out. <br />
                          <a href="/settings/profile" className="underline">
                            Click here to update your address.
                          </a>
                        </span>
                      );
                      return;
                    }
                    router.post("/order", {
                      cart: cart.map((item) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                      })),
                    });
                  }}
                >
                  Checkout
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* ShadCN Dialog for Confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to remove this item from your cart?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              if (itemToRemove) {
                handleRemoveItem(itemToRemove);
              }
            }}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
