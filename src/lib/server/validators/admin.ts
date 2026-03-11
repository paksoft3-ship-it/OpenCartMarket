import { z } from "zod";

export const createProductSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  shortDescription: z.string().min(2),
  description: z.string().min(2),
  price: z.number().nonnegative(),
  categoryId: z.string().min(1),
  developerId: z.string().min(1),
  compatibility: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  version: z.string().default("1.0.0"),
  status: z.enum(["draft", "review", "published", "archived"]).default("draft"),
  demoUrl: z.string().default(""),
});

export const updateProductSchema = createProductSchema.partial();

export const createProductFileSchema = z.object({
  productId: z.string().min(1),
  storageProvider: z.enum(["vercel_blob", "s3", "r2", "external"]),
  url: z.string().url(),
  path: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  checksumSha256: z.string().min(16),
  isPrimary: z.boolean().default(false),
});

export const updatePoliciesSchema = z.object({
  coreCommission: z.string(),
  premiumCommission: z.string(),
  xmlCommission: z.string(),
  minPayout: z.string(),
  txFee: z.string(),
  payoutRetry: z.string(),
  refundAutoCap: z.string(),
  reviewScoreThreshold: z.string(),
  require2fa: z.boolean(),
  xmlStrictMode: z.boolean(),
  autoNoindexDrafts: z.boolean(),
});

export const createBlogPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  cover: z.string().optional(),
  category: z.enum(["SEO", "Marketing", "Growth", "Product"]).optional(),
  readTime: z.string().optional(),
  author: z.string().min(1),
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
  publishedAt: z.string().nullable().default(null),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const upsertContentBlockSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const upsertSeoPageSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  keywords: z.string().default(""),
  noindex: z.boolean().default(false),
  canonicalUrl: z.string().nullable().default(null),
  ogTitle: z.string().nullable().default(null),
  ogDescription: z.string().nullable().default(null),
});

export const createCampaignSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(1),
  status: z.enum(["draft", "active", "paused", "completed"]).default("draft"),
  startDate: z.string().min(1),
  endDate: z.string().nullable().default(null),
  budget: z.number().nonnegative().nullable().default(null),
  description: z.string().default(""),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const updateRefundStatusSchema = z.object({
  status: z.enum(["pending", "review", "approved", "rejected"]),
});

export const updatePayoutStatusSchema = z.object({
  status: z.enum(["Beklemede", "İncelemede", "Onaylandı", "Gonderildi", "Basarisiz"]),
});

export const createAutomationRuleSchema = z.object({
  name: z.string().min(2),
  trigger: z.string().min(1),
  action: z.string().min(1),
  status: z.enum(["active", "paused"]).default("active"),
});

export const updateAutomationRuleSchema = createAutomationRuleSchema.partial();

export const simulateRuleSchema = z.object({
  result: z.enum(["success", "skipped", "failed"]),
});

export const setModuleStageSchema = z.object({
  stage: z.enum(["review", "qa", "release", "released", "blocked"]),
});

export const setModuleRiskSchema = z.object({
  risk: z.enum(["low", "medium", "high"]),
});

export const updateSupportTicketSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  assignedTo: z.string().nullable().optional(),
});

export const createXmlFeedSchema = z.object({
  partner: z.string().min(1),
  status: z.enum(["healthy", "degraded", "blocked", "syncing"]).default("healthy"),
  latency: z.string().default(""),
  lastSync: z.string().default("-"),
});

export const createXmlTemplateSchema = z.object({
  name: z.string().min(2),
  mapped: z.string().default(""),
  coverage: z.number().int().min(0).max(100).default(0),
});
