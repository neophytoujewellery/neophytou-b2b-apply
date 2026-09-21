"use client";

import { useState } from "react";

const STOCK = [
  { v: "18kt", l: "18KT gold" },
  { v: "natural", l: "Natural diamonds" },
  { v: "lab", l: "Lab-grown diamonds" },
  { v: "bridal", l: "Bridal & engagement" },
  { v: "tennis", l: "Tennis bracelets" },
  { v: "watches", l: "Watches" },
];

const REQUIRED = ["business", "country", "city", "contact", "email"] as const;
const ID: Record<string, string> = { business: "biz", country: "country", city: "city", contact: "name", email: "email" };
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default function Page() {
  const [f, setF] = useState<Record<string, string>>({ business: "", country: "", city: "", website: "", contact: "", email: "", notes: "" });
  const [stock, setStock] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => {
    setF((s) => ({ ...s, [k]: v }));
    if (invalid[k]) setInvalid((s) => ({ ...s, [k]: false }));
  };
  const toggleStock = (v: string) =>
    setStock((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  const fieldClass = (k: string) => `field${invalid[k] ? " invalid" : ""}`;

  async function submit() {
    setError("");
    const bad: Record<string, boolean> = {};
    let first: string | null = null;
    for (const k of REQUIRED) {
      const v = (f[k] || "").trim();
      let isBad = !v;
      if (!isBad && k === "email") isBad = !emailOk(v);
      if (isBad) { bad[k] = true; if (!first) first = k; }
    }
    setInvalid(bad);
    if (first) { document.getElementById(ID[first])?.focus(); return; }

    setSending(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, stock }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => document.getElementById("sent")?.scrollIntoView({ block: "center" }), 30);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not submit — please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header>
        <div className="wrap hdr">
          <div className="mark">Neophytou<span>Jewellery</span></div>
          <a className="hdr-link" href="https://www.neophytoujewellery.com">View the collection</a>
        </div>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="hallmark">
              <svg width="54" height="38" viewBox="0 0 54 38" aria-hidden="true">
                <rect x="1" y="1" width="52" height="36" rx="18" fill="none" stroke="#B08D3F" strokeWidth="1.1" />
                <text x="27" y="25" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fill="#D9BE7E" letterSpacing="1.5">750</text>
              </svg>
              <p>The European hallmark for 18 karat gold. Every piece we supply carries it.</p>
            </div>
            <h1>Stock the diamonds<br />your buyers ask for</h1>
            <p className="lede">We supply independent fine jewellers across Europe with 18KT gold, certified natural and lab-grown diamonds, tennis lines and bridal. Short lead times, trade pricing, no minimum first order.</p>
            <a className="btn" href="#apply">Apply for a trade account</a>
            <p className="hero-note">Applications are reviewed within two working days.</p>
          </div>

          <div className="case">
            <h2>What we supply</h2>
            <ul>
              <li><b>Gold</b> <i>18KT — 750</i></li>
              <li><b>Natural diamonds</b> <i>GIA / IGI certified</i></li>
              <li><b>Lab-grown diamonds</b> <i>IGI certified</i></li>
              <li><b>Tennis bracelets &amp; necklaces</b> <i>1.0 – 10.0 ct</i></li>
              <li><b>Engagement &amp; bridal</b> <i>made to order</i></li>
              <li><b>Lead time</b> <i>10 – 21 days</i></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="criteria">
        <div className="wrap">
          <div className="sec-head">
            <h2>We only take on a handful of partners per city</h2>
            <p>Territory matters to the jewellers we work with, so we are deliberate about who we supply. Here is where we tend to fit — and where we honestly do not.</p>
          </div>
          <div className="cols">
            <div className="col yes">
              <h3>A good fit</h3>
              <ul>
                <li>Independent fine jewellers with a physical showroom</li>
                <li>Retailers already selling 18KT and certified stones</li>
                <li>Bridal and engagement specialists</li>
                <li>Buyers wanting a lab-grown line alongside naturals</li>
                <li>Shops whose average sale sits above €1,000</li>
              </ul>
            </div>
            <div className="col no">
              <h3>Not a fit</h3>
              <ul>
                <li>Costume and fashion accessory retailers</li>
                <li>Silver-only or stainless steel focused shops</li>
                <li>Cash-for-gold and pawn businesses</li>
                <li>Marketplace-only resellers without a storefront</li>
                <li>Anyone needing sub-€50 price points</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="apply" id="apply">
        <div className="wrap">
          <div className="cert">
            <div className="cert-top">
              <h2>Trade partner application</h2>
              <p>Tell us about your shop. If there is a fit, we will send our trade catalogue and pricing.</p>
            </div>

            {!sent ? (
              <div id="formBody">
                <div className={fieldClass("business")}>
                  <label htmlFor="biz">Business name</label>
                  <input id="biz" value={f.business} onChange={(e) => set("business", e.target.value)} autoComplete="organization" placeholder="Kosmima Athina" />
                  <span className="err">Enter your registered business name</span>
                </div>

                <div className="row2">
                  <div className={fieldClass("country")}>
                    <label htmlFor="country">Country</label>
                    <select id="country" value={f.country} onChange={(e) => set("country", e.target.value)}>
                      <option value="">Select a country</option>
                      <option>Greece</option><option>Cyprus</option><option>Italy</option>
                      <option>Spain</option><option>France</option><option>Germany</option>
                      <option>Other</option>
                    </select>
                    <span className="err">Select a country</span>
                  </div>
                  <div className={fieldClass("city")}>
                    <label htmlFor="city">City</label>
                    <input id="city" value={f.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" placeholder="Thessaloniki" />
                    <span className="err">Enter your city</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="site">Shop website or Instagram</label>
                  <input id="site" value={f.website} onChange={(e) => set("website", e.target.value)} placeholder="kosmima-athina.gr" />
                </div>

                <div className="row2">
                  <div className={fieldClass("contact")}>
                    <label htmlFor="name">Your name</label>
                    <input id="name" value={f.contact} onChange={(e) => set("contact", e.target.value)} autoComplete="name" placeholder="Eleni Papadopoulou" />
                    <span className="err">Enter your name</span>
                  </div>
                  <div className={fieldClass("email")}>
                    <label htmlFor="email">Work email</label>
                    <input id="email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" placeholder="eleni@kosmima-athina.gr" />
                    <span className="err">Enter a valid work email</span>
                  </div>
                </div>

                <div className="field">
                  <label>What do you currently stock?</label>
                  <div className="checks">
                    {STOCK.map((s) => (
                      <label key={s.v} className="chk">
                        <input type="checkbox" checked={stock.includes(s.v)} onChange={() => toggleStock(s.v)} /> {s.l}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="msg">Anything else we should know?</label>
                  <textarea id="msg" value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Years trading, showroom size, the lines you carry now." />
                </div>

                <button className="submit" type="button" onClick={submit} disabled={sending}>
                  {sending ? "Sending…" : "Send application"}
                </button>
                {error && <p className="privacy" style={{ color: "#A3302B" }}>{error}</p>}
                <p className="privacy">We use your details only to assess this application and contact you about wholesale supply. You can ask us to delete them at any time.</p>
              </div>
            ) : (
              <div className="sent" id="sent" style={{ display: "block" }}>
                <h3>Application received</h3>
                <p>We will review your shop and reply within two working days.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap ftr">
          <p>Neophytou Jewellery — wholesale &amp; trade supply</p>
          <a href="https://www.neophytoujewellery.com">View the collection</a>
        </div>
      </footer>
    </>
  );
}