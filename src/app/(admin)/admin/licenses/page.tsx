"use client";

import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

export default function AdminLicensesPage() {
  const tr = useAdminLanguage() === "tr";
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Lisans Yönetimi" : "License Management"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Lisans anahtarları, domain atamaları ve durumları yönetin." : "Manage license keys, domain assignments and statuses."}</p>
        </div>
        <input
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          placeholder={tr ? "Lisans ara..." : "Search license..."}
          type="text"
        />
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {tr ? "Lisans yönetimi henüz yapılandırılmamış." : "License management is not yet configured."}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {tr ? "Bu özelliği etkinleştirmek için lisans API entegrasyonu gereklidir." : "A license API integration is required to enable this feature."}
        </p>
      </div>
    </div>
  );
}
