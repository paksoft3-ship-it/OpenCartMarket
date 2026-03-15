"use client";

import { Category } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface BrowseFiltersProps {
    categories: Category[];
    currentParams: {
        query: string;
        category: string;
        minPrice?: number;
        maxPrice?: number;
        sort: string;
    };
}

export default function BrowseFilters({ categories, currentParams }: BrowseFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(currentParams.minPrice?.toString() || "");
    const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice?.toString() || "");

    const setFilter = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            router.push(`/browse?${params.toString()}`);
        },
        [router, searchParams]
    );

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Filter Section: Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                    Kategoriler
                </h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="category"
                            checked={!currentParams.category || currentParams.category === "all"}
                            onChange={() => setFilter("category", "")}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Tümü</span>
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">1240</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="category"
                            checked={currentParams.category === "themes"}
                            onChange={() => setFilter("category", "themes")}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Temalar</span>
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">342</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="category"
                            checked={currentParams.category === "modules"}
                            onChange={() => setFilter("category", "modules")}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Ödeme Modülleri</span>
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">156</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="category"
                            checked={currentParams.category === "shipping"}
                            onChange={() => setFilter("category", "shipping")}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Kargo Modülleri</span>
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">89</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="category"
                            checked={currentParams.category === "seo"}
                            onChange={() => setFilter("category", "seo")}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">SEO Araçları</span>
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">64</span>
                    </label>
                </div>
            </div>

            {/* Filter Section: OpenCart Version */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">OpenCart Sürümü</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input checked className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" readOnly />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">4.x (En Yeni)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">3.0.x</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">2.3.x</span>
                    </label>
                </div>
            </div>

            {/* Filter Section: Rating */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Değerlendirme</h3>
                <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300">
                        <div className="flex items-center text-amber-400 text-sm">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="ml-2 text-slate-600 dark:text-slate-400">5.0</span>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300">
                        <div className="flex items-center text-amber-400 text-sm">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">star</span>
                            <span className="ml-2 text-slate-600 dark:text-slate-400">4.0+</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Filter Section: Price */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Fiyat Aralığı</h3>
                <div className="space-y-4">
                    <input
                        className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        max="1000"
                        min="0"
                        type="range"
                        value={maxPrice || "1000"}
                        onChange={(e) => {
                            setMaxPrice(e.target.value);
                            setFilter("maxPrice", e.target.value);
                        }}
                    />
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₺</span>
                            <input
                                className="w-full text-xs py-1.5 pl-6 pr-2 border border-slate-200 dark:border-slate-600 rounded bg-transparent focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-200"
                                placeholder="Min"
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={() => setFilter("minPrice", minPrice)}
                            />
                        </div>
                        <span className="text-slate-400">-</span>
                        <div className="relative w-full">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₺</span>
                            <input
                                className="w-full text-xs py-1.5 pl-6 pr-2 border border-slate-200 dark:border-slate-600 rounded bg-transparent focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-200"
                                placeholder="Max"
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onBlur={() => setFilter("maxPrice", maxPrice)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
