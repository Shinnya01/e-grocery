import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Sales</CardTitle>
                            <CardDescription>Today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">$1,250</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Orders</CardTitle>
                            <CardDescription>
                                Pending / Completed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">12 / 85</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Customers</CardTitle>
                            <CardDescription>New / Returning</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">42 / 120</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Products</CardTitle>
                            <CardDescription>
                                Active / Out of Stock
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">350 / 20</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Analytics / Chart Section */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    {/* Replace this with your actual chart component */}
                    <p className="text-center text-muted-foreground">
                        Chart
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
