"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";
import { toast } from "sonner";

interface SeoPage {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  noindex: boolean;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  updatedAt: string;
}

export default function AdminSeoPage() {
  const tr = useAdminLanguage() === "tr";
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((data) => setPages(data.items ?? []))
      .catch(() => toast.error(tr ? "SEO sayfaları yüklenemedi." : "Failed to load SEO pages."))
      .finally(() => setLoading(false));
  }, [tr]);

  const issues = useMemo(() => {
    return pages
      .flatMap((page) => {
        const found: { page: string; issue: string; priority: "high" | "medium" }[] = [];
        if (!page.title) found.push({ page: page.slug, issue: tr ? "Başlık eksik" : "Missing title", priority: "high" });
        if (!page.description) found.push({ page: page.slug, issue: tr ? "Açıklama eksik" : "Missing description", priority: "high" });
        if (!page.keywords) found.push({ page: page.slug, issue: tr ? "Anahtar kelime yok" : "No keywords", priority: "medium" });
        if (!page.ogTitle && !page.ogDescription) found.push({ page: page.slug, issue: tr ? "OG meta eksik" : "Missing OG meta", priority: "medium" });
        return found;
      })
      .slice(0, 10);
  }, [pages, tr]);

  const pagesWithTitle = pages.filter((p) => p.title).length;
  const pagesWithDescription = pages.filter((p) => p.description).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "SEO Kontrol Merkezi" : "SEO Control Center"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Teknik SEO, içerik kalitesi ve organik büyüme fırsatlarını takip edin." : "Track technical SEO, content quality and organic growth opportunities."}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label={tr ? "Toplam Sayfa" : "Total Pages"} value={loading ? "—" : pages.length.toString()} />
        <Kpi label={tr ? "Başlığı Olan" : "With Title"} value={loading ? "—" : pagesWithTitle.toString()} />
        <Kpi label={tr ? "Açıklaması Olan" : "With Description"} value={loading ? "—" : pagesWithDescription.toString()} />
        <Kpi label={tr ? "Sorun Sayısı" : "Issues Found"} value={loading ? "—" : issues.length.toString()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Öncelikli SEO Sorunları" : "Priority SEO Issues"}</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
          ) : issues.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              {pages.length === 0
                ? (tr ? "Henüz SEO sayfası yok." : "No SEO pages configured yet.")
                : (tr ? "Tüm sayfalar sağlıklı görünüyor." : "All pages look healthy.")}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">{tr ? "Sayfa" : "Page"}</th>
                  <th className="px-4 py-3">{tr ? "Sorun" : "Issue"}</th>
                  <th className="px-4 py-3">{tr ? "Öncelik" : "Priority"}</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{issue.page}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{issue.issue}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${issue.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {tr ? (issue.priority === "high" ? "yüksek" : "orta") : issue.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Sayfa Durumu" : "Page Health"}</h3>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</p>
            ) : pages.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">{tr ? "Henüz veri yok." : "No data yet."}</p>
            ) : (
              <div className="mt-4 space-y-2">
                <HealthRow
                  label={tr ? "Başlık Kapsamı" : "Title Coverage"}
                  value={`${Math.round((pagesWithTitle / pages.length) * 100)}%`}
                  status={pagesWithTitle === pages.length ? "good" : pagesWithTitle > pages.length / 2 ? "warn" : "bad"}
                />
                <HealthRow
                  label={tr ? "Açıklama Kapsamı" : "Description Coverage"}
                  value={`${Math.round((pagesWithDescription / pages.length) * 100)}%`}
                  status={pagesWithDescription === pages.length ? "good" : pagesWithDescription > pages.length / 2 ? "warn" : "bad"}
                />
                <HealthRow
                  label={tr ? "Toplam Sorun" : "Total Issues"}
                  value={issues.length.toString()}
                  status={issues.length === 0 ? "good" : issues.length < 5 ? "warn" : "bad"}
                />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Tüm SEO Sayfaları" : "All SEO Pages"}</h3>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</p>
            ) : pages.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">{tr ? "Henüz SEO sayfası yok." : "No SEO pages configured."}</p>
            ) : (
              <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm">
                {pages.map((page) => (
                  <li key={page.slug} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {page.slug}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
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

function HealthRow({ label, value, status }: { label: string; value: string; status: "good" | "warn" | "bad" }) {
  const tone = status === "good" ? "text-emerald-600" : status === "warn" ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className={`font-semibold ${tone}`}>{value}</span>
    </div>
  );
}
