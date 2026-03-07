"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMockData } from "@/lib/hooks/useMockData";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardOverview() {
    const { isLoaded } = useMockData();
    const auditTrail = useAdminOpsStore((state) => state.auditTrail);
    const restorePoints = useAdminOpsStore((state) => state.restorePoints);
    const automationLogs = useAdminOpsStore((state) => state.automationLogs);
    const recentOpsActivity = useMemo(() => auditTrail.slice(0, 4), [auditTrail]);

    if (!isLoaded) {
        return <div className="p-8"><Skeleton className="h-[200px] w-full rounded-xl" /></div>;
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is what is happening with your marketplace today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Sales */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">payments</span>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                            12.5%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Sales</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">$45,231.89</h3>
                </div>

                {/* Active Users */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">group</span>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                            5.2%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">12,543</h3>
                </div>

                {/* Developers */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">terminal</span>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                            18.4%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New Developers</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">84</h3>
                </div>

                {/* Orders */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">shopping_bag</span>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_down</span>
                            2.1%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Recent Orders</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">1,204</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revenue Analytics</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Daily revenue across all modules</p>
                        </div>
                        <div className="flex bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm">Daily</button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">Weekly</button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">Monthly</button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] relative mt-4">
                        {/* Abstract Chart Representation */}
                        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 250 C 100 250, 150 150, 250 180 C 350 210, 400 80, 500 120 C 600 160, 650 50, 800 80 L 800 300 L 0 300 Z" fill="url(#gradient-area)"></path>
                            <path d="M0 250 C 100 250, 150 150, 250 180 C 350 210, 400 80, 500 120 C 600 160, 650 50, 800 80" fill="none" stroke="#5B6CFF" strokeWidth="3"></path>
                            <defs>
                                <linearGradient id="gradient-area" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#5B6CFF" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#5B6CFF" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50"></div>
                            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50"></div>
                            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50"></div>
                            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50"></div>
                            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50"></div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* Right Side: Pending Approvals & Activity */}
                <div className="space-y-6">
                    {/* Pending Approvals */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pending Approvals</h3>
                            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {/* Item 1 */}
                            <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">extension</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">Stripe Payment Gateway Pro</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">by DevStudio • v2.1.0</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="flex-1 py-1.5 px-3 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">Review</button>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">speed</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">Advanced SEO Optimizer</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">by WebBoost • v1.0.5</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="flex-1 py-1.5 px-3 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">Review</button>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/approvals" className="block p-3 text-center text-xs font-medium text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-200 dark:border-slate-800">
                            View All Submissions
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentOpsActivity.map((entry) => (
                                <div key={entry.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{entry.action}</p>
                                    <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">{entry.details}</p>
                                    <p className="mt-1 text-xs text-slate-500">{entry.actor} • {new Date(entry.at).toLocaleString("tr-TR")}</p>
                                </div>
                            ))}
                            {recentOpsActivity.length === 0 && <p className="text-sm text-slate-500">No live activity yet.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Marketplace Portfolio Mix</h3>
                        <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">Manage Catalog</Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <PortfolioCard label="Themes" value="148" icon="palette" />
                        <PortfolioCard label="Modules" value="236" icon="extension" />
                        <PortfolioCard label="XML Integrations" value="74" icon="sync_alt" />
                        <PortfolioCard label="Payment" value="39" icon="payments" />
                        <PortfolioCard label="Marketing" value="112" icon="campaign" />
                        <PortfolioCard label="SEO Packs" value="57" icon="travel_explore" />
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Growth Shortcuts</h3>
                    <div className="mt-4 space-y-2">
                        <QuickLink href="/admin/blog" label="Blog Editorial Queue" icon="article" />
                        <QuickLink href="/admin/marketing" label="Campaign Hub" icon="campaign" />
                        <QuickLink href="/admin/seo" label="SEO Control Center" icon="travel_explore" />
                        <QuickLink href="/admin/products" label="Product Pipeline" icon="inventory_2" />
                        <QuickLink href="/admin/modules" label="Modules Release Lab" icon="deployed_code" />
                        <QuickLink href="/admin/xml" label="XML Integration Hub" icon="sync_alt" />
                    </div>
                    <div className="mt-5 rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                        <p className="font-semibold uppercase tracking-wider text-slate-500">Ops Signals</p>
                        <div className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
                            <p>Restore Points: {restorePoints.length}</p>
                            <p>Automation Logs: {automationLogs.length}</p>
                            <p>Audit Entries: {auditTrail.length}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function PortfolioCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
                <span className="material-symbols-outlined text-slate-500">{icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
    );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <Link href={href} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                {label}
            </span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
        </Link>
    );
}
