import { getCategories } from "@/lib/data/categories";
import { searchProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/marketplace/ProductCard";
import BrowseFilters from "./BrowseFilters";
import BrowseSort from "./BrowseSort";
import ActiveFilterTags from "./ActiveFilterTags";

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const unresolvedSearchParams = await searchParams;
    const query = typeof unresolvedSearchParams.q === "string" ? unresolvedSearchParams.q : "";
    const category = typeof unresolvedSearchParams.category === "string" ? unresolvedSearchParams.category : "";
    const minPrice = typeof unresolvedSearchParams.minPrice === "string" ? parseInt(unresolvedSearchParams.minPrice) : undefined;
    const maxPrice = typeof unresolvedSearchParams.maxPrice === "string" ? parseInt(unresolvedSearchParams.maxPrice) : undefined;
    const sort = typeof unresolvedSearchParams.sort === "string" ? unresolvedSearchParams.sort : "popular";

    const categories = await getCategories();
    const products = await searchProducts(query, category, minPrice, maxPrice, sort);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            {/* Page Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">OpenCart Temaları ve Modülleri</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Mağazanız için en iyi ve güncel eklentileri keşfedin. Türkiye'nin en büyük OpenCart pazaryeri.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <BrowseSort currentSort={sort} />
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                    <BrowseFilters categories={categories} currentParams={{ query, category, minPrice, maxPrice, sort }} />
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Active Filters Tags (Optional/Contextual) */}
                    <ActiveFilterTags
                        category={category}
                        query={query}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        categories={categories}
                    />

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-24 text-center bg-white/50 dark:bg-slate-800/50">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">search_off</span>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ürün bulunamadı</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">Filtrelerinizi veya arama sorgunuzu değiştirmeyi deneyin.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {products.length > 0 && (
                        <p className="mt-8 text-center text-sm text-slate-500">
                            {products.length} ürün bulundu
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
