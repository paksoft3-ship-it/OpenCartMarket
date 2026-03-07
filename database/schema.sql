-- PostgreSQL schema for Vercel deployment
-- Use this schema in Neon / Vercel Postgres.

create extension if not exists pgcrypto;

create type product_status as enum ('draft', 'review', 'published', 'archived');
create type storage_provider as enum ('vercel_blob', 's3', 'r2', 'external');

create table if not exists admin_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  category_id text not null,
  developer_id text not null,
  compatibility jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  version text not null default '1.0.0',
  status product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references admin_products(id) on delete cascade,
  storage_provider storage_provider not null,
  url text not null,
  path text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  checksum_sha256 text not null,
  is_primary boolean not null default false,
  uploaded_at timestamptz not null default now()
);

create table if not exists policy_settings (
  id uuid primary key default gen_random_uuid(),
  core_commission text not null,
  premium_commission text not null,
  xml_commission text not null,
  min_payout text not null,
  tx_fee text not null,
  payout_retry text not null,
  refund_auto_cap text not null,
  review_score_threshold text not null,
  require_2fa boolean not null,
  xml_strict_mode boolean not null,
  auto_noindex_drafts boolean not null,
  updated_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor text not null,
  target text not null,
  details text not null,
  changes jsonb not null default '[]'::jsonb,
  at timestamptz not null default now()
);

create index if not exists idx_admin_products_category on admin_products(category_id);
create index if not exists idx_product_files_product_id on product_files(product_id);
create index if not exists idx_audit_events_action_at on audit_events(action, at desc);
