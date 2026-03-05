import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { BookOpen, Rocket, Download, Code, Shield, HelpCircle, ChevronRight, Copy } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dokümantasyon | OpenCartTR Market",
    description: "Geliştirici rehberleri, kurulum adımları ve API referansları.",
};

export default function DocsPage() {
    return (
        <div className="flex flex-col w-full bg-white dark:bg-background-dark min-h-screen">
            <Container className="py-12 px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-72 shrink-0 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Başlangıç</h3>
                            <nav className="flex flex-col gap-1">
                                <Link href="#intro" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary/10 text-primary">
                                    <Rocket className="size-4" /> Giriş
                                </Link>
                                <Link href="#installation" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Download className="size-4" /> Kurulum Rehberi
                                </Link>
                                <Link href="#licensing" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Shield className="size-4" /> Lisanslama
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Geliştirici</h3>
                            <nav className="flex flex-col gap-1">
                                <Link href="#api" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Code className="size-4" /> API Referansı
                                </Link>
                                <Link href="#ocmod" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <BookOpen className="size-4" /> OCMOD Kullanımı
                                </Link>
                            </nav>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-3xl text-white">
                            <HelpCircle className="size-8 text-primary mb-4" />
                            <h4 className="font-bold mb-2">Desteğe mi ihtiyacınız var?</h4>
                            <p className="text-white/60 text-xs leading-relaxed mb-4">Sorunuzun cevabını bulamadınız mı? Destek ekibimize yazın.</p>
                            <Link href="/support" className="inline-flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors">
                                Destek Talebi Aç <ChevronRight className="size-3" />
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-3xl">
                        <section id="intro" className="mb-16">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Giriş</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                OpenCartTR Pazaryeri, Türkiye'nin en gelişmiş OpenCart ekosistemidir. Bu dökümantasyon, satın aldığınız ürünlerin kurulumu, yönetimi ve geliştirilmesi ile ilgili kapsamlı bilgiler içerir.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <h3 className="font-bold mb-2">Hızlı Kurulum</h3>
                                    <p className="text-sm text-slate-500">5 dakikada modülünüzü hazır hale getirin.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <h3 className="font-bold mb-2">Lisans Yönetimi</h3>
                                    <p className="text-sm text-slate-500">Domainlerinizi ve lisans anahtarlarınızı yönetin.</p>
                                </div>
                            </div>
                        </section>

                        <section id="installation" className="mb-16 pt-16 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Modül Kurulumu</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                OpenCart modülleri genellikle <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary font-mono text-sm">.ocmod.zip</code> formatında gelir ve admin paneli üzerinden kolayca kurulabilir.
                            </p>

                            <div className="space-y-12">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
                                        <h3 className="text-xl font-bold">Dosyaları Yükleyin</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 pl-12">
                                        Eklentiler &gt; Eklenti Yükle sayfasından indirdiğiniz zip dosyasını seçip yükleyin.
                                    </p>
                                    <div className="pl-12">
                                        <div className="relative bg-[#0B0E17] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                                            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900">
                                                <span className="text-xs font-mono text-slate-400">Terminal - Kurulum</span>
                                                <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs">
                                                    <Copy className="size-3" /> Kopyala
                                                </button>
                                            </div>
                                            <div className="p-6 overflow-x-auto">
                                                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                                                    <code>
                                                        {`# SSH üzerinden manuel yükleme (Opsiyonel)
cd /var/www/vhosts/siteniz.com/httpdocs/
unzip modül_ismi.zip -d ./
chown -R www-data:www-data ./`}
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
                                        <h3 className="text-xl font-bold">Modifikasyonları Yenileyin</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 pl-12">
                                        Eklentiler &gt; Modifikasyonlar sayfasına gidin ve sağ üstteki mavi yenile butonuna basın. Bu adım OCMOD dosyalarının sisteme işlenmesi için kritiktir.
                                    </p>
                                </div>

                                <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex gap-4">
                                    <Shield className="size-6 text-amber-600 dark:text-amber-500 shrink-0" />
                                    <div className="text-sm text-amber-800 dark:text-amber-200">
                                        <p className="font-bold mb-1">Önemli Hatırlatma</p>
                                        <p>Kurulumdan önce mutlaka sitenizin ve veritabanınızın yedeğini alın. Herhangi bir çakışma durumunda yedeğe dönmeniz gerekebilir.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="licensing" className="mb-16 pt-16 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Lisanslama</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                OpenCartTR üzerinden alınan her ürün, korumalı bir lisans sistemiyle çalışır. Ürünü aktive etmek için panelinizdeki lisans anahtarını kullanmalısınız.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Her lisans 1 (bir) ana domain için geçerlidir.",
                                    "Alt domainler (test.site.com) için ek lisans gerekmez.",
                                    "Lisans anahtarınızı 'Hesabım > Lisanslarım' sayfasından görebilirsiniz.",
                                    "Domain değişikliği için destek talebi oluşturmanız gerekmektedir."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                        <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </main>

                    {/* Table of Contents (Sticky) */}
                    <aside className="hidden xl:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">Bu Sayfada</p>
                            <ul className="space-y-4 text-sm font-medium">
                                <li>
                                    <Link href="#intro" className="text-primary border-l-2 border-primary pl-4 transition-all">Giriş</Link>
                                </li>
                                <li>
                                    <Link href="#installation" className="text-slate-500 hover:text-slate-900 dark:hover:text-white border-l-2 border-transparent pl-4 transition-all hover:border-slate-300">Modül Kurulumu</Link>
                                </li>
                                <li>
                                    <Link href="#licensing" className="text-slate-500 hover:text-slate-900 dark:hover:text-white border-l-2 border-transparent pl-4 transition-all hover:border-slate-300">Lisanslama</Link>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </Container>
        </div>
    );
}
