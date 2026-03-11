import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { updateRefundStatusSchema } from "@/lib/server/validators/admin";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const refund = await getRepository().getRefund(id);
    if (!refund) return notFound("Refund not found");
    return ok(refund);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateRefundStatusSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid refund status payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().updateRefundStatus(id, parsed.data.status, actor);
    if (!updated) return notFound("Refund not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
