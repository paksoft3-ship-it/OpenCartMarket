"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { AdminAccessProvider, AdminView } from "@/components/admin/AdminAccessContext";
import { AdminLanguage, AdminLanguageProvider } from "@/components/admin/AdminLanguageContext";
type LocalizedLabel = { tr: string; en: string };
type NavItem = { href: string; icon: string; label: LocalizedLabel; views: AdminView[] };

const adminLinks: NavItem[] = [
    { href: "/admin", icon: "dashboard", label: { tr: "Kontrol Paneli", en: "Dashboard" }, views: ["super", "ops", "finance", "content", "growth"] },
    { href: "/admin/products", icon: "inventory_2", label: { tr: "Ürünler", en: "Products" }, views: ["super", "ops", "content", "growth"] },
    { href: "/admin/orders", icon: "shopping_cart", label: { tr: "Siparişler", en: "Orders" }, views: ["super", "ops", "finance"] },
    { href: "/admin/customers", icon: "group", label: { tr: "Müşteriler", en: "Customers" }, views: ["super", "ops", "growth"] },
];

const ecosystemLinks: NavItem[] = [
    { href: "/admin/developers", icon: "code", label: { tr: "Geliştiriciler", en: "Developers" }, views: ["super", "ops"] },
    { href: "/admin/modules", icon: "deployed_code", label: { tr: "Modül Laboratuvarı", en: "Modules Lab" }, views: ["super", "ops", "content"] },
    { href: "/admin/xml", icon: "sync_alt", label: { tr: "XML Merkezi", en: "XML Hub" }, views: ["super", "ops", "finance"] },
    { href: "/admin/licenses", icon: "vpn_key", label: { tr: "Lisanslar", en: "Licenses" }, views: ["super", "ops", "finance"] },
    { href: "/admin/blog", icon: "article", label: { tr: "Blog", en: "Blog" }, views: ["super", "content", "growth"] },
    { href: "/admin/reviews", icon: "rule", label: { tr: "Moderasyon", en: "Moderation" }, views: ["super", "ops", "content"] },
];

const managementLinks: NavItem[] = [
    { href: "/admin/analytics", icon: "bar_chart", label: { tr: "Analitik", en: "Analytics" }, views: ["super", "finance", "growth", "ops"] },
    { href: "/admin/risk", icon: "gpp_maybe", label: { tr: "Risk Merkezi", en: "Risk Center" }, views: ["super", "ops", "finance"] },
    { href: "/admin/marketing", icon: "campaign", label: { tr: "Pazarlama", en: "Marketing" }, views: ["super", "growth", "content"] },
    { href: "/admin/seo", icon: "travel_explore", label: { tr: "SEO", en: "SEO" }, views: ["super", "content", "growth"] },
    { href: "/admin/payouts", icon: "account_balance_wallet", label: { tr: "Ödemeler", en: "Payouts" }, views: ["super", "finance"] },
    { href: "/admin/automations", icon: "automation", label: { tr: "Otomasyonlar", en: "Automations" }, views: ["super", "ops", "finance", "content", "growth"] },
    { href: "/admin/audit", icon: "history", label: { tr: "Denetim Kayıtları", en: "Audit Logs" }, views: ["super", "ops", "finance", "content", "growth"] },
    { href: "/admin/roles", icon: "admin_panel_settings", label: { tr: "Roller", en: "Roles" }, views: ["super"] },
    { href: "/admin/support", icon: "support_agent", label: { tr: "Destek", en: "Support" }, views: ["super", "ops"] },
    { href: "/admin/refunds", icon: "request_quote", label: { tr: "İadeler", en: "Refunds" }, views: ["super", "ops", "finance"] },
    { href: "/admin/settings", icon: "settings", label: { tr: "Ayarlar", en: "Settings" }, views: ["super", "finance", "ops"] },
];

const viewOptions: { value: AdminView; label: LocalizedLabel }[] = [
    { value: "super", label: { tr: "Süper Admin", en: "Super Admin" } },
    { value: "ops", label: { tr: "Operasyon Görünümü", en: "Ops View" } },
    { value: "finance", label: { tr: "Finans Görünümü", en: "Finance View" } },
    { value: "content", label: { tr: "İçerik Görünümü", en: "Content View" } },
    { value: "growth", label: { tr: "Büyüme Görünümü", en: "Growth View" } },
];

