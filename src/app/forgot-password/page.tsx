"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Şifre sıfırlama bağlantısı gönderildi.");
    router.push("/reset-password");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Şifrenizi mi Unuttunuz?</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Kayıtlı e-posta adresinizi girin.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="ornek@eposta.com"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
          />
          <button className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-primary/90">Bağlantı Gönder</button>
        </form>

        <Link href="/login" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">Giriş sayfasına dön</Link>
      </div>
    </div>
  );
}
