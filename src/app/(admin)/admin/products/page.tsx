"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import productsFallback from "@/data/products.json";
import categories from "@/data/categories.json";
import { Product } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

const productSlots = [
  { type: "themes", label: "Themes", icon: "palette", color: "from-indigo-500 to-violet-500" },
  { type: "modules", label: "Modules", icon: "extension", color: "from-emerald-500 to-teal-500" },
  { type: "xml-integrations", label: "XML Integrations", icon: "sync_alt", color: "from-sky-500 to-cyan-500" },
  { type: "payment", label: "Payment", icon: "payments", color: "from-amber-500 to-orange-500" },
  { type: "marketing", label: "Marketing & SEO", icon: "trending_up", color: "from-pink-500 to-rose-500" },
];

const pipeline = [
  { label: "Concept", count: 24, note: "Yeni fikirler ve brief'ler" },
  { label: "In Build", count: 13, note: "Geliştirme aşamasında" },
  { label: "QA Review", count: 9, note: "Test ve kalite kontrol" },
  { label: "Launch Ready", count: 7, note: "Yayın bekliyor" },
];

export default function AdminProductsPage() {
  const language = useAdminLanguage();
  const tr = language === "tr";
  const [products, setProducts] = useState<Product[]>(productsFallback as Product[]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, search, categoryFilter]);

  const categoryStats = useMemo(() => {
    return productSlots.map((slot) => ({
      ...slot,
      count: products.filter((product) => product.categoryId === slot.type).length,
    }));
  }, [products]);

  const slotLabel = (label: string) => {
    if (!tr) return label;
    const map: Record<string, string> = {
      Themes: "Temalar",
      Modules: "Modüller",
      "XML Integrations": "XML Entegrasyonları",
      Payment: "Ödeme",
      "Marketing & SEO": "Pazarlama ve SEO",
    };
    return map[label] ?? label;
  };

  const pipelineLabel = (label: string) => {
    if (!tr) return label;
    const map: Record<string, string> = {
      Concept: "Konsept",
      "In Build": "Geliştirme",
      "QA Review": "QA İnceleme",
      "Launch Ready": "Yayına Hazır",
    };
    return map[label] ?? label;
  };

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string).trim();
    const categoryId = (formData.get("categoryId") as string).trim();
    const price = Number(formData.get("price"));

    if (!name || !categoryId || Number.isNaN(price)) {
      toast.error(tr ? "Lütfen zorunlu alanları doldurun." : "Please fill in required fields.");
      return;
    }

    const newProduct: Product = {
      id: `prod-${crypto.randomUUID().slice(0, 8)}`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      shortDescription: (formData.get("shortDescription") as string) || "Yeni urun aciklamasi",
      description: "Yonetim panelinden detaylandirilacak urun icerigi.",
      price,
      rating: "0.0",
      installs: 0,
      categoryId,
      developerId: "dev-1",
      compatibility: ["4.0.2.3"],
      images: ["https://picsum.photos/seed/new-admin-product/800/600"],
      features: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    toast.success(tr ? "Ürün eklendi." : "Product added.");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.success(tr ? "Ürün kaldırıldı." : "Product removed.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Product Command Center</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "Tema, modül, XML entegrasyonu, ödeme, pazarlama ve SEO ürünlerini tek panelden yönetin."
              : "Manage themes, modules, XML integrations, payment, marketing and SEO products from one panel."}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">{tr ? "Yeni Ürün Ekle" : "Add New Product"}</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tr ? "Yeni Ürün" : "New Product"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-3" onSubmit={handleAddProduct}>
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" name="name" placeholder={tr ? "Ürün adı" : "Product name"} required />
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" defaultValue="themes" name="categoryId">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" min="0" name="price" placeholder={tr ? "Fiyat" : "Price"} required step="0.01" type="number" />
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" name="shortDescription" placeholder={tr ? "Kısa açıklama" : "Short description"} required />
              <button className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90" type="submit">{tr ? "Kaydet" : "Save"}</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <JumpCard href="/admin/modules" icon="deployed_code" label={tr ? "Modül Yayın Laboratuvarı" : "Open Modules Release Lab"} desc={tr ? "QA aşamaları, yayın hattı ve uyumluluk." : "QA gates, release train and compatibility."} />
        <JumpCard href="/admin/xml" icon="sync_alt" label={tr ? "XML Entegrasyon Merkezi" : "Open XML Integration Hub"} desc={tr ? "Besleme durumu, eşlemeler ve yeniden denemeler." : "Feed status, mappings and retries."} />
        <JumpCard href="/admin/marketing" icon="campaign" label={tr ? "Pazarlama Konsolu" : "Open Marketing Console"} desc={tr ? "Kampanya paketleri ve büyüme yerleşimleri." : "Campaign bundles and growth placement."} />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {categoryStats.map((slot) => (
          <article key={slot.type} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className={`bg-gradient-to-r ${slot.color} px-4 py-3 text-white`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{slotLabel(slot.label)}</p>
                <span className="material-symbols-outlined text-lg">{slot.icon}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{slot.count}</p>
              <p className="text-xs text-slate-500">{tr ? "Aktif ürün" : "Active products"}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-4">
        {pipeline.map((item) => (
          <section key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{pipelineLabel(item.label)}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{item.count}</p>
            <p className="mt-1 text-xs text-slate-500">{item.note}</p>
          </section>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          onChange={(event) => setSearch(event.target.value)}
          placeholder={tr ? "Ürün ara..." : "Search product..."}
          value={search}
        />
        <FilterButton active={categoryFilter === "all"} label={tr ? "Tüm Ürünler" : "All Products"} onClick={() => setCategoryFilter("all")} />
        {categories.map((category) => (
          <FilterButton
            key={category.id}
            active={categoryFilter === category.id}
            label={category.name}
            onClick={() => setCategoryFilter(category.id)}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.slice(0, 12).map((product) => (
          <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{product.slug}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary capitalize">
                {product.categoryId.replace("-", " ")}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{product.shortDescription}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">${product.price.toFixed(0)}</p>
                <p className="text-slate-500">{tr ? "Fiyat" : "Price"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{product.rating}</p>
                <p className="text-slate-500">{tr ? "Puan" : "Rating"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{product.installs.toLocaleString()}</p>
                <p className="text-slate-500">{tr ? "Kurulum" : "Installs"}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                {tr ? "Düzenle" : "Edit"}
              </button>
              <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={() => deleteProduct(product.id)}>
                {tr ? "Sil" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "bg-primary text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function JumpCard({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50" href={href}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      </div>
      <p className="mt-2 text-xs text-slate-500">{desc}</p>
    </Link>
  );
}
