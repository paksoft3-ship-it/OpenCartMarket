const posts = [
  { id: "BLG-102", title: "OpenCart SEO Checklist 2026", author: "Marketplace Team", status: "published", views: 4210, published: "28 Feb 2026" },
  { id: "BLG-101", title: "Increase Conversion with Module Bundles", author: "Growth Desk", status: "scheduled", views: 0, published: "10 Mar 2026" },
  { id: "BLG-100", title: "Managing XML Integrations at Scale", author: "Tech Ops", status: "draft", views: 0, published: "-" },
];

export default function AdminBlogPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Blog Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">İçerik üretimi, yayın takvimi ve blog performansını yönetin.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            İçerik Takvimi
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Yeni Yazı</button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card label="Toplam Yazı" value="48" />
        <Card label="Yayınlanan" value="37" />
        <Card label="Taslak" value="8" />
        <Card label="Aylık Okunma" value="126K" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Yazı</th>
                <th className="px-4 py-3">Yazar</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Görüntülenme</th>
                <th className="px-4 py-3">Yayın</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{post.title}</p>
                    <p className="text-xs text-slate-500">{post.id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{post.author}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{post.status}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{post.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{post.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kategori Dağılımı</h2>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="SEO" value="14" />
              <Row label="Marketing" value="11" />
              <Row label="Growth" value="9" />
              <Row label="Product" value="14" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Editoryal Hızlı Aksiyonlar</h2>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                En çok trafiği alan 10 yazıyı güncelle
              </button>
              <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                Düşük CTR başlıkları yeniden yaz
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Distribution Channels</h2>
            <div className="mt-3 space-y-2 text-sm">
              <ChannelRow name="Website Blog" cadence="Daily" health="healthy" />
              <ChannelRow name="Email Digest" cadence="Weekly" health="healthy" />
              <ChannelRow name="X / Twitter" cadence="Daily" health="needs-update" />
              <ChannelRow name="LinkedIn" cadence="Bi-weekly" health="healthy" />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Editorial Workflow Board</h2>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            Add Story
          </button>
        </div>
        <div className="grid gap-3 lg:grid-cols-4">
          <WorkflowColumn title="Ideas" items={["OpenCart checkout UX teardown", "Top 10 XML feed mistakes"]} />
          <WorkflowColumn title="Drafting" items={["Plugin pricing strategy guide", "Merchant retention playbook"]} />
          <WorkflowColumn title="Review" items={["SEO Checklist 2026 update"]} />
          <WorkflowColumn title="Scheduled" items={["Module Bundles conversion post"]} />
        </div>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

function ChannelRow({ name, cadence, health }: { name: string; cadence: string; health: "healthy" | "needs-update" }) {
  const tone = health === "healthy" ? "text-emerald-600" : "text-amber-600";
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-xs text-slate-500">{cadence}</p>
      </div>
      <span className={`text-xs font-semibold ${tone}`}>{health}</span>
    </div>
  );
}

function WorkflowColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-md bg-slate-50 px-2.5 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">{item}</p>
        ))}
      </div>
    </div>
  );
}
