import { NextRequest } from "next/server";
import { fileRepository } from "@/lib/server/db/fileRepository";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { createProductSchema } from "@/lib/server/validators/admin";

export async function GET(request: NextRequest) {
  try {
    const products = await fileRepository.listProducts();
    const search = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
    const categoryId = request.nextUrl.searchParams.get("categoryId");

    const filtered = products.filter((product) => {
      const matchSearch = !search || product.name.toLowerCase().includes(search) || product.slug.toLowerCase().includes(search);
      const matchCategory = !categoryId || product.categoryId === categoryId;
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
    const created = await fileRepository.createProduct(parsed.data, actor);
    return ok(created, 201);
  } catch (error) {
    return serverError(error);
  }
}
