"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMockData } from "@/lib/hooks/useMockData";

export default function LicensesPage() {
  const { licenses, isLoaded } = useMockData();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isLoaded) {
    return <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Lisans Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aktif ve pasif lisanslarınızı yeni tasarım düzeninde yönetin.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">Ürün</th>
              <th className="px-5 py-3">Lisans Anahtarı</th>
              <th className="px-5 py-3">Domain</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => (
              <tr key={license.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{license.productName}</td>
                <td className="px-5 py-4">
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">{license.key}</code>
                </td>
                <td className="px-5 py-4 text-sm">
                  {editingId === license.id ? (
                    <div className="flex items-center gap-2">
                      <input defaultValue={license.domain || ""} placeholder="yeni-domain.com" className="h-9 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800" />
                      <button
                        onClick={() => {
                          setEditingId(null);
                          toast.success("Domain güncellendi (mock)");
                        }}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white"
                      >
                        Kaydet
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-600 dark:text-slate-300">{license.domain || "Atanmamış"}</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${license.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {license.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => setEditingId(license.id)} className="text-sm font-semibold text-primary hover:underline">Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
