import { promises as fs } from "fs";
import path from "path";
import productsFallback from "@/data/products.json";
import { AdminProduct, AuditEvent, DbState, PolicySettings, ProductFile } from "@/lib/server/db/types";

const dbPath = path.join(process.cwd(), ".data", "admin-db.json");

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function initialPolicies(): PolicySettings {
  return {
    coreCommission: "20",
    premiumCommission: "15",
    xmlCommission: "12",
    minPayout: "50.00",
    txFee: "0.50",
    payoutRetry: "2",
    refundAutoCap: "20",
    reviewScoreThreshold: "72",
    require2fa: true,
    xmlStrictMode: true,
    autoNoindexDrafts: true,
    updatedAt: nowIso(),
  };
}

function initialProducts(): AdminProduct[] {
  return (productsFallback as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    slug: String(item.slug),
    name: String(item.name),
    shortDescription: String(item.shortDescription),
    description: String(item.description),
    price: Number(item.price ?? 0),
    categoryId: String(item.categoryId),
    developerId: String(item.developerId),
    compatibility: Array.isArray(item.compatibility) ? item.compatibility.map(String) : [],
    images: Array.isArray(item.images) ? item.images.map(String) : [],
    features: Array.isArray(item.features) ? item.features.map(String) : [],
    tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
    version: "1.0.0",
    status: "published",
    demoUrl: String(item.demoUrl ?? ""),
    createdAt: String(item.createdAt ?? nowIso()),
    updatedAt: String(item.updatedAt ?? nowIso()),
  }));
}

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    const dir = path.dirname(dbPath);
    await fs.mkdir(dir, { recursive: true });
    const initial: DbState = {
      products: initialProducts(),
      productFiles: [],
      policySettings: initialPolicies(),
      auditEvents: [],
    };
    await fs.writeFile(dbPath, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readDb(): Promise<DbState> {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as DbState;
}

async function writeDb(next: DbState) {
  await fs.writeFile(dbPath, JSON.stringify(next, null, 2), "utf8");
}

function addAudit(db: DbState, event: Omit<AuditEvent, "id" | "at">): DbState {
  const entry: AuditEvent = {
    id: makeId("aud"),
    at: nowIso(),
    ...event,
  };
  return {
    ...db,
    auditEvents: [entry, ...db.auditEvents].slice(0, 1000),
  };
}

export const fileRepository = {
  async listProducts() {
    const db = await readDb();
    return db.products;
  },

  async createProduct(payload: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">, actor: string) {
    const db = await readDb();
    const now = nowIso();
    const created: AdminProduct = {
      id: makeId("prd"),
      createdAt: now,
      updatedAt: now,
      ...payload,
    };

    let next: DbState = { ...db, products: [created, ...db.products] };
    next = addAudit(next, {
      action: "product.created",
      actor,
      target: created.id,
      details: `Product ${created.name} created.`,
      changes: [{ field: "status", before: "none", after: created.status }],
    });

    await writeDb(next);
    return created;
  },

  async getProduct(id: string) {
    const db = await readDb();
    return db.products.find((p) => p.id === id) ?? null;
  },

  async updateProduct(id: string, patch: Partial<AdminProduct>, actor: string) {
    const db = await readDb();
    const current = db.products.find((p) => p.id === id);
    if (!current) return null;

    const updated: AdminProduct = { ...current, ...patch, id: current.id, updatedAt: nowIso() };
    const changes = Object.entries(patch).map(([field, value]) => ({
      field,
      before: String((current as unknown as Record<string, unknown>)[field] ?? ""),
      after: String(value ?? ""),
    }));

    let next: DbState = {
      ...db,
      products: db.products.map((p) => (p.id === id ? updated : p)),
    };
    next = addAudit(next, {
      action: "product.updated",
      actor,
      target: id,
      details: `Product ${id} updated.`,
      changes,
    });

    await writeDb(next);
    return updated;
  },

  async deleteProduct(id: string, actor: string) {
    const db = await readDb();
    const exists = db.products.some((p) => p.id === id);
    if (!exists) return false;

    let next: DbState = {
      ...db,
      products: db.products.filter((p) => p.id !== id),
      productFiles: db.productFiles.filter((f) => f.productId !== id),
    };
    next = addAudit(next, {
      action: "product.deleted",
      actor,
      target: id,
      details: `Product ${id} deleted.`,
      changes: [{ field: "exists", before: "true", after: "false" }],
    });

    await writeDb(next);
    return true;
  },

  async listProductFiles(productId?: string) {
    const db = await readDb();
    return productId ? db.productFiles.filter((f) => f.productId === productId) : db.productFiles;
  },

  async addProductFile(payload: Omit<ProductFile, "id" | "uploadedAt">, actor: string) {
    const db = await readDb();
    const file: ProductFile = {
      id: makeId("fil"),
      uploadedAt: nowIso(),
      ...payload,
    };

    let files = db.productFiles;
    if (file.isPrimary) {
      files = files.map((f) => (f.productId === file.productId ? { ...f, isPrimary: false } : f));
    }

    let next: DbState = { ...db, productFiles: [file, ...files] };
    next = addAudit(next, {
      action: "product.file.added",
      actor,
      target: file.productId,
      details: `File attached to product ${file.productId}.`,
      changes: [{ field: "filePath", before: "none", after: file.path }],
    });

    await writeDb(next);
    return file;
  },

  async getPolicies() {
    const db = await readDb();
    return db.policySettings;
  },

  async updatePolicies(nextPolicies: Omit<PolicySettings, "updatedAt">, actor: string) {
    const db = await readDb();
    const current = db.policySettings;
    const next: PolicySettings = { ...nextPolicies, updatedAt: nowIso() };

    const changes = Object.keys(nextPolicies)
      .filter((field) => (current as unknown as Record<string, unknown>)[field] !== (nextPolicies as unknown as Record<string, unknown>)[field])
      .map((field) => ({
        field,
        before: String((current as unknown as Record<string, unknown>)[field] ?? ""),
        after: String((nextPolicies as unknown as Record<string, unknown>)[field] ?? ""),
      }));

    let dbNext: DbState = { ...db, policySettings: next };
    dbNext = addAudit(dbNext, {
      action: "settings.policy.saved",
      actor,
      target: "policy-settings",
      details: `Policy settings updated (${changes.length} fields).`,
      changes,
    });

    await writeDb(dbNext);
    return next;
  },

  async listAuditEvents(action?: string) {
    const db = await readDb();
    return action ? db.auditEvents.filter((e) => e.action === action) : db.auditEvents;
  },
};
