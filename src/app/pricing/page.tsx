import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Check, Shield, Zap, Layout } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Fiyatlandırma | OpenCartTR Market",
    description: "İhtiyacınıza uygun lisans modelleri ve şeffaf fiyatlandırma.",
};

export default function PricingPage() {
    return (
        <div className="flex flex-col w-full bg-slate-50 dark:bg-background-dark min-h-screen">
            {/* Header */}
            <section className="pt-20 pb-16 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Basit ve Şeffaf <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Fiyatlandırma</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        İhtiyacınıza uygun lisans modelini seçin. Tüm planlar 1 yıl ücretsiz teknik destek ve güncellemeleri içerir.
                    </p>
                </div>
            </section>

            <Container className="py-12 px-6 max-w-6xl">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Standard License */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col shadow-sm hover:shadow-xl transition-all h-full">
                        <div className="size-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6 font-bold">
                            <Layout className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Standart Lisans</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                            Tek bir mağaza işletenler için en popüler ve ekonomik çözüm.
                        </p>
                        <div className="mb-8">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">$49</span>
                            <span className="text-slate-500 text-sm ml-2">/ ömür boyu</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {[
                                "1 Canlı Domain Lisansı",
                                "Sınırsız Test/Geliştirme Domaini",
                                "6 Ay Öncelikli Destek",
                                "1 Yıl Ücretsiz Güncelleme",
                                "Temel Kurulum Klavuzu"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <Check className="size-4 text-emerald-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Hemen Satın Al
                        </button>
                    </div>

                    {/* Developer License (Recommended) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-primary p-8 flex flex-col shadow-2xl hover:shadow-primary/10 transition-all h-full relative overflow-hidden scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-widest">EN POPÜLER</div>
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 font-bold">
                            <Zap className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Geliştirici Paketi</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                            Birden fazla projesi olan geliştiriciler ve serbest çalışanlar için ideal.
                        </p>
                        <div className="mb-8">
                            <span className="text-5xl font-black text-slate-900 dark:text-white">$149</span>
                            <span className="text-slate-500 text-sm ml-2">/ ömür boyu</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {[
                                "5 Canlı Domain Lisansı",
                                "Sınırsız Test/Geliştirme Domaini",
                                "1 Yıl 7/24 Öncelikli Destek",
                                "Ömür Boyu Ücretsiz Güncelleme",
                                "Ücretsiz Tema Kurulum Hizmeti",
                                "Alt Geliştirici Hesabı"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-900 dark:text-slate-200 font-medium">
                                    <Check className="size-4 text-primary shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform hover:-translate-y-0.5">
                            Geliştirici Ol
                        </button>
                    </div>

                    {/* Agency License */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col shadow-sm hover:shadow-xl transition-all h-full">
                        <div className="size-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-6 font-bold">
                            <Shield className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ajans Lisansı</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                            Büyük ölçekli ajanslar ve kurumsal çözüm ortakları için sınırsız güç.
                        </p>
                        <div className="mb-8">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">$299</span>
                            <span className="text-slate-500 text-sm ml-2">/ ömür boyu</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Sınırsız Canlı Domain Lisansı",
                                "Ömür Boyu VIP Destek",
                                "Tüm Gelecek Ürünlere %50 İndirim",
                                "Özel Geliştirme Danışmanlığı",
                                "Yetkili Servis Rozeti"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <Check className="size-4 text-purple-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Bize Ulaşın
                        </button>
                    </div>
                </div>

                {/* FAQ Section in Pricing */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Fiyatlandırma Hakkında Sorular</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Ödeme tek seferlik mi yoksa abonelik mi?", a: "Tüm lisanslarımız tek seferlik ödemedir. Bir kez satın aldıktan sonra ürünü ömür boyu kullanabilirsiniz." },
                            { q: "Lisansımı başka bir siteye taşıyabilir miyim?", a: "Evet, aktif olan lisansınızı bir alan adından silip yeni bir alan adına tanımlayabilirsiniz." },
                            { q: "Ücretli kurulum desteği veriyor musunuz?", a: "Geliştirici ve Ajans paketlerinde standart kurulum ücretsizdir. Standart lisansta ise cüzi bir ücretle kurulum talep edebilirsiniz." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
