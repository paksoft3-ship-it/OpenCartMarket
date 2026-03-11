import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/server/db/index";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { createProductSchema } from "@/lib/server/validators/admin";

export async function GET(request: NextRequest) {
  try {
    const repo = getRepository();
    const products = await repo.listProducts();
    const search = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
    const categoryId = request.nextUrl.searchParams.get("categoryId");

    const filtered = products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search) || p.slug.toLowerCase().includes(search);
      const matchCategory = !categoryId || p.categoryId === categoryId;
      return matchSearch && matchCategory;
    });

    return ok({ items: filtered, total: filtered.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid product payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const repo = getRepository();
    const created = await repo.createProduct(parsed.data, actor);

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath(`/product/${created.slug}`);

    return ok(created, 201);
  } catch (error) {
    return serverError(error);
  }
}
