"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAppStore, User } from "@/lib/store";

export default function LoginPage() {
  const login = useAppStore((state) => state.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Lütfen e-posta ve şifre girin.");
      return;
    }

    const isAdmin = email.toLowerCase().includes("admin");
    const role = isAdmin ? "admin" : "customer";

    const user: User = {
      id: isAdmin ? "admin-1" : "cust-1",
      name: isAdmin ? "Admin User" : "Demo Customer",
      email,
      role,
    };

    login(user);
    Cookies.set("market_session", role, { expires: 1 });
    toast.success("Giriş başarılı.");
    router.push(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 px-6 py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">OpenCart Marketplace</h2>
            <p className="mt-6 text-4xl font-extrabold leading-tight">Eklenti satışınızı tek panelden yönetin.</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-white/80">Demo giriş</p>
            <p className="mt-2 text-sm">Admin: `admin@ocmarket.com`</p>
            <p className="text-sm">Müşteri: `customer@example.com`</p>
            <p className="text-sm">Şifre: herhangi bir değer</p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Giriş Yap</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Hesabınıza erişmek için bilgilerinizi girin.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">E-posta</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="eposta@adresiniz.com"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Şifre</label>
                <div className="flex items-center gap-3">
                  <Link href="/verify-2fa" className="text-xs font-semibold text-primary hover:underline">2FA Doğrula</Link>
                  <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Şifremi unuttum</Link>
                </div>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90">
              Giriş Yap
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Hesabın yok mu?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
