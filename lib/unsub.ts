const SECRET = process.env.UNSUB_SECRET || process.env.DASHBOARD_SECRET || "unsub-secret-change-me";
const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return b64url(new Uint8Array(sig));
}

export function decodeEmail(e: string): string {
  try {
    const b = atob(e.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(b, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes).trim().toLowerCase();
  } catch {
    return "";
  }
}

export async function verifyUnsub(email: string, token: string): Promise<boolean> {
  if (!email || !token) return false;
  return (await hmac(email.trim().toLowerCase())) === token;
}