"use client";

import { Category } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface ActiveFilterTagsProps {
    category: string;
    query: string;
    minPrice?: number;
    maxPrice?: number;
    categories: Category[];
}

export default function ActiveFilterTags({ category, query, minPrice, maxPrice, categories }: ActiveFilterTagsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const removeFilter = useCallback(
        (key: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(key);
            router.push(`/browse?${params.toString()}`);
        },
        [router, searchParams]
    );

    const clearAll = useCallback(() => {
        router.push("/browse");
    }, [router]);

    const hasFilters = category || query || minPrice || maxPrice;

    if (!hasFilters) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {category && category !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {categories.find((c) => c.id === category)?.name || category}
                    <button onClick={() => removeFilter("category")} className="hover:bg-primary/20 rounded-full p-0.5">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                </span>
            )}
            {query && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    "{query}"
                    <button onClick={() => removeFilter("q")} className="hover:bg-primary/20 rounded-full p-0.5">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                </span>
            )}
            {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {minPrice || 0}₺ - {maxPrice || "∞"}₺
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete("minPrice");
                            params.delete("maxPrice");
                            router.push(`/browse?${params.toString()}`);
                        }}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                </span>
            )}
            <button onClick={clearAll} className="text-xs text-slate-500 hover:text-primary font-medium underline px-2">
                Aramayı Temizle
            </button>
        </div>
    );
}
