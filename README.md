# OCMarket Marketplace (MVP)

A modern, production-quality Next.js marketplace web app for selling OpenCart themes and modules. Built for speed, SEO, and great developer experience with a "modern SaaS marketplace" feel.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 
- **Styling:** Tailwind CSS & shadcn/ui
- **State Management:** Zustand (Cart & Auth)
- **Data:** File-backed admin API datastore + PostgreSQL schema for production

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```
   *(npm or yarn will also work if you prefer)*

2. **Run the development server**
   ```bash
   pnpm dev
   ```

3. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Route Map

- `/` - Homepage (Hero, Featured products, Trending)
- `/browse` - Browse Marketplace (Search, Filter by Category/Price, Sort)
- `/product/[slug]` - Product details, Screenshots, Reviews, and Add to Cart
- `/developer/[id]` - Developer profile and their products
- `/checkout` - Mock secure checkout
- `/login` - Demo login selector for Customer / Admin
- `/dashboard/*` - Customer Portal (Orders, Downloads, Licenses, Settings)
- `/admin/*` - Admin Portal (Sales Overview, Product CRUD mock, Orders)
- `/docs`, `/support` - Static informational pages

## How it works (Mock MVP)

**Data Layer:** 
Products, categories, developers, and reviews are statically read from `src/data/*.json`. This gives you a robust local API feel using React Server Components.

**Authentication:** 
The `/login` route demonstrates a "Fake Auth" where you choose between Customer and Admin. It sets a local cookie (`market_session`) and saves user details into Zustand `localStorage`. The `src/middleware.ts` protects `/dashboard` and `/admin` routes based on this cookie.

**State & Cart:**
Zustand handles the global cart and user state, persisting automatically via `localStorage`. The `/checkout` route saves mockup purchase data (Orders & Licenses) into `localStorage`, so your Dashboard actually reflects what you bought!

## Admin API Layer

Implemented API routes:

- `GET/POST /api/admin/products`
- `GET/PATCH/DELETE /api/admin/products/:id`
- `GET/POST /api/admin/product-files`
- `GET/POST /api/admin/policies`
- `GET /api/admin/audit`

Current runtime persistence is file-backed in `.data/admin-db.json` for immediate local/dev functionality.

Production database/storage plan is documented here:

- `database/schema.sql` (PostgreSQL DDL)
- `database/DEPLOYMENT.md` (Vercel deploy architecture and env vars)
# OpenCartMarket
