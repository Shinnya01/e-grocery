import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Search, ShoppingCart } from "lucide-react";

export default function Products(){
    return (
      <AppLayout>
        <Head title="Products"/>
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex-1 grid grid-cols-4 gap-4">
                <div className="col-span-3 h-fit space-y-4">
                    <InputGroup className="max-w-lg">
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                        <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
                    </InputGroup>
                    {/* CATEGORIES */}
                    <ScrollArea className="w-full rounded-md whitespace-nowrap">
                    <div className="flex w-max space-x-4 pb-4">
                        {[...Array(10)].map((_,i) => (
                            <Card className="p-0 rounded-lg overflow-hidden">
                                <PlaceholderPattern className="h-30 w-30 bg-green-100"/>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <div className="grid grid-cols-5 gap-2  ">
                    {[...Array(50)].map((_, i) => (
                        <Card key={i} className="p-0 flex rounded-lg overflow-hidden gap-0">
                            <PlaceholderPattern className="min-h-30 h-30 w-full bg-white" />
                            <div className="grid grid-cols-[1fr_auto] items-end p-2">
                                <div >
                                    <h3 className="text-base font-medium">Lorem, ipsum.</h3>
                                    <p className="text-sm text-gray-500">$00.00</p>
                                </div>      
                                <Button size="sm" variant="outline">
                                    <ShoppingCart/>
                                </Button>  
                            </div>
                        </Card>
                    ))}
                </div>

                </div>
                
                {/* CART */}
                <Card className="flex-1 h-132 sticky top-20 self-start">
                    <CardHeader>
                        <CardTitle>Your Cart</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center m-auto">
                        <p>🍪</p>
                        <p>Your cart is empty.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </AppLayout> 
    );
}