import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { createBlogPostSchema } from "@/lib/server/validators/admin";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const items = await getRepository().listBlogPosts(status);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBlogPostSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid blog post payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const created = await getRepository().createBlogPost(parsed.data, actor);

    revalidatePath("/blog");
    revalidatePath(`/blog/${created.slug}`);

    return ok(created, 201);
  } catch (error) {
    return serverError(error);
  }
}
