export type ProductStatus = "draft" | "review" | "published" | "archived";

export interface ProductFile {
  id: string;
  productId: string;
  storageProvider: "vercel_blob" | "s3" | "r2" | "external";
  url: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  categoryId: string;
  developerId: string;
  compatibility: string[];
  images: string[];
  features: string[];
  tags: string[];
  version: string;
  status: ProductStatus;
  demoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicySettings {
  coreCommission: string;
  premiumCommission: string;
  xmlCommission: string;
  minPayout: string;
  txFee: string;
  payoutRetry: string;
  refundAutoCap: string;
  reviewScoreThreshold: string;
  require2fa: boolean;
  xmlStrictMode: boolean;
  autoNoindexDrafts: boolean;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  target: string;
  details: string;
  changes: Array<{ field: string; before: string; after: string }>;
  at: string;
}

export interface DbState {
  products: AdminProduct[];
  productFiles: ProductFile[];
  policySettings: PolicySettings;
  auditEvents: AuditEvent[];
}
