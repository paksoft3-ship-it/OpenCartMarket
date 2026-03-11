import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { setModuleStageSchema } from "@/lib/server/validators/admin";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = setModuleStageSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid stage payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().setModuleStage(id, parsed.data.stage, actor);
    if (!updated) return notFound("Module not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
