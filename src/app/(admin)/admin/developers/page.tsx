"use client";

import developers from "@/data/developers.json";

export default function AdminDevelopersPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Geliştirici Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Satıcı hesaplarını, ürün sayılarını ve performanslarını yönetin.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Geliştirici ara..."
            type="text"
          />
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Geliştirici Ekle</button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Toplam Geliştirici" value="842" />
        <MetricCard label="Aktif Satıcı" value="796" />
        <MetricCard label="Yeni Başvuru (7 gün)" value="34" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3">Geliştirici</th>
              <th className="px-4 py-3">Puan</th>
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3">İnceleme</th>
              <th className="px-4 py-3">Katılım</th>
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {developers.map((developer) => (
              <tr key={developer.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{developer.name}</p>
                  <p className="text-xs text-slate-500">{developer.id}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{developer.rating.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{developer.products}</td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{developer.reviews}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{new Date(developer.joined).toLocaleDateString("tr-TR")}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm font-semibold text-primary hover:underline">Profili Gör</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
