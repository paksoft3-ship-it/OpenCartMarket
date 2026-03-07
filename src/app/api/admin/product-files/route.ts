import { NextRequest } from "next/server";
import { fileRepository } from "@/lib/server/db/fileRepository";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { createProductFileSchema } from "@/lib/server/validators/admin";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId") || undefined;
    const items = await fileRepository.listProductFiles(productId);
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createProductFileSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid file payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const created = await fileRepository.addProductFile(parsed.data, actor);
    return ok(created, 201);
  } catch (error) {
    return serverError(error);
  }
}
