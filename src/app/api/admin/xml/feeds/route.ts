import { ok, serverError } from "@/lib/server/api/http";
import { getRepository } from "@/lib/server/db/index";

export async function GET() {
  try {
    const items = await getRepository().listXmlFeeds();
    return ok({ items, total: items.length });
  } catch (error) {
    return serverError(error);
  }
}
