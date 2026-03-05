"use client";

import { useMockData } from "@/lib/hooks/useMockData";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function DownloadsPage() {
    const { licenses, isLoaded } = useMockData();

    if (!isLoaded) return <div className="space-y-4 animate-pulse"><Skeleton className="h-[200px] w-full rounded-xl" /></div>;

    // Group by product ID effectively to show unique downloads
    const uniqueProducts = Array.from(new Map(licenses.map(l => [l.productId, l])).values());

    return (
        <div className="max-w-7xl mx-auto space-y-8 w-full">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">İndirmelerim</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and download your purchased themes and modules.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 shadow-sm outline-none placeholder:text-slate-400 transition-shadow text-slate-900 dark:text-white" placeholder="Search your downloads..." />
                </div>
            </div>

            {/* Downloads List (Table Alternative with Cards) */}
            <div className="flex flex-col gap-4">
                {/* Table Header (Hidden on mobile) */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2">Version</div>
                    <div className="col-span-3">License Key</div>
                    <div className="col-span-1 text-center">Update</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {uniqueProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-5xl mb-4 opacity-50">download</span>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No downloads available</h3>
                        <p className="mt-1">You haven't purchased any extensions yet.</p>
                        <Link href="/browse" className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    uniqueProducts.map((license) => (
                        <div key={license.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] transition-all duration-300">
                            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start lg:items-center">
                                {/* Product Info */}
                                <div className="col-span-4 flex items-center gap-4 w-full">
                                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden relative flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl opacity-50 absolute">extension</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary text-base mb-1 hover:underline cursor-pointer line-clamp-1 pr-4">{license.productName}</h3>
                                        <p className="text-xs text-slate-500 font-medium">OpenCart Extension</p>
                                    </div>
                                </div>
                                {/* Version Badge */}
                                <div className="col-span-2 w-full lg:w-auto flex lg:justify-start">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        v2.1.0
                                    </div>
                                </div>
                                {/* License Key */}
                                <div className="col-span-3 w-full lg:w-auto">
                                    <div className="flex items-center gap-2 max-w-full">
                                        <div className="font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 truncate flex-grow lg:flex-grow-0 lg:w-48">
                                            {license.key || "A1B2-C3D4-E5F6-G7H8"}
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-primary bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 rounded-lg transition-colors border-slate-200 dark:border-slate-700" title="Copy License Key" onClick={() => {
                                            if (license.key) navigator.clipboard.writeText(license.key);
                                        }}>
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Last Update */}
                                <div className="col-span-1 w-full lg:w-auto flex lg:justify-center text-sm font-medium text-slate-500">
                                    <span className="lg:hidden text-xs uppercase mr-2 text-slate-400">Updated:</span>
                                    {new Date().toLocaleDateString('tr-TR')}
                                </div>
                                {/* Actions */}
                                <div className="col-span-2 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-100 dark:border-slate-700 lg:border-none">
                                    <Link className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors" href={`/product/${license.productId}?tab=docs`}>
                                        Docs
                                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                    </Link>
                                    <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors" onClick={() => alert('Download started... (Mock)')}>
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
