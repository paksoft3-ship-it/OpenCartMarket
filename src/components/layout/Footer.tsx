"use client";

import { usePathname } from "next/navigation";
import { Container } from "./Container";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const pathname = usePathname();

    // Hide footer on admin, dashboard, and developer panel pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/developer')) {
        return null;
    }

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center">
                            <div className="text-primary flex items-center">
                                <Image src="/logo1_v2.png" alt="OpenCart Marketplace Logo" width={260} height={44} className="object-contain w-auto h-10" />
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                            Türkiye&apos;nin en kapsamlı OpenCart pazaryeri. Geliştiricileri ve mağaza sahiplerini güvenilir bir ekosistemde buluşturuyoruz. E-ticaret sitenizi bir üst seviyeye taşıyın.
                        </p>
                    </div>

                    {/* Products Column */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Ürünler</h3>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/browse?category=themes">Temalar</Link></li>
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/browse?category=modules">Modüller</Link></li>
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/browse?category=payments">Ödeme Sistemleri</Link></li>
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/browse?category=shipping">Kargo Entegrasyonları</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Kaynaklar</h3>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/blog">Blog</Link></li>
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/docs">Geliştirici Dokümanları</Link></li>
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/forum">Topluluk Forumu</Link></li>
                            <li><Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="/support">Destek Merkezi</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Bültene Abone Ol</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">En güncel haberleri ve fırsatları kaçırmayın.</p>
                        </div>
                        <form className="flex w-full items-stretch rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                            <input
                                className="flex w-full min-w-0 flex-1 border-none bg-transparent h-12 px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-slate-400 text-slate-900 dark:text-white"
                                placeholder="E-posta adresiniz"
                                type="email"
                                required
                            />
                            <button className="flex items-center justify-center px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors" type="submit">
                                Abone Ol
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        {/* Social Icons (using placeholders for now) */}
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">share</span>
                        </a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors font-bold text-sm">X</a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors font-bold text-sm">LI</a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors font-bold text-sm">GH</a>
                    </div>
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-4 text-xs font-semibold text-slate-400">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Gizlilik</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Koşullar</Link>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            TR / EN
                            <span className="material-symbols-outlined text-xs">expand_more</span>
                        </button>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
