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
