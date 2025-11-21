import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { CheckCircle, ChevronLeft, CircleCheck, CreditCard, Pen, Printer, SquarePen, TruckIcon } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  placed_at: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  payment_method: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shipped_at?: string;
}

interface Props {
  order?: Order; // optional
}

export default function OrderDetail({ order }: Props) {
  // Calculate progress
  const progressMap: Record<string, number> = {
    processing: 0,
    shipped: 33.5,
    out_for_delivery: 65.5,
    delivered: 100,
  };

  return (
    <AppLayout>
      <Head title={order ? `Order #₱{order.order_number}` : "Order #123"} />
      <div className="max-w-5xl mx-auto w-full py-6 space-y-6">
        {/* ACTION BUTTONS */}
        <div className="flex justify-between">
          <Button variant="outline" className="pl-0" onClick={() => router.visit('/products')}>
            <ChevronLeft />
          </Button>
          
        </div>

        {/* ORDER INFO */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{order?.order_number ?? "ORD-12345"}</CardTitle>
              <p className="text-sm text-zinc-500">{order?.placed_at ?? "2025-04-15"}</p>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2">
              <h3 className="font-medium">Customer Information</h3>
              <p className="text-zinc-500 text-sm">{order?.customer_name ?? "Alice Johnson"}</p>
              <p className="text-zinc-500 text-sm">{order?.customer_email ?? "alice@gmail.com"}</p>
              <p className="text-zinc-500 text-sm">{order?.customer_address ?? "123 Main St, Anytown, AN 12345"}</p>

              <Card className="p-4 bg-zinc-900">
                <div className="grid grid-cols-[1fr_auto]">
                  <div>
                    <CardTitle>Payment Method</CardTitle>
                    <p className="flex gap-2 items-center text-sm">
                      <CreditCard className="size-5" />
                      {order?.payment_method ?? "Visa ending in **** 1234"}
                    </p>
                  </div>
                  <Button variant="outline">
                    <SquarePen />
                  </Button>
                </div>
              </Card>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between flex-col gap-6">
              <div className="flex justify-between">
                <p>Payment</p>
                <p>Paid</p>
              </div>
              <Separator/>
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>₱{order?.subtotal.toFixed(2) ?? "101.97"}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>₱{order?.shipping.toFixed(2) ?? "10.00"}</p>
              </div>
              <Separator />
              <div className="font-medium flex justify-between">
                <p>Total</p>
                <p>₱{order?.total.toFixed(2) ?? "111.97"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[4fr_1fr_1fr_2fr] py-2">
              <CardDescription>Product</CardDescription>
              <CardDescription className="text-center">Quantity</CardDescription>
              <CardDescription className="text-center">Price</CardDescription>
              <CardDescription className="text-right">Total</CardDescription>
            </div>
            <Separator />
            {(order?.items.length ? order.items : Array(5).fill({ product: { name: "Placeholder", image: "" }, quantity: 1, id: 0 })).map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="grid grid-cols-[4fr_1fr_1fr_2fr] py-4 items-center">
                  <div className="flex gap-2 items-center">
                    {item.product.image ? <img src={`/storage/${item.product.image}`} alt={item.product.name} className="w-15 h-15 rounded-lg" /> : <PlaceholderPattern className="w-15 h-15 bg-zinc-300 rounded-lg" />}
                    <p>{item.product.name}</p>
                  </div>
                  <p className="text-center">{item.quantity}</p>
                  <p className="text-center">₱{item.product.price?.toFixed(2) ?? "12.00"}</p>
                  <p className="text-right">₱{item.quantity * (item.product.price ?? 12)}</p>
                </div>
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
