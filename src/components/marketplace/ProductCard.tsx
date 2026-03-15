import Link from "next/link";
import { Product } from "@/lib/types";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

function getStableReviewCount(product: Product): number {
    const numericId = Number.parseInt(product.id.replace(/\D/g, ""), 10) || 0;
    return 10 + ((numericId * 37 + product.installs + Math.round(Number(product.rating) * 10)) % 200);
}

function isPublicUrl(url?: string): boolean {
    if (!url) return false;
    try {
        const { hostname } = new URL(url);
        return hostname !== "localhost" && hostname !== "127.0.0.1" && !hostname.startsWith("192.168.");
    } catch {
        return false;
    }
}

export function ProductCard({ product }: ProductCardProps) {
    const reviewCount = getStableReviewCount(product);
    const hasDemoUrl = isPublicUrl(product.demoUrl);

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col h-full relative">
            {/* Image Container — link wraps image ONLY, no nested links */}
            <Link href={`/product/${product.slug}`} className="block aspect-[4/3] bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                <Image
                    src={product.images[0] || "https://picsum.photos/seed/placeholder/800/600"}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold text-slate-800 dark:text-slate-100 rounded shadow-sm border border-white/20 capitalize">
                        {product.categoryId.replace('-', ' ')}
                    </span>
                    {Number(product.rating) >= 4.5 && (
                        <span className="px-2 py-1 bg-accent/90 backdrop-blur text-xs font-bold text-white rounded shadow-sm border border-white/20">YENİ</span>
                    )}
                </div>
            </Link>

            {/* Hover Overlay — sibling to the image Link, positioned absolutely over image area */}
            <div className="absolute top-0 inset-x-0 aspect-[4/3] flex items-end p-3 md:p-4 bg-gradient-to-t from-slate-950/85 via-slate-900/55 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="grid grid-cols-2 gap-2 w-full pointer-events-auto">
                    {hasDemoUrl ? (
                        <a
                            href={product.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/30 bg-white/95 px-2 text-[11px] font-semibold text-slate-900 shadow-md transition-colors hover:bg-white whitespace-nowrap leading-none sm:px-3 sm:text-xs"
                        >
                            Canlı Demo
                        </a>
                    ) : (
                        <span className="inline-flex h-10 items-center justify-center rounded-xl border border-white/20 bg-white/30 px-2 text-[11px] font-semibold text-white/60 whitespace-nowrap leading-none sm:px-3 sm:text-xs cursor-not-allowed" title="Demo yakında eklenecek">
                            Demo Yakında
                        </span>
                    )}
                    <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-2 text-[11px] font-semibold text-white shadow-md shadow-primary/30 transition-colors hover:bg-primary/90 whitespace-nowrap leading-none sm:px-3 sm:text-xs"
                    >
                        Detayları Gör
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg leading-tight text-primary line-clamp-2">
                        <Link href={`/product/${product.slug}`} className="hover:underline">{product.name}</Link>
                    </h3>
                    <span className="text-accent font-bold text-lg shrink-0">
                        {product.price === 0 ? "Ücretsiz" : `₺${product.price.toFixed(2)}`}
                    </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.shortDescription}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
                        <span className="text-xs text-slate-400">({reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>{product.installs >= 1000 ? `${(product.installs / 1000).toFixed(1)}k+` : product.installs} Kurulum</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
