"use client";

import Link from "next/link";

const topProducts = [
  { name: "Mega Shop Theme", sales: 342, revenue: 6840 },
  { name: "Quick Checkout", sales: 219, revenue: 4380 },
  { name: "Smart SEO Pack", sales: 161, revenue: 2898 },
];

const recentSales = [
  { order: "ORD-7F93A", product: "Mega Shop Theme", amount: "$59.00" },
  { order: "ORD-2BA10", product: "Quick Checkout", amount: "$39.00" },
  { order: "ORD-8K211", product: "Smart SEO Pack", amount: "$29.00" },
];

export default function DeveloperDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Satıcı Paneli</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Developer seller dashboard overview tasarımı entegre edildi.</p>
        </div>
        <Link href="/developer/add" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">Yeni Ürün Ekle</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Toplam Satış</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">722</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Aylık Gelir</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">$4,982</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Ürün Sayısı</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">14</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Ortalama Puan</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">4.8</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Products</h2>
          <div className="mt-4 space-y-3">
            {topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.sales} satış</p>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">${product.revenue}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Sales</h2>
          <div className="mt-4 space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.order} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sale.order}</p>
                  <p className="text-xs text-slate-500">{sale.product}</p>
                </div>
                <p className="text-sm font-bold text-primary">{sale.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
