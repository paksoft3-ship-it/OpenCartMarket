import rolesData from "@/data/admin-roles.json";
import { ok } from "@/lib/server/api/http";

export async function GET() {
  return ok({ items: rolesData, total: rolesData.length });
}
