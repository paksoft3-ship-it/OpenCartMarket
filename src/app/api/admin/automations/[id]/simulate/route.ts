import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { simulateRuleSchema } from "@/lib/server/validators/admin";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = simulateRuleSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid simulate payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const log = await getRepository().simulateRule(id, parsed.data.result, actor);
    return ok(log);
  } catch (error) {
    return serverError(error);
  }
}
