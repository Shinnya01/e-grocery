import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { CheckCircle, ChevronLeft, CircleCheck, CreditCard, SquarePen, TruckIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  status: "pending" | "accepted" | "received" | "delivered";
}

interface Props {
  order?: Order;
}

export default function OrderDetail({ order }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const progressMap: Record<string, number> = {
    pending: 2.3,
    accepted: 50,
    received: 100,
  };

  const statusLabelMap: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    received: "Received",
  };

  // Handler for marking as received
  const handleMarkAsReceived = () => {
    if (!order) return;

    router.patch(`/order/${order.id}`, { status: "received" }, {
      onSuccess: () => setIsDialogOpen(false),
    });
  };

  return (
    <AppLayout>
      <Head title={order ? `Order #${order.order_number}` : "Order #123"} />
      <div className="max-w-5xl mx-auto w-full py-6 space-y-6">
        {/* ACTION BUTTONS */}
        <div className="flex justify-between">
          <Button variant="outline" className="pl-0" onClick={() => router.visit("/products")}>
            <ChevronLeft />
          </Button>

          {order?.status === "accepted" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Received</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark as Received</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to mark this order as received? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="secondary" onClick={handleMarkAsReceived}>
                    Yes, Received
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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

              <Card className="p-4">
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
                <div>
                  <p>Status</p>
                  <p className="text-xs text-zinc-500">Please wait for admin to accept the order approval</p>
                </div>
                <p className="capitalize">{statusLabelMap[order?.status ?? "pending"]}</p>
              </div>
              <Separator />
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

        {/* Delivery Status */}
        <Card className="p-4">
          <CardTitle>Delivery Status</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              {/* Status Icons */}
              <div className="flex flex-col items-center gap-2">
                <div className={`border p-3 rounded-full ${order?.status === "pending" || order?.status === "accepted" || order?.status === "received" || order?.status === "delivered" ? "bg-green-800" : ""}`}>
                  <CheckCircle className="size-5" />
                </div>
                <p>Pending</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`border p-3 rounded-full ${order?.status === "accepted" || order?.status === "received" || order?.status === "delivered" ? "bg-green-800" : ""}`}>
                  <TruckIcon className="size-5" />
                </div>
                <p>Accepted</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`border p-3 rounded-full ${order?.status === "received" || order?.status === "delivered" ? "bg-green-800" : ""}`}>
                  <CircleCheck className="size-5" />
                </div>
                <p>Received</p>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={progressMap[order?.status ?? "pending"]} className="transition ease-in-out" />

            <div className="mt-4 space-x-2">
              <Badge className="bg-blue-500/30 border border-blue-500 text-white">
                {statusLabelMap[order?.status ?? "pending"]}
              </Badge>
              <span className="text-xs text-zinc-500">
                {order?.status === 'pending' ? "Not yet shipped" 
                : order?.status === 'accepted' ? "On the way" 
                : order?.status === 'received' && "Delivered"}
              </span>
            </div>
          </div>
        </Card>

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
