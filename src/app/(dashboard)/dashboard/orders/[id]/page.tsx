"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMockData } from "@/lib/hooks/useMockData";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { orders, isLoaded } = useMockData();

  if (!isLoaded) {
    return <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  const order = orders.find((item) => item.id === params.id);

  if (!order) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm dark:border-slate-800 dark:bg-slate-900">Sipariş bulunamadı.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Sipariş Detayı</h1>
          <p className="mt-1 text-sm text-slate-500">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <Link href="/dashboard/orders" className="text-sm font-semibold text-primary hover:underline">Siparişlere Dön</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Satın Alınan Ürünler</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.productName}</p>
                  <p className="text-xs text-slate-500">Ürün ID: {item.productId}</p>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fatura Özeti</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Ara Toplam</span>
              <span>${(order.total / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>KDV</span>
              <span>${(order.total - order.total / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
              <span>Toplam</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-900">PDF İndir</button>
            <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">Lisansları Görüntüle</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
