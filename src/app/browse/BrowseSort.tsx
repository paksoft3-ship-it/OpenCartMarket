"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BrowseSort({ currentSort }: { currentSort: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`/browse?${params.toString()}`);
    };

    return (
        <>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap" htmlFor="sort">Sırala:</label>
            <div className="relative">
                <select
                    id="sort"
                    value={currentSort}
                    onChange={handleSortChange}
                    className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer leading-tight"
                >
                    <option value="popular">En Popüler</option>
                    <option value="newest">En Yeniler</option>
                    <option value="rating">En Yüksek Puan</option>
                    <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
            </div>
        </>
    );
}
