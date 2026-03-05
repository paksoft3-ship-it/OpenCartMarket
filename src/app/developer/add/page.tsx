"use client";

import { toast } from "sonner";

export default function DeveloperAddProductPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Ürün taslağı kaydedildi (mock)");
  };

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create / Edit Product</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Zip v3 içindeki product create/edit form tasarımına göre güncellendi.</p>
          </div>
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white">Yayınla</button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            <input required placeholder="Ürün Başlığı" className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
            <input required placeholder="Slug" className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
            <select className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option>Tema</option>
              <option>Ödeme Modülü</option>
              <option>SEO Modülü</option>
            </select>
            <input required type="number" step="0.01" placeholder="Fiyat" className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>

          <textarea rows={8} placeholder="Ürün açıklaması, özellikler ve changelog" className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800" />

          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
            <label className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
              ZIP Dosyası
              <input type="file" className="mt-2 block w-full text-xs" />
            </label>
            <label className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
              Görseller
              <input type="file" multiple className="mt-2 block w-full text-xs" />
            </label>
            <label className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
              Dokümantasyon
              <input type="file" className="mt-2 block w-full text-xs" />
            </label>
          </div>
        </section>
      </form>
    </div>
  );
}
