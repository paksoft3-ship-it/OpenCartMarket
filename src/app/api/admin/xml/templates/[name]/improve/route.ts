import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";

export async function POST(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await context.params;
    const decodedName = decodeURIComponent(name);
    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().improveXmlTemplateCoverage(decodedName, actor);
    if (!updated) return notFound("XML template not found");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
