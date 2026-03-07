"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import { Container } from "./Container";

export function Header() {
    const pathname = usePathname();
    const { user, cart } = useAppStore();

    // Hide the global header on admin and dashboard pages that have their own header
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/developer')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
            <Container className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 text-primary">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo1_v2.png" alt="OpenCart Marketplace Logo" width={210} height={36} className="object-contain w-auto h-8" priority />
                    </Link>
                </div>

                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/browse?category=themes" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Temalar</Link>
                        <Link href="/browse?category=modules" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Modüller</Link>
                        <Link href="/browse?category=xml-integrations" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">XML Entegrasyonları</Link>
                        <Link href="/browse?category=marketing-tools" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Pazarlama Araçları</Link>
                        <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Blog</Link>
                    </nav>

                    <div className="flex gap-3">
                        <Link href="/cart" className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                            {cart.length > 0 && (
                                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-semibold shadow-sm">
                                <span>Panel</span>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="flex items-center justify-center rounded-lg h-10 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-semibold">
                                    <span>Giriş Yap</span>
                                </Link>
                                <Link href="/register" className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-semibold shadow-sm">
                                    <span>Kayıt Ol</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
}
