import Link from "next/link";
import { LifeBuoy, MessageSquare, Search, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Destek Merkezi | OpenCart Market",
  description: "Destek konuları, ticket akışı ve yardım merkezi.",
};

const quickActions = [
  {
    title: "Ticketlarım",
    description: "Mevcut taleplerinizi görüntüleyin ve yanıtlayın.",
    href: "/dashboard/support",
    icon: MessageSquare,
  },
  {
    title: "Yeni Ticket",
    description: "Yeni bir teknik destek talebi oluşturun.",
    href: "/dashboard/support/new",
    icon: LifeBuoy,
  },
  {
    title: "Hesap ve Lisans",
    description: "Lisanslama ve ödeme konularında yardım alın.",
    href: "/legal",
    icon: ShieldCheck,
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="bg-gradient-to-r from-slate-900 to-primary px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-5xl font-black tracking-tight">Destek Merkezi</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">Yeni tasarımdaki destek akışı projeye entegre edildi. Arama yapın veya ticket akışına geçin.</p>
          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700">
            <Search className="size-5 text-slate-400" />
            <input className="w-full border-none bg-transparent text-sm outline-none" placeholder="Nasıl yardımcı olabiliriz?" />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 grid max-w-6xl gap-6 px-6 pb-14 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <action.icon className="size-9 text-primary" />
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{action.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{action.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
