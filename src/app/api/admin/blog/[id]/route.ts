import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { updateBlogPostSchema } from "@/lib/server/validators/admin";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const post = await getRepository().getBlogPost(id);
    if (!post) return notFound("Blog post not found");
    return ok(post);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateBlogPostSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid blog post payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().updateBlogPost(id, parsed.data, actor);
    if (!updated) return notFound("Blog post not found");

    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);

    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const actor = getActorFromHeaders(request.headers);
    const deleted = await getRepository().deleteBlogPost(id, actor);
    if (!deleted) return notFound("Blog post not found");

    revalidatePath("/blog");

    return ok({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
