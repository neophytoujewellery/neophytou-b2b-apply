import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE = process.env.BACKEND_API_URL || "http://localhost:5000";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(`${BASE}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 502 });
  }
}