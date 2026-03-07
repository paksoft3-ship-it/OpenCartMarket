# Vercel Database + File Storage Plan

## Recommended stack

- Metadata + transactions: **PostgreSQL** (Vercel Postgres / Neon)
- ZIP binaries: **Object storage** (Vercel Blob, S3, or Cloudflare R2)

Do **not** store ZIP binaries inside PostgreSQL rows (BYTEA) for this marketplace use case.
Store only file metadata and URL/path in DB.

## Why this is best

- ZIP/theme/module files are large binary blobs.
- Object storage is cheaper and scales better for downloads.
- Postgres remains fast for product search, policy updates, and audit trails.

## Required env vars

- `DATABASE_URL` = Postgres connection string
- `ZIP_STORAGE_PROVIDER` = `vercel_blob` | `s3` | `r2`
- `ZIP_STORAGE_BUCKET` = bucket/container name (for s3/r2)
- `ZIP_PUBLIC_BASE_URL` = CDN/public base URL
- `BLOB_READ_WRITE_TOKEN` = only if using Vercel Blob

## Upload flow (production)

1. Admin requests signed upload URL from API.
2. Frontend uploads ZIP directly to object storage.
3. Frontend sends resulting file URL/path + checksum + size to `/api/admin/product-files`.
4. API stores metadata in DB and writes audit event.

## Download flow

- Buyer requests product download.
- API validates license/order access.
- API returns short-lived signed URL (or proxied download token).
