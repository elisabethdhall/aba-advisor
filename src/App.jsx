import { useState, useRef, useEffect } from "react";

const C = {
  cream: "#FAF7F2", warm: "#F5F1EA", gold: "#C9A96E", goldL: "#E8D5B0",
  goldD: "#A07840", char: "#1C1C1C", text: "#2C2822", textL: "#6B6259",
  textLL: "#A09890", border: "#E8E0D4", borderD: "#D4C8B8", white: "#FFFFFF",
};

const STORAGE_KEY = "aba_practice_profile";

const SYS = (p) => `You are ABA — Your Aesthetic Business Advisor, a specialized business advisory tool built exclusively for aesthetic medical practices. You are not a general-purpose AI. You are not a clinical tool. You exist for one purpose: to help aesthetic medical practices run more profitable, more efficient, and more fulfilling businesses.

You have been built on 10-15 years of real-world expertise working inside aesthetic medical practices — including plastic surgery, injectables, laser treatments, and medical-grade skincare. You understand how these practices actually operate, where revenue leaks, why staff turns over, and what separates thriving practices from ones that are quietly struggling.

CORE PHILOSOPHY:
- Profitability and patient experience are not in tension — they are the same thing
- You NEVER recommend selling to patients. Patients come in for a medical result. The practice creates exceptional experience, sets proper expectations, demonstrates expertise, and lets results do the work
- Time is the most undervalued asset. Always think about margin in context of time, not just dollars
- Leadership is the root of most practice problems. Physicians got no business training. Deep empathy, zero judgment
- Patient lifecycle is long. Lifetime value is enormous — realized only through thoughtful pressure-free relationship-building
- Every recommendation considers: patient experience, physician time, team capacity, revenue impact

KEY FRAMEWORKS:
- Phone calls: Credential the practice, providers, procedures naturally. Use in fact phrasing. Close every call. Excitement is contagious
- Consultations: Should feel like a second date — patient already knows the practice. Provider sits next to patient. Use their photos plus relevant B&As. Listen to understand. No surprises
- Pricing: Frame around outcomes not procedures. Financing upfront not last resort. You pay for the outcome not the product
- Price shoppers: Most are not — they have not been educated. Ask about desired outcomes
- I need to think about it: Do not push. If expectations set properly they should not need to think — that is upstream work to improve
- Staff: Hire for personality train for skill. Hire to protect culture. Stay interviews 2-4x per year. Morning huddles. Flexibility matters
- Performance: Separate behavior from person. Crucial Conversations for hard talks
- Inventory: Frozen cash with expiration clock. Two-bin system. First in first out. One person owns it
- Metrics monthly: operating expenses, provider productivity, new patient sources specific, procedure revenue, skincare revenue, percent procedure patients buying skincare, retention, LTV, Google reviews, conversion rates
- Post-procedure: No gap ever. Voice memos, care packages, automated texts — patients feel abandoned after surgery booked
- Reviews: Ask warmly, QR code, make it easy
- Social/DMs: Meet patients where they are. Never redirect DM to phone call
- Average ticket spend: A key benchmark for non-surgical practices. If a practice does not know this number, help them think through how to calculate it and why it matters

RESPONSE FORMAT — ALWAYS THIS EXACT STRUCTURE:
💡 The Insight
[Direct answer. No fluff. No preamble.]

🔍 What This Means For You
[Connect to their specific practice profile. Only exists because they completed intake.]

✅ Your Next Move
[1-3 concrete sequenced action steps. Bullets. Never overwhelming.]

TONE: Warm, direct, empathetic, concise. Under 2 minutes to read. Always know what to do next.

BOUNDARIES:
- No clinical advice — redirect to clinical team
- No legal, HIPAA, employment law — refer to attorney
- No accounting or tax advice — refer to financial advisor
- No vendor recommendations by name
- Compensation: directional only, flag for legal
- No PHI ever

PRACTICE PROFILE:
Specialty: ${p.specialty || "Not provided"}
Role: ${p.role || "Not provided"}
Practice Name: ${p.name || "Not provided"}
Market: ${p.market || "Not provided"}
Zip: ${p.zip || "Not provided"}
Practice Age: ${p.age || "Not provided"}
Number of Providers: ${p.numProviders || "Not provided"}
Other Providers: ${(p.otherProviders || []).join(", ") || "None"}
Staff Count: ${p.staff || "Not provided"}
${p.specialty === "Plastic Surgery & Cosmetic Surgery" ? `Coordinator: ${p.coordinator || "Not provided"}` : `Patient Booking Guide: ${p.coordinator || "Not provided"}`}
Post-Consult Follow-Up: ${p.followup || "Not provided"}
Monthly Consults: ${p.consultVol || "Not provided"}
Top Procedures: ${p.procedures || "Not provided"}
Injectables: ${p.injectables || "Not provided"}
Laser: ${p.laser || "Not provided"}
${p.specialty === "Plastic Surgery & Cosmetic Surgery" ? `Average Case Value: ${p.caseValue || "Not provided"}` : `Average Ticket Spend Per Visit: ${p.avgTicket || "Not provided"}`}
Patient Sources: ${(p.sources || []).join(", ") || "Not provided"}
Paid Ads: ${p.ads || "Not provided"}
Reviews: ${p.reviews || "Not provided"}
Challenges: ${(p.challenges || []).join(", ") || "Not provided"}
Personal Goals: ${(p.personalGoals || []).join(", ") || "Not provided"}
Prior Coach: ${p.coach || "Not provided"}
${p.specialty === "Plastic Surgery & Cosmetic Surgery" ? `OR Days/Week: ${p.orDays || "Not provided"}` : ""}
${p.specialty === "Medical Spa" ? `Total Provider Treatment Hours/Week: ${p.treatmentHours || "Not provided"}` : ""}
${p.specialty === "Dermatology — Cosmetic & Medical" ? `Procedure Days/Week: ${p.orDays || "Not provided"}` : ""}
Clinic Days/Week: ${p.clinicDays || "Not provided"}
Post-Procedure Follow-Up: ${p.postProc || "Not provided"}
Notes: ${p.notes || "None"}
Core Values: ${(p.values || []).join(", ") || "Not selected"}

Reference profile naturally. Never announce you are doing it.`;

