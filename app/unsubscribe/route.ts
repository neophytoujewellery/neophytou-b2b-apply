import { NextResponse } from "next/server";
import { verifyUnsub, decodeEmail } from "@/lib/unsub";
import { suppressEmail } from "@/lib/suppress-db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const e = String(form.get("e") || "");
  const t = String(form.get("t") || "");
  const email = decodeEmail(e);
  if (email && (await verifyUnsub(email, t))) {
    await suppressEmail(email, "unsubscribe", "link");
  }
  return NextResponse.redirect(new URL("/unsubscribe?done=1", req.url), { status: 303 });
}