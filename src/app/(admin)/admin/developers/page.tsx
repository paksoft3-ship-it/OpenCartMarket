"use client";

import developers from "@/data/developers.json";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

export default function AdminDevelopersPage() {
  const tr = useAdminLanguage() === "tr";
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
            placeholder={tr ? "Geliştirici ara..." : "Search developer..."}
            type="text"
          />
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">{tr ? "Geliştirici Ekle" : "Add Developer"}</button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label={tr ? "Toplam Geliştirici" : "Total Developers"} value="842" />
        <MetricCard label={tr ? "Aktif Satıcı" : "Active Sellers"} value="796" />
        <MetricCard label={tr ? "Yeni Başvuru (7 gün)" : "New Applications (7d)"} value="34" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
              <th className="px-4 py-3">{tr ? "Puan" : "Rating"}</th>
              <th className="px-4 py-3">{tr ? "Ürün" : "Products"}</th>
              <th className="px-4 py-3">{tr ? "İnceleme" : "Reviews"}</th>
              <th className="px-4 py-3">{tr ? "Katılım" : "Joined"}</th>
              <th className="px-4 py-3 text-right">{tr ? "İşlem" : "Action"}</th>
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
                <td className="px-4 py-3 text-sm text-slate-500">{new Date(developer.joined).toLocaleDateString(tr ? "tr-TR" : "en-US")}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm font-semibold text-primary hover:underline">{tr ? "Profili Gör" : "View Profile"}</button>
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
