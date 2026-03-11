export type BlogPostStatus = "draft" | "published" | "scheduled" | "archived";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: BlogPostStatus;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  key: string;
  title: string;
  body: string;
  meta: Record<string, unknown>;
  updatedAt: string;
}

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  noindex: boolean;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  updatedAt: string;
}

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string | null;
  budget: number | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type RefundStatus = "pending" | "review" | "approved" | "rejected";
export type RefundRisk = "low" | "medium" | "high";

export interface RefundCase {
  id: string;
  order: string;
  customer: string;
  customerEmail: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  risk: RefundRisk;
  previousRefunds: number;
  hoursOpen: number;
  createdAt: string;
  updatedAt: string;
}

export type PayoutStatus = "Beklemede" | "İncelemede" | "Onaylandı" | "Gonderildi" | "Basarisiz";
export type PayoutQueue = "all" | "manual" | "auto" | "exception";

export interface PayoutRequest {
  id: string;
  developer: string;
  amount: number;
  requestedAt: string;
  method: string;
  status: PayoutStatus;
  queue: PayoutQueue;
  reason: string;
  fee: number;
  retries: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  runs: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLog {
  id: string;
  rule: string;
  result: "success" | "skipped" | "failed";
  at: string;
}

export type ModuleStage = "review" | "qa" | "release" | "released" | "blocked";
export type ModuleRisk = "low" | "medium" | "high";

export interface ModuleSubmission {
  id: string;
  name: string;
  type: string;
  owner: string;
  stage: ModuleStage;
  risk: ModuleRisk;
  createdAt: string;
  updatedAt: string;
}

export type XmlFeedStatus = "healthy" | "degraded" | "blocked" | "syncing";

export interface XmlFeed {
  id: string;
  partner: string;
  status: XmlFeedStatus;
  latency: string;
  lastSync: string;
  errors: number;
  retries: number;
  createdAt: string;
  updatedAt: string;
}

export interface XmlTemplate {
  id: string;
  name: string;
  mapped: string;
  coverage: number;
  createdAt: string;
  updatedAt: string;
}

export type SupportPriority = "low" | "medium" | "high" | "critical";
export type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  customerEmail: string;
  status: SupportStatus;
  priority: SupportPriority;
  category: string;
  message: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}
