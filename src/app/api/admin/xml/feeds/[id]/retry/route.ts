import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().retryXmlFeed(id, actor);
    if (!updated) return notFound("XML feed not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
