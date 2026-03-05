import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const docs: Record<string, { title: string; intro: string; sections: { title: string; body: string }[] }> = {
  "system-requirements": {
    title: "Sistem Gereksinimleri",
    intro: "SaaS marketplace kurulumu için önerilen sunucu ve yazılım sürümleri.",
    sections: [
      {
        title: "Sunucu Altyapısı",
        body: "PHP 8.1+, MySQL 8+, OPcache ve HTTPS önerilir. Üretim ortamında Redis cache performansı artırır.",
      },
      {
        title: "Kurulum Komutları",
        body: "Dosyaları yükleyin, OCMOD yenileyin, ardından tema cache temizliği yapın. Kurulum sonrası admin izinlerini kontrol edin.",
      },
      {
        title: "Veritabanı Yapılandırması",
        body: "utf8mb4 karakter seti kullanın ve düzenli yedek alma politikası uygulayın.",
      },
    ],
  },
};

export default async function DocsArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const article = docs[resolvedParams.slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Dokümanlar</p>
          <nav className="mt-4 space-y-2 text-sm">
            <Link href="/docs" className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Dokümantasyon Ana Sayfa</Link>
            <Link href="/docs/system-requirements" className="block rounded-lg bg-primary/10 px-3 py-2 font-semibold text-primary">Sistem Gereksinimleri</Link>
          </nav>
        </aside>

        <article>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{article.title}</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{article.intro}</p>

          <div className="mt-10 space-y-8">
            {article.sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
