import { verifyUnsub, decodeEmail } from "@/lib/unsub";

export const dynamic = "force-dynamic";

export default async function Unsubscribe({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; t?: string; done?: string }>;
}) {
  const { e, t, done } = await searchParams;
  const email = e ? decodeEmail(e) : "";
  const valid = e && t ? await verifyUnsub(email, t) : false;

  const shell = (children: React.ReactNode) => (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#14100F", color: "#F2F4F5", textAlign: "center", padding: "24px", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ maxWidth: 420 }}>
        <div style={{ fontSize: 30, color: "#B08D3F", fontWeight: 600 }}>Neophytou</div>
        <div style={{ marginTop: 24 }}>{children}</div>
      </div>
    </main>
  );

  if (done) return shell(<><h1 style={{ fontSize: 22 }}>You&apos;ve been unsubscribed</h1><p style={{ color: "#938C86", marginTop: 12 }}>You will no longer receive emails from us. Thank you.</p></>);
  if (!valid) return shell(<><h1 style={{ fontSize: 22 }}>Invalid link</h1><p style={{ color: "#938C86", marginTop: 12 }}>This unsubscribe link is not valid or has expired.</p></>);

  return shell(
    <>
      <h1 style={{ fontSize: 22 }}>Unsubscribe</h1>
      <p style={{ color: "#938C86", marginTop: 12 }}>Confirm you no longer wish to receive emails at {email}.</p>
      <form method="POST" action="/api/unsubscribe" style={{ marginTop: 24 }}>
        <input type="hidden" name="e" value={e} />
        <input type="hidden" name="t" value={t} />
        <button type="submit" style={{ background: "#B08D3F", color: "#14100F", border: "none", borderRadius: 999, padding: "12px 28px", fontWeight: 600, cursor: "pointer" }}>Unsubscribe me</button>
      </form>
    </>
  );
}