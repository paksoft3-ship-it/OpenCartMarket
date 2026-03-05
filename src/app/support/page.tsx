import { Container } from "@/components/layout/Container";
import { MessageSquare, Mail, Search, LifeBuoy, BookOpen, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
    title: "Destek Merkezi | OpenCart Market",
    description: "Size nasıl yardımcı olabiliriz? Destek talepleriniz ve sorularınız için bize ulaşın.",
};

export default function SupportPage() {
    return (
        <div className="flex flex-col w-full bg-slate-50 dark:bg-background-dark min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary pt-16 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Destek Merkezi</h1>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Size nasıl yardımcı olabiliriz? Sorularınızı arayın veya doğrudan bize ulaşın.
                    </p>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Nasıl kurulum yaparım? İade politikası nedir?..."
                            className="w-full h-14 pl-12 pr-4 rounded-xl border-none shadow-2xl text-slate-900 focus:ring-2 focus:ring-white/20"
                        />
                    </div>
                </div>
            </section>

            <Container className="py-12 -mt-12 relative z-10 max-w-6xl">
                {/* Quick Help Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
                        <CardHeader>
                            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl font-bold">Teknik Destek</CardTitle>
                            <CardDescription>Ürün geliştiricilerinden yardım alın</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Satın aldığınız bir tema veya modül ile ilgili teknik sorun yaşıyorsanız, doğrudan geliştiriciye soru sorabilirsiniz.
                            </p>
                            <Link href="/dashboard/tickets" className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
                                Talep Oluştur <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
                        <CardHeader>
                            <div className="size-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl font-bold">Hesap & Ödeme</CardTitle>
                            <CardDescription>Marketplace ekibiyle iletişime geçin</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Faturalandırma, lisanslama işlemleri veya iade talepleriniz için marketplace destek ekibi buradadır.
                            </p>
                            <Link href="/contact" className="text-emerald-500 font-bold text-sm hover:underline flex items-center gap-2">
                                Bize Yazın <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
                        <CardHeader>
                            <div className="size-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-4">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl font-bold">Bilgi Bankası</CardTitle>
                            <CardDescription>Rehberlerimizi ve dökümanlarımızı inceleyin</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                En sık karşılaşılan sorunların çözümleri ve adım adım kurulum rehberleri için dökümantasyonumuza göz atın.
                            </p>
                            <Link href="/docs" className="text-amber-500 font-bold text-sm hover:underline flex items-center gap-2">
                                Dökümanları Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sıkça Sorulan Sorular</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "İade politikanız nedir?",
                                    a: "Satın aldığınız ürün çalışmıyorsa veya dökümantasyonda belirtilen özellikleri taşımıyorsa, 14 gün içinde iade talebinde bulunabilirsiniz. 'Fikrim değişti' gibi nedenlerle yapılan talepler maalesef kabul edilmemektedir."
                                },
                                {
                                    q: "Ömür boyu güncellemeler dahil mi?",
                                    a: "Evet, satın aldığınız her ürün için yayınlanan tüm güncellemelerden ömür boyu ücretsiz yararlanırsınız. Güncellemeleri 'İndirmelerim' sayfasından takip edebilirsiniz."
                                },
                                {
                                    q: "Tek lisansla birden fazla sitede kullanabilir miyim?",
                                    a: "Standart lisanslar tek bir canlı site (domain) için geçerlidir. Lokal (localhost) veya staging (test.siteniz.com) kullanımları sınırsızdır. Birden fazla canlı site için ek lisans almanız gerekir."
                                },
                                {
                                    q: "Modül kurulumu yapıyor musunuz?",
                                    a: "Pek çok geliştirici opsiyonel olarak kurulum hizmeti sunmaktadır. Ürün sayfasındaki 'Kurulum Hizmeti' seçeneğini işaretleyerek bu hizmeti sepetinize ekleyebilirsiniz."
                                }
                            ].map((faq, i) => (
                                <details key={i} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{faq.q}</h3>
                                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-3xl p-8 sticky top-24 shadow-2xl">
                        <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                            <LifeBuoy className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 leading-tight">Canlı Destek mi <br />Gerekiyor?</h3>
                        <p className="text-white/70 text-sm mb-8 leading-relaxed">
                            Müşteri temsilcilerimiz hafta içi 09:00 - 18:00 saatleri arasında hızlı destek sağlamaktadır.
                        </p>
                        <button className="w-full h-12 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-50 transition-all">
                            Sohbeti Başlat
                        </button>
                        <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="size-8 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                                ))}
                            </div>
                            <span className="text-xs text-white/50 font-medium">Bize her zaman sorabilirsiniz.</span>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
