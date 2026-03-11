import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";

export async function POST(request: NextRequest) {
  try {
    const actor = getActorFromHeaders(request.headers);
    const feeds = await getRepository().runFullXmlSync(actor);
    return ok({ feeds, total: feeds.length });
  } catch (error) {
    return serverError(error);
  }
}