const shellText: Record<AdminLanguage, Record<string, string>> = {
    tr: {
        ecosystem: "Ekosistem",
        management: "Yönetim",
        admin: "Yönetim",
        dashboardOverview: "Kontrol Paneli Özeti",
        searchPlaceholder: "Modül, kullanıcı veya sipariş ara...",
        commandHint: "Komut Menüsü",
        verified: "Doğrulandı",
        accessRestricted: "Bu görünüm için erişim kısıtlı",
        accessRestrictedDesc: "Bu modül şu görünümde kullanılamıyor:",
        goDashboard: "Panele Dön",
        commandSearchPlaceholder: "Yönetim sayfaları ve işlemleri ara...",
        noMatch: "Eşleşen yönetim sayfası yok.",
        language: "Dil",
        ordersBadge: "12",
    },
    en: {
        ecosystem: "Ecosystem",
        management: "Management",
        admin: "Admin",
        dashboardOverview: "Dashboard Overview",
        searchPlaceholder: "Search modules, users, or orders...",
        commandHint: "Cmd K",
        verified: "Verified",
        accessRestricted: "Access Restricted for Current View",
        accessRestrictedDesc: "This module is not available for",
        goDashboard: "Go to Dashboard",
        commandSearchPlaceholder: "Search admin pages and actions...",
        noMatch: "No matching admin page.",
        language: "Language",
        ordersBadge: "12",
    },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [commandOpen, setCommandOpen] = useState(false);
    const [commandQuery, setCommandQuery] = useState("");
    const [language, setLanguage] = useState<AdminLanguage>(() => {
        if (typeof window === "undefined") return "tr";
        const stored = localStorage.getItem("admin_language");
        return stored === "en" ? "en" : "tr";
    });
    const [activeView, setActiveView] = useState<AdminView>(() => {
        if (typeof window === "undefined") return "super";
        return (localStorage.getItem("admin_active_view") as AdminView | null) ?? "super";
    });

    useEffect(() => {
        const onKeydown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setCommandOpen((prev) => !prev);
            }
            if (event.key === "Escape") setCommandOpen(false);
        };
        window.addEventListener("keydown", onKeydown);
        return () => window.removeEventListener("keydown", onKeydown);
    }, []);

    const t = shellText[language];

    const filteredAdminLinks = useMemo(() => adminLinks.filter((item) => item.views.includes(activeView)), [activeView]);
    const filteredEcosystemLinks = useMemo(() => ecosystemLinks.filter((item) => item.views.includes(activeView)), [activeView]);
    const filteredManagementLinks = useMemo(() => managementLinks.filter((item) => item.views.includes(activeView)), [activeView]);

    const commandItems = useMemo(() => {
        const base = [
            ...filteredAdminLinks,
            ...filteredEcosystemLinks,
            ...filteredManagementLinks,
        ];
        const query = commandQuery.trim().toLowerCase();
        if (!query) return base;
        return base.filter((item) => item.label[language].toLowerCase().includes(query) || item.href.toLowerCase().includes(query));
    }, [commandQuery, filteredAdminLinks, filteredEcosystemLinks, filteredManagementLinks, language]);

    const allAllowedItems = useMemo(() => {
        return [...filteredAdminLinks, ...filteredEcosystemLinks, ...filteredManagementLinks];
    }, [filteredAdminLinks, filteredEcosystemLinks, filteredManagementLinks]);

    const hasAccess = useMemo(() => {
        if (pathname === "/admin") return true;
        return allAllowedItems.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
    }, [allAllowedItems, pathname]);

    const currentPathLabel = useMemo(() => {
        if (pathname === "/admin") return t.dashboardOverview;
        const exact = [...adminLinks, ...ecosystemLinks, ...managementLinks].find((item) => item.href === pathname);
        if (exact) return exact.label[language];
        const parent = [...adminLinks, ...ecosystemLinks, ...managementLinks].find((item) => pathname.startsWith(`${item.href}/`));
        return parent ? parent.label[language] : pathname.replace("/admin/", "").replace(/-/g, " ");
    }, [language, pathname, t.dashboardOverview]);

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
                    {filteredAdminLinks.map((link) => {
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
                                <span className="text-sm flex-1">{link.label[language]}</span>
                                {link.href === "/admin/orders" && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{t.ordersBadge}</span>}
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2 px-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.ecosystem}</p>
                    </div>

                    {filteredEcosystemLinks.map((link) => {
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
                                <span className="text-sm">{link.label[language]}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2 px-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.management}</p>
                    </div>

                    {filteredManagementLinks.map((link) => {
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
                                <span className="text-sm">{link.label[language]}</span>
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
                            <Link href="/admin" className="hover:text-primary transition-colors">{t.admin}</Link>
                            <span className="material-symbols-outlined text-lg mx-1">chevron_right</span>
                            <span className="text-slate-900 dark:text-slate-200 capitalize">
                                {currentPathLabel}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 flex-1 justify-end">
                        {/* Search */}
                        <div className="relative w-full max-w-md hidden lg:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">search</span>
                            </div>
                            <input className="block w-full pl-10 pr-16 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-[#F8FAFC] dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow text-slate-900 dark:text-slate-200" placeholder={t.searchPlaceholder} type="text" />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-xs font-semibold text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">⌘K</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                onClick={() => setCommandOpen(true)}
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[16px]">search</span>
                                {t.commandHint}
                            </button>
                            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-primary/5">
                                <span className="material-symbols-outlined text-xl">notifications</span>
                                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                            </button>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                            <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-200 hover:text-primary transition-colors">
                                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full text-xs">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    {t.verified}
                                </div>
                            </button>
                            <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <span>{t.language}</span>
                                <select
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                                    onChange={(event) => {
                                        const lang = event.target.value as AdminLanguage;
                                        setLanguage(lang);
                                        localStorage.setItem("admin_language", lang);
                                    }}
                                    value={language}
                                >
                                    <option value="tr">TR</option>
                                    <option value="en">EN</option>
                                </select>
                            </div>
                            <select
                                className="hidden md:block rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                onChange={(event) => {
                                    const view = event.target.value as AdminView;
                                    setActiveView(view);
                                    localStorage.setItem("admin_active_view", view);
                                }}
                                value={activeView}
                            >
                                {viewOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label[language]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <AdminLanguageProvider language={language}>
                    <AdminAccessProvider activeView={activeView}>
                        {hasAccess ? (
                            children
                        ) : (
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.accessRestricted}</h2>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        {t.accessRestrictedDesc} <span className="font-semibold">{viewOptions.find((option) => option.value === activeView)?.label[language]}</span>.
                                    </p>
                                    <div className="mt-5 flex items-center justify-center gap-2">
                                        {viewOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${activeView === option.value ? "bg-primary text-white" : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                                                onClick={() => {
                                                    setActiveView(option.value);
                                                    localStorage.setItem("admin_active_view", option.value);
                                                }}
                                                type="button"
                                            >
                                                {option.label[language]}
                                            </button>
                                        ))}
                                    </div>
                                    <Link className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90" href="/admin">
                                        {t.goDashboard}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </AdminAccessProvider>
                </AdminLanguageProvider>
            </main>

            {commandOpen && (
                <div className="fixed inset-0 z-[60] bg-black/40 p-4 backdrop-blur-sm" onClick={() => setCommandOpen(false)}>
                    <div
                        className="mx-auto mt-14 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-200 p-3 dark:border-slate-800">
                            <input
                                autoFocus
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                                onChange={(event) => setCommandQuery(event.target.value)}
                                placeholder={t.commandSearchPlaceholder}
                                value={commandQuery}
                            />
                        </div>
                        <div className="max-h-[360px] overflow-y-auto p-2">
                            {commandItems.map((item) => (
                                <Link
                                    key={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                                    href={item.href}
                                    onClick={() => {
                                        setCommandOpen(false);
                                        setCommandQuery("");
                                    }}
                                >
                                    <span className="material-symbols-outlined text-[18px] text-slate-500">{item.icon}</span>
                                    <span className="text-slate-800 dark:text-slate-200">{item.label[language]}</span>
                                    <span className="ml-auto text-xs text-slate-400">{item.href}</span>
                                </Link>
                            ))}
                            {commandItems.length === 0 && (
                                <p className="px-3 py-5 text-sm text-slate-500">{t.noMatch}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
