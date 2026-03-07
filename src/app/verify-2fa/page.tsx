"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function VerifyTwoFactorPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);

  const code = digits.join("");

  const handleChange = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value.replace(/\D/g, "").slice(0, 1);
    setDigits(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== 6) {
      toast.error("6 haneli kodu girin.");
      return;
    }
    toast.success("Doğrulama tamamlandı.");
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary" href="/login">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Giriş yap sayfasına dön
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">İki Faktörlü Doğrulama</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Telefonunuza gelen 6 haneli kodu girin.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  className="h-14 w-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  inputMode="numeric"
                  onChange={(event) => handleChange(index, event.target.value)}
                  value={digit}
                />
              ))}
            </div>

            <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90" type="submit">
              Doğrula
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm font-semibold text-primary hover:underline" type="button">
              Kodu Tekrar Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
