"use client";

const payouts = [
  { id: "PAY-1001", period: "2026-02", gross: "$2,140", fee: "$321", net: "$1,819", status: "paid" },
  { id: "PAY-1000", period: "2026-01", gross: "$1,930", fee: "$289", net: "$1,641", status: "paid" },
  { id: "PAY-0999", period: "2025-12", gross: "$1,450", fee: "$217", net: "$1,233", status: "processing" },
];

export default function DeveloperAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ödemeler ve Kazançlar</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Developer payouts dashboard tasarımı entegre edildi.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Bu Ay Brüt</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">$2,140</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Komisyon</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">$321</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-400">Net Ödeme</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">$1,819</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">Ödeme ID</th>
              <th className="px-5 py-3">Dönem</th>
              <th className="px-5 py-3">Brüt</th>
              <th className="px-5 py-3">Komisyon</th>
              <th className="px-5 py-3">Net</th>
              <th className="px-5 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{payout.id}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{payout.period}</td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">{payout.gross}</td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">{payout.fee}</td>
                <td className="px-5 py-4 text-sm font-bold text-emerald-600">{payout.net}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${payout.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {payout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
