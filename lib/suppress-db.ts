import { pool } from "./db";

export async function suppressEmail(email: string, reason: string, source: string) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return;
  await pool.query(
    `INSERT INTO suppression (email, reason, source) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [e, reason, source]
  );
  await pool.query(
    `UPDATE leads SET do_not_contact = true, unsubscribed = true WHERE lower(email) = $1`,
    [e]
  );
}