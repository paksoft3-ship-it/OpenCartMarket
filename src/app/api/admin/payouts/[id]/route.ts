import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { updatePayoutStatusSchema } from "@/lib/server/validators/admin";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payout = await getRepository().getPayout(id);
    if (!payout) return notFound("Payout not found");
    return ok(payout);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updatePayoutStatusSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid payout status payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().updatePayoutStatus(id, parsed.data.status, actor);
    if (!updated) return notFound("Payout not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
