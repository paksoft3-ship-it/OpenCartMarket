import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { updateAutomationRuleSchema } from "@/lib/server/validators/admin";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateAutomationRuleSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid rule payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().updateRule(id, parsed.data, actor);
    if (!updated) return notFound("Rule not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const actor = getActorFromHeaders(request.headers);
    const deleted = await getRepository().deleteRule(id, actor);
    if (!deleted) return notFound("Rule not found");
    return ok({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
