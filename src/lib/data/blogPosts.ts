import { getRepository } from "@/lib/server/db/index";
import { BlogPost as DbBlogPost } from "@/lib/server/db/opsTypes";

// Frontend blog post shape (used by storefront pages)
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "SEO" | "Marketing" | "Growth" | "Product";
  readTime: string;
  publishedAt: string;
  author: string;
  cover: string;
  content: string[];
}

// Static fallback data — used when DB is unavailable (dev without DATABASE_URL)
const staticBlogPosts: BlogPost[] = [
  {
    slug: "opencart-seo-checklist-2026",
    title: "OpenCart SEO Checklist 2026: Technical + Content",
    excerpt: "A practical SEO checklist for OpenCart stores covering indexation, schema, and category page optimization.",
    category: "SEO",
    readTime: "7 min",
    publishedAt: "2026-02-28",
    author: "Marketplace Team",
    cover: "https://picsum.photos/seed/blog-seo-1/1200/700",
    content: [
      "OpenCart stores often lose organic traffic due to duplicate category URLs, weak internal links, and thin product copy.",
      "Start by cleaning indexation: noindex low-value filtered pages and keep canonical tags stable for category and product URLs.",
      "Then optimize commercial pages: include FAQ blocks, comparison snippets, and schema markup for products and reviews.",
      "Finally, measure impact through weekly visibility changes by category cluster and by template type.",
    ],
  },
  {
    slug: "increase-conversion-with-module-bundles",
    title: "Increase Conversion with Module Bundles",
    excerpt: "How to package themes, modules, and XML tools into high-converting bundle offers.",
    category: "Marketing",
    readTime: "6 min",
    publishedAt: "2026-02-19",
    author: "Growth Desk",
    cover: "https://picsum.photos/seed/blog-marketing-1/1200/700",
    content: [
      "Single product pages are useful, but bundles lift average order value when grouped by use case.",
      "Create bundles like Starter Store Pack, Performance Pack, and B2B Sync Pack with clear outcomes.",
      "Show savings and implementation time directly on cards. Keep bundle names benefit-driven.",
    ],
  },
  {
    slug: "xml-integrations-at-scale",
    title: "Managing XML Integrations at Scale",
    excerpt: "Operational patterns to maintain healthy XML catalogs across multiple suppliers.",
    category: "Product",
    readTime: "8 min",
    publishedAt: "2026-02-10",
    author: "Tech Ops",
    cover: "https://picsum.photos/seed/blog-xml-1/1200/700",
    content: [
      "Large XML catalogs fail when feed freshness and mapping rules are not tracked centrally.",
      "Define per-supplier SLAs for feed freshness and keep a fallback cache for critical products.",
      "Build monitoring for out-of-stock spikes, price variance, and parsing error rates.",
    ],
  },
  {
    slug: "admin-growth-dashboard-what-to-track",
    title: "Admin Growth Dashboard: What to Track Weekly",
    excerpt: "The KPIs that matter for marketplace growth and which ones to ignore.",
    category: "Growth",
    readTime: "5 min",
    publishedAt: "2026-01-30",
    author: "Analytics Team",
    cover: "https://picsum.photos/seed/blog-growth-1/1200/700",
    content: [
      "Track category-level net revenue, refund ratio, and time-to-first-sale for new developers.",
      "Do not over-focus on vanity metrics like visits without conversion quality segmentation.",
      "Every weekly review should end with one pricing action and one discoverability action.",
    ],
  },
];

function dbPostToFrontend(post: DbBlogPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    category: "Product", // default; extend DB schema with category field if needed
    readTime: "5 min",
    publishedAt: post.publishedAt ?? post.createdAt.slice(0, 10),
    author: post.author,
    cover: `https://picsum.photos/seed/blog-${post.slug}/1200/700`,
    // Split content on paragraph breaks or return as single array element
    content: post.content ? post.content.split("\n\n").filter(Boolean) : [post.excerpt || ""],
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const repo = getRepository();
    const dbPosts = await repo.listBlogPosts("published");
    if (dbPosts.length > 0) {
      return dbPosts.map(dbPostToFrontend);
    }
  } catch {
    // DB unavailable — use static fallback below
  }
  return staticBlogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const repo = getRepository();
    const dbPost = await repo.getBlogPostBySlug(slug);
    if (dbPost) return dbPostToFrontend(dbPost);
  } catch {
    // DB unavailable
  }
  return staticBlogPosts.find((p) => p.slug === slug) ?? null;
}

// Keep old synchronous export for any legacy callers during migration
export const blogPosts = staticBlogPosts;
