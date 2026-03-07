const campaigns = [
  { id: "MKT-31", name: "Spring Bundle Push", channel: "Email", budget: "$1,200", roas: "4.2x", status: "active" },
  { id: "MKT-30", name: "Theme Launch Retargeting", channel: "Meta Ads", budget: "$2,800", roas: "3.7x", status: "active" },
  { id: "MKT-29", name: "Developer Recruitment", channel: "Search", budget: "$1,500", roas: "2.9x", status: "paused" },
];

export default function AdminMarketingPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Marketing Merkezi</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kampanyalar, bütçe dağılımı ve dönüşüm performansını yönetin.</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Kampanya Oluştur</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label="Aylık Gelir" value="$86,430" />
        <Metric label="Pazarlama Harcaması" value="$12,940" />
        <Metric label="Ortalama ROAS" value="3.8x" />
        <Metric label="Yeni Müşteri" value="1,284" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kampanya Panosu</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Kampanya</th>
                <th className="px-4 py-3">Kanal</th>
                <th className="px-4 py-3">Bütçe</th>
                <th className="px-4 py-3">ROAS</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{campaign.name}</p>
                    <p className="text-xs text-slate-500">{campaign.id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{campaign.channel}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{campaign.budget}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">{campaign.roas}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{campaign.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kanal Dağılımı</h3>
            <div className="mt-4 space-y-3 text-sm">
              <SmallRow label="Email" value="31%" />
              <SmallRow label="Search Ads" value="26%" />
              <SmallRow label="Meta Ads" value="19%" />
              <SmallRow label="Affiliate" value="24%" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Hızlı Segmentler</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">New Buyers</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">Theme Buyers</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">High LTV</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">Churn Risk</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Funnel Snapshot</h3>
            <div className="mt-4 space-y-2">
              <FunnelRow stage="Ad Clicks" volume="48,220" ratio="100%" />
              <FunnelRow stage="Landing Sessions" volume="32,402" ratio="67%" />
              <FunnelRow stage="Product Views" volume="18,109" ratio="37%" />
              <FunnelRow stage="Checkout Starts" volume="4,912" ratio="10%" />
              <FunnelRow stage="Purchases" volume="2,203" ratio="4.6%" />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Experiment Backlog</h2>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Add Test</button>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <BacklogCard title="Homepage Hero Variant" impact="High" owner="Growth" eta="3 days" />
          <BacklogCard title="Checkout Coupon UX" impact="Medium" owner="Product" eta="6 days" />
          <BacklogCard title="Exit Intent Popup Rules" impact="Medium" owner="CRM" eta="4 days" />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function SmallRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700 dark:border-slate-800 dark:text-slate-200">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function FunnelRow({ stage, volume, ratio }: { stage: string; volume: string; ratio: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
      <span className="text-slate-700 dark:text-slate-200">{stage}</span>
      <span className="text-right">
        <span className="block font-semibold text-slate-900 dark:text-slate-100">{volume}</span>
        <span className="text-xs text-slate-500">{ratio}</span>
      </span>
    </div>
  );
}

function BacklogCard({ title, impact, owner, eta }: { title: string; impact: string; owner: string; eta: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-xs text-slate-500">Impact: {impact}</p>
      <p className="text-xs text-slate-500">Owner: {owner}</p>
      <p className="text-xs text-slate-500">ETA: {eta}</p>
    </div>
  );
}
