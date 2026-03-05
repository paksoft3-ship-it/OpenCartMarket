"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) {
      toast.error("Lütfen şartları kabul edin.");
      return;
    }
    toast.success("Hesap oluşturuldu. Giriş yapabilirsiniz.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Yeni Hesap Oluştur</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Zip tasarımına uygun kayıt akışı.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input required placeholder="Ad Soyad" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800" />
          <input required type="email" placeholder="ornek@eposta.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800" />
          <input required type="password" placeholder="Şifre" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800" />
          <input required type="password" placeholder="Şifre Tekrar" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800" />

          <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5" />
            <span>Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.</span>
          </label>

          <button type="submit" className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90">
            Hesap Oluştur
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Zaten hesabın var mı? <Link href="/login" className="font-semibold text-primary hover:underline">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
