import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { upsertContentBlockSchema } from "@/lib/server/validators/admin";

export async function GET(_request: NextRequest, context: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await context.params;
    const block = await getRepository().getContentBlock(key);
    if (!block) return notFound("Content block not found");
    return ok(block);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await context.params;
    const body = await request.json();
    const parsed = upsertContentBlockSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid content block payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const block = await getRepository().upsertContentBlock(key, parsed.data, actor);

    revalidatePath("/");
    revalidatePath("/browse");

    return ok(block);
  } catch (error) {
    return serverError(error);
  }
}
