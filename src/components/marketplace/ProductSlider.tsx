"use client";

import { useRef } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductSliderProps {
    title: string;
    badge?: {
        text: string;
        type: "new" | "trending";
    };
    products: Product[];
    viewAllLink: string;
}

export function ProductSlider({ title, badge, products, viewAllLink }: ProductSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="flex flex-col gap-6 relative group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
                    {badge && (
                        <div className={`flex items-center gap-1 ${badge.type === "new"
                                ? "bg-primary/10 text-primary"
                                : "bg-orange-50 dark:bg-orange-500/10 text-orange-500"
                            } px-2 py-1 rounded-md`}>
                            {badge.type === "trending" && <span className="material-symbols-outlined text-[18px]">local_fire_department</span>}
                            <span className="text-xs font-bold uppercase tracking-wider">{badge.text}</span>
                        </div>
                    )}
                </div>
                <Link
                    href={viewAllLink}
                    className="text-primary font-medium hover:text-primary/80 flex items-center gap-1 transition-colors text-sm"
                >
                    Tümünü Gör
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll("left")}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 pt-2 -mx-2 px-2 snap-x scroll-smooth"
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-none w-[280px] snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
