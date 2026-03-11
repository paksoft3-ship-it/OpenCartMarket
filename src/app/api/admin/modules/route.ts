import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { ok, serverError } from "@/lib/server/api/http";

export async function GET(request: NextRequest) {
  try {
    const stage = request.nextUrl.searchParams.get("stage") || undefined;
    const items = await getRepository().listModules(stage);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
