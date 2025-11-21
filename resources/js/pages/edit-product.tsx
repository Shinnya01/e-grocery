    "use client"

    import { Badge } from '@/components/ui/badge';
    import { Card } from '@/components/ui/card';
    import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
    import AppLayout from '@/layouts/app-layout';
    import { dashboard } from '@/routes';
    import { type BreadcrumbItem } from '@/types';
    import { Head, Link, useForm } from '@inertiajs/react';
    import { ChevronLeft, Upload, ImageIcon, ChevronsUpDown, Check } from 'lucide-react';
    import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    } from "@/components/ui/field";
    import { Input } from "@/components/ui/input";
    import { Textarea } from '@/components/ui/textarea';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Separator } from '@/components/ui/separator';
    import InputError from '@/components/input-error';
    import { toast } from 'sonner';
    import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
    import { cn } from '@/lib/utils';

    const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product', href: '/products' },
    { title: 'Edit Product', href: '' },
    ];

    const foodCategories = [
    "Fruits & Vegetables",
    "Meat & Poultry",
    "Seafood",
    "Dairy & Eggs",
    "Bakery",
    "Snacks & Confectionery",
    "Beverages",
    "Grains & Pasta",
    "Frozen Foods",
    "Condiments & Spices",
    ];
    
    interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    stock: number;
    image?: string; // existing image URL
    category: string;
    }

    interface EditProductProps {
    product: Product;
    }

    export default function EditProduct({ product }: EditProductProps) {
        const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock || '',
        image: null as File | null, // new file only
        category: product.category || '',
        });

    const handleSubmit = (e: any) => {
    e.preventDefault();
    put(`/products/${product.id}`, {
        onSuccess: () => toast.success("Product updated successfully!"),
        onError: () => toast.error("Failed to update product"),
    });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Edit Product" />
        <form onSubmit={handleSubmit}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-6xl w-full mx-auto">
            
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                <Button asChild className='aspect-square' size="sm">
                    <Link href="/products"><ChevronLeft/></Link>
                </Button>
                <h1 className='text-2xl font-bold'>Edit Product</h1>
                </div>
                <div className='space-x-2'>
                <Button variant="destructive"><Link href="/products">Discard</Link></Button>
                <Button variant="default" type='submit' disabled={processing}>Edit</Button>
                </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
                {/* Left side: Details and Images */}
                <div className='col-span-2 space-y-4'>
                {/* Product Details */}
                <Card className='p-4'>
                    <FieldSet>
                    <FieldLegend>Product Details</FieldLegend>
                    <FieldDescription>We need your address to deliver your order.</FieldDescription>
                    <FieldGroup>
                        <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                        </Field>
                        <Field>
                        <FieldLabel htmlFor='description'>Description</FieldLabel>
                        <Textarea
                            id="description"
                            placeholder='Product description'
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                        <FieldDescription>Set a description to the product for better visibility.</FieldDescription>
                        </Field>
                    </FieldGroup>
                    </FieldSet>
                </Card>

                {/* Product Image */}
                <Card className='p-4'>
                    <FieldSet>
                    <div className='flex items-center justify-between'>
                        <FieldLegend>Product Image</FieldLegend>
                        <Button variant="link">Add media from URL</Button>
                    </div>
                    <Label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center border border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer"
                    >
                        <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">Drop your image here</p>
                        <p className="text-xs text-gray-400 mb-4">PNG or JPG (max. 5MB)</p>
                        <Button asChild type="button" variant="outline" className="flex items-center gap-2">
                        <span><Upload className="w-4 h-4"/> Select image</span>
                        </Button>
                        <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                        />
                    </Label>
                    {product.image && !data.image && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Current image:</p>
                        <img src={`/storage/${product.image}`} className="h-24 w-24 object-cover rounded" />
                    </div>
                    )}

                    {data.image && (
                    <div className="mt-2 text-sm text-gray-700">
                        Selected file: <span className="font-medium">{data.image.name}</span>
                    </div>
                    )}

                    </FieldSet>
                </Card>
                </div>

                {/* Right side: Pricing & Category */}
                <div className='space-y-4'>
                {/* Category */}
                <Card className='p-4'>
                    <FieldSet>
                    <FieldLabel>Category</FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={false}
                            className="w-full justify-between"
                        >
                            {data.category ? data.category : "Select category..."}
                            <ChevronsUpDown className="opacity-50 ml-2" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" side='bottom' align='center' sideOffset={4} >
                        <Command>
                            <CommandInput placeholder="Search category..." className="h-9"/>
                            <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {foodCategories.map(cat => (
                                <CommandItem
                                    key={cat}
                                    value={cat}
                                    onSelect={(val) => setData("category", val)}
                                >
                                    {cat}
                                    <Check
                                    className={cn(
                                        "ml-auto",
                                        data.category === cat ? "opacity-100" : "opacity-0"
                                    )}
                                    />
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </CommandList>
                        </Command>
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.category} />
                    </FieldSet>
                </Card>   

                {/* Pricing */}
                <Card className='p-4'>
                    <FieldSet>
                    <FieldLegend className='mb-4'>Pricing</FieldLegend>
                    <Field>
                        <FieldLabel htmlFor='price'>Price</FieldLabel>
                        <Input
                        id="price"
                        type='number'
                        placeholder='$100.00'
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        />
                        <InputError message={errors.price} />
                    </Field>
                    <Separator/>
                    <Field>
                        <FieldLabel htmlFor='stock'>Stock</FieldLabel>
                        <Input
                        id='stock'
                        type='number'
                        placeholder='Number of stock'
                        value={data.stock}
                        onChange={(e) => setData('stock', e.target.value)}
                        />
                        <InputError message={errors.stock} />
                    </Field>
                    </FieldSet>
                </Card>

                
                </div>
            </div>
            </div>
        </form>
        </AppLayout>
    );
    }
