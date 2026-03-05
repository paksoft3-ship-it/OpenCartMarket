"use client";

import { useMockData } from "@/lib/hooks/useMockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Key, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function LicensesPage() {
    const { licenses, isLoaded } = useMockData();
    const [editingDomain, setEditingDomain] = useState<string | null>(null);

    if (!isLoaded) return <div className="h-[400px] bg-muted/20 animate-pulse rounded-md" />;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("License key copied to clipboard!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">License Keys</h1>
                <p className="text-muted-foreground mt-1">Manage licenses and active domains for your premium extensions.</p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>License Key</TableHead>
                            <TableHead>Registered Domain</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {licenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No licenses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            licenses.map((license) => (
                                <TableRow key={license.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        <Link href={`/product/${license.productId}`} className="hover:underline text-primary flex items-center gap-1.5 align-middle">
                                            {license.productName} <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm tracking-wider">
                                                {license.key}
                                            </code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(license.key)}>
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {editingDomain === license.id ? (
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                <Input defaultValue={license.domain || ''} placeholder="example.com" className="h-8 text-sm" />
                                                <Button size="sm" onClick={() => {
                                                    toast.success("Domain updated (Mock)");
                                                    setEditingDomain(null);
                                                }}>Save</Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {license.domain ? (
                                                    <span className="text-sm">{license.domain}</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">None</span>
                                                )}
                                                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setEditingDomain(license.id)}>
                                                    Edit
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={license.status === 'active' ? 'default' : 'destructive'} className={license.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                            {license.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-lg flex gap-4 items-start border border-blue-100 text-sm">
                <Key className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-blue-900 leading-relaxed">
                    <p className="font-semibold mb-1">About Licenses</p>
                    <p>Each license key can only be activated on one live domain at a time. If you need to migrate your store to a new domain, you must update the registered domain here first. Development environments (localhost, .local, .test) do not require license activation.</p>
                </div>
            </div>
        </div>
    );
}
