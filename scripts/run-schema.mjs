/**
 * Runs database/schema.sql against the DATABASE_URL from .env.local
 * Usage: node scripts/run-schema.mjs
 */
import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env.local manually
const envPath = join(root, ".env.local");
const envContent = readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  if (!process.env[key]) process.env[key] = value;
}

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

const require = createRequire(import.meta.url);
const { Pool } = require("pg");

const sql = readFileSync(join(root, "database/schema.sql"), "utf8");

const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

console.log("🔌 Connecting to database...");
try {
  const client = await pool.connect();
  console.log("✅ Connected. Running schema...\n");
  await client.query(sql);
  client.release();
  console.log("✅ Schema applied successfully! All tables and seed data are ready.");
} catch (err) {
  console.error("❌ Error running schema:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