function Radio({ name, value, label, checked, onChange, type = "radio" }) {
  return (
    <label style={{ display: "block", padding: "10px 14px", border: `1px solid ${checked ? C.gold : C.borderD}`, background: checked ? C.goldL : C.white, cursor: "pointer", fontSize: 13, color: checked ? C.char : C.text, fontWeight: checked ? 500 : 400, borderRadius: 2, marginBottom: 7, lineHeight: 1.4, transition: "all 0.15s" }}>
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} style={{ display: "none" }} />
      {label}
    </label>
  );
}

function Chip({ value, label, checked, onChange }) {
  return (
    <label style={{ display: "inline-block", padding: "6px 14px", border: `1px solid ${checked ? C.goldD : C.borderD}`, background: checked ? C.goldD : C.white, color: checked ? "white" : C.textL, cursor: "pointer", fontSize: 12, borderRadius: 20, transition: "all 0.15s", userSelect: "none", marginRight: 6, marginBottom: 6 }}>
      <input type="checkbox" value={value} checked={checked} onChange={onChange} style={{ display: "none" }} />
      {label}
    </label>
  );
}

function Head({ num, title, desc }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, marginBottom: 5 }}>{num}</div>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 400, color: C.char, margin: 0, lineHeight: 1.2 }}>{title}</h2>
      {desc && <p style={{ marginTop: 7, fontSize: 13, color: C.textL, fontWeight: 300 }}>{desc}</p>}
    </div>
  );
}

