import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { upsertSeoPageSchema } from "@/lib/server/validators/admin";
import { z } from "zod";

const upsertSeoPageBodySchema = z.object({
  slug: z.string().min(1),
  data: upsertSeoPageSchema,
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = upsertSeoPageBodySchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid SEO page payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const page = await getRepository().upsertSeoPage(parsed.data.slug, parsed.data.data, actor);

    revalidatePath(parsed.data.slug);

    return ok(page);
  } catch (error) {
    return serverError(error);
  }
}
