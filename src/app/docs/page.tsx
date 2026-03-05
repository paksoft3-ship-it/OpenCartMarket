import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Cog, KeyRound, LifeBuoy, Rocket, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Dokümantasyon Merkezi | OpenCart Market",
  description: "Kurulum, lisanslama, API ve destek rehberleri.",
};

const sections = [
  { title: "Hızlı Başlangıç", icon: Rocket, href: "/docs/system-requirements", desc: "Sistem gereksinimleri ve ilk kurulum adımları." },
  { title: "Kurulum", icon: Cog, href: "/docs/system-requirements", desc: "OCMOD modülleri için adım adım kurulum." },
  { title: "Lisans", icon: KeyRound, href: "/docs/system-requirements", desc: "Lisans anahtarı ve domain yönetimi." },
  { title: "Güvenlik", icon: ShieldCheck, href: "/docs/system-requirements", desc: "Güvenli kullanım ve erişim politikaları." },
  { title: "API Referansı", icon: BookOpen, href: "/docs/system-requirements", desc: "Geliştiriciler için endpoint ve örnekler." },
  { title: "Destek", icon: LifeBuoy, href: "/support", desc: "Sorun yaşarsanız destek akışına geçin." },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-14 dark:bg-slate-950">
      <section className="mx-auto max-w-5xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dokümantasyon Merkezi</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Yeni tasarımdaki dokümantasyon görünümüne göre yenilendi. Aradığınız başlığı seçerek devam edin.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <section.icon className="size-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{section.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-6xl rounded-3xl bg-slate-900 p-10 text-white">
        <h2 className="text-3xl font-bold">Hala yardıma mı ihtiyacınız var?</h2>
        <p className="mt-3 text-sm text-white/80">Destek ekibine ticket açabilir veya müşteri panelinizden mevcut taleplerinizi görüntüleyebilirsiniz.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/support" className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">Destek Merkezine Git</Link>
          <Link href="/dashboard/support" className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white">Ticketlarım</Link>
        </div>
      </section>
    </div>
  );
}
