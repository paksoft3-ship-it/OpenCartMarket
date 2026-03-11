import { getRepository } from "@/lib/server/db/index";
import { ContentBlock } from "@/lib/server/db/opsTypes";

const defaultBlocks: Record<string, ContentBlock> = {
  hero: {
    key: "hero",
    title: "OpenCart Temaları & Modülleri",
    body: "Mağazanız için en iyi uzantıları keşfedin",
    meta: { cta_primary: "Keşfet", cta_secondary: "Modüller" },
    updatedAt: new Date().toISOString(),
  },
  seller_cta: {
    key: "seller_cta",
    title: "Marketplace'da Sat",
    body: "Binlerce OpenCart mağazasına ürünlerinizi sunun",
    meta: {},
    updatedAt: new Date().toISOString(),
  },
  footer_tagline: {
    key: "footer_tagline",
    title: "OpenCart Marketplace",
    body: "Türkiye'nin en büyük OpenCart uzantı platformu",
    meta: {},
    updatedAt: new Date().toISOString(),
  },
};

export async function getContentBlock(key: string): Promise<ContentBlock> {
  try {
    const repo = getRepository();
    const block = await repo.getContentBlock(key);
    return block ?? defaultBlocks[key] ?? { key, title: "", body: "", meta: {}, updatedAt: new Date().toISOString() };
  } catch {
    return defaultBlocks[key] ?? { key, title: "", body: "", meta: {}, updatedAt: new Date().toISOString() };
  }
}

export async function getAllContentBlocks(): Promise<ContentBlock[]> {
  try {
    const repo = getRepository();
    const blocks = await repo.listContentBlocks();
    if (blocks.length > 0) return blocks;
  } catch {
    // DB unavailable
  }
  return Object.values(defaultBlocks);
}
