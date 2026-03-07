"use client";

import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

const seoIssues = [
  { page: "/browse/themes", issue: "Missing FAQ schema", priority: "high" as const, impact: "+8-12% CTR" },
  { page: "/product/ultimate-opencart-filter-2", issue: "Thin description", priority: "medium" as const, impact: "+4-7% CVR" },
  { page: "/developer", issue: "Duplicate title tags", priority: "medium" as const, impact: "Index quality" },
  { page: "/blog", issue: "No internal links from categories", priority: "high" as const, impact: "+6-9% crawl depth" },
];

export default function AdminSeoPage() {
  const tr = useAdminLanguage() === "tr";

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "SEO Kontrol Merkezi" : "SEO Control Center"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Teknik SEO, içerik kalitesi ve organik büyüme fırsatlarını takip edin." : "Track technical SEO, content quality and organic growth opportunities."}</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">{tr ? "Site Denetimi Çalıştır" : "Run Site Audit"}</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label={tr ? "Organik Tıklama (30g)" : "Organic Clicks (30d)"} value="94,240" />
        <Kpi label={tr ? "Ortalama Sıra" : "Average Rank"} value="12.4" />
        <Kpi label={tr ? "İndekslenen URL" : "Indexed URLs"} value="3,842" />
        <Kpi label={tr ? "Kritik Hata" : "Critical Issues"} value="7" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Öncelikli SEO Görevleri" : "Priority SEO Tasks"}</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{tr ? "Sayfa" : "Page"}</th>
                <th className="px-4 py-3">{tr ? "Sorun" : "Issue"}</th>
                <th className="px-4 py-3">{tr ? "Öncelik" : "Priority"}</th>
                <th className="px-4 py-3">{tr ? "Beklenen Etki" : "Expected Impact"}</th>
              </tr>
            </thead>
            <tbody>
              {seoIssues.map((issue) => (
                <tr key={issue.page} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{issue.page}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{issue.issue}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${issue.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {tr ? (issue.priority === "high" ? "yüksek" : "orta") : issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-600">{issue.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Öne Çıkan Anahtar Kelimeler" : "Top Keywords"}</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Item keyword="opencart theme marketplace" rank="#4" />
              <Item keyword="opencart xml integration" rank="#6" />
              <Item keyword="opencart seo module" rank="#7" />
              <Item keyword="opencart payment module" rank="#9" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "İçerik Kuyruğu" : "Content Queue"}</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "OpenCart kategori SEO rehberi" : "OpenCart Category SEO Guide"}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "XML feed optimizasyonu 101" : "XML Feed Optimization 101"}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Tema bounce oranı nasıl düşürülür" : "How to Reduce Theme Bounce Rate"}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Teknik Sağlık" : "Technical Health"}</h3>
            <div className="mt-4 space-y-2">
              <HealthRow label={tr ? "Core Web Vitals Geçiş Oranı" : "Core Web Vitals Pass Rate"} value="86%" status="good" />
              <HealthRow label={tr ? "Şema Kapsamı" : "Schema Coverage"} value="72%" status="warn" />
              <HealthRow label={tr ? "Kırık Bağlantı" : "Broken Links"} value="19" status="bad" />
              <HealthRow label={tr ? "Yönlendirme Zinciri" : "Redirect Chains"} value="6" status="warn" />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "SEO Sprint Panosu" : "SEO Sprint Board"}</h2>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">{tr ? "Bilet Oluştur" : "Create Ticket"}</button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <SprintColumn title="Backlog" items={tr ? ["Eski kategori içeriklerini güncelle", "Tema sayfalarına FAQ şeması ekle"] : ["Refresh stale category content", "Add FAQ schema to theme pages"]} />
          <SprintColumn title={tr ? "Devam Ediyor" : "In Progress"} items={tr ? ["/blog için canonical temizliği", "PNG hero görsellerini sıkıştır"] : ["Canonical cleanup for /blog", "Compress PNG hero assets"]} />
          <SprintColumn title={tr ? "Tamamlandı" : "Done"} items={tr ? ["/developer sayfasında yinelenen başlıkları düzelt", "Sitemap ping otomasyonu ekle"] : ["Fix duplicate title tags on /developer", "Add sitemap ping automation"]} />
        </div>
      </section>
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

function Item({ keyword, rank }: { keyword: string; rank: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
      <span className="text-slate-700 dark:text-slate-300">{keyword}</span>
      <span className="font-semibold text-primary">{rank}</span>
    </div>
  );
}

function HealthRow({ label, value, status }: { label: string; value: string; status: "good" | "warn" | "bad" }) {
  const tone = status === "good" ? "text-emerald-600" : status === "warn" ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className={`font-semibold ${tone}`}>{value}</span>
    </div>
  );
}

function SprintColumn({ title, items }: { title: string; items: string[] }) {
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
