import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Sipariş Başarılı | OCMarket",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <CheckCircle2 className="mx-auto size-16 text-emerald-500" />
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Siparişiniz Tamamlandı!</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Yeni onboarding tasarımına uygun başarı ekranı entegre edildi. Ürünlerinize panelden hemen erişebilirsiniz.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/downloads" className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">İndirmelerime Git</Link>
          <Link href="/dashboard/licenses" className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100">Lisanslarımı Gör</Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100">Panele Geç</Link>
        </div>
      </div>
    </div>
  );
}
