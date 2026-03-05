"use client";

import Link from "next/link";

export default function DeveloperApplyPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Satıcı Başvurusu</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Seller application wizard success-state tasarımı projeye eklendi.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Şirket Evrakları</p>
            <p className="mt-1 text-xs text-slate-500">Kimlik ve vergi belgelerini yükleyin.</p>
            <input type="file" className="mt-3 block w-full text-xs" />
          </label>
          <label className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Banka Bilgileri</p>
            <p className="mt-1 text-xs text-slate-500">Ödeme alacağınız hesap bilgilerini girin.</p>
            <input placeholder="IBAN" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Başvurunuz Alındı!</p>
          <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-400/80">Ekibimiz başvurunuzu inceleyip kısa sürede size dönüş yapacak.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/developer" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white">Geliştirici Paneline Git</Link>
          <Link href="/developer/products" className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">Ürünlerimi Gör</Link>
        </div>
      </div>
    </div>
  );
}
