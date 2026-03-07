"use client";

import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

const licenses = [
  { id: "LIC-9042", product: "Ultima Theme Pro", key: "ULT-PRO-8F92-K3M9-L1N5", developer: "Stitch Themes", domain: "magazam.com", status: "active" },
  { id: "LIC-9041", product: "Advanced SEO Module", key: "SEO-ADV-3B11-X2Q8-R0P4", developer: "WebBoost", domain: "modulhub.net", status: "active" },
  { id: "LIC-9040", product: "Quick Checkout UX", key: "QCX-UX7-1M22-A9V6-E2D3", developer: "SmartLabs", domain: null, status: "inactive" },
];

export default function AdminLicensesPage() {
  const tr = useAdminLanguage() === "tr";
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Lisans Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lisans anahtarları, domain atamaları ve durumları yönetin.</p>
        </div>
        <input
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          placeholder={tr ? "Lisans ara..." : "Search license..."}
          type="text"
        />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Kpi label={tr ? "Toplam Lisans" : "Total Licenses"} value="2,941" />
        <Kpi label={tr ? "Aktif Lisans" : "Active Licenses"} value="2,412" />
        <Kpi label={tr ? "Boşta Lisans" : "Unassigned Licenses"} value="529" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3">{tr ? "Lisans" : "License"}</th>
              <th className="px-4 py-3">{tr ? "Ürün" : "Product"}</th>
              <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
              <th className="px-4 py-3 text-right">{tr ? "İşlem" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => (
              <tr key={license.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{license.id}</p>
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{license.key}</code>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{license.product}</td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{license.developer}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{license.domain ?? (tr ? "Atanmamış" : "Unassigned")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${license.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}>
                    {tr ? (license.status === "active" ? "aktif" : "pasif") : license.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm font-semibold text-primary hover:underline">{tr ? "Yönet" : "Manage"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
