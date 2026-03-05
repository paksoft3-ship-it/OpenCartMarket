import { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Fiyatlandırma Planları | OpenCart Market",
  description: "Alıcı ve geliştirici planları ile OpenCart marketplace fiyatlandırması.",
};

const buyerPlans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Yeni başlayan mağazalar için temel plan.",
    featured: false,
    features: ["1 aktif lisans", "Topluluk desteği", "Temel dökümantasyon"],
  },
  {
    name: "Pro",
    price: "$29/ay",
    desc: "Sürekli destek ve güncelleme isteyen ekipler için.",
    featured: true,
    features: ["10 aktif lisans", "Öncelikli destek", "Hızlı sürüm erişimi"],
  },
  {
    name: "Business",
    price: "$79/ay",
    desc: "Büyük mağazalar ve ajanslar için tam kapsam.",
    featured: false,
    features: ["Sınırsız lisans", "SLA destek", "Özel onboarding"],
  },
];

const sellerPlans = [
  {
    name: "Vendor Basic",
    fee: "%15 komisyon",
    features: ["Aylık 10 ürün", "Standart görünürlük", "Temel raporlar"],
  },
  {
    name: "Vendor Plus",
    fee: "%8 komisyon",
    features: ["Sınırsız ürün", "Öne çıkan listeleme", "Detaylı analitik"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-14 dark:bg-slate-950">
      <section className="mx-auto max-w-6xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Marketplace Fiyatlandırma Planları</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Yeni zip tasarımına göre güncellenmiş alıcı ve geliştirici planları. İhtiyacınıza göre plan seçin.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
        {buyerPlans.map((plan) => (
          <article
            key={plan.name}
            className={[
              "rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900",
              plan.featured
                ? "border-primary shadow-xl shadow-primary/20"
                : "border-slate-200 dark:border-slate-800",
            ].join(" ")}
          >
            {plan.featured && <p className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">EN POPÜLER</p>}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>
            <p className="mt-6 text-4xl font-black text-slate-900 dark:text-white">{plan.price}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="size-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-full bg-slate-100 py-3 text-sm font-bold text-slate-900 transition hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-100">
              Planı Seç
            </button>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">Geliştiriciler İçin Satış Planları</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sellerPlans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{plan.fee}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="size-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
