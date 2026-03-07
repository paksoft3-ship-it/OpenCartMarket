import { NextRequest } from "next/server";
import { fileRepository } from "@/lib/server/db/fileRepository";
import { ok, serverError } from "@/lib/server/api/http";

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get("action") || undefined;
    const items = await fileRepository.listAuditEvents(action);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
