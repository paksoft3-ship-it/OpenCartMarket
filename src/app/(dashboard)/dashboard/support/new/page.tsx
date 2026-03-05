"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewSupportTicketPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Destek talebiniz oluşturuldu.");
    router.push("/dashboard/support");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Yeni Destek Talebi Oluştur</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <select className="w-full rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <option>Ürün seçin</option>
          <option>Ultima Theme</option>
          <option>Quick Checkout</option>
        </select>
        <select className="w-full rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <option>Öncelik</option>
          <option>Yüksek</option>
          <option>Normal</option>
          <option>Düşük</option>
        </select>
        <input required placeholder="Kısa başlık" className="w-full rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        <textarea required rows={6} placeholder="Sorununuzu detaylı yazın" className="w-full rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold dark:border-slate-700">Vazgeç</button>
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white">Talep Oluştur</button>
        </div>
      </form>
    </div>
  );
}
