-- PostgreSQL schema for Vercel deployment (Neon / Vercel Postgres / Supabase)
-- Run this script once against your production database to create all tables.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT DO NOTHING throughout.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Enums ─────────────────────────────────────────────────────────────────────
-- Note: PostgreSQL does not support CREATE TYPE IF NOT EXISTS before PG 9.x.
-- Use DO blocks to guard enum creation idempotently.

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft','review','published','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE storage_provider AS ENUM ('vercel_blob','s3','r2','external');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE blog_post_status AS ENUM ('draft','published','scheduled','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft','active','paused','completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE refund_status AS ENUM ('pending','review','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE refund_risk AS ENUM ('low','medium','high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payout_queue AS ENUM ('all','manual','auto','exception');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE automation_status AS ENUM ('active','paused');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE automation_result AS ENUM ('success','skipped','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE module_stage AS ENUM ('review','qa','release','released','blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE module_risk AS ENUM ('low','medium','high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE xml_feed_status AS ENUM ('healthy','degraded','blocked','syncing');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE support_priority AS ENUM ('low','medium','high','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE support_status AS ENUM ('open','in_progress','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Products ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description       TEXT NOT NULL,
  price             NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  category_id       TEXT NOT NULL,
  developer_id      TEXT NOT NULL,
  compatibility     JSONB NOT NULL DEFAULT '[]'::JSONB,
  images            JSONB NOT NULL DEFAULT '[]'::JSONB,
  features          JSONB NOT NULL DEFAULT '[]'::JSONB,
  tags              JSONB NOT NULL DEFAULT '[]'::JSONB,
  version           TEXT NOT NULL DEFAULT '1.0.0',
  status            product_status NOT NULL DEFAULT 'draft',
  demo_url          TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration: add demo_url to existing installs
ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS demo_url TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS product_files (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES admin_products(id) ON DELETE CASCADE,
  storage_provider storage_provider NOT NULL,
  url              TEXT NOT NULL,
  path             TEXT NOT NULL,
  mime_type        TEXT NOT NULL,
  size_bytes       BIGINT NOT NULL CHECK (size_bytes >= 0),
  checksum_sha256  TEXT NOT NULL,
  is_primary       BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Policy Settings ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS policy_settings (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  core_commission        TEXT NOT NULL DEFAULT '20',
  premium_commission     TEXT NOT NULL DEFAULT '15',
  xml_commission         TEXT NOT NULL DEFAULT '12',
  min_payout             TEXT NOT NULL DEFAULT '50.00',
  tx_fee                 TEXT NOT NULL DEFAULT '0.50',
  payout_retry           TEXT NOT NULL DEFAULT '2',
  refund_auto_cap        TEXT NOT NULL DEFAULT '20',
  review_score_threshold TEXT NOT NULL DEFAULT '72',
  require_2fa            BOOLEAN NOT NULL DEFAULT TRUE,
  xml_strict_mode        BOOLEAN NOT NULL DEFAULT TRUE,
  auto_noindex_drafts    BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Audit Events ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_events (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action  TEXT NOT NULL,
  actor   TEXT NOT NULL,
  target  TEXT NOT NULL,
  details TEXT NOT NULL,
  changes JSONB NOT NULL DEFAULT '[]'::JSONB,
  at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Blog Posts ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  author       TEXT NOT NULL,
  status       blog_post_status NOT NULL DEFAULT 'draft',
  views        INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Site Content Blocks ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_content_blocks (
  key        TEXT PRIMARY KEY,
  title      TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  meta       JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_content_blocks (key, title, body, meta) VALUES
  ('hero', 'OpenCart Temaları & Modülleri', 'Mağazanız için en iyi uzantıları keşfedin',
   '{"cta_primary":"Keşfet","cta_secondary":"Modüller"}'),
  ('seller_cta', 'Marketplace''da Sat', 'Binlerce OpenCart mağazasına ürünlerinizi sunun', '{}'),
  ('footer_tagline', 'OpenCart Marketplace', 'Türkiye''nin en büyük OpenCart uzantı platformu', '{}')
ON CONFLICT (key) DO NOTHING;

-- ── SEO Pages ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seo_pages (
  slug           TEXT PRIMARY KEY,
  title          TEXT NOT NULL DEFAULT '',
  description    TEXT NOT NULL DEFAULT '',
  keywords       TEXT NOT NULL DEFAULT '',
  noindex        BOOLEAN NOT NULL DEFAULT FALSE,
  canonical_url  TEXT,
  og_title       TEXT,
  og_description TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO seo_pages (slug, title, description, keywords) VALUES
  ('/', 'OpenCart Marketplace - Tema & Modül', 'En iyi OpenCart temaları ve modülleri',
   'opencart,tema,modül,marketplace'),
  ('/browse', 'OpenCart Uzantıları - Tümünü Keşfet', 'OpenCart için tüm tema ve modülleri keşfet',
   'opencart uzantı,opencart modül'),
  ('/blog', 'Blog - OpenCart Haberleri', 'OpenCart ile ilgili güncel haberler ve rehberler',
   'opencart blog')
ON CONFLICT (slug) DO NOTHING;

-- ── Marketing Campaigns ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'banner',
  status      campaign_status NOT NULL DEFAULT 'draft',
  start_date  TEXT NOT NULL,
  end_date    TEXT,
  budget      NUMERIC(12,2),
  description TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Refund Cases ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS refund_cases (
  id               TEXT PRIMARY KEY,
  order_ref        TEXT NOT NULL,
  customer         TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  amount           NUMERIC(12,2) NOT NULL,
  reason           TEXT NOT NULL,
  status           refund_status NOT NULL DEFAULT 'pending',
  risk             refund_risk NOT NULL DEFAULT 'low',
  previous_refunds INTEGER NOT NULL DEFAULT 0,
  hours_open       NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO refund_cases (id,order_ref,customer,customer_email,amount,reason,status,risk,previous_refunds,hours_open) VALUES
  ('RF-1042','ORD-7F93A','Ahmet Y.','ahmet@store.com',59,'Module conflict','pending','high',3,12),
  ('RF-1038','ORD-2BA10','Nida K.','nida@shop.io',39,'Not as described','review','medium',1,6),
  ('RF-1032','ORD-1CC31','Daniel P.','daniel@commerce.net',29,'Duplicate purchase','approved','low',0,0),
  ('RF-1030','ORD-8A110','Elif D.','elif@myshop.com',119,'Compatibility issue','pending','high',2,18)
ON CONFLICT (id) DO NOTHING;

-- ── Payout Requests ───────────────────────────────────────────────────────────
-- Note: payout_status values contain Unicode (Turkish chars) — stored as TEXT.

CREATE TABLE IF NOT EXISTS payout_requests (
  id           TEXT PRIMARY KEY,
  developer    TEXT NOT NULL,
  amount       NUMERIC(12,2) NOT NULL,
  requested_at TEXT NOT NULL,
  method       TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'Beklemede',
  queue        payout_queue NOT NULL DEFAULT 'manual',
  reason       TEXT NOT NULL DEFAULT '',
  fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  retries      INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO payout_requests (id,developer,amount,requested_at,method,status,queue,reason,fee) VALUES
  ('WD-2042','PixelThemes Co.',12500,'06 Mar 2026','Banka','Beklemede','manual','Yeni hesap ilk transfer',180),
  ('WD-2041','WebBoost Studio',7900,'05 Mar 2026','Banka','İncelemede','manual','Unusual volume increase',130),
  ('WD-2040','SmartLabs',6250,'04 Mar 2026','IBAN','Onaylandı','auto','Healthy account',95),
  ('WD-2038','Nexus Modules',14900,'03 Mar 2026','Banka','Basarisiz','exception','Bank rejection code 57',210)
ON CONFLICT (id) DO NOTHING;

-- ── Automation Rules ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS automation_rules (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  trigger    TEXT NOT NULL,
  action     TEXT NOT NULL,
  status     automation_status NOT NULL DEFAULT 'active',
  runs       INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id    TEXT NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  result     automation_result NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO automation_rules (id,name,trigger,action,status,runs) VALUES
  ('AUT-101','High Value Refund Approval','refund.amount > 100','require manager approval','active',112),
  ('AUT-102','Payout Exception Routing','payout.retry >= 2','move to exception queue','active',67),
  ('AUT-103','SLA Escalation','ticket.sla_remaining < 2h','assign senior support','paused',25)
ON CONFLICT (id) DO NOTHING;

-- ── Module Submissions ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS module_submissions (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  type       TEXT NOT NULL,
  owner      TEXT NOT NULL,
  stage      module_stage NOT NULL DEFAULT 'review',
  risk       module_risk NOT NULL DEFAULT 'low',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO module_submissions (id,name,type,owner,stage,risk) VALUES
  ('MOD-901','Smart Checkout Rules','checkout','Nexus Labs','qa','medium'),
  ('MOD-900','Theme Variant Switcher','theme','PixelThemes','review','low'),
  ('MOD-899','Invoice XML Pro','integration','CoreBridge','release','high')
ON CONFLICT (id) DO NOTHING;

-- ── XML Feeds ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS xml_feeds (
  id         TEXT PRIMARY KEY,
  partner    TEXT NOT NULL,
  status     xml_feed_status NOT NULL DEFAULT 'healthy',
  latency    TEXT NOT NULL DEFAULT '',
  last_sync  TEXT NOT NULL DEFAULT '-',
  errors     INTEGER NOT NULL DEFAULT 0,
  retries    INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO xml_feeds (id,partner,status,latency,last_sync,errors,retries) VALUES
  ('XML-331','MegaStore','healthy','42s','6 Mar 2026, 18:20',0,0),
  ('XML-330','ShopNet','degraded','3m 12s','6 Mar 2026, 18:01',7,1),
  ('XML-329','TrendCart','blocked','-','6 Mar 2026, 16:40',24,2)
ON CONFLICT (id) DO NOTHING;

-- ── XML Templates ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS xml_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  mapped     TEXT NOT NULL DEFAULT '',
  coverage   INTEGER NOT NULL DEFAULT 0 CHECK (coverage >= 0 AND coverage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO xml_templates (name,mapped,coverage) VALUES
  ('Product Catalog v2','43 fields',91),
  ('Inventory Delta Feed','17 fields',95),
  ('Order Dispatch Feed','22 fields',88)
ON CONFLICT (name) DO NOTHING;

-- ── Support Tickets ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_tickets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject        TEXT NOT NULL,
  customer       TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status         support_status NOT NULL DEFAULT 'open',
  priority       support_priority NOT NULL DEFAULT 'medium',
  category       TEXT NOT NULL DEFAULT 'general',
  message        TEXT NOT NULL DEFAULT '',
  assigned_to    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_admin_products_category  ON admin_products(category_id);
CREATE INDEX IF NOT EXISTS idx_admin_products_status    ON admin_products(status);
CREATE INDEX IF NOT EXISTS idx_product_files_product_id ON product_files(product_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action_at   ON audit_events(action, at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_at          ON audit_events(at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status        ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug          ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_refund_cases_status      ON refund_cases(status);
CREATE INDEX IF NOT EXISTS idx_refund_cases_risk        ON refund_cases(risk);
CREATE INDEX IF NOT EXISTS idx_payout_requests_queue    ON payout_requests(queue);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status   ON payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_module_submissions_stage ON module_submissions(stage);
CREATE INDEX IF NOT EXISTS idx_automation_logs_rule_id  ON automation_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status   ON support_tickets(status);
