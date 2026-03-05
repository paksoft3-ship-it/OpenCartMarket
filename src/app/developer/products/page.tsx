"use client";

import Link from "next/link";

const products = [
  { id: "prod-1", name: "Mega Shop Theme", category: "Theme", price: "$59", status: "active", sales: 342 },
  { id: "prod-2", name: "Quick Checkout", category: "Module", price: "$39", status: "active", sales: 219 },
  { id: "prod-3", name: "Smart SEO Pack", category: "Module", price: "$29", status: "draft", sales: 0 },
];

export default function DeveloperProductsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ürün Yönetimi</h1>
        <Link href="/developer/add" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">Yeni Ürün</Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">Ürün</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Fiyat</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Satış</th>
              <th className="px-5 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{product.name}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{product.category}</td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">{product.price}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{product.sales}</td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-3">
                    <Link href="/developer/add" className="font-semibold text-primary hover:underline">Düzenle</Link>
                    <Link href="/developer/analytics" className="font-semibold text-slate-600 hover:underline dark:text-slate-300">Analiz</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
