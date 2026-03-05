"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [updated, setUpdated] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdated(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {!updated ? (
          <>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni Şifre Belirleyin</h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="password" required placeholder="Yeni şifre" className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800" />
              <input type="password" required placeholder="Şifre tekrar" className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800" />
              <button className="w-full rounded-lg bg-primary py-3 font-bold text-white hover:bg-primary/90">Şifreyi Güncelle</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Şifreniz Başarıyla Güncellendi</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Yeni şifrenizle tekrar giriş yapabilirsiniz.</p>
            <Link href="/login" className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">Giriş Yap</Link>
          </>
        )}
      </div>
    </div>
  );
}
