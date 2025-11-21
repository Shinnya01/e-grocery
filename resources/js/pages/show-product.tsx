"use client"

import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FieldSet, FieldLegend, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from "@/types";

interface Product {
  id: number;
  name: string;
  price: number | string;
  description: string;
  stock: number;
  image?: string;
  category: string;
}

interface ShowProductProps {
  product: Product;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Product", href: "/products" },
  { title: "View Product", href: "#" },
];

export default function ShowProduct({ product }: ShowProductProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View Product" />
      <div className="flex flex-col gap-4 p-4 max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild size="sm" className="aspect-square">
              <Link href="/products">
                <ChevronLeft />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">View Product</h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left: Details & Image */}
          <div className="col-span-2 space-y-4">
            {/* Product Details */}
            <Card className="p-4">
              <FieldSet>
                <FieldLegend>Product Details</FieldLegend>
                <FieldGroup>
                  <div className="mb-2">
                    <FieldLabel>Name</FieldLabel>
                    <Input value={product.name} readOnly />
                  </div>
                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea value={product.description} readOnly rows={4} />
                  </div>
                </FieldGroup>
              </FieldSet>
            </Card>

            {/* Product Image */}
            <Card className="p-4">
              <FieldSet>
                <FieldLegend>Product Image</FieldLegend>
                {product.image ? (
                  <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="h-48 w-48 object-cover rounded"
                  />
                ) : (
                  <p className="text-gray-500">No image uploaded</p>
                )}
              </FieldSet>
            </Card>
          </div>

          {/* Right: Category & Stock/Price */}
          <div className="space-y-4">
            <Card className="p-4">
              <FieldSet>
                <FieldLegend>Category</FieldLegend>
                <Badge variant="outline">{product.category}</Badge>
              </FieldSet>
            </Card>

            <Card className="p-4">
              <FieldSet>
                <FieldLegend>Pricing & Stock</FieldLegend>
                <div className="mb-2">
                  <FieldLabel>Price</FieldLabel>
                  <Input value={`$${product.price}`} readOnly />
                </div>
                <div>
                  <FieldLabel>Stock</FieldLabel>
                  <Input value={product.stock} readOnly />
                </div>
              </FieldSet>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
