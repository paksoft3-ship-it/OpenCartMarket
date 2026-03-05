"use client";

import Link from "next/link";
import { useMockData } from "@/lib/hooks/useMockData";

export default function OrdersPage() {
  const { orders, isLoaded } = useMockData();

  if (!isLoaded) {
    return <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Sipariş Geçmişi</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Yeni tasarımdaki liste görünümü ve invoice detay akışı entegre edildi.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">Sipariş ID</th>
              <th className="px-5 py-3">Tarih</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Toplam</th>
              <th className="px-5 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${order.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">${order.total.toFixed(2)}</td>
                <td className="px-5 py-4 text-sm">
                  <Link href={`/dashboard/orders/${order.id}`} className="font-semibold text-primary hover:underline">Detayları Gör</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
