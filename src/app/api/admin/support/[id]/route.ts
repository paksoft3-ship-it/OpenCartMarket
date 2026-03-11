import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { updateSupportTicketSchema } from "@/lib/server/validators/admin";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateSupportTicketSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid ticket payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().updateSupportTicket(id, parsed.data, actor);
    if (!updated) return notFound("Support ticket not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
