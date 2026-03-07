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

export const blogPosts: BlogPost[] = [
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
      "Finally, measure impact through weekly visibility changes by category cluster and by template type."
    ]
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
      "Show savings and implementation time directly on cards. Keep bundle names benefit-driven."
    ]
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
      "Build monitoring for out-of-stock spikes, price variance, and parsing error rates."
    ]
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
      "Every weekly review should end with one pricing action and one discoverability action."
    ]
  }
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
