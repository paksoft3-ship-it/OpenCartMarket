import { NextRequest } from "next/server";
import { fileRepository } from "@/lib/server/db/fileRepository";
import { badRequest, getActorFromHeaders, ok, serverError } from "@/lib/server/api/http";
import { updatePoliciesSchema } from "@/lib/server/validators/admin";

export async function GET() {
  try {
    const policies = await fileRepository.getPolicies();
    return ok(policies);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updatePoliciesSchema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid policy payload", parsed.error.flatten());

    const actor = getActorFromHeaders(request.headers);
    const updated = await fileRepository.updatePolicies(parsed.data, actor);
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}
