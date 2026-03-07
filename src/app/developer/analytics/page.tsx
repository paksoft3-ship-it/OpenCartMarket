const bestSellers = [
  { name: "Ultima Theme Pro", sales: 118, net: "₺28,400" },
  { name: "Advanced SEO Module", sales: 92, net: "₺14,650" },
  { name: "Quick Checkout UX", sales: 64, net: "₺9,200" },
];

const recentSales = [
  { id: "ORD-8A12", product: "Ultima Theme Pro", date: "06 Mar 2026", amount: "₺1,250" },
  { id: "ORD-8A11", product: "SEO Module", date: "05 Mar 2026", amount: "₺450" },
  { id: "ORD-8A10", product: "Quick Checkout UX", date: "05 Mar 2026", amount: "₺380" },
];

export default function DeveloperAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Satış Analitiği</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ürün performansı, net kazanç trendi ve son satışlar.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Bu Ay Brüt Satış" value="₺42,850" />
        <Card label="Platform Komisyonu" value="₺6,420" />
        <Card label="Net Kazanç" value="₺36,430" accent />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Günlük Kazanç Trendi</h2>
        <div className="mt-4 h-52">
          <svg className="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 700 220">
            <path d="M0 190 C80 170,120 130,200 150 C280 170,340 90,420 110 C500 130,560 70,700 85 L700 220 L0 220 Z" fill="#5c6cff1a" />
            <path d="M0 190 C80 170,120 130,200 150 C280 170,340 90,420 110 C500 130,560 70,700 85" stroke="#5c6cff" strokeWidth="3" />
          </svg>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">En Çok Satanlar</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-3">Ürün</th>
                <th className="px-5 py-3">Satış</th>
                <th className="px-5 py-3">Net</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((item) => (
                <tr key={item.name} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{item.sales}</td>
                  <td className="px-5 py-4 text-sm font-bold text-emerald-600">{item.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Son Satışlar</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-3">Sipariş</th>
                <th className="px-5 py-3">Ürün</th>
                <th className="px-5 py-3">Tarih</th>
                <th className="px-5 py-3">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.id}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{item.product}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-5 py-4 text-sm font-bold text-emerald-600">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function Card({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-black ${accent ? "text-emerald-600" : "text-slate-900 dark:text-white"}`}>{value}</p>
    </div>
  );
}
