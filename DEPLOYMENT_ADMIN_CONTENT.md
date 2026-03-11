# Admin Content & Ops — Deployment Guide

## Overview

Admin CMS and ops pages are fully API-backed. All mutations write to PostgreSQL and call `revalidatePath` so the Next.js cache is invalidated immediately. Without `DATABASE_URL`, the app falls back to a local file-based repository (development only).

---

## 1. Database Setup

### 1.1 Provision PostgreSQL

Use any PostgreSQL 14+ provider (Vercel Postgres, Neon, Supabase, Railway, RDS).

Copy the connection string and set it as `DATABASE_URL` in your Vercel project environment variables.

### 1.2 Run the Schema

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

The schema is idempotent — safe to run on an existing database. It creates all tables and enums using `IF NOT EXISTS` / `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$;` guards.

**Tables created:**
- `products`, `product_files`, `policies`, `audit_log`
- `blog_posts`, `content_blocks`, `seo_pages`
- `marketing_campaigns`
- `refund_cases`, `payout_requests`
- `automation_rules`, `automation_logs`
- `module_submissions`
- `xml_feeds`, `xml_templates`
- `support_tickets`

### 1.3 Seed Data

The schema includes `INSERT ... ON CONFLICT DO NOTHING` seed rows for all ops tables so the admin UI has data on first load.

---

## 2. Vercel Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes (prod) | PostgreSQL connection string |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob for file uploads |
| `ZIP_STORAGE_PROVIDER` | Yes | `vercel_blob` |
| `ZIP_STORAGE_BUCKET` | Yes | Blob container name |
| `ZIP_PUBLIC_BASE_URL` | Yes | CDN base URL for downloads |
| `NEXT_PUBLIC_APP_URL` | Yes | Full app URL |

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.

---

## 3. Repository Pattern

```
src/lib/server/db/
  index.ts          ← getRepository(): returns pgRepository if DATABASE_URL is set
  pg.ts             ← PostgreSQL connection pool (singleton)
  pgRepository.ts   ← Full PostgreSQL implementation of all CRUD operations
  fileRepository.ts ← File-based fallback for local dev (no DATABASE_URL)
  opsTypes.ts       ← Shared TypeScript interfaces for all ops domains
```

`getRepository()` is used in all API routes. It automatically selects the right backend.

---

## 4. Admin API Routes

All routes are under `/api/admin/` and require `x-admin-actor` header for mutations.

| Domain | Routes |
|---|---|
| Products | `GET/POST /api/admin/products`, `GET/PATCH/DELETE /api/admin/products/[id]` |
| Blog | `GET/POST /api/admin/blog`, `GET/PATCH/DELETE /api/admin/blog/[id]` |
| Content Blocks | `GET /api/admin/content`, `GET/PUT /api/admin/content/[key]` |
| SEO Pages | `GET /api/admin/seo`, `PUT /api/admin/seo/pages` |
| Marketing | `GET/POST /api/admin/marketing`, `PATCH/DELETE /api/admin/marketing/[id]` |
| Refunds | `GET /api/admin/refunds`, `GET/PATCH /api/admin/refunds/[id]` |
| Payouts | `GET /api/admin/payouts`, `GET/PATCH /api/admin/payouts/[id]`, `POST /api/admin/payouts/[id]/retry` |
| Automations | `GET/POST /api/admin/automations`, `PATCH/DELETE /api/admin/automations/[id]`, `POST .../toggle`, `POST .../simulate` |
| Automation Logs | `GET /api/admin/automations/logs` |
| Modules | `GET /api/admin/modules`, `PATCH /api/admin/modules/[id]/stage`, `PATCH /api/admin/modules/[id]/risk` |
| XML Feeds | `GET /api/admin/xml/feeds`, `POST .../sync`, `POST /api/admin/xml/feeds/[id]/retry` |
| XML Templates | `GET/POST /api/admin/xml/templates`, `POST .../[name]/improve` |
| Support | `GET /api/admin/support`, `PATCH /api/admin/support/[id]` |
| Policies | `GET/POST /api/admin/policies` |
| Audit | `GET /api/admin/audit` |

---

## 5. Frontend Data Loaders

Server components use these async helpers (fallback to static data when DB unavailable):

- `src/lib/data/blogPosts.ts` — `getBlogPosts()`, `getBlogPostBySlug(slug)`
- `src/lib/data/contentBlocks.ts` — `getContentBlock(key)`, `getAllContentBlocks()`
- `src/lib/data/seoSettings.ts` — `getSeoForPage(slug)`, `getAllSeoPages()`
- `src/lib/data/products.ts` — `getProducts()`, `getProductBySlug(slug)`

---

## 6. Cache Invalidation

All mutation API routes call `revalidatePath()` after a successful write:

| Route | Revalidates |
|---|---|
| Content blocks | `/` (homepage) |
| Blog posts | `/blog` |
| Products | `/browse`, `/products` |
| SEO pages | Individual slug |

---

## 7. Local Development (no DATABASE_URL)

1. Copy `.env.example` to `.env.local`
2. Leave `DATABASE_URL` unset
3. The app uses `fileRepository` backed by `.data/admin-db.json`
4. All admin UI pages work with local mock data

---

## 8. First Deploy Checklist

- [ ] `DATABASE_URL` set in Vercel env vars
- [ ] `database/schema.sql` executed against production DB
- [ ] `BLOB_READ_WRITE_TOKEN` and blob vars set
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Deploy and verify `/admin` dashboard loads
- [ ] Check `/api/admin/products` returns data
- [ ] Confirm `revalidatePath` works by updating a content block and visiting homepage
