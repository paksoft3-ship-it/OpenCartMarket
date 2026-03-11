import { getPool } from "./pg";
import { AdminProduct, AuditEvent, PolicySettings, ProductFile } from "./types";
import {
  BlogPost,
  ContentBlock,
  SeoPage,
  MarketingCampaign,
  RefundCase,
  RefundStatus,
  RefundRisk,
  PayoutRequest,
  PayoutStatus,
  PayoutQueue,
  AutomationRule,
  AutomationLog,
  ModuleSubmission,
  ModuleStage,
  ModuleRisk,
  XmlFeed,
  XmlTemplate,
  SupportTicket,
  SupportStatus,
  SupportPriority,
} from "./opsTypes";

async function addAudit(
  action: string,
  actor: string,
  target: string,
  details: string,
  changes: Array<{ field: string; before: string; after: string }>
) {
  const pool = getPool();
  await pool.query(
    `INSERT INTO audit_events (action, actor, target, details, changes) VALUES ($1,$2,$3,$4,$5)`,
    [action, actor, target, details, JSON.stringify(changes)]
  );
}

// ── Products ──────────────────────────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): AdminProduct {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    shortDescription: String(row.short_description),
    description: String(row.description),
    price: Number(row.price),
    categoryId: String(row.category_id),
    developerId: String(row.developer_id),
    compatibility: Array.isArray(row.compatibility) ? row.compatibility.map(String) : [],
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    version: String(row.version),
    status: row.status as AdminProduct["status"],
    demoUrl: String(row.demo_url ?? ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

async function listProducts(): Promise<AdminProduct[]> {
  const { rows } = await getPool().query(`SELECT * FROM admin_products ORDER BY created_at DESC`);
  return rows.map(rowToProduct);
}

async function createProduct(
  payload: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<AdminProduct> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO admin_products (slug,name,short_description,description,price,category_id,developer_id,compatibility,images,features,tags,version,status,demo_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [
      payload.slug, payload.name, payload.shortDescription, payload.description,
      payload.price, payload.categoryId, payload.developerId,
      JSON.stringify(payload.compatibility), JSON.stringify(payload.images),
      JSON.stringify(payload.features), JSON.stringify(payload.tags),
      payload.version, payload.status, payload.demoUrl ?? "",
    ]
  );
  const created = rowToProduct(rows[0]);
  await addAudit("product.created", actor, created.id, `Product "${created.name}" created.`, [
    { field: "status", before: "none", after: created.status },
  ]);
  return created;
}

async function getProduct(id: string): Promise<AdminProduct | null> {
  const { rows } = await getPool().query(`SELECT * FROM admin_products WHERE id=$1`, [id]);
  return rows[0] ? rowToProduct(rows[0]) : null;
}

async function updateProduct(
  id: string,
  patch: Partial<AdminProduct>,
  actor: string
): Promise<AdminProduct | null> {
  const pool = getPool();
  const current = await getProduct(id);
  if (!current) return null;

  const colMap: Record<string, string> = {
    slug: "slug", name: "name", shortDescription: "short_description",
    description: "description", price: "price", categoryId: "category_id",
    developerId: "developer_id", version: "version", status: "status",
    demoUrl: "demo_url",
  };
  const jsonCols = new Set(["compatibility", "images", "features", "tags"]);
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(patch)) {
    if (key === "id" || key === "createdAt" || key === "updatedAt") continue;
    if (jsonCols.has(key)) {
      fields.push(`${key}=$${idx++}`);
      values.push(JSON.stringify(val));
    } else if (colMap[key]) {
      fields.push(`${colMap[key]}=$${idx++}`);
      values.push(val);
    }
  }
  if (fields.length === 0) return current;
  fields.push(`updated_at=NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE admin_products SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
    values
  );
  const updated = rowToProduct(rows[0]);
  const changes = Object.entries(patch)
    .filter(([k]) => k !== "id" && k !== "createdAt" && k !== "updatedAt")
    .map(([field, value]) => ({
      field,
      before: String((current as unknown as Record<string, unknown>)[field] ?? ""),
      after: String(value ?? ""),
    }));
  await addAudit("product.updated", actor, id, `Product ${id} updated.`, changes);
  return updated;
}

async function deleteProduct(id: string, actor: string): Promise<boolean> {
  const { rowCount } = await getPool().query(`DELETE FROM admin_products WHERE id=$1`, [id]);
  if (!rowCount) return false;
  await addAudit("product.deleted", actor, id, `Product ${id} deleted.`, [
    { field: "exists", before: "true", after: "false" },
  ]);
  return true;
}

// ── Product Files ─────────────────────────────────────────────────────────────

function rowToFile(row: Record<string, unknown>): ProductFile {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    storageProvider: row.storage_provider as ProductFile["storageProvider"],
    url: String(row.url),
    path: String(row.path),
    mimeType: String(row.mime_type),
    sizeBytes: Number(row.size_bytes),
    checksumSha256: String(row.checksum_sha256),
    isPrimary: Boolean(row.is_primary),
    uploadedAt: String(row.uploaded_at),
  };
}

async function listProductFiles(productId?: string): Promise<ProductFile[]> {
  const pool = getPool();
  if (productId) {
    const { rows } = await pool.query(
      `SELECT * FROM product_files WHERE product_id=$1 ORDER BY uploaded_at DESC`, [productId]
    );
    return rows.map(rowToFile);
  }
  const { rows } = await pool.query(`SELECT * FROM product_files ORDER BY uploaded_at DESC`);
  return rows.map(rowToFile);
}

async function addProductFile(
  payload: Omit<ProductFile, "id" | "uploadedAt">,
  actor: string
): Promise<ProductFile> {
  const pool = getPool();
  if (payload.isPrimary) {
    await pool.query(`UPDATE product_files SET is_primary=false WHERE product_id=$1`, [payload.productId]);
  }
  const { rows } = await pool.query(
    `INSERT INTO product_files (product_id,storage_provider,url,path,mime_type,size_bytes,checksum_sha256,is_primary)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [payload.productId, payload.storageProvider, payload.url, payload.path,
     payload.mimeType, payload.sizeBytes, payload.checksumSha256, payload.isPrimary]
  );
  const file = rowToFile(rows[0]);
  await addAudit("product.file.added", actor, payload.productId, `File attached to product ${payload.productId}.`, [
    { field: "filePath", before: "none", after: file.path },
  ]);
  return file;
}

