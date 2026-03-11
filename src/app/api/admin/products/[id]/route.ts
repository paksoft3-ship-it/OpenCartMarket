import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, notFound, ok, serverError } from "@/lib/server/api/http";
import { updateProductSchema } from "@/lib/server/validators/admin";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const product = await getRepository().getProduct(id);
    if (!product) return notFound("Product not found");
    return ok(product);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid update payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await getRepository().updateProduct(id, parsed.data, actor);
    if (!updated) return notFound("Product not found");

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath(`/product/${updated.slug}`);

    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const actor = getActorFromHeaders(request.headers);
    const deleted = await getRepository().deleteProduct(id, actor);
    if (!deleted) return notFound("Product not found");

    revalidatePath("/");
    revalidatePath("/browse");

    return ok({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
