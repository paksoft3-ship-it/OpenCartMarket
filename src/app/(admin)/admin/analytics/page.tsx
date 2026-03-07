"use client";

import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

const topDevelopers = [
  { name: "PixelThemes Co.", sales: 342, volume: "₺42,500" },
  { name: "WebBoost Studio", sales: 298, volume: "₺31,200" },
  { name: "SmartLabs", sales: 221, volume: "₺24,750" },
];

const recentPayouts = [
  { id: "PY-1042", developer: "PixelThemes Co.", amount: "₺8,200", status: "completed" as const },
  { id: "PY-1041", developer: "WebBoost Studio", amount: "₺5,400", status: "processing" as const },
  { id: "PY-1040", developer: "SmartLabs", amount: "₺4,150", status: "pending" as const },
];

export default function AdminAnalyticsPage() {
  const tr = useAdminLanguage() === "tr";

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Satış Analitiği" : "Sales Analytics"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Pazaryeri performans metrikleri ve ödeme hareketleri." : "Marketplace performance metrics and payout activity."}</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">{tr ? "Rapor İndir" : "Download Report"}</button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={tr ? "Toplam Brüt Satış" : "Gross Sales"} value="₺128,450" change="+12.5%" />
        <MetricCard label={tr ? "Net Gelir" : "Net Revenue"} value="₺102,340" change="+8.2%" />
        <MetricCard label={tr ? "Ortalama Sepet" : "Average Basket"} value="₺1,250" change="+5.4%" />
        <MetricCard label={tr ? "İade Oranı" : "Refund Rate"} value="%2.4" change={tr ? "Stabil" : "Stable"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tr ? "Satış Performansı" : "Sales Performance"}</h2>
            <div className="text-xs text-slate-500">{tr ? "1 Eki - 31 Eki" : "Oct 1 - Oct 31"}</div>
          </div>
          <div className="h-[260px]">
            <svg className="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 260">
              <path d="M0 220 C100 210,150 140,250 160 C350 180,420 90,520 120 C620 150,680 70,800 95 L800 260 L0 260 Z" fill="#5c6cff1a" />
              <path d="M0 220 C100 210,150 140,250 160 C350 180,420 90,520 120 C620 150,680 70,800 95" stroke="#5c6cff" strokeWidth="3" />
            </svg>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{tr ? "Kategori Dağılımı" : "Category Split"}</h2>
          <div className="space-y-3 text-sm">
            <RowLabel label={tr ? "Temalar" : "Themes"} percent="58%" />
            <RowLabel label={tr ? "Modüller" : "Modules"} percent="32%" />
            <RowLabel label={tr ? "Servisler" : "Services"} percent="10%" />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "En Çok Satan Geliştiriciler" : "Top Developers"}</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
                <th className="px-4 py-3">{tr ? "Satış" : "Sales"}</th>
                <th className="px-4 py-3">{tr ? "Hacim" : "Volume"}</th>
              </tr>
            </thead>
            <tbody>
              {topDevelopers.map((developer) => (
                <tr key={developer.name} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{developer.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{developer.sales}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{developer.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Son Ödemeler" : "Recent Payouts"}</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
                <th className="px-4 py-3">{tr ? "Tutar" : "Amount"}</th>
                <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {recentPayouts.map((payout) => (
                <tr key={payout.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{payout.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{payout.developer}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{payout.amount}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {tr ? payoutStatusTr(payout.status) : payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function payoutStatusTr(status: "completed" | "processing" | "pending") {
  if (status === "completed") return "tamamlandı";
  if (status === "processing") return "işleniyor";
  return "beklemede";
}

function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-2 text-xs font-semibold text-primary">{change}</p>
    </div>
  );
}

function RowLabel({ label, percent }: { label: string; percent: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700 dark:border-slate-800 dark:text-slate-200">
      <span>{label}</span>
      <span className="font-semibold">{percent}</span>
    </div>
  );
}
