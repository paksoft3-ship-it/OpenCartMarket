"use client";

import { useMockData } from "@/lib/hooks/useMockData";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function DeveloperAddProductPage() {
    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Downloads */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Toplam İndirme</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,245</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">download</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-emerald-500 text-sm font-medium">
                            <span className="material-symbols-outlined text-sm">trending_up</span> +15%
                        </span>
                        <span className="text-xs text-slate-500">geçen aya göre</span>
                    </div>
                    {/* Abstract Sparkline */}
                    <div className="mt-4 h-10 w-full rounded" style={{ background: "linear-gradient(90deg, rgba(91,108,255,0.1) 0%, rgba(91,108,255,0.3) 50%, rgba(91,108,255,0.1) 100%)", clipPath: "polygon(0 100%, 0 80%, 20% 60%, 40% 70%, 60% 30%, 80% 50%, 100% 20%, 100% 100%)" }}></div>
                </div>

                {/* Revenue */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Toplam Kazanç</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">$4,500</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <span className="material-symbols-outlined">attach_money</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-emerald-500 text-sm font-medium">
                            <span className="material-symbols-outlined text-sm">trending_up</span> +22%
                        </span>
                        <span className="text-xs text-slate-500">geçen aya göre</span>
                    </div>
                    {/* Abstract Sparkline */}
                    <div className="mt-4 h-10 w-full rounded" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.3) 50%, rgba(16,185,129,0.1) 100%)", clipPath: "polygon(0 100%, 0 90%, 20% 70%, 40% 80%, 60% 40%, 80% 20%, 100% 10%, 100% 100%)" }}></div>
                </div>

                {/* Rating */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Ortalama Puan</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">4.8</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <span className="material-symbols-outlined">star</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <span className="material-symbols-outlined text-sm filled">star</span>
                        <span className="material-symbols-outlined text-sm filled">star</span>
                        <span className="material-symbols-outlined text-sm filled">star</span>
                        <span className="material-symbols-outlined text-sm filled">star</span>
                        <span className="material-symbols-outlined text-sm">star_half</span>
                        <span className="text-xs text-slate-500 ml-2">(124 değerlendirme)</span>
                    </div>
                    <div className="mt-2 h-10 w-full rounded flex items-end">
                        <div className="w-1/5 h-2 bg-slate-200 dark:bg-slate-800 rounded-t mx-0.5"></div>
                        <div className="w-1/5 h-4 bg-slate-200 dark:bg-slate-800 rounded-t mx-0.5"></div>
                        <div className="w-1/5 h-8 bg-yellow-500/40 rounded-t mx-0.5"></div>
                        <div className="w-1/5 h-10 bg-yellow-500/70 rounded-t mx-0.5"></div>
                        <div className="w-1/5 h-full bg-yellow-500 rounded-t mx-0.5"></div>
                    </div>
                </div>
            </div>

            <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ürün Detayları</h2>
                <p className="text-sm text-slate-500 mt-1">OpenCart temanızı veya modülünüzü pazaryerine yükleyin.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Panel: Form */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Ürün Başlığı</label>
                                <input className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Örn: Modern E-Ticaret Teması" type="text" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Fiyat ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                                        <input className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="49.00" type="number" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Kategori</label>
                                    <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none">
                                        <option>Tema</option>
                                        <option>Modül - Ödeme</option>
                                        <option>Modül - Kargo</option>
                                        <option>Modül - SEO</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Açıklama</label>
                                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col">
                                    <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-2 flex gap-2">
                                        <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                        <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                        <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                        <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"><span className="material-symbols-outlined text-[18px]">link</span></button>
                                    </div>
                                    <textarea className="w-full h-40 p-4 bg-white dark:bg-slate-900 border-none resize-none focus:ring-0 text-sm text-slate-900 dark:text-slate-100 outline-none" placeholder="Ürününüzün özelliklerini ve detaylarını buraya yazın..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Version Management */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Versiyon Yönetimi</h3>
                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Versiyon 1.0.0</span>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Değişiklik Günlüğü (Changelog)</label>
                            <textarea className="w-full h-24 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="- İlk sürüm yayınlandı."></textarea>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">update</span>
                                Güncelleme Yükle
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Uploads */}
                <div className="lg:w-96 space-y-6">
                    {/* Dropzone: ZIP */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">ZIP Dosyası</h3>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">folder_zip</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Dosyayı buraya sürükleyin</p>
                            <p className="text-xs text-slate-500 mt-1">veya seçmek için tıklayın (Max 50MB)</p>
                        </div>
                    </div>

                    {/* Dropzone: Screenshots */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Ekran Görüntüleri</h3>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">image</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Görselleri sürükleyin</p>
                            <p className="text-xs text-slate-500 mt-1">1920x1080px önerilir</p>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {/* Preview Thumbnails */}
                            <div className="w-16 h-16 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0 relative group">
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                    <span className="material-symbols-outlined text-white text-[16px]">delete</span>
                                </div>
                            </div>
                            <div className="w-16 h-16 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0 relative group">
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                    <span className="material-symbols-outlined text-white text-[16px]">delete</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dropzone: Documentation */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Dokümantasyon (Opsiyonel)</h3>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 mb-2 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">PDF yükle</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
