"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

export default function AdminProductsPage() {
  const language = useAdminLanguage();
  const tr = language === "tr";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/admin/products", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load products");
        const payload = await response.json() as { items: Array<Record<string, unknown>> };
        if (!active) return;
        const mapped = (payload.items ?? []).map((item) => ({
          id: String(item.id),
          slug: String(item.slug),
          name: String(item.name),
          shortDescription: String(item.shortDescription ?? ""),
          description: String(item.description ?? ""),
          price: Number(item.price ?? 0),
          rating: "0.0",
          installs: 0,
          categoryId: String(item.categoryId),
          developerId: String(item.developerId ?? "dev-1"),
          compatibility: Array.isArray(item.compatibility) ? item.compatibility.map(String) : [],
          images: Array.isArray(item.images) ? item.images.map(String) : [],
          features: Array.isArray(item.features) ? item.features.map(String) : [],
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          createdAt: String(item.createdAt ?? new Date().toISOString()),
          updatedAt: String(item.updatedAt ?? new Date().toISOString()),
        })) as Product[];
        setProducts(mapped);
      } catch {
        toast.error(tr ? "Ürünler yüklenemedi." : "Failed to load products.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      active = false;
    };
  }, [tr]);

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

    const payload = {
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      shortDescription: (formData.get("shortDescription") as string) || "",
      description: "",
      price,
      categoryId,
      developerId: "",
      compatibility: [],
      images: [],
      features: [],
      tags: [],
      version: "1.0.0",
      status: "published",
    };
    fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-actor": "Admin UI",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Create failed");
        const created = await response.json() as Record<string, unknown>;
        const mapped: Product = {
          id: String(created.id),
          slug: String(created.slug),
          name: String(created.name),
          shortDescription: String(created.shortDescription ?? ""),
          description: String(created.description ?? ""),
          price: Number(created.price ?? 0),
          rating: "0.0",
          installs: 0,
          categoryId: String(created.categoryId),
          developerId: String(created.developerId ?? "dev-1"),
          compatibility: Array.isArray(created.compatibility) ? created.compatibility.map(String) : [],
          images: Array.isArray(created.images) ? created.images.map(String) : [],
          features: Array.isArray(created.features) ? created.features.map(String) : [],
          tags: Array.isArray(created.tags) ? created.tags.map(String) : [],
          createdAt: String(created.createdAt ?? new Date().toISOString()),
          updatedAt: String(created.updatedAt ?? new Date().toISOString()),
        };
        setProducts((prev) => [mapped, ...prev]);
        toast.success(tr ? "Ürün eklendi." : "Product added.");
      })
      .catch(() => {
        toast.error(tr ? "Ürün eklenemedi." : "Failed to add product.");
      });
  };

  const handleEditProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editProduct) return;
    setEditSaving(true);
    const formData = new FormData(event.currentTarget);
    const patch = {
      name: (formData.get("name") as string).trim(),
      price: Number(formData.get("price")),
      shortDescription: (formData.get("shortDescription") as string).trim(),
      categoryId: formData.get("categoryId") as string,
    };
    try {
      const res = await fetch(`/api/admin/products/${editProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin UI" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json() as Record<string, unknown>;
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, ...patch, updatedAt: String(updated.updatedAt ?? new Date().toISOString()) } : p));
      setEditProduct(null);
      toast.success(tr ? "Ürün güncellendi." : "Product updated.");
    } catch {
      toast.error(tr ? "Güncelleme başarısız." : "Update failed.");
    } finally {
      setEditSaving(false);
    }
  };

  const deleteProduct = (id: string) => {
    fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-actor": "Admin UI" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Delete failed");
        setProducts((prev) => prev.filter((product) => product.id !== id));
        toast.success(tr ? "Ürün kaldırıldı." : "Product removed.");
      })
      .catch(() => {
        toast.error(tr ? "Ürün silinemedi." : "Failed to delete product.");
      });
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
        {!loading && filtered.length === 0 && (
          <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            {tr ? "Filtreye uygun ürün bulunamadı." : "No products found for the selected filter."}
          </article>
        )}
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
              <button className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setEditProduct(product)}>
                {tr ? "Düzenle" : "Edit"}
              </button>
              <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={() => deleteProduct(product.id)}>
                {tr ? "Sil" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tr ? "Ürünü Düzenle" : "Edit Product"}</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setEditProduct(null)}>✕</button>
            </div>
            <form className="space-y-3" onSubmit={handleEditProduct}>
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" name="name" defaultValue={editProduct.name} placeholder={tr ? "Ürün adı" : "Product name"} required />
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" name="categoryId" defaultValue={editProduct.categoryId}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" min="0" name="price" defaultValue={editProduct.price} placeholder={tr ? "Fiyat" : "Price"} required step="0.01" type="number" />
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" name="shortDescription" defaultValue={editProduct.shortDescription} placeholder={tr ? "Kısa açıklama" : "Short description"} required />
              <div className="flex gap-2 pt-2">
                <button type="button" className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => setEditProduct(null)}>
                  {tr ? "İptal" : "Cancel"}
                </button>
                <button type="submit" disabled={editSaving} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
                  {editSaving ? (tr ? "Kaydediliyor..." : "Saving...") : (tr ? "Güncelle" : "Update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
