import { getRepository } from "@/lib/server/db/index";
import { SeoPage } from "@/lib/server/db/opsTypes";

const fallbackSeo: Record<string, Partial<SeoPage>> = {
  "/": {
    title: "OpenCart Marketplace - Tema & Modül",
    description: "En iyi OpenCart temaları ve modülleri",
    keywords: "opencart,tema,modül,marketplace",
    noindex: false,
  },
  "/browse": {
    title: "OpenCart Uzantıları - Tümünü Keşfet",
    description: "OpenCart için tüm tema ve modülleri keşfet",
    keywords: "opencart uzantı,opencart modül",
    noindex: false,
  },
  "/blog": {
    title: "Blog - OpenCart Haberleri",
    description: "OpenCart ile ilgili güncel haberler ve rehberler",
    keywords: "opencart blog",
    noindex: false,
  },
};

export async function getSeoForPage(slug: string): Promise<Partial<SeoPage>> {
  try {
    const repo = getRepository();
    const page = await repo.getSeoPage(slug);
    return page ?? fallbackSeo[slug] ?? {};
  } catch {
    return fallbackSeo[slug] ?? {};
  }
}

export async function getAllSeoPages(): Promise<Partial<SeoPage>[]> {
  try {
    const repo = getRepository();
    return await repo.listSeoPages();
  } catch {
    return Object.entries(fallbackSeo).map(([slug, data]) => ({ slug, ...data }));
  }
}
