import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

export default function GuidesPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            {/* Hero Section / Header */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-6">
                        Rehberler ve Eğitimler
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        OpenCart mağazanızı en iyi şekilde yönetmeniz için hazırladığımız kapsamlı rehberleri keşfedin.
                    </p>
                </div>
            </section>

            {/* Installation Guide Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900/40">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-4">
                            Sadece 10 Dakikada Kurulum
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            OpenCart temanızı veya modülünüzü dakikalar içinde mağazanıza kurun ve satışa hemen başlayın. Teknik bilgi gerektirmez.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 flex flex-col gap-6 border border-border transition-all hover:shadow-md">
                            <div className="w-full aspect-video bg-primary/5 rounded-xl flex items-center justify-center relative overflow-hidden border border-primary/10">
                                <span className="material-symbols-outlined text-5xl text-primary">cloud_download</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Satın Al ve ZIP İndir</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Güvenli ödeme sonrasında eklenti dosyanızı hemen bilgisayarınıza .zip formatında indirin.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 flex flex-col gap-6 border border-border transition-all hover:shadow-md">
                            <div className="w-full aspect-video bg-primary/5 rounded-xl flex items-center justify-center relative overflow-hidden border border-primary/10">
                                <span className="material-symbols-outlined text-5xl text-primary">upload_file</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">OpenCart Paneline Yükle</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    OpenCart Admin panelinden Eklentiler sekmesine gidip indirdiğiniz ZIP dosyasını kolayca yükleyin.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 flex flex-col gap-6 border border-border transition-all hover:shadow-md">
                            <div className="w-full aspect-video bg-emerald-500/5 rounded-xl flex items-center justify-center relative overflow-hidden border border-emerald-500/10">
                                <span className="material-symbols-outlined text-5xl text-emerald-500">check_circle</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Etkinleştir ve Yenile</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Modifikasyonları yenileyin, eklentiyi etkinleştirin ve yeni özelliklerin keyfini çıkarmaya başlayın.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="h-1 w-12 bg-primary mb-4 rounded-full"></div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Bilgi Merkezinizi Keşfedin</h2>
                        </div>
                        <Link className="group inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors" href="/blog">
                            Tüm Makaleler
                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                category: "Geliştirici",
                                time: "8 dk",
                                title: "XML Import ile Ürün Yönetimi",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdzKUcIXHMrcdMcpZkZ5Y29dmQsAmx2psaE2iYhyLAa3O6jCXGm_DlNT4BQuBmvWNXoQec1GnzQYheq7RogQktF_0knNL4ciVKoJGhdzspaml4saE7kwsh60CjqYF8XLkensECo41LF9ILY1G0Ls37ceK4pmBeoZMSQY6d7QWdyCPe5_wXkxiupwQ6lQNep6FPATdTdcbhwKUbvXiA3isdfmNT38pQQ1sqNCq6iJ87N4hD7ki01ZRqDcLm0iNi7gRlLiveNDw4rXY"
                            },
                            {
                                category: "Performans",
                                time: "12 dk",
                                title: "OpenCart Hız Optimizasyonu Rehberi",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo1TyYjsLc4SyfR0OITvKemnYTONkHh1otRM9omA3_sEWAWMicg6hubg4vcOB17twTSsYlZ4zCLADOBiEBdaac8_T4z_A7tkdQ9FIxbrYLcg2x4a-khSWBNUKEhq2TtPrIVkeAbDTinajOVSThiTttWGmti6NfGIVHnaWS-72Qu7XYt39oOmDFd12fW4i3CEVHA7UnbeFTPH0EGo4pD5CLYI5eVQTVMuR6gwxCs5w4yqZdVoU3BVq4KmYYYNJCUv_e1d0rDdrn-sg"
                            },
                            {
                                category: "Pazarlama",
                                time: "10 dk",
                                title: "Ödeme Sayfası Dönüşüm Artırma",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1FNBhQRdS3bRgckRsARQs0aTRMvyzvgwATt8fvqy3lt-PdAXnIVaF5kienjGvTNw1NQSoqwzCiFZ1yaJ7c5bPkG2d7JqBkatZ_udzLtJH63a9wP5IbJqZN9vSOfOziszeQ5rjGO2Vny_XquzIJ84PjFgJOYf8weGU-HRnV8eOKAMa6tKWnVXvD6HvHlTWcM9XyLKZBtKgghZS1_NsydEpW8mLJaJj31zXfNv9t1bHIqY2SNdEynXCh4hfP4phR-DUoT-6DjcpxkA"
                            }
                        ].map((article, i) => (
                            <Link key={i} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border" href="#">
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    <img alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={article.img} />
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {article.time} okuma süresi
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Help CTA */}
            <section className="max-w-7xl mx-auto px-4 py-16 mb-16">
                <div className="bg-primary rounded-[2rem] p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-3xl font-bold mb-4 relative z-10">Daha fazla yardıma mı ihtiyacınız var?</h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto relative z-10">
                        Destek ekibimiz her türlü sorunuz için burada. Hemen iletişime geçin.
                    </p>
                    <Link href="/support" className="inline-flex items-center justify-center h-12 px-8 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors relative z-10">
                        Destek Ekibine Yazın
                    </Link>
                </div>
            </section>
        </div>
    );
}
