import { NextRequest } from "next/server";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { createXmlTemplateSchema } from "@/lib/server/validators/admin";

export async function GET() {
  try {
    const items = await getRepository().listXmlTemplates();
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createXmlTemplateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid template payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const created = await getRepository().createXmlTemplate(parsed.data, actor);
    return ok(created, 201);
  } catch (error) {
    return serverError(error);
  }
}
