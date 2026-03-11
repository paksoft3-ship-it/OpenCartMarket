"use client";

import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

export default function AdminCustomersPage() {
  const tr = useAdminLanguage() === "tr";

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Müşteri 360" : "Customer 360"}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Segment, LTV, destek durumu ve sonraki aksiyon önerileri." : "Segment, LTV, ticket health and recommended next actions."}</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <span className="material-symbols-outlined text-5xl text-slate-400">group</span>
        <h2 className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-300">
          {tr ? "Müşteri verisi henüz bağlı değil" : "Customer data not connected yet"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {tr
            ? "Müşteri profilleri, sipariş sisteminizle entegre olduğunda burada görünecek. Destek taleplerine Admin → Destek bölümünden erişebilirsiniz."
            : "Customer profiles will appear here once integrated with your order system. You can access support tickets from Admin → Support."}
        </p>
      </div>
    </div>
  );
}
