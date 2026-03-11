# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js)
npm run build     # Production build
npm run lint      # ESLint
```

No test suite is configured.

## Architecture Overview

**OCMarket** — a Next.js 16 App Router marketplace for OpenCart themes/modules.

### Data Layer (Repository Pattern)

`src/lib/server/db/index.ts` exports `getRepository()`, which returns:
- `pgRepository` (PostgreSQL via `pg`) if `DATABASE_URL` is set
- `fileRepository` (JSON file at `.data/admin-db.json`) otherwise — used in local dev

All server-side DB access goes through this abstraction. Never import `pgRepository` or `fileRepository` directly.

`database/schema.sql` is idempotent — safe to re-run. Contains enums, tables, and seed data.

### API Routes

All admin API routes live under `src/app/api/admin/`. Pattern:
1. Parse body with a Zod schema from `src/lib/server/validators/admin.ts`
2. Call `getRepository()` for DB operations
3. Return via helpers from `src/lib/server/api/http.ts` (`ok`, `badRequest`, `notFound`, `serverError`)
4. Call `revalidatePath()` after mutations
5. Extract actor via `getActorFromHeaders(headers)` — reads `x-admin-actor` header

### Frontend Data Loaders

`src/lib/data/` contains async server-side data loaders (e.g., `getBlogPosts()`, `getBlogPostBySlug()`). These are DB-first with static JSON fallbacks. All are async — always `await` them.

### App Router Layout Groups

- `(admin)/admin/` — Admin dashboard pages
- `(dashboard)/dashboard/` — Customer portal pages
- `api/admin/` — Admin REST endpoints

### Auth

Cookie-based fake auth (`market_session`). Users pick "Customer" or "Admin" role at `/login`. No real authentication — `NEXTAUTH_*` vars are optional/unused. Zustand (`src/lib/store/index.ts`) persists cart and session to localStorage.

### State Management

Zustand (`useAppStore`) for cart and user session. Admin pages should fetch from API routes rather than using Zustand for data operations.

### UI Components

Shadcn/ui primitives in `src/components/ui/`. Path alias `@/*` maps to `src/*`.

## Key Conventions

- **Zod records:** use `z.record(z.string(), z.unknown())` (2 args required in this version)
- **Interface → record cast:** `as unknown as Record<string, unknown>`
- **`getBlogPostBySlug`** is async — must `await` it
- All admin mutations should include `x-admin-actor` header from the UI

## Environment Variables

See `.env.example`. Key vars:
- `DATABASE_URL` — PostgreSQL (omit to use file fallback in dev)
- `BLOB_READ_WRITE_TOKEN` + `ZIP_STORAGE_*` — Vercel Blob for product file uploads
- `NEXT_PUBLIC_APP_URL` — Full app URL
- `ADMIN_API_SECRET` — Optional protection for `/api/admin/*`
