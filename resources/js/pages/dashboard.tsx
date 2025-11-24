import { Statistics } from '@/components/statistics';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Product, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ sales }: { sales: Product[] }) {
    const [totalSales, setTotalSales] = useState<number | null>(null);
    const [orders, setOrders] = useState<{ total_orders: number; pending: number; completed: number } | null>(null);
    const [productsCounts, setProductsCounts] = useState<{ total: number; active: number; out_of_stock: number } | null>(null);
    const [customersCounts, setCustomersCounts] = useState<{ total: number; new: number; returning: number } | null>(null);

    useEffect(() => {
        // fetch total sales from backend (admin-only endpoint)
        fetch('/reports/total-sales')
            .then((r) => r.json())
            .then((data) => setTotalSales(data.total_sales ?? 0))
            .catch(() => setTotalSales(0));
        // fetch total orders counts
        fetch('/reports/total-orders')
            .then((r) => r.json())
            .then((data) => setOrders({
                total_orders: data.total_orders ?? 0,
                pending: data.pending ?? 0,
                completed: data.completed ?? 0,
            }))
            .catch(() => setOrders({ total_orders: 0, pending: 0, completed: 0 }));
        // fetch total products counts
        fetch('/reports/total-products')
            .then((r) => r.json())
            .then((data) => setProductsCounts({
                total: data.total ?? 0,
                active: data.active ?? 0,
                out_of_stock: data.out_of_stock ?? 0,
            }))
            .catch(() => setProductsCounts({ total: 0, active: 0, out_of_stock: 0 }));
            // fetch total customers counts
            fetch('/reports/total-customers')
                .then((r) => r.json())
                .then((data) => setCustomersCounts({
                    total: data.total ?? 0,
                    new: data.new ?? 0,
                    returning: data.returning ?? 0,
                }))
                .catch(() => setCustomersCounts({ total: 0, new: 0, returning: 0 }));
    }, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col h-screen w-full p-4 gap-4">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="h-50">
                        <CardHeader>
                            <CardTitle>Total Sales</CardTitle>
                            <CardDescription>Today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalSales === null ? '—' : `₱${totalSales.toFixed(2)}`}</p>
                        </CardContent>
                    </Card>

                    <Card className="h-50">
                        <CardHeader>
                            <CardTitle>Total Orders</CardTitle>
                            <CardDescription>Pending / Completed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{orders ? `${orders.pending} / ${orders.completed}` : '—'}</p>
                            <p className="text-xs text-muted-foreground">Total: {orders ? orders.total_orders : '—'}</p>
                        </CardContent>
                    </Card>

                    <Card className="h-50">
                        <CardHeader>
                            <CardTitle>Total Products</CardTitle>
                            <CardDescription>Active / Out of Stock</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* will be populated from admin report endpoint */}
                            <p className="text-2xl font-bold">
                                {productsCounts
                                    ? `${productsCounts.active} / ${productsCounts.out_of_stock}`
                                    : '—'}
                            </p>
                            <p className="text-xs text-muted-foreground">Total: {productsCounts ? productsCounts.total : '—'}</p>
                        </CardContent>
                    </Card>

                    <Card className="h-50">
                        <CardHeader>
                            <CardTitle>Total Customers</CardTitle>
                            <CardDescription>New / Returning</CardDescription>
                        </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{customersCounts ? `${customersCounts.new} / ${customersCounts.returning}` : '—'}</p>
                                <p className="text-xs text-muted-foreground">Total: {customersCounts ? customersCounts.total : '—'}</p>
                            </CardContent>
                    </Card>
                </div>

                {/* Main Analytics / Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 h-full">
                    {/* Total Products / Statistics card larger */}
                    <Card className="w-full lg:col-span-2 h-full">
                        <CardHeader>
                            <CardTitle>Sales</CardTitle>
                            <CardDescription>Sales by day</CardDescription>
                        </CardHeader>
                        <CardContent className="h-full">
                            <Statistics />
                        </CardContent>
                    </Card>

                    {/* Top Products card smaller */}
                    <Card className="w-full h-1/2 lg:h-full overflow-auto">
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {sales.map((sale) => (
                                    <Card key={sale.id} className="p-0 w-full">
                                        <CardContent className="grid grid-cols-[auto_1fr_auto] gap-2 p-2 items-center justify-center">
                                            {sale.image ? (
                                                <img
                                                    src={`/storage/${sale.image}`}
                                                    alt={sale.name}
                                                    className="w-16 h-16 rounded-lg"
                                                />
                                            ) : (
                                                <PlaceholderPattern className="w-16 h-16 bg-zinc-300 rounded-lg" />
                                            )}
                                            <div>
                                                <h3 className="text-base">{sale.name}</h3>
                                                <p className="text-zinc-500 text-xs">{sale.sales} Sold</p>
                                            </div>
                                            <p className="font-medium text-sm">
                                                ₱{(sale.sales * sale.price).toFixed(2)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
