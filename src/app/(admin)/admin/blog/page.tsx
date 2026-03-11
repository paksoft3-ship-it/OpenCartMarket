"use client";

import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: "",
    cover: "",
    category: "SEO" as "SEO" | "Marketing" | "Growth" | "Product",
    readTime: "",
    status: "draft" as "draft" | "published",
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      toast.error(tr ? "Başlık ve yazar zorunludur." : "Title and author are required.");
      return;
    }
    setSaving(true);
    try {
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin" },
        body: JSON.stringify({ ...form, slug }),
      });
      if (!res.ok) throw new Error();
      const created: BlogPost = await res.json();
      setPosts((prev) => [created, ...prev]);
      setShowModal(false);
      setForm({
        title: "",
        author: "",
        excerpt: "",
        content: "",
        cover: "",
        category: "SEO",
        readTime: "",
        status: "draft",
      });
      toast.success(tr ? "Blog yazısı oluşturuldu." : "Blog post created.");
    } catch {
      toast.error(tr ? "Yazı oluşturulamadı." : "Failed to create post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(tr ? "Bu yazı silinsin mi?" : "Delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE", headers: { "x-admin-actor": "Admin" } });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success(tr ? "Yazı silindi." : "Post deleted.");
    } catch {
      toast.error(tr ? "Silinemedi." : "Delete failed.");
    }
  };

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Blog Yönetimi" : "Blog Management"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "İçerik üretimi, yayın takvimi ve blog performansını yönetin." : "Manage content creation, publishing calendar and blog performance."}</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90" onClick={() => setShowModal(true)}>
          {tr ? "Yeni Yazı" : "New Post"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card label={tr ? "Toplam Yazı" : "Total Posts"} value={posts.length.toString()} />
        <Card label={tr ? "Yayında" : "Published"} value={published.toString()} />
        <Card label={tr ? "Taslak" : "Draft"} value={drafts.toString()} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex items-center justify-center p-10 text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-slate-500 gap-2">
            <p>{tr ? "Henüz blog yazısı yok." : "No blog posts yet."}</p>
            <button className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90" onClick={() => setShowModal(true)}>
              {tr ? "İlk Yazıyı Oluştur" : "Create First Post"}
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{tr ? "Yazı" : "Post"}</th>
                <th className="px-4 py-3">{tr ? "Yazar" : "Author"}</th>
                <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                <th className="px-4 py-3">{tr ? "Tarih" : "Date"}</th>
                <th className="px-4 py-3"></th>
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
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                      {tr ? (post.status === "published" ? "yayında" : "taslak") : post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(tr ? "tr-TR" : "en-US") : "—"}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => handleDelete(post.id)}>
                      {tr ? "Sil" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tr ? "Yeni Blog Yazısı" : "New Blog Post"}</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder={tr ? "Başlık *" : "Title *"}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder={tr ? "Yazar *" : "Author *"}
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder={tr ? "Özet" : "Excerpt"}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="Cover image URL"
                value={form.cover}
                onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
              />
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as "SEO" | "Marketing" | "Growth" | "Product" }))}
              >
                <option value="SEO">SEO</option>
                <option value="Marketing">Marketing</option>
                <option value="Growth">Growth</option>
                <option value="Product">Product</option>
              </select>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="e.g. 5 min"
                value={form.readTime}
                onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
              />
              <div data-color-mode="light">
                <MDEditor
                  value={form.content}
                  onChange={(val) => setForm((f) => ({ ...f, content: val ?? "" }))}
                  height={300}
                />
              </div>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "draft" | "published" }))}
              >
                <option value="draft">{tr ? "Taslak" : "Draft"}</option>
                <option value="published">{tr ? "Yayınla" : "Published"}</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => setShowModal(false)}>
                  {tr ? "İptal" : "Cancel"}
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
                  {saving ? (tr ? "Kaydediliyor..." : "Saving...") : (tr ? "Kaydet" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
