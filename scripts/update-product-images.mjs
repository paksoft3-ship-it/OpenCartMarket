#!/usr/bin/env node
/**
 * Directly updates the images column in DB for all 25 products
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '../..');

dotenv.config({ path: join(__dir, '../.env.local') });

const { Pool } = await import('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const dirs = [
  join(ROOT, 'OpenCartThemes/products'),
  join(ROOT, 'OpenCartModules/products'),
  join(ROOT, 'OpenCartXML/products'),
];

const updates = [];
for (const dir of dirs) {
  let entries;
  try { entries = readdirSync(dir); } catch { continue; }
  for (const slug of entries) {
    const mpath = join(dir, slug, 'manifest.json');
    try {
      const m = JSON.parse(readFileSync(mpath, 'utf8'));
      if (m.images?.length > 0) updates.push({ slug: m.slug, images: m.images });
    } catch {}
  }
}

console.log(`Updating ${updates.length} products in DB...\n`);
let count = 0;
for (const { slug, images } of updates) {
  const res = await pool.query(
    `UPDATE admin_products SET images=$2, updated_at=NOW() WHERE slug=$1 RETURNING slug`,
    [slug, JSON.stringify(images)]
  );
  if (res.rowCount > 0) { console.log(`✓ ${slug}`); count++; }
  else { console.log(`✗ not found: ${slug}`); }
}

console.log(`\n✅ Updated ${count} / ${updates.length} products`);
await pool.end();
