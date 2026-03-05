"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const sidebarLinks = [
    { href: "/dashboard", icon: "space_dashboard", label: "Dashboard" },
    { href: "/dashboard/orders", icon: "shopping_cart", label: "Satın Alımlarım" },
    { href: "/dashboard/downloads", icon: "download", label: "İndirmeler" },
    { href: "/dashboard/licenses", icon: "key", label: "Lisanslar" },
    { href: "/dashboard/support", icon: "support_agent", label: "Destek Talepleri" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAppStore();

    return (
        <div className="flex w-full bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen items-stretch">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col flex-shrink-0 relative z-20 h-screen sticky top-0">
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors my-1",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                <span className={cn("material-symbols-outlined", isActive && "filled")}>{link.icon}</span>
                                <span className="text-sm">{link.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-6 pb-2">
                        <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ayarlar</div>
                    </div>
                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors my-1",
                            pathname === "/dashboard/settings"
                                ? "bg-primary/10 text-primary"
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        <span className={cn("material-symbols-outlined", pathname === "/dashboard/settings" && "filled")}>settings</span>
                        <span className="text-sm">Hesap Ayarları</span>
                    </Link>
                </nav>

                {/* Bottom User Area */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                        <img alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZaqvFFWuYbjcbMmcSkdFlfloCB8589Sm-Z84uqvSn3gMU7bT-sNBdcnpx0cX5hZb03VJpOYQ-kJ_5DdMEFnXBUzYr8De-2TBEV1D3lPIzPtzwSQ9pO9jXqz3o5u5GsrukDGMceaGy1HJiTlHxQDhmjz3JysYfju8qEPMpF0hzBxNeOYAt6MV5KUQAg7wBtm5ndkW_nh6ccLcANngWMX-DHA4C35FK7mo9O7puqzHOHYD9dOdXiblWYMeEYKu0m5Z-MgtJAxqebX8" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{user?.name || "Ahmet Yılmaz"}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || "ahmet@example.com"}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                {/* Secondary Topbar inside Dashboard */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 w-full">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-200 transition-all sm:text-sm" placeholder="Search themes, modules, orders..." />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-xs text-slate-400 font-medium px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">⌘K</span>
                            </div>
                        </div>
                    </div>
                    {/* Right Actions */}
                    <div className="flex items-center gap-4 ml-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
