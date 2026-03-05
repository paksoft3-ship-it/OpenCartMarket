"use client";

import { useAppStore } from "@/lib/store";
import { useMockData } from "@/lib/hooks/useMockData";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function DashboardOverview() {
    const { user } = useAppStore();
    const { orders, licenses, isLoaded } = useMockData();

    if (!isLoaded) {
        return <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>;
    }

    const activeLicenses = licenses.filter(l => l.status === 'active').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Hoş geldin, {user?.name || "Ahmet"} 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base">Manage your OpenCart themes and modules.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Purchases</h3>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{orders.length}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Licenses</h3>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <span className="material-symbols-outlined text-[20px]">verified_user</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{activeLicenses}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Available Updates</h3>
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <span className="material-symbols-outlined text-[20px]">update</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">3</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Support Tickets</h3>
                        <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">forum</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">1</span>
                        <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">Open</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Wider) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Purchases Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Purchases</h2>
                            <Link href="/dashboard/orders" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {orders.slice(0, 3).map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined">shopping_cart</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">Order {order.id}</div>
                                                        <div className="text-xs text-slate-500">{order.items.length} items</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                ${order.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                                                No recent purchases found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-8">
                    {/* Product Updates Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined text-[18px]">new_releases</span>
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">New Updates Available</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">Journal 3 Theme</div>
                                        <div className="text-xs text-slate-500">v3.2.0 is now available</div>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Download Update
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* License Keys Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Active Licenses</h3>
                            <Link href="/dashboard/licenses" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {licenses.slice(0, 2).map((license, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-1">{license.productName}</span>
                                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">mystore.com</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 flex items-center justify-between font-mono text-xs text-slate-500 overflow-hidden">
                                            <span className="truncate">{license.key}</span>
                                        </div>
                                        <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors flex items-center shrink-0" title="Copy">
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
