import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { ok, serverError } from "@/lib/server/api/http";

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get("action") || undefined;
    const items = await getRepository().listAuditEvents(action);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
