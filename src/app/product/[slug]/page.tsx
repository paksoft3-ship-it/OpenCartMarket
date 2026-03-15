import { getProductBySlug } from "@/lib/data/products";
import { getDeveloperById } from "@/lib/data/developers";
import { getReviewsByProduct } from "@/lib/data/reviews";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/marketplace/AddToCartButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const unresolvedParams = await params;
    const product = await getProductBySlug(unresolvedParams.slug);
    if (!product) return {};
    return {
        title: `${product.name} | OCMarket`,
        description: product.shortDescription,
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const unresolvedParams = await params;
    const product = await getProductBySlug(unresolvedParams.slug);
    if (!product) notFound();

    const developer = await getDeveloperById(product.developerId);
    const reviews = await getReviewsByProduct(product.id);
    const numericRating = Number(product.rating);

    return (
        <div className="flex-grow max-w-[1280px] mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-8 space-y-8">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100">Ana Sayfa</Link>
                    <span className="mx-2">/</span>
                    <Link href="/browse" className="hover:text-slate-900 dark:hover:text-slate-100">Temalar</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 dark:text-slate-100">{product.name}</span>
                </nav>

                {/* Hero Image Preview */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 aspect-[16/10] relative group">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                        </div>
                    )}
                    {product.demoUrl && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                            <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all transform translate-y-4 group-hover:translate-y-0">
                                <span className="material-symbols-outlined">visibility</span>
                                Tam Ekran Önizleme
                            </a>
                        </div>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-slate-200 dark:border-slate-800 sticky top-16 bg-background dark:bg-background z-40 pt-4">
                    <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
                        <a href="#overview" className="border-b-2 border-primary text-primary font-bold pb-4 text-sm whitespace-nowrap">Genel Bakış</a>
                        <a href="#features" className="border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium pb-4 text-sm whitespace-nowrap transition-colors">Özellikler</a>
                        <a href="#screenshots" className="border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium pb-4 text-sm whitespace-nowrap transition-colors">Ekran Görüntüleri</a>
                        <a href="#docs" className="border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium pb-4 text-sm whitespace-nowrap transition-colors">Dokümantasyon</a>
                        <a href="#reviews" className="border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium pb-4 text-sm whitespace-nowrap transition-colors flex items-center gap-2">
                            İncelemeler <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">{reviews.length}</span>
                        </a>
                    </nav>
                </div>

                {/* Content Area - Overview */}
                <div id="overview" className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <div className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />

                    {/* Feature Grid */}
                    <h3 id="features" className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-10 mb-6">Öne Çıkan Özellikler</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {product.features.map((feature, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                                <div className="bg-accent/10 p-3 rounded-lg text-accent shrink-0">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{feature}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Screenshots Horizontal Scroll */}
                    <h3 id="screenshots" className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-10 mb-6">Ekran Görüntüleri</h3>
                    <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar">
                        {product.images.slice(1).map((img, i) => (
                            <div key={i} className="min-w-[300px] h-[200px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                                <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <div className="lg:col-span-4 relative">
                <div className="sticky top-24 space-y-6">
                    {/* Main Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md capitalize">{product.categoryId.replace('-', ' ')}</span>
                            {product.tags.includes('premium') && (
                                <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-md">Premium</span>
                            )}
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-4xl font-black text-slate-900 dark:text-slate-100">${product.price.toFixed(2)}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1 line-through">${(product.price * 1.5).toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < numericRating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{product.rating} ({reviews.length} Değerlendirme)</span>
                        </div>

                        <div className="space-y-3 mb-8">
                            <AddToCartButton product={product} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary/20">
                                <span className="material-symbols-outlined">shopping_cart</span>
                                Satın Al
                            </AddToCartButton>
                            {product.demoUrl ? (
                                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined">preview</span>
                                    Canlı Demo
                                </a>
                            ) : (
                                <button disabled className="w-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50">
                                    <span className="material-symbols-outlined">preview</span>
                                    Canlı Demo
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">download</span>
                                <span>{product.installs.toLocaleString()} Kurulum</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">verified</span>
                                <span>Kalite Kontrollü</span>
                            </div>
                        </div>
                    </div>

                    {/* Support Card */}
                    {developer && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">support_agent</span>
                                Destek & Güncelleme
                            </h3>
                            <ul className="space-y-4 text-sm mb-6">
                                <li className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-slate-400">Son Güncelleme:</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{new Date(product.updatedAt).toLocaleDateString()}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-slate-400">Lisans:</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{product.license || "Tek Site (Standard)"}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-slate-400">Yazar:</span>
                                    <Link href={`/developer/${developer.id}`} className="font-medium text-primary hover:underline cursor-pointer">
                                        {developer.name}
                                    </Link>
                                </li>
                            </ul>
                            <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                                <span className="material-symbols-outlined text-sm">forum</span>
                                Destek Masası
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Bottom Bar (Mobile/Tablet focus or long scroll) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 transform translate-y-0 transition-transform lg:hidden">
                <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="hidden sm:block truncate">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                            <span className="text-slate-500 text-xs">Tek Seferlik Ödeme</span>
                        </div>
                    </div>
                    <div className="block sm:hidden">
                        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                        {product.demoUrl ? (
                            <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold py-3 px-4 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined">preview</span>
                            </a>
                        ) : (
                            <button disabled className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed">
                                <span className="material-symbols-outlined">preview</span>
                            </button>
                        )}
                        <AddToCartButton product={product} className="flex-[2] sm:flex-none bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                            Sepete Ekle
                        </AddToCartButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
