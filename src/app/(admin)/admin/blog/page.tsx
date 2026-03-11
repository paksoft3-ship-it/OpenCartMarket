"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogPage() {
  const tr = useAdminLanguage() === "tr";
  const locale = tr ? "tr-TR" : "en-US";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const { items } = await res.json();
        setPosts(items ?? []);
      }
    } catch {
      toast.error(tr ? "Blog yazıları yüklenemedi." : "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Blog Yönetimi" : "Blog Management"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "İçerik üretimi, yayın takvimi ve blog performansını yönetin." : "Manage content creation, publishing calendar and blog performance."}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {tr ? "İçerik Takvimi" : "Content Calendar"}
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">{tr ? "Yeni Yazı" : "New Post"}</button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card label={tr ? "Toplam Yazı" : "Total Posts"} value={posts.length.toString()} />
        <Card label={tr ? "Yayında" : "Published"} value={published.toString()} />
        <Card label={tr ? "Taslak" : "Draft"} value={drafts.toString()} />
        <Card label={tr ? "Aylık Okunma" : "Monthly Views"} value="—" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">{tr ? "Yazı" : "Post"}</th>
                  <th className="px-4 py-3">{tr ? "Yazar" : "Author"}</th>
                  <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                  <th className="px-4 py-3">{tr ? "Yayın" : "Publish"}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{post.title}</p>
                      <p className="text-xs text-slate-500">{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{post.author}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {tr ? (post.status === "published" ? "yayında" : post.status === "scheduled" ? "planlandı" : "taslak") : post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{post.publishedAt ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Kategori Dağılımı" : "Category Split"}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="SEO" value="—" />
              <Row label={tr ? "Pazarlama" : "Marketing"} value="—" />
              <Row label={tr ? "Büyüme" : "Growth"} value="—" />
              <Row label={tr ? "Ürün" : "Product"} value="—" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Editoryal Hızlı Aksiyonlar" : "Editorial Quick Actions"}</h2>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                {tr ? "En çok trafik alan 10 yazıyı güncelle" : "Refresh top-traffic 10 posts"}
              </button>
              <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                {tr ? "Düşük CTR başlıkları yeniden yaz" : "Rewrite low-CTR headlines"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Dağıtım Kanalları" : "Distribution Channels"}</h2>
            <div className="mt-3 space-y-2 text-sm">
              <ChannelRow name="Website Blog" cadence={tr ? "Günlük" : "Daily"} health="healthy" tr={tr} />
              <ChannelRow name="Email Digest" cadence={tr ? "Haftalık" : "Weekly"} health="healthy" tr={tr} />
              <ChannelRow name="X / Twitter" cadence={tr ? "Günlük" : "Daily"} health="needs-update" tr={tr} />
              <ChannelRow name="LinkedIn" cadence={tr ? "İki haftada bir" : "Bi-weekly"} health="healthy" tr={tr} />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Editoryal İş Akışı Panosu" : "Editorial Workflow Board"}</h2>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            {tr ? "Hikaye Ekle" : "Add Story"}
          </button>
        </div>
        <div className="grid gap-3 lg:grid-cols-4">
          <WorkflowColumn title={tr ? "Fikirler" : "Ideas"} items={tr ? ["OpenCart checkout UX analizi", "En sık 10 XML feed hatası"] : ["OpenCart checkout UX teardown", "Top 10 XML feed mistakes"]} />
          <WorkflowColumn title={tr ? "Taslak" : "Drafting"} items={tr ? ["Eklenti fiyatlandırma strateji rehberi", "Satıcı elde tutma playbook'u"] : ["Plugin pricing strategy guide", "Merchant retention playbook"]} />
          <WorkflowColumn title={tr ? "İnceleme" : "Review"} items={tr ? ["SEO Checklist 2026 güncellemesi"] : ["SEO Checklist 2026 update"]} />
          <WorkflowColumn title={tr ? "Planlandı" : "Scheduled"} items={tr ? ["Module Bundles dönüşüm yazısı"] : ["Module Bundles conversion post"]} />
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

function ChannelRow({ name, cadence, health, tr }: { name: string; cadence: string; health: "healthy" | "needs-update"; tr: boolean }) {
  const tone = health === "healthy" ? "text-emerald-600" : "text-amber-600";
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-xs text-slate-500">{cadence}</p>
      </div>
      <span className={`text-xs font-semibold ${tone}`}>{tr ? (health === "healthy" ? "sağlıklı" : "güncelleme gerekli") : health}</span>
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
