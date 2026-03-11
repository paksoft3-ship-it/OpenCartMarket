import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { ok, serverError } from "@/lib/server/api/http";

export async function GET(request: NextRequest) {
  try {
    const queue = request.nextUrl.searchParams.get("queue") || undefined;
    const items = await getRepository().listPayouts(queue);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
