import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { ok, serverError } from "@/lib/server/api/http";

export async function GET(request: NextRequest) {
  try {
    const ruleId = request.nextUrl.searchParams.get("ruleId") || undefined;
    const items = await getRepository().listLogs(ruleId);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
