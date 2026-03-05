import Link from "next/link";

export default function CompatibilityPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
                        Sürüm Uyumluluğu ve Teknik Gereksinimler
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        OpenCart temanızın veya modülünüzün sorunsuz çalışması için gerekli olan teknik standartları ve sürüm bilgilerini burada bulabilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Compatibility & Tech Reqs */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Version Compatibility */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-border">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">verified</span>
                                Sürüm Uyumluluğu
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
                                    <span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">OpenCart 3.x</span>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
                                    <span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">OpenCart 4.x</span>
                                </div>
                            </div>
                            <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm italic">
                                * Bazı eski modüller sadece 3.x sürümlerini destekleyebilir. Lütfen ürün detay sayfasındaki uyumluluk listesini kontrol edin.
                            </p>
                        </div>

                        {/* Technical Requirements */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-border">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">settings_suggest</span>
                                Teknik Gereksinimler
                            </h2>
                            <div className="divide-y divide-border">
                                <div className="flex justify-between items-center py-5">
                                    <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg">PHP Sürümü</p>
                                    <p className="font-bold text-slate-900 dark:text-white text-lg">7.4+</p>
                                </div>
                                <div className="flex justify-between items-center py-5">
                                    <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg">MySQL / MariaDB</p>
                                    <p className="font-bold text-slate-900 dark:text-white text-lg">5.7+ / 10.3+</p>
                                </div>
                                <div className="flex justify-between items-center py-5">
                                    <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg">IonCube Loader</p>
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20">
                                        Gerekli (Bazı Modüller İçin)
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-5">
                                    <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg">cURL & OpenSSL</p>
                                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-sm font-bold rounded-full border border-emerald-500/20">
                                        Aktif Olmalı
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Warnings & CTA */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Warning Card */}
                        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-200 dark:border-amber-900/30 flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">Modül Çakışma Uyarısı</h4>
                                <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
                                    VQMod ve OCMod gibi eklentilerle çakışma yaşanabilir. Lütfen kurulumdan önce sisteminizi yedekleyin.
                                </p>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Mağazam uyumlu mu?</h3>
                                <p className="text-white/80 mb-8 leading-relaxed">
                                    Sistem gereksinimlerinizi otomatik olarak kontrol edelim ve sorunsuz bir kurulum sağlayalım.
                                </p>
                                <button className="w-full bg-white text-primary hover:bg-slate-50 transition-all font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                                    <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
                                    Uyumluluğu Kontrol Et
                                </button>
                            </div>
                        </div>

                        {/* Need Help Card */}
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 border border-border">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Destek Gerekiyor mu?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                Teknik gereksinimler konusunda yardıma ihtiyacınız varsa bizimle iletişime geçin.
                            </p>
                            <Link href="/contact" className="text-primary font-bold hover:underline flex items-center gap-1">
                                İletişime Geç <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
