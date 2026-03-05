"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const sidebarLinks = [
    { href: "/developer", icon: "dashboard", label: "Genel Bakış" },
    { href: "/developer/products", icon: "inventory_2", label: "Ürünlerim" },
    { href: "/developer/add", icon: "add_circle", label: "Yeni Ekle" },
    { href: "/developer/analytics", icon: "payments", label: "Ödemeler" },
    { href: "/developer/apply", icon: "task_alt", label: "Başvuru" },
];

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAppStore();

    return (
        <div className="flex w-full bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-[calc(100vh-64px)] items-stretch">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col flex-shrink-0 relative z-20 h-[calc(100vh-64px)] sticky top-[64px]">
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">shopping_bag</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">OpenCart Dev</h2>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 flex flex-col gap-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href === '/developer/add' && pathname.includes('add'));
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

                    <Link
                        href="/developer/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors mt-auto",
                            pathname === "/developer/settings"
                                ? "bg-primary/10 text-primary"
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        <span className={cn("material-symbols-outlined", pathname === "/developer/settings" && "filled")}>settings</span>
                        <span className="text-sm">Ayarlar</span>
                    </Link>
                </nav>

                {/* Bottom User Area */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtsTGAM_SjkbkPVwOGWdlyaByIW46F6E55zoj-2m5sxlEJ6LUh7d3XgA999cBhIMQtH-O5LsxFndRBOsonb_MhJ6XEBVTjXAKg--lx1y6WzK_t-YLny04orI68-Nx7Cvg20DZWkiJ7KeEbB-9_rv_AM7y2PchXc9PDJr7OmbQFnBQELJzkUSkGg76zyeLCG3_55cVsbNQiE6oEpO1znr4EOGVO88nDog5snWiBWQz9RwdTAitNAztD9SiJjE8Glmm26tOEfRVoESE')" }}></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || "Ahmet Yılmaz"}</p>
                            <p className="text-xs text-slate-500">Premium Geliştirici</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                {/* Secondary Topbar inside Dashboard */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[64px] z-10 w-full">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-500">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {pathname === '/developer/add' ? 'Yeni Ürün Ekle' : 'Geliştirici Paneli'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none w-64 text-slate-900 dark:text-slate-100 placeholder:text-slate-500" placeholder="Ara..." type="text" />
                        </div>
                        <button className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                            Yayına Al
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
