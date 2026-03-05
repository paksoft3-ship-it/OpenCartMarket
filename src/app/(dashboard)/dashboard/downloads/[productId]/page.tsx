"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMockData } from "@/lib/hooks/useMockData";

export default function ProductDownloadDetailPage() {
  const params = useParams<{ productId: string }>();
  const { licenses, isLoaded } = useMockData();

  if (!isLoaded) {
    return <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  const license = licenses.find((item) => item.productId === params.productId);

  if (!license) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm dark:border-slate-800 dark:bg-slate-900">Ürün bulunamadı.</div>;
  }

  const versions = ["v2.1.0", "v2.0.5", "v2.0.1"];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{license.productName}</h1>
          <p className="mt-1 text-sm text-slate-500">Ürün bazlı indirme ve güncelleme geçmişi</p>
        </div>
        <Link href="/dashboard/downloads" className="text-sm font-semibold text-primary hover:underline">İndirmelere Dön</Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">Versiyon</th>
              <th className="px-5 py-3">Yayın Tarihi</th>
              <th className="px-5 py-3">Not</th>
              <th className="px-5 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((version, index) => (
              <tr key={version} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{version}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{new Date(Date.now() - index * 86400000 * 30).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">Performans iyileştirmeleri ve hata düzeltmeleri.</td>
                <td className="px-5 py-4">
                  <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">İndir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
