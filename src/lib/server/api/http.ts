import { NextResponse } from "next/server";

export function getActorFromHeaders(headers: Headers) {
  return headers.get("x-admin-actor") || "Admin";
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function serverError(error: unknown) {
  return NextResponse.json(
    {
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
