"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminLinks = [
    { href: "/admin", icon: "dashboard", label: "Dashboard" },
    { href: "/admin/products", icon: "inventory_2", label: "Products" },
    { href: "/admin/orders", icon: "shopping_cart", label: "Orders" },
    { href: "/admin/customers", icon: "group", label: "Customers" },
];

const ecosystemLinks = [
    { href: "/admin/developers", icon: "code", label: "Developers" },
    { href: "/admin/licenses", icon: "vpn_key", label: "Licenses" },
    { href: "/admin/reviews", icon: "star", label: "Reviews" },
];

const managementLinks = [
    { href: "/admin/analytics", icon: "bar_chart", label: "Analytics" },
    { href: "/admin/support", icon: "support_agent", label: "Support" },
    { href: "/admin/settings", icon: "settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex bg-[#F8FAFC] dark:bg-[#0f1123] text-slate-900 dark:text-slate-100 min-h-screen font-display overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 bg-[#0B0E17] flex-col h-screen flex-shrink-0 z-20 shadow-xl fixed top-0 left-0">
                <div className="p-6 flex items-center gap-3 border-b border-gray-800 h-16 box-border">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                        O
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-lg leading-tight tracking-tight">OpenCart</span>
                        <span className="text-[#94A3B8] text-[10px] font-medium uppercase tracking-wider">Marketplace</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                    {/* Navigation Items */}
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-medium"
                                )}
                            >
                                <span className={cn("material-symbols-outlined text-xl transition-colors", !isActive && "group-hover:text-white")}>{link.icon}</span>
                                <span className="text-sm flex-1">{link.label}</span>
                                {link.label === "Orders" && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>}
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2 px-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ecosystem</p>
                    </div>

                    {ecosystemLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-medium"
                                )}
                            >
                                <span className={cn("material-symbols-outlined text-xl transition-colors", !isActive && "group-hover:text-white")}>{link.icon}</span>
                                <span className="text-sm">{link.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2 px-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</p>
                    </div>

                    {managementLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-medium"
                                )}
                            >
                                <span className={cn("material-symbols-outlined text-xl transition-colors", !isActive && "group-hover:text-white")}>{link.icon}</span>
                                <span className="text-sm">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-gray-800">
                    <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#1E293B] transition-colors">
                        <div className="relative">
                            <img alt="Admin Profile" className="w-10 h-10 rounded-full border border-gray-700 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOgBnvoqJ7QfW1QSGR6K9Vuo-GMujuYajDbxvJcb3AiHxN59QJXh-KklPhxCOy1vPwQ_2fCqddoB0IhkLqQqZJydFYrETCXFXqoVBFnDHDzN7C0vIv6TArCvY94ix9_wDKdjhMDuniXMPcSZVNT6cTx7Pu36tdRXvfOeIH7dhUK4FuwBmHUU_nKyMRVJyg1Tu-fXZ_RaG14NsLuW43EZhkdR9xoeBKBhkqPFYCzxGlFdwsf7JXauXFLmQXrKtxtlRTYSxlkiBYXOM" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0B0E17] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
                            <p className="text-xs text-[#94A3B8] truncate">Super Admin</p>
                        </div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-lg">unfold_more</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64 bg-[#F8FAFC] dark:bg-[#0f1123]">
                {/* Top Bar */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="lg:hidden text-slate-500">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        {/* Breadcrumb */}
                        <div className="hidden md:flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
                            <span className="material-symbols-outlined text-lg mx-1">chevron_right</span>
                            <span className="text-slate-900 dark:text-slate-200 capitalize">
                                {pathname === '/admin' ? 'Dashboard Overview' : pathname.replace('/admin/', '').replace('-', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 flex-1 justify-end">
                        {/* Search */}
                        <div className="relative w-full max-w-md hidden lg:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">search</span>
                            </div>
                            <input className="block w-full pl-10 pr-16 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-[#F8FAFC] dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow text-slate-900 dark:text-slate-200" placeholder="Search modules, users, or orders..." type="text" />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-xs font-semibold text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">⌘K</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-primary/5">
                                <span className="material-symbols-outlined text-xl">notifications</span>
                                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                            </button>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                            <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-200 hover:text-primary transition-colors">
                                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full text-xs">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    Verified
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
