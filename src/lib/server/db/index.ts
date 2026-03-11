import { fileRepository } from "./fileRepository";
import { pgRepository } from "./pgRepository";

export type Repository = typeof pgRepository;

/**
 * Returns the PostgreSQL repository if DATABASE_URL is set,
 * otherwise falls back to the file-based repository (local dev only).
 *
 * The file-based fallback only supports the original product/policy/audit domains.
 * New domains (blog, content, seo, etc.) require DATABASE_URL to be set.
 */
export function getRepository(): Repository {
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    return pgRepository;
  }
  // file-based fallback — cast is safe for shared methods (products, policies, audit)
  return fileRepository as unknown as Repository;
}

export { fileRepository } from "./fileRepository";
export { pgRepository } from "./pgRepository";
