import developersData from "@/data/developers.json";
import { ok } from "@/lib/server/api/http";

export async function GET() {
  return ok({ items: developersData, total: developersData.length });
}
