"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useMockData } from "@/lib/hooks/useMockData";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverview() {
  const { user } = useAppStore();
  const { orders, licenses, isLoaded } = useMockData();

  if (!isLoaded) {
    return <Skeleton className="h-[300px] w-full rounded-2xl" />;
  }

  const activeLicenses = licenses.filter((license) => license.status === "active").length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Hoş geldin, {user?.name || "Ahmet"}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Müşteri panelinin yeni dashboard tasarımı entegre edildi.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Siparişler</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aktif Lisans</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{activeLicenses}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Toplam Harcama</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Destek Talepleri</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">1</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Son Siparişler</h2>
            <Link href="/dashboard/orders" className="text-sm font-semibold text-primary hover:underline">Tümünü Gör</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3">Sipariş</th>
                  <th className="px-6 py-3">Tarih</th>
                  <th className="px-6 py-3">Toplam</th>
                  <th className="px-6 py-3">Aksiyon</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map((order) => (
                  <tr key={order.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/dashboard/orders/${order.id}`} className="font-semibold text-primary hover:underline">Detay</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Lisans Özetim</h3>
          <div className="mt-4 space-y-3">
            {licenses.slice(0, 3).map((license) => (
              <div key={license.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{license.productName}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{license.key}</p>
              </div>
            ))}
          </div>
          <Link href="/dashboard/licenses" className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline">Lisans Yönetimine Git</Link>
        </section>
      </div>
    </div>
  );
}
