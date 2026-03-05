"use client";

import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAppStore();
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [securityEmails, setSecurityEmails] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Ayarlar kaydedildi (mock)");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Hesap Ayarları</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Yeni design dosyasındaki profile/security/preferences düzeni uygulandı.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profil Ayarları</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input defaultValue={user?.name || ""} placeholder="Ad Soyad" className="rounded-lg border border-slate-200 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800" />
            <input defaultValue={user?.email || ""} type="email" placeholder="ornek@email.com" className="rounded-lg border border-slate-200 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Güvenlik</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input type="password" placeholder="Mevcut şifre" className="rounded-lg border border-slate-200 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800" />
            <input type="password" placeholder="Yeni şifre" className="rounded-lg border border-slate-200 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800" />
            <input type="password" placeholder="Yeni şifre tekrar" className="rounded-lg border border-slate-200 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bildirimler ve Tercihler</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span>Pazarlama e-postaları</span>
              <input type="checkbox" checked={marketingEmails} onChange={(e) => setMarketingEmails(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span>Güvenlik bildirimleri</span>
              <input type="checkbox" checked={securityEmails} onChange={(e) => setSecurityEmails(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span>Ürün güncellemeleri</span>
              <input type="checkbox" checked={productUpdates} onChange={(e) => setProductUpdates(e.target.checked)} />
            </label>
          </div>
        </section>

        <button type="submit" className="rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white hover:bg-primary/90">Değişiklikleri Kaydet</button>
      </form>
    </div>
  );
}