// ── Policy Settings ───────────────────────────────────────────────────────────

function rowToPolicy(row: Record<string, unknown>): PolicySettings {
  return {
    coreCommission: String(row.core_commission),
    premiumCommission: String(row.premium_commission),
    xmlCommission: String(row.xml_commission),
    minPayout: String(row.min_payout),
    txFee: String(row.tx_fee),
    payoutRetry: String(row.payout_retry),
    refundAutoCap: String(row.refund_auto_cap),
    reviewScoreThreshold: String(row.review_score_threshold),
    require2fa: Boolean(row.require_2fa),
    xmlStrictMode: Boolean(row.xml_strict_mode),
    autoNoindexDrafts: Boolean(row.auto_noindex_drafts),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

const defaultPolicyValues = {
  coreCommission: "20", premiumCommission: "15", xmlCommission: "12",
  minPayout: "50.00", txFee: "0.50", payoutRetry: "2", refundAutoCap: "20",
  reviewScoreThreshold: "72", require2fa: true, xmlStrictMode: true, autoNoindexDrafts: true,
};

async function getPolicies(): Promise<PolicySettings> {
  const pool = getPool();
  const { rows } = await pool.query(`SELECT * FROM policy_settings ORDER BY updated_at DESC LIMIT 1`);
  if (rows[0]) return rowToPolicy(rows[0]);
  const d = defaultPolicyValues;
  const { rows: created } = await pool.query(
    `INSERT INTO policy_settings (core_commission,premium_commission,xml_commission,min_payout,tx_fee,payout_retry,refund_auto_cap,review_score_threshold,require_2fa,xml_strict_mode,auto_noindex_drafts)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [d.coreCommission, d.premiumCommission, d.xmlCommission, d.minPayout, d.txFee,
     d.payoutRetry, d.refundAutoCap, d.reviewScoreThreshold, d.require2fa, d.xmlStrictMode, d.autoNoindexDrafts]
  );
  return rowToPolicy(created[0]);
}

async function updatePolicies(
  next: Omit<PolicySettings, "updatedAt">,
  actor: string
): Promise<PolicySettings> {
  const pool = getPool();
  const current = await getPolicies();
  const { rows } = await pool.query(
    `UPDATE policy_settings
     SET core_commission=$1,premium_commission=$2,xml_commission=$3,min_payout=$4,tx_fee=$5,
         payout_retry=$6,refund_auto_cap=$7,review_score_threshold=$8,require_2fa=$9,
         xml_strict_mode=$10,auto_noindex_drafts=$11,updated_at=NOW()
     WHERE id=(SELECT id FROM policy_settings ORDER BY updated_at DESC LIMIT 1)
     RETURNING *`,
    [next.coreCommission, next.premiumCommission, next.xmlCommission, next.minPayout, next.txFee,
     next.payoutRetry, next.refundAutoCap, next.reviewScoreThreshold, next.require2fa,
     next.xmlStrictMode, next.autoNoindexDrafts]
  );
  const updated = rowToPolicy(rows[0]);
  const changes = Object.entries(next)
    .filter(([k, v]) => (current as unknown as Record<string, unknown>)[k] !== v)
    .map(([field, value]) => ({
      field,
      before: String((current as unknown as Record<string, unknown>)[field] ?? ""),
      after: String(value ?? ""),
    }));
  await addAudit("settings.policy.saved", actor, "policy-settings", `Policy updated (${changes.length} fields).`, changes);
  return updated;
}

// ── Audit Events ──────────────────────────────────────────────────────────────

function rowToAudit(row: Record<string, unknown>): AuditEvent {
  return {
    id: String(row.id),
    action: String(row.action),
    actor: String(row.actor),
    target: String(row.target),
    details: String(row.details),
    changes: Array.isArray(row.changes) ? row.changes : [],
    at: row.at instanceof Date ? row.at.toISOString() : String(row.at),
  };
}

async function listAuditEvents(action?: string): Promise<AuditEvent[]> {
  const pool = getPool();
  if (action) {
    const { rows } = await pool.query(
      `SELECT * FROM audit_events WHERE action=$1 ORDER BY at DESC LIMIT 500`, [action]
    );
    return rows.map(rowToAudit);
  }
  const { rows } = await pool.query(`SELECT * FROM audit_events ORDER BY at DESC LIMIT 500`);
  return rows.map(rowToAudit);
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

function rowToBlog(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    author: String(row.author),
    status: row.status as BlogPost["status"],
    views: Number(row.views ?? 0),
    publishedAt: row.published_at ? (row.published_at instanceof Date ? row.published_at.toISOString() : String(row.published_at)) : null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listBlogPosts(status?: string): Promise<BlogPost[]> {
  const pool = getPool();
  if (status) {
    const { rows } = await pool.query(`SELECT * FROM blog_posts WHERE status=$1 ORDER BY created_at DESC`, [status]);
    return rows.map(rowToBlog);
  }
  const { rows } = await pool.query(`SELECT * FROM blog_posts ORDER BY created_at DESC`);
  return rows.map(rowToBlog);
}

async function createBlogPost(
  payload: Pick<BlogPost, "title" | "slug" | "excerpt" | "content" | "author" | "status" | "publishedAt">,
  actor: string
): Promise<BlogPost> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO blog_posts (title,slug,excerpt,content,author,status,published_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [payload.title, payload.slug, payload.excerpt, payload.content, payload.author, payload.status, payload.publishedAt]
  );
  const created = rowToBlog(rows[0]);
  await addAudit("blog.post.created", actor, created.id, `Blog post "${created.title}" created.`, [
    { field: "status", before: "none", after: created.status },
  ]);
  return created;
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { rows } = await getPool().query(`SELECT * FROM blog_posts WHERE id=$1`, [id]);
  return rows[0] ? rowToBlog(rows[0]) : null;
}

async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { rows } = await getPool().query(`SELECT * FROM blog_posts WHERE slug=$1`, [slug]);
  return rows[0] ? rowToBlog(rows[0]) : null;
}

async function updateBlogPost(id: string, patch: Partial<BlogPost>, actor: string): Promise<BlogPost | null> {
  const pool = getPool();
  const current = await getBlogPost(id);
  if (!current) return null;
  const { rows } = await pool.query(
    `UPDATE blog_posts
     SET title=COALESCE($1,title), slug=COALESCE($2,slug), excerpt=COALESCE($3,excerpt),
         content=COALESCE($4,content), author=COALESCE($5,author), status=COALESCE($6,status),
         published_at=COALESCE($7,published_at), updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [patch.title ?? null, patch.slug ?? null, patch.excerpt ?? null, patch.content ?? null,
     patch.author ?? null, patch.status ?? null, patch.publishedAt ?? null, id]
  );
  const updated = rowToBlog(rows[0]);
  const changes = Object.entries(patch).map(([field, value]) => ({
    field,
    before: String((current as unknown as Record<string, unknown>)[field] ?? ""),
    after: String(value ?? ""),
  }));
  await addAudit("blog.post.updated", actor, id, `Blog post "${updated.title}" updated.`, changes);
  return updated;
}

async function deleteBlogPost(id: string, actor: string): Promise<boolean> {
  const { rowCount } = await getPool().query(`DELETE FROM blog_posts WHERE id=$1`, [id]);
  if (!rowCount) return false;
  await addAudit("blog.post.deleted", actor, id, `Blog post ${id} deleted.`, []);
  return true;
}

// ── Site Content Blocks ───────────────────────────────────────────────────────

function rowToBlock(row: Record<string, unknown>): ContentBlock {
  return {
    key: String(row.key),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    meta: typeof row.meta === "object" && row.meta !== null ? (row.meta as Record<string, unknown>) : {},
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listContentBlocks(): Promise<ContentBlock[]> {
  const { rows } = await getPool().query(`SELECT * FROM site_content_blocks ORDER BY key`);
  return rows.map(rowToBlock);
}

async function getContentBlock(key: string): Promise<ContentBlock | null> {
  const { rows } = await getPool().query(`SELECT * FROM site_content_blocks WHERE key=$1`, [key]);
  return rows[0] ? rowToBlock(rows[0]) : null;
}

async function upsertContentBlock(
  key: string,
  data: { title?: string; body?: string; meta?: Record<string, unknown> },
  actor: string
): Promise<ContentBlock> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO site_content_blocks (key,title,body,meta) VALUES ($1,$2,$3,$4)
     ON CONFLICT (key) DO UPDATE
       SET title=COALESCE(EXCLUDED.title, site_content_blocks.title),
           body=COALESCE(EXCLUDED.body, site_content_blocks.body),
           meta=COALESCE(EXCLUDED.meta, site_content_blocks.meta),
           updated_at=NOW()
     RETURNING *`,
    [key, data.title ?? "", data.body ?? "", JSON.stringify(data.meta ?? {})]
  );
  const block = rowToBlock(rows[0]);
  await addAudit("content.block.upserted", actor, key, `Content block "${key}" updated.`, []);
  return block;
}

// ── SEO Pages ─────────────────────────────────────────────────────────────────

function rowToSeoPage(row: Record<string, unknown>): SeoPage {
  return {
    slug: String(row.slug),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    keywords: String(row.keywords ?? ""),
    noindex: Boolean(row.noindex),
    canonicalUrl: row.canonical_url ? String(row.canonical_url) : null,
    ogTitle: row.og_title ? String(row.og_title) : null,
    ogDescription: row.og_description ? String(row.og_description) : null,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listSeoPages(): Promise<SeoPage[]> {
  const { rows } = await getPool().query(`SELECT * FROM seo_pages ORDER BY slug`);
  return rows.map(rowToSeoPage);
}

async function getSeoPage(slug: string): Promise<SeoPage | null> {
  const { rows } = await getPool().query(`SELECT * FROM seo_pages WHERE slug=$1`, [slug]);
  return rows[0] ? rowToSeoPage(rows[0]) : null;
}

async function upsertSeoPage(
  slug: string,
  data: Omit<SeoPage, "slug" | "updatedAt">,
  actor: string
): Promise<SeoPage> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO seo_pages (slug,title,description,keywords,noindex,canonical_url,og_title,og_description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (slug) DO UPDATE
       SET title=$2,description=$3,keywords=$4,noindex=$5,canonical_url=$6,og_title=$7,og_description=$8,updated_at=NOW()
     RETURNING *`,
    [slug, data.title, data.description, data.keywords, data.noindex, data.canonicalUrl, data.ogTitle, data.ogDescription]
  );
  const page = rowToSeoPage(rows[0]);
  await addAudit("seo.page.upserted", actor, slug, `SEO for "${slug}" updated.`, []);
  return page;
}

// ── Marketing Campaigns ───────────────────────────────────────────────────────

function rowToCampaign(row: Record<string, unknown>): MarketingCampaign {
  return {
    id: String(row.id),
    name: String(row.name),
    type: String(row.type),
    status: row.status as MarketingCampaign["status"],
    startDate: String(row.start_date),
    endDate: row.end_date ? String(row.end_date) : null,
    budget: row.budget !== null && row.budget !== undefined ? Number(row.budget) : null,
    description: String(row.description ?? ""),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listCampaigns(): Promise<MarketingCampaign[]> {
  const { rows } = await getPool().query(`SELECT * FROM marketing_campaigns ORDER BY created_at DESC`);
  return rows.map(rowToCampaign);
}

async function createCampaign(
  payload: Omit<MarketingCampaign, "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<MarketingCampaign> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO marketing_campaigns (name,type,status,start_date,end_date,budget,description)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [payload.name, payload.type, payload.status, payload.startDate, payload.endDate, payload.budget, payload.description]
  );
  const created = rowToCampaign(rows[0]);
  await addAudit("campaign.created", actor, created.id, `Campaign "${created.name}" created.`, []);
  return created;
}

async function updateCampaign(id: string, patch: Partial<MarketingCampaign>, actor: string): Promise<MarketingCampaign | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE marketing_campaigns
     SET name=COALESCE($1,name),type=COALESCE($2,type),status=COALESCE($3,status),
         start_date=COALESCE($4,start_date),end_date=COALESCE($5,end_date),
         budget=COALESCE($6,budget),description=COALESCE($7,description),updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [patch.name ?? null, patch.type ?? null, patch.status ?? null, patch.startDate ?? null,
     patch.endDate ?? null, patch.budget ?? null, patch.description ?? null, id]
  );
  if (!rows[0]) return null;
  const updated = rowToCampaign(rows[0]);
  await addAudit("campaign.updated", actor, id, `Campaign "${updated.name}" updated.`, []);
  return updated;
}

async function deleteCampaign(id: string, actor: string): Promise<boolean> {
  const { rowCount } = await getPool().query(`DELETE FROM marketing_campaigns WHERE id=$1`, [id]);
  if (!rowCount) return false;
  await addAudit("campaign.deleted", actor, id, `Campaign ${id} deleted.`, []);
  return true;
}

// ── Refund Cases ──────────────────────────────────────────────────────────────

function rowToRefund(row: Record<string, unknown>): RefundCase {
  return {
    id: String(row.id),
    order: String(row.order_ref),
    customer: String(row.customer),
    customerEmail: String(row.customer_email),
    amount: Number(row.amount),
    reason: String(row.reason),
    status: row.status as RefundStatus,
    risk: row.risk as RefundRisk,
    previousRefunds: Number(row.previous_refunds ?? 0),
    hoursOpen: Number(row.hours_open ?? 0),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listRefunds(status?: string, risk?: string): Promise<RefundCase[]> {
  const pool = getPool();
  const vals: unknown[] = [];
  let q = `SELECT * FROM refund_cases WHERE 1=1`;
  if (status) { q += ` AND status=$${vals.length + 1}`; vals.push(status); }
  if (risk) { q += ` AND risk=$${vals.length + 1}`; vals.push(risk); }
  q += ` ORDER BY created_at DESC`;
  const { rows } = await pool.query(q, vals);
  return rows.map(rowToRefund);
}

async function getRefund(id: string): Promise<RefundCase | null> {
  const { rows } = await getPool().query(`SELECT * FROM refund_cases WHERE id=$1`, [id]);
  return rows[0] ? rowToRefund(rows[0]) : null;
}

async function updateRefundStatus(id: string, status: RefundStatus, actor: string): Promise<RefundCase | null> {
  const pool = getPool();
  const current = await getRefund(id);
  if (!current) return null;
  const { rows } = await pool.query(
    `UPDATE refund_cases SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  const updated = rowToRefund(rows[0]);
  await addAudit("refund.status.updated", actor, id, `Refund ${id} → ${status}.`, [
    { field: "status", before: current.status, after: status },
  ]);
  return updated;
}

// ── Payout Requests ───────────────────────────────────────────────────────────

function rowToPayout(row: Record<string, unknown>): PayoutRequest {
  return {
    id: String(row.id),
    developer: String(row.developer),
    amount: Number(row.amount),
    requestedAt: String(row.requested_at),
    method: String(row.method),
    status: row.status as PayoutStatus,
    queue: row.queue as PayoutQueue,
    reason: String(row.reason ?? ""),
    fee: Number(row.fee ?? 0),
    retries: Number(row.retries ?? 0),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listPayouts(queue?: string): Promise<PayoutRequest[]> {
  const pool = getPool();
  if (queue && queue !== "all") {
    const { rows } = await pool.query(`SELECT * FROM payout_requests WHERE queue=$1 ORDER BY created_at DESC`, [queue]);
    return rows.map(rowToPayout);
  }
  const { rows } = await pool.query(`SELECT * FROM payout_requests ORDER BY created_at DESC`);
  return rows.map(rowToPayout);
}

async function getPayout(id: string): Promise<PayoutRequest | null> {
  const { rows } = await getPool().query(`SELECT * FROM payout_requests WHERE id=$1`, [id]);
  return rows[0] ? rowToPayout(rows[0]) : null;
}

async function updatePayoutStatus(id: string, status: PayoutStatus, actor: string): Promise<PayoutRequest | null> {
  const pool = getPool();
  const current = await getPayout(id);
  if (!current) return null;
  const { rows } = await pool.query(
    `UPDATE payout_requests SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  const updated = rowToPayout(rows[0]);
  await addAudit("payout.status.updated", actor, id, `Payout ${id} → ${status}.`, [
    { field: "status", before: current.status, after: status },
  ]);
  return updated;
}

async function retryPayout(id: string, actor: string): Promise<PayoutRequest | null> {
  const pool = getPool();
  const current = await getPayout(id);
  if (!current) return null;
  const { rows } = await pool.query(
    `UPDATE payout_requests SET retries=retries+1, status='İncelemede', queue='manual', updated_at=NOW() WHERE id=$1 RETURNING *`,
    [id]
  );
  const updated = rowToPayout(rows[0]);
  await addAudit("payout.retried", actor, id, `Payout ${id} retried (attempt ${updated.retries}).`, [
    { field: "retries", before: String(current.retries), after: String(updated.retries) },
  ]);
  return updated;
}

// ── Automation Rules ──────────────────────────────────────────────────────────

function rowToRule(row: Record<string, unknown>): AutomationRule {
  return {
    id: String(row.id),
    name: String(row.name),
    trigger: String(row.trigger),
    action: String(row.action),
    status: row.status as AutomationRule["status"],
    runs: Number(row.runs ?? 0),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listRules(): Promise<AutomationRule[]> {
  const { rows } = await getPool().query(`SELECT * FROM automation_rules ORDER BY created_at DESC`);
  return rows.map(rowToRule);
}

async function createRule(
  payload: Omit<AutomationRule, "id" | "runs" | "createdAt" | "updatedAt">,
  actor: string
): Promise<AutomationRule> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO automation_rules (name,trigger,action,status) VALUES ($1,$2,$3,$4) RETURNING *`,
    [payload.name, payload.trigger, payload.action, payload.status]
  );
  const created = rowToRule(rows[0]);
  await addAudit("automation.rule.created", actor, created.id, `Rule "${created.name}" created.`, []);
  return created;
}

async function updateRule(id: string, patch: Partial<AutomationRule>, actor: string): Promise<AutomationRule | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE automation_rules
     SET name=COALESCE($1,name),trigger=COALESCE($2,trigger),action=COALESCE($3,action),status=COALESCE($4,status),updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [patch.name ?? null, patch.trigger ?? null, patch.action ?? null, patch.status ?? null, id]
  );
  if (!rows[0]) return null;
  const updated = rowToRule(rows[0]);
  await addAudit("automation.rule.updated", actor, id, `Rule "${updated.name}" updated.`, []);
  return updated;
}

async function deleteRule(id: string, actor: string): Promise<boolean> {
  const { rowCount } = await getPool().query(`DELETE FROM automation_rules WHERE id=$1`, [id]);
  if (!rowCount) return false;
  await addAudit("automation.rule.deleted", actor, id, `Rule ${id} deleted.`, []);
  return true;
}

async function toggleRule(id: string, actor: string): Promise<AutomationRule | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE automation_rules
     SET status=CASE WHEN status='active' THEN 'paused' ELSE 'active' END, updated_at=NOW()
     WHERE id=$1 RETURNING *`,
    [id]
  );
  if (!rows[0]) return null;
  const updated = rowToRule(rows[0]);
  await addAudit("automation.rule.toggled", actor, id, `Rule ${id} → ${updated.status}.`, []);
  return updated;
}

function rowToLog(row: Record<string, unknown>): AutomationLog {
  return {
    id: String(row.id),
    rule: String(row.rule_id),
    result: row.result as AutomationLog["result"],
    at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

async function simulateRule(id: string, result: "success" | "skipped" | "failed", actor: string): Promise<AutomationLog> {
  const pool = getPool();
  await pool.query(`UPDATE automation_rules SET runs=runs+1, updated_at=NOW() WHERE id=$1`, [id]);
  const { rows } = await pool.query(
    `INSERT INTO automation_logs (rule_id,result) VALUES ($1,$2) RETURNING *`,
    [id, result]
  );
  await addAudit("automation.rule.simulated", actor, id, `Simulation for ${id}: ${result}.`, []);
  return rowToLog(rows[0]);
}

async function listLogs(ruleId?: string): Promise<AutomationLog[]> {
  const pool = getPool();
  if (ruleId) {
    const { rows } = await pool.query(
      `SELECT * FROM automation_logs WHERE rule_id=$1 ORDER BY created_at DESC LIMIT 240`, [ruleId]
    );
    return rows.map(rowToLog);
  }
  const { rows } = await pool.query(`SELECT * FROM automation_logs ORDER BY created_at DESC LIMIT 240`);
  return rows.map(rowToLog);
}

// ── Module Submissions ────────────────────────────────────────────────────────

function rowToModule(row: Record<string, unknown>): ModuleSubmission {
  return {
    id: String(row.id),
    name: String(row.name),
    type: String(row.type),
    owner: String(row.owner),
    stage: row.stage as ModuleSubmission["stage"],
    risk: row.risk as ModuleSubmission["risk"],
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listModules(stage?: string): Promise<ModuleSubmission[]> {
  const pool = getPool();
  if (stage) {
    const { rows } = await pool.query(`SELECT * FROM module_submissions WHERE stage=$1 ORDER BY created_at DESC`, [stage]);
    return rows.map(rowToModule);
  }
  const { rows } = await pool.query(`SELECT * FROM module_submissions ORDER BY created_at DESC`);
  return rows.map(rowToModule);
}

async function createModule(
  payload: Omit<ModuleSubmission, "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ModuleSubmission> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO module_submissions (name,type,owner,stage,risk) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [payload.name, payload.type, payload.owner, payload.stage, payload.risk]
  );
  const created = rowToModule(rows[0]);
  await addAudit("module.created", actor, created.id, `Module "${created.name}" submitted.`, []);
  return created;
}

async function setModuleStage(id: string, stage: ModuleStage, actor: string): Promise<ModuleSubmission | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE module_submissions SET stage=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [stage, id]
  );
  if (!rows[0]) return null;
  const updated = rowToModule(rows[0]);
  await addAudit("module.stage.updated", actor, id, `Module ${id} stage → ${stage}.`, []);
  return updated;
}

async function setModuleRisk(id: string, risk: ModuleRisk, actor: string): Promise<ModuleSubmission | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE module_submissions SET risk=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [risk, id]
  );
  if (!rows[0]) return null;
  const updated = rowToModule(rows[0]);
  await addAudit("module.risk.updated", actor, id, `Module ${id} risk → ${risk}.`, []);
  return updated;
}

// ── XML Feeds ─────────────────────────────────────────────────────────────────

function rowToFeed(row: Record<string, unknown>): XmlFeed {
  return {
    id: String(row.id),
    partner: String(row.partner),
    status: row.status as XmlFeed["status"],
    latency: String(row.latency ?? ""),
    lastSync: String(row.last_sync ?? "-"),
    errors: Number(row.errors ?? 0),
    retries: Number(row.retries ?? 0),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listXmlFeeds(): Promise<XmlFeed[]> {
  const { rows } = await getPool().query(`SELECT * FROM xml_feeds ORDER BY created_at DESC`);
  return rows.map(rowToFeed);
}

async function retryXmlFeed(id: string, actor: string): Promise<XmlFeed | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE xml_feeds
     SET retries=retries+1, errors=GREATEST(0,errors-2), status='degraded',
         last_sync=to_char(NOW(),'DD Mon YYYY, HH24:MI'), updated_at=NOW()
     WHERE id=$1 RETURNING *`,
    [id]
  );
  if (!rows[0]) return null;
  const updated = rowToFeed(rows[0]);
  await addAudit("xml.feed.retried", actor, id, `XML feed ${id} retried.`, []);
  return updated;
}

async function runFullXmlSync(actor: string): Promise<XmlFeed[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE xml_feeds
     SET errors=GREATEST(0, errors - CASE WHEN status='blocked' THEN 3 ELSE 1 END),
         status=CASE
           WHEN GREATEST(0, errors - CASE WHEN status='blocked' THEN 3 ELSE 1 END)=0 THEN 'healthy'
           WHEN GREATEST(0, errors - CASE WHEN status='blocked' THEN 3 ELSE 1 END)>15 THEN 'blocked'
           ELSE 'degraded'
         END,
         last_sync=to_char(NOW(),'DD Mon YYYY, HH24:MI'),
         updated_at=NOW()
     RETURNING *`
  );
  await addAudit("xml.sync.full_run", actor, "xml-all", "Full XML sync completed.", []);
  return rows.map(rowToFeed);
}

// ── XML Templates ─────────────────────────────────────────────────────────────

function rowToTemplate(row: Record<string, unknown>): XmlTemplate {
  return {
    id: String(row.id),
    name: String(row.name),
    mapped: String(row.mapped ?? ""),
    coverage: Number(row.coverage ?? 0),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listXmlTemplates(): Promise<XmlTemplate[]> {
  const { rows } = await getPool().query(`SELECT * FROM xml_templates ORDER BY name`);
  return rows.map(rowToTemplate);
}

async function createXmlTemplate(
  payload: Omit<XmlTemplate, "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<XmlTemplate> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO xml_templates (name,mapped,coverage) VALUES ($1,$2,$3) RETURNING *`,
    [payload.name, payload.mapped, payload.coverage]
  );
  const created = rowToTemplate(rows[0]);
  await addAudit("xml.template.created", actor, created.id, `XML template "${created.name}" created.`, []);
  return created;
}

async function improveXmlTemplateCoverage(name: string, actor: string): Promise<XmlTemplate | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE xml_templates SET coverage=LEAST(100,coverage+1), updated_at=NOW() WHERE name=$1 RETURNING *`,
    [name]
  );
  if (!rows[0]) return null;
  const updated = rowToTemplate(rows[0]);
  await addAudit("xml.template.coverage.improved", actor, name, `Template "${name}" → ${updated.coverage}%.`, []);
  return updated;
}

// ── Support Tickets ───────────────────────────────────────────────────────────

function rowToTicket(row: Record<string, unknown>): SupportTicket {
  return {
    id: String(row.id),
    subject: String(row.subject),
    customer: String(row.customer),
    customerEmail: String(row.customer_email),
    status: row.status as SupportStatus,
    priority: row.priority as SupportPriority,
    category: String(row.category ?? ""),
    message: String(row.message ?? ""),
    assignedTo: row.assigned_to ? String(row.assigned_to) : null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

async function listSupportTickets(status?: string): Promise<SupportTicket[]> {
  const pool = getPool();
  if (status) {
    const { rows } = await pool.query(`SELECT * FROM support_tickets WHERE status=$1 ORDER BY created_at DESC`, [status]);
    return rows.map(rowToTicket);
  }
  const { rows } = await pool.query(`SELECT * FROM support_tickets ORDER BY created_at DESC`);
  return rows.map(rowToTicket);
}

async function createSupportTicket(
  payload: Omit<SupportTicket, "id" | "assignedTo" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SupportTicket> {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO support_tickets (subject,customer,customer_email,status,priority,category,message)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [payload.subject, payload.customer, payload.customerEmail, payload.status, payload.priority, payload.category, payload.message]
  );
  const created = rowToTicket(rows[0]);
  await addAudit("support.ticket.created", actor, created.id, `Ticket "${created.subject}" created.`, []);
  return created;
}

async function updateSupportTicket(id: string, patch: Partial<SupportTicket>, actor: string): Promise<SupportTicket | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE support_tickets
     SET status=COALESCE($1,status), priority=COALESCE($2,priority), assigned_to=COALESCE($3,assigned_to), updated_at=NOW()
     WHERE id=$4 RETURNING *`,
    [patch.status ?? null, patch.priority ?? null, patch.assignedTo ?? null, id]
  );
  if (!rows[0]) return null;
  const updated = rowToTicket(rows[0]);
  await addAudit("support.ticket.updated", actor, id, `Ticket ${id} updated.`, []);
  return updated;
}

// ── Export ────────────────────────────────────────────────────────────────────

export const pgRepository = {
  // Products
  listProducts, createProduct, getProduct, updateProduct, deleteProduct,
  listProductFiles, addProductFile,
  // Policies + Audit
  getPolicies, updatePolicies, listAuditEvents,
  // Blog
  listBlogPosts, createBlogPost, getBlogPost, getBlogPostBySlug, updateBlogPost, deleteBlogPost,
  // Content blocks
  listContentBlocks, getContentBlock, upsertContentBlock,
  // SEO
  listSeoPages, getSeoPage, upsertSeoPage,
  // Marketing
  listCampaigns, createCampaign, updateCampaign, deleteCampaign,
  // Refunds
  listRefunds, getRefund, updateRefundStatus,
  // Payouts
  listPayouts, getPayout, updatePayoutStatus, retryPayout,
  // Automations
  listRules, createRule, updateRule, deleteRule, toggleRule, simulateRule, listLogs,
  // Modules
  listModules, createModule, setModuleStage, setModuleRisk,
  // XML
  listXmlFeeds, retryXmlFeed, runFullXmlSync,
  listXmlTemplates, createXmlTemplate, improveXmlTemplateCoverage,
  // Support
  listSupportTickets, createSupportTicket, updateSupportTicket,
};
