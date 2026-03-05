"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import productsFallback from "@/data/products.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem('mock_products');
        if (stored) setProducts(JSON.parse(stored));
        else setProducts(productsFallback as Product[]);
        setIsLoaded(true);
    }, []);

    const saveProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem('mock_products', JSON.stringify(newProducts));
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            saveProducts(products.filter(p => p.id !== id));
            toast.success("Product deleted successfully");
        }
    };

    const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const price = parseFloat(fd.get("price") as string);
        const name = fd.get("name") as string;

        const newProduct: Product = {
            id: `prod-${Math.random().toString(36).substr(2, 9)}`,
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            shortDescription: fd.get("shortDescription") as string || "New product",
            description: "Description",
            price: isNaN(price) ? 0 : price,
            rating: "0.0",
            installs: 0,
            categoryId: fd.get("categoryId") as string || "themes",
            developerId: "dev-1",
            compatibility: ["4.0.2.3"],
            images: ["https://picsum.photos/seed/new/800/600"],
            features: [],
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        saveProducts([newProduct, ...products]);
        toast.success("Product added successfully");
        // close dialog hack or rely on user to click outside since MVP
    };

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    if (!isLoaded) return <div className="h-[400px] bg-muted/20 animate-pulse rounded-md" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground mt-1">Manage and curate marketplace products.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddProduct} className="space-y-4 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" name="price" type="number" step="0.01" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="categoryId">Category Slug</Label>
                                <Input id="categoryId" name="categoryId" defaultValue="themes" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Input id="shortDescription" name="shortDescription" required />
                            </div>
                            <Button type="submit" className="w-full">Create Product</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground absolute ml-3" />
                <Input placeholder="Search products..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.slice(0, 15).map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">{product.categoryId.replace('-', ' ')}</Badge>
                                </TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground text-center">Showing top 15 results. {filtered.length} total.</p>
        </div>
    );
}
