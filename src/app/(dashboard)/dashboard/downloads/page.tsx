"use client";

import Link from "next/link";
import { useMockData } from "@/lib/hooks/useMockData";

export default function DownloadsPage() {
  const { licenses, isLoaded } = useMockData();

  if (!isLoaded) {
    return <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  const uniqueProducts = Array.from(new Map(licenses.map((license) => [license.productId, license])).values());

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-cyan-500 p-6 text-white">
        <h1 className="text-3xl font-black tracking-tight">My Downloads</h1>
        <p className="mt-2 text-sm text-white/90">Yeni tasarımdaki updates alanına göre ürün bazlı indirme/versiyon akışı entegre edildi.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">Ürün</th>
              <th className="px-5 py-3">Sürüm</th>
              <th className="px-5 py-3">Lisans</th>
              <th className="px-5 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {uniqueProducts.map((product) => (
              <tr key={product.productId} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{product.productName}</td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">v2.1.0</td>
                <td className="px-5 py-4">
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">{product.key}</code>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/downloads/${product.productId}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                      Versiyonlar
                    </Link>
                    <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">İndir</button>
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
