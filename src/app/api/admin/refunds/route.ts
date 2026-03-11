import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { ok, serverError } from "@/lib/server/api/http";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const risk = request.nextUrl.searchParams.get("risk") || undefined;
    const items = await getRepository().listRefunds(status, risk);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
