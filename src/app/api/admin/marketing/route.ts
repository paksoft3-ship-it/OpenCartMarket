import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { createCampaignSchema } from "@/lib/server/validators/admin";

export async function GET() {
  try {
    const items = await getRepository().listCampaigns();
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCampaignSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid campaign payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const created = await getRepository().createCampaign(parsed.data, actor);
    return ok(created, 201);
  } catch (error) {
    return serverError(error);
  }
}