function Sel({ value, onChange, opts }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.borderD}`, background: C.white, fontFamily: "inherit", fontSize: 13, color: value ? C.text : C.textLL, borderRadius: 2, appearance: "none", cursor: "pointer" }}>
      <option value="">Select one</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ValTag({ label, selected, disabled, onToggle }) {
  return (
    <span onClick={(!disabled || selected) ? onToggle : undefined} style={{ display: "inline-block", padding: "7px 14px", border: `1px solid ${selected ? C.goldD : C.borderD}`, background: selected ? C.char : C.white, color: selected ? C.goldL : disabled ? C.textLL : C.textL, cursor: (disabled && !selected) ? "not-allowed" : "pointer", fontFamily: "Georgia,serif", fontSize: 14, borderRadius: 2, transition: "all 0.15s", marginRight: 6, marginBottom: 7, opacity: (disabled && !selected) ? 0.4 : 1 }}>
      {label}
    </span>
  );
}

function NavBtns({ onNext, label = "Continue →", back = true, onBack }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
      {back ? <button onClick={onBack} style={{ background: "none", border: `1px solid ${C.borderD}`, color: C.textL, padding: "9px 22px", fontFamily: "inherit", fontSize: 12, cursor: "pointer", borderRadius: 2 }}>← Back</button> : <div />}
      <button onClick={onNext} style={{ background: C.char, border: "none", color: C.goldL, padding: "10px 28px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>{label}</button>
    </div>
  );
}

function Header() {
  return (
    <div style={{ background: C.char, padding: "13px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
      <div style={{ color: C.goldL, fontSize: 16, fontFamily: "Georgia,serif" }}><span style={{ color: C.gold }}>ABA</span> — Your Aesthetic Business Advisor</div>
      <div style={{ fontSize: 10, color: C.textLL, letterSpacing: "0.1em", textTransform: "uppercase" }}>Business Strategy Only</div>
    </div>
  );
}

function formatMsg(text) {
  const parts = text.split(/(💡|🔍|✅)/);
  const sections = [];
  let cur = null;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "💡") { if (cur) sections.push(cur); cur = { e: "💡", l: "The Insight", c: "" }; }
    else if (parts[i] === "🔍") { if (cur) sections.push(cur); cur = { e: "🔍", l: "What This Means For You", c: "" }; }
    else if (parts[i] === "✅") { if (cur) sections.push(cur); cur = { e: "✅", l: "Your Next Move", c: "" }; }
    else if (cur) cur.c += parts[i];
    else if (parts[i].trim()) sections.push({ e: "", l: "", c: parts[i] });
  }
  if (cur) sections.push(cur);
  if (!sections.length) return <p style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>{text}</p>;
  return sections.map((s, i) => (
    <div key={i} style={{ marginBottom: i < sections.length - 1 ? 14 : 0 }}>
      {s.l && <div style={{ fontWeight: 600, fontSize: 12, color: C.char, marginBottom: 5 }}>{s.e} {s.l}</div>}
      <div style={{ fontSize: 13, lineHeight: 1.75, color: C.text }}>
        {s.c.trim().split("\n").map((line, j) => {
          const t = line.trim();
          if (t.startsWith("•") || t.startsWith("-") || t.startsWith("*")) return <div key={j} style={{ paddingLeft: 12, marginBottom: 3 }}>· {t.replace(/^[•\-\*]\s*/, "")}</div>;
          if (!t) return <div key={j} style={{ height: 4 }} />;
          return <p key={j} style={{ margin: "0 0 4px" }}>{t}</p>;
        })}
      </div>
    </div>
  ));
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({});
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [busy, setBusy] = useState(false);
  const [hist, setHist] = useState([]);
  const [savedProfile, setSavedProfile] = useState(null);
  const endRef = useRef(null);

  const [specialty, setSpecialty] = useState("");
  const [multiLoc, setMultiLoc] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [role, setRole] = useState("");
  const [market, setMarket] = useState("");
  const [age, setAge] = useState("");
  const [numProviders, setNumProviders] = useState("");
  const [otherProviders, setOtherProviders] = useState([]);
  const [staff, setStaff] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const [followup, setFollowup] = useState("");
  const [consultVol, setConsultVol] = useState("");
  const [procedures, setProcedures] = useState("");
  const [injectables, setInjectables] = useState("");
  const [laser, setLaser] = useState("");
  const [caseValue, setCaseValue] = useState("");
  const [avgTicket, setAvgTicket] = useState("");
  const [sources, setSources] = useState([]);
  const [ads, setAds] = useState("");
  const [reviews, setReviews] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [personalGoals, setPersonalGoals] = useState([]);
  const [coach, setCoach] = useState("");
  const [orDays, setOrDays] = useState("");
  const [treatmentHours, setTreatmentHours] = useState("");
  const [clinicDays, setClinicDays] = useState("");
  const [postProc, setPostProc] = useState("");
  const [notes, setNotes] = useState("");
  const [values, setValues] = useState([]);

  const isPlastic = specialty === "Plastic Surgery & Cosmetic Surgery";
  const isMedSpa = specialty === "Medical Spa";
  const isDerm = specialty === "Dermatology — Cosmetic & Medical";

  const prog = Math.round((step / 8) * 100);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedProfile(JSON.parse(saved));
    } catch {}
  }, []);

  const tog = (arr, set, val, max) => {
    if (arr.includes(val)) set(arr.filter(v => v !== val));
    else if (!max || arr.length < max) set([...arr, val]);
  };

  const loadSavedProfile = () => {
    const p = savedProfile;
    setSpecialty(p.specialty || ""); setMultiLoc(p.multiLoc || ""); setName(p.name || "");
    setZip(p.zip || ""); setRole(p.role || ""); setMarket(p.market || "");
    setAge(p.age || ""); setNumProviders(p.numProviders || ""); setOtherProviders(p.otherProviders || []);
    setStaff(p.staff || ""); setCoordinator(p.coordinator || ""); setFollowup(p.followup || "");
    setConsultVol(p.consultVol || ""); setProcedures(p.procedures || ""); setInjectables(p.injectables || "");
    setLaser(p.laser || ""); setCaseValue(p.caseValue || ""); setAvgTicket(p.avgTicket || "");
    setSources(p.sources || []); setAds(p.ads || ""); setReviews(p.reviews || "");
    setChallenges(p.challenges || []); setPersonalGoals(p.personalGoals || []); setCoach(p.coach || "");
    setOrDays(p.orDays || ""); setTreatmentHours(p.treatmentHours || ""); setClinicDays(p.clinicDays || "");
    setPostProc(p.postProc || ""); setNotes(p.notes || ""); setValues(p.values || []);
    setProfile(p);
    const greet = p.name ? `Welcome back, ${p.name}.` : "Welcome back.";
    setMsgs([{ role: "assistant", text: `💡 The Insight\n\n${greet} I have your practice profile saved and ready.\n\n🔍 What This Means For You\n\nI remember everything you shared — your specialty, your team, your goals. We can pick up right where we left off.\n\n✅ Your Next Move\n\n• Ask me anything about your practice\n• Use the topic buttons on the left to jump into a specific area\n• Or tell me what has changed since we last spoke` }]);
    setHist([]); setScreen("advisor");
  };

  const submit = () => {
    const p = { specialty, multiLoc, name, zip, role, market, age, numProviders, otherProviders, staff, coordinator, followup, consultVol, procedures, injectables, laser, caseValue, avgTicket, sources, ads, reviews, challenges, personalGoals, coach, orDays, treatmentHours, clinicDays, postProc, notes, values };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
    setProfile(p);
    const greet = p.name ? `Welcome, ${p.name}.` : "Welcome.";
    const ch = challenges[0] ? `I can see your focus is on ${challenges[0].toLowerCase()}` : "I have reviewed everything you shared";
    setMsgs([{ role: "assistant", text: `💡 The Insight\n\n${greet} Your practice profile is ready.\n\n🔍 What This Means For You\n\n${ch} — and I am already thinking about the highest-leverage moves for your practice specifically.\n\n✅ Your Next Move\n\n• Ask me anything — conversion, retention, team, marketing, operations, pricing\n• Use the topic buttons on the left to jump into a specific area\n• Or just tell me what is keeping you up at night` }]);
    setHist([]); setScreen("advisor");
  };

  const send = async () => {
    if (!inp.trim() || busy) return;
    const msg = inp.trim();
    setInp("");
    const newMsgs = [...msgs, { role: "user", text: msg }];
    setMsgs(newMsgs);
    const newHist = [...hist, { role: "user", content: msg }];
    setHist(newHist);
    setBusy(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYS(profile),
          messages: newHist
        })
      });
      const d = await r.json();
      const reply = d.content?.[0]?.text || "Something went wrong. Please try again.";
      setMsgs([...newMsgs, { role: "assistant", text: reply }]);
      setHist([...newHist, { role: "assistant", content: reply }]);
    } catch {
      setMsgs([...newMsgs, { role: "assistant", text: "Something went wrong. Please try again." }]);
    }
    setBusy(false);
  };

  const iStyle = { width: "100%", padding: "10px 12px", border: `1px solid ${C.borderD}`, background: C.white, fontFamily: "inherit", fontSize: 13, color: C.text, borderRadius: 2, outline: "none", boxSizing: "border-box" };

  if (screen === "welcome") return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Introducing</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: C.char, lineHeight: 1.15, marginBottom: 8, maxWidth: 580 }}>
          The advisor your practice<br /><em style={{ color: C.goldD }}>always needed.</em>
        </h1>
        <div style={{ width: 40, height: 1, background: C.gold, margin: "22px auto" }} />
        <p style={{ fontSize: 14, color: C.textL, maxWidth: 460, lineHeight: 1.8, marginBottom: 38, fontWeight: 300 }}>
          Built on years of real-world expertise inside aesthetic medical practices. Personalized to your team, your patients, and your goals.
        </p>
        {savedProfile && (
          <div style={{ marginBottom: 16, padding: "16px 24px", background: C.warm, border: `1px solid ${C.border}`, borderRadius: 2, maxWidth: 400, width: "100%" }}>
            <div style={{ fontSize: 12, color: C.textL, marginBottom: 10 }}>Welcome back — your profile is saved.</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: C.char, marginBottom: 12 }}>{savedProfile.name || "Your Practice"}</div>
            <button onClick={loadSavedProfile} style={{ background: C.goldD, color: "white", border: "none", padding: "10px 24px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, width: "100%", marginBottom: 8 }}>
              Continue as {savedProfile.name || "Your Practice"} →
            </button>
            <button onClick={() => setSavedProfile(null)} style={{ background: "none", color: C.textLL, border: "none", fontFamily: "inherit", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
              Start fresh with a new profile
            </button>
          </div>
        )}
        {!savedProfile && (
          <>
            <button onClick={() => setScreen("intake")} style={{ background: C.char, color: C.goldL, border: "none", padding: "13px 42px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>
              Begin Your Practice Profile
            </button>
            <p style={{ marginTop: 12, fontSize: 11, color: C.textLL }}>Takes about 10 minutes · Your answers shape every response</p>
          </>
        )}
      </div>
    </div>
  );

  if (screen === "advisor") return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui,sans-serif" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <aside style={{ width: 220, background: C.char, display: "flex", flexDirection: "column", padding: "16px 0", flexShrink: 0, overflowY: "auto" }}>
          <div style={{ padding: "0 14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textLL, marginBottom: 3 }}>Your Practice</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: C.goldL, lineHeight: 1.3 }}>{profile.name || "Your Practice"}</div>
            <div style={{ fontSize: 10, color: C.textLL, marginTop: 2 }}>{profile.specialty}</div>
          </div>
          <div style={{ padding: "14px 14px 8px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textLL, marginBottom: 7 }}>Ask About</div>
            {[
              ["Consult Conversion", "consultation conversion and why patients are not booking"],
              ["Non-Surgical Revenue", "growing non-surgical revenue"],
              ["Patient Retention", "patient retention and lifetime value"],
              ["Patient Experience", "the full patient experience from first call through post-procedure"],
              ["Staff & Culture", "staff performance, team culture, and leadership"],
              ["Marketing & Leads", "marketing strategy and lead generation"],
              ["Pricing Strategy", "pricing strategy and whether I am leaving money on the table"],
              ["Operations", "operations and workflow efficiency"],
              ["Key Metrics", "which metrics I should be tracking and what they mean"],
              ["Compensation", "compensation planning for my team"],
            ].map(([l, t]) => (
              <button key={l} onClick={() => setInp(`What advice do you have for me on ${t}?`)}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "6px 7px", fontSize: 11, color: "rgba(255,255,255,0.45)", cursor: "pointer", borderRadius: 3, marginBottom: 1 }}
                onMouseEnter={e => { e.target.style.background = "rgba(201,169,110,0.12)"; e.target.style.color = C.goldL; }}
                onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.45)"; }}
              >{l}</button>
            ))}
          </div>
          <div style={{ marginTop: "auto", padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => setScreen("intake")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.35)", padding: "6px 10px", fontFamily: "inherit", fontSize: 10, cursor: "pointer", borderRadius: 2, width: "100%", marginBottom: 8 }}>Update My Profile</button>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", lineHeight: 1.6 }}>Business strategy only — not clinical, legal, financial, or HR advice.</p>
          </div>
        </aside>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.cream }}>
          <div style={{ padding: "11px 20px", background: C.warm, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: C.char }}>Your Advisor</div>
            <div style={{ fontSize: 11, color: C.textLL }}>Personalized to your practice profile</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignSelf: m.role === "user" ? "flex-end" : "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row", maxWidth: "88%" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, fontSize: 10, fontWeight: 600, background: m.role === "assistant" ? C.char : C.goldL, color: m.role === "assistant" ? C.gold : C.char, fontFamily: m.role === "assistant" ? "Georgia,serif" : "inherit" }}>
                  {m.role === "assistant" ? "A" : "Y"}
                </div>
                <div style={{ padding: "11px 14px", borderRadius: 2, background: m.role === "user" ? C.char : C.white, border: m.role === "user" ? "none" : `1px solid ${C.border}`, color: m.role === "user" ? "rgba(255,255,255,0.88)" : C.text, maxWidth: 580 }}>
                  {m.role === "assistant" ? formatMsg(m.text) : <p style={{ margin: 0, lineHeight: 1.6, fontSize: 13 }}>{m.text}</p>}
                </div>
              </div>
            ))}
            {busy && (
              <div style={{ display: "flex", gap: 8, alignSelf: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.char, display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontFamily: "Georgia,serif", fontSize: 10 }}>A</div>
                <div style={{ padding: "11px 14px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, fontSize: 12, color: C.textLL, fontStyle: "italic" }}>Your advisor is thinking…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div style={{ padding: "11px 18px 14px", background: C.warm, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: C.white, border: `1px solid ${C.borderD}`, borderRadius: 2, padding: "7px 10px" }}>
              <textarea value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask your advisor anything about your practice…" rows={1}
                style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: 13, color: C.text, resize: "none", minHeight: 20, maxHeight: 80, lineHeight: 1.5, outline: "none" }} />
              <button onClick={send} disabled={busy} style={{ background: busy ? C.border : C.char, border: "none", color: C.gold, width: 28, height: 28, borderRadius: 2, cursor: busy ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </div>
            <div style={{ fontSize: 10, color: C.textLL, marginTop: 5, textAlign: "center" }}>Business strategy only · Not a substitute for clinical, legal, financial, or HR advice</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "system-ui,sans-serif" }}>
      <Header />
      <div style={{ background: C.warm, borderBottom: `1px solid ${C.border}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textLL, whiteSpace: "nowrap" }}>Your Profile</span>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2 }}><div style={{ height: "100%", width: `${prog}%`, background: C.gold, borderRadius: 2, transition: "width 0.4s" }} /></div>
        <span style={{ fontSize: 11, color: C.goldD, fontWeight: 500, whiteSpace: "nowrap" }}>{prog}%</span>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 18px 70px" }}>

        {step === 0 && <div>
          <Head num="To Get Started" title="Tell us about your practice" desc="This shapes everything that follows." />
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>What best describes your practice?</div>
            {["Plastic Surgery & Cosmetic Surgery", "Medical Spa", "Dermatology — Cosmetic & Medical"].map(v => <Radio key={v} name="sp" value={v} label={v} checked={specialty === v} onChange={() => setSpecialty(v)} />)}
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Do you operate more than one location?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["No", "No, single location"], ["Yes", "Yes, multiple locations"]].map(([v, l]) => <Radio key={v} name="ml" value={v} label={l} checked={multiLoc === v} onChange={() => setMultiLoc(v)} />)}
            </div>
          </div>
          <NavBtns back={false} onNext={() => setStep(1)} />
        </div>}

        {step === 1 && <div>
          <Head num="Section 1 of 8" title="Practice Identity" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 6 }}>Practice Name</div><input style={iStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Clarity Aesthetics" /></div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 6 }}>Zip Code</div><input style={iStyle} value={zip} onChange={e => setZip(e.target.value)} placeholder="e.g. 90210" maxLength={5} /></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Your Primary Role</div>
            {["Dermatologist Owner", "Surgeon Owner", "Physician (Other) Owner", "RN / NP / PA Owner", "Business Owner", "Practice Manager", "Other"].map(v => <Radio key={v} name="role" value={v} label={v} checked={role === v} onChange={() => setRole(v)} />)}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Your market?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {["Urban", "Suburban", "Rural", "Mixed"].map(v => <Radio key={v} name="mkt" value={v} label={v} checked={market === v} onChange={() => setMarket(v)} />)}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 6 }}>Practice age?</div><Sel value={age} onChange={setAge} opts={["Under 1 year", "1–3 years", "3–10 years", "10+ years"]} /></div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 6 }}>Total number of providers?</div><Sel value={numProviders} onChange={setNumProviders} opts={["1", "2–3", "4–6", "7–10", "10+"]} /></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Other providers in the practice? <span style={{ fontWeight: 300, color: C.textLL, fontSize: 11 }}>(select all that apply)</span></div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {["Physician", "PA", "NP", "RN", "Esthetician / Aesthetician", "Other"].map(v => <Chip key={v} value={v} label={v} checked={otherProviders.includes(v)} onChange={() => tog(otherProviders, setOtherProviders, v)} />)}
            </div>
          </div>
          <NavBtns onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </div>}

        {step === 2 && <div>
          <Head num="Section 2 of 8" title="Team & Operations" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Patient-facing staff total?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {["1–3", "4–10", "11–20", "20+"].map(v => <Radio key={v} name="stf" value={v} label={v} checked={staff === v} onChange={() => setStaff(v)} />)}
            </div>
          </div>
          {isPlastic && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 5 }}>Do you have someone dedicated to walking patients through options and closing bookings?</div>
            <p style={{ fontSize: 11, color: C.textLL, marginBottom: 8, fontStyle: "italic" }}>Patient Coordinator, Treatment Coordinator, Patient Advocate, or Aesthetic Consultant</p>
            {[["primary", "Yes — that is their primary job"], ["manyHats", "We have someone, but it is one of many hats"], ["surgeonHandles", "No — the surgeon or nurse handles this"], ["feelGap", "No — and we feel the gap"]].map(([v, l]) => <Radio key={v} name="coord" value={v} label={l} checked={coordinator === v} onChange={() => setCoordinator(v)} />)}
          </div>}
          {(isMedSpa || isDerm) && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 5 }}>Do you have someone dedicated to guiding patients toward booking treatment?</div>
            <p style={{ fontSize: 11, color: C.textLL, marginBottom: 8, fontStyle: "italic" }}>Treatment Coordinator, Patient Advocate, Front Desk Lead, or similar role</p>
            {[["primary", "Yes — that is their primary job"], ["manyHats", "We have someone, but it is one of many hats"], ["providerHandles", "No — the provider handles this"], ["feelGap", "No — and we feel the gap"]].map(([v, l]) => <Radio key={v} name="coord" value={v} label={l} checked={coordinator === v} onChange={() => setCoordinator(v)} />)}
          </div>}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>When a patient consults but does not book, what typically happens next?</div>
            {[["structured", "We have a structured follow-up system"], ["inconsistent", "Someone follows up, but it is inconsistent"], ["notMuch", "Honestly, not much happens"], ["varies", "We are not sure — it varies"]].map(([v, l]) => <Radio key={v} name="fu" value={v} label={l} checked={followup === v} onChange={() => setFollowup(v)} />)}
          </div>
          <NavBtns onBack={() => setStep(1)} onNext={() => setStep(3)} />
        </div>}

        {step === 3 && <div>
          <Head num="Section 3 of 8" title="Patients & Revenue" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Monthly new patient consultations?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {["Under 20", "20–50", "50–100", "100+"].map(v => <Radio key={v} name="cv" value={v} label={v} checked={consultVol === v} onChange={() => setConsultVol(v)} />)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 6 }}>Top 3 procedures or services by volume</div>
            <input style={iStyle} value={procedures} onChange={e => setProcedures(e.target.value)} placeholder={isPlastic ? "e.g. Rhinoplasty, Breast Augmentation, Botox" : isMedSpa ? "e.g. Botox, Filler, Laser" : "e.g. Botox, Filler, Chemical Peels"} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Do you offer injectables?</div>
            {[["significant", "Yes — a significant part of our practice"], ["minimal", "Yes, but it is minimal"], ["wantToGrow", "No, but we want to grow it"], ["no", "No"]].map(([v, l]) => <Radio key={v} name="inj" value={v} label={l} checked={injectables === v} onChange={() => setInjectables(v)} />)}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Do you offer laser or energy-based treatments?</div>
            {[["significant", "Yes — a significant part of our practice"], ["minimal", "Yes, but it is minimal"], ["wantToGrow", "No, but we want to grow it"], ["no", "No"]].map(([v, l]) => <Radio key={v} name="las" value={v} label={l} checked={laser === v} onChange={() => setLaser(v)} />)}
          </div>
          {isPlastic && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Average surgical case value?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {["$3K–$8K", "$8K–$15K", "$15K–$25K", "$25K+", "It varies widely"].map(v => <Radio key={v} name="cv2" value={v} label={v} checked={caseValue === v} onChange={() => setCaseValue(v)} />)}
            </div>
          </div>}
          {(isMedSpa || isDerm) && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>What is your average patient spend per visit?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {["Under $200", "$200–$500", "$500–$1,000", "$1,000–$2,500", "$2,500+", "Not sure"].map(v => <Radio key={v} name="ticket" value={v} label={v} checked={avgTicket === v} onChange={() => setAvgTicket(v)} />)}
            </div>
          </div>}
          <NavBtns onBack={() => setStep(2)} onNext={() => setStep(4)} />
        </div>}

        {step === 4 && <div>
          <Head num="Section 4 of 8" title="Marketing & Lead Generation" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>How do most new patients find you? <span style={{ fontWeight: 300, color: C.textLL, fontSize: 11 }}>(top 2)</span></div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {["Word of mouth", "Google search", "Instagram / Social", "Doctor referral", "RealSelf / Healthgrades", "Paid ads", "Honestly do not know"].map(v => <Chip key={v} value={v} label={v} checked={sources.includes(v)} onChange={() => tog(sources, setSources, v, 2)} />)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Do you run paid advertising?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {["Yes — Google", "Yes — Meta/Instagram", "Both", "No", "Not sure who manages it"].map(v => <Radio key={v} name="ads" value={v} label={v} checked={ads === v} onChange={() => setAds(v)} />)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Do you collect and use patient reviews?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {["Yes, actively", "Sometimes", "Not really"].map(v => <Radio key={v} name="rev" value={v} label={v} checked={reviews === v} onChange={() => setReviews(v)} />)}
            </div>
          </div>
          <NavBtns onBack={() => setStep(3)} onNext={() => setStep(5)} />
        </div>}

        {step === 5 && <div>
          <Head num="Section 5 of 8" title="Goals & Priorities" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Biggest growth challenge right now? <span style={{ fontWeight: 300, color: C.textLL, fontSize: 11 }}>(up to 2)</span></div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {["Getting more new leads", "Converting consults to bookings", "Patient retention", "Growing non-surgical revenue", "Building referrals", "Staff training", "Pricing strategy", "Standing out from competition"].map(v => <Chip key={v} value={v} label={v} checked={challenges.includes(v)} onChange={() => tog(challenges, setChallenges, v, 2)} />)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Beyond growth, what matters most right now? <span style={{ fontWeight: 300, color: C.textLL, fontSize: 11 }}>(up to 2)</span></div>
            {["Performing more procedures I love", "Working fewer hours without hurting revenue", "Reducing personal stress and burnout", "Less staff conflict and turnover", "Building something I can eventually sell or step back from", "Feeling more in control of the business side", "I just want the practice to run more smoothly"].map(v => <Radio key={v} type="checkbox" name="pg" value={v} label={v} checked={personalGoals.includes(v)} onChange={() => tog(personalGoals, setPersonalGoals, v, 2)} />)}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Have you worked with a practice consultant before?</div>
            {[["helpful", "Yes — and it was helpful"], ["notWorth", "Yes — but it was not worth it"], ["open", "No — but open to guidance"], ["skeptical", "No — and honestly a little skeptical"]].map(([v, l]) => <Radio key={v} name="cch" value={v} label={l} checked={coach === v} onChange={() => setCoach(v)} />)}
          </div>
          <NavBtns onBack={() => setStep(4)} onNext={() => setStep(6)} />
        </div>}

        {step === 6 && <div>
          <Head num="Section 6 of 8" title="Capacity & Workload" />
          {isPlastic && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>OR days per week?</div>
            {["None", "1 day", "2 days", "3 days", "4+ days"].map(v => <Radio key={v} name="ord" value={v} label={v} checked={orDays === v} onChange={() => setOrDays(v)} />)}
          </div>}
          {isDerm && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Procedure / OR days per week?</div>
            {["None", "1 day", "2 days", "3 days", "4+ days"].map(v => <Radio key={v} name="ord" value={v} label={v} checked={orDays === v} onChange={() => setOrDays(v)} />)}
          </div>}
          {isMedSpa && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Roughly how many total provider treatment hours per week?</div>
            <p style={{ fontSize: 11, color: C.textLL, marginBottom: 8, fontStyle: "italic" }}>Estimate is fine — add up all providers across all days</p>
            {["Under 20 hours", "20–40 hours", "40–80 hours", "80–120 hours", "120+ hours"].map(v => <Radio key={v} name="th" value={v} label={v} checked={treatmentHours === v} onChange={() => setTreatmentHours(v)} />)}
          </div>}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Clinic / consultation days per week?</div>
            {["1 day", "2 days", "3 days", "4+ days", "Every day"].map(v => <Radio key={v} name="cld" value={v} label={v} checked={clinicDays === v} onChange={() => setClinicDays(v)} />)}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>How does your practice handle post-procedure follow-up?</div>
            {[["structured", "We have a structured protocol"], ["inconsistent", "We follow up, but it is inconsistent"], ["apptOnly", "Mostly at scheduled appointments only"], ["doBetter", "We could definitely do better here"]].map(([v, l]) => <Radio key={v} name="pp" value={v} label={l} checked={postProc === v} onChange={() => setPostProc(v)} />)}
          </div>
          <NavBtns onBack={() => setStep(5)} onNext={() => setStep(7)} />
        </div>}

        {step === 7 && <div>
          <Head num="Section 7 of 8" title="Anything else we should know?" desc="The more you share, the more specific your advisor can be." />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 6 }}>Anything specific you want your advisor to know? <span style={{ fontWeight: 300, color: C.textLL, fontSize: 11 }}>(optional)</span></div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} placeholder="e.g. We recently added a second location, just hired a new coordinator, navigating a specific challenge…" style={{ ...iStyle, resize: "vertical", minHeight: 90, lineHeight: 1.6 }} />
          </div>
          <NavBtns onBack={() => setStep(6)} onNext={() => setStep(8)} />
        </div>}

        {step === 8 && <div>
          <Head num="Section 8 of 8" title="Your Core Values" desc="The practices that get the most from ABA are the ones that help us understand not just their business — but what drives them. Select up to 5." />
          <div style={{ marginBottom: 6 }}>
            {["Integrity", "Excellence", "Empathy", "Education", "Innovation", "Authenticity", "Community", "Balance", "Trust", "Results", "Compassion", "Artistry", "Growth", "Collaboration", "Accountability", "Service", "Wellness", "Leadership", "Transparency", "Family"].map(v => (
              <ValTag key={v} label={v} selected={values.includes(v)} disabled={values.length >= 5} onToggle={() => tog(values, setValues, v, 5)} />
            ))}
          </div>
          <p style={{ fontSize: 11, fontStyle: "italic", color: C.goldD, marginTop: 8, marginBottom: 20 }}>"The more you share, the more your advisor sounds like it was built just for you."</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <button onClick={() => setStep(7)} style={{ background: "none", border: `1px solid ${C.borderD}`, color: C.textL, padding: "9px 22px", fontFamily: "inherit", fontSize: 12, cursor: "pointer", borderRadius: 2 }}>← Back</button>
            <button onClick={submit} style={{ background: C.goldD, border: "none", color: "white", padding: "11px 34px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Meet Your Advisor →</button>
          </div>
        </div>}

      </div>
    </div>
  );
}
