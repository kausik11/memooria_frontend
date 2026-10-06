"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Fields, { visible as fieldVisible } from "@/components/marketplace/Fields";
import Loader from "@/components/Loader";
import { api, ApiError } from "@/services/api";
type Value = string | number | boolean | string[];
type Question = { id: string; label: string; type: string; options?: string[]; when?: { id: string; value: string }; help?: string; optional?: boolean; minLength?: number; min?: number; max?: number };
type Config = { services: string[]; questions: Question[] };
export default function Onboarding({ kind }: { kind: "user" | "creator" }) {
  const [answers, setAnswers] = useState<Record<string, Value>>({});
  const [config, setConfig] = useState<Config>();
  const [account, setAccount] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const c = await api<Config>(`/onboarding/questions?kind=${kind}`);
        if (!active) return;
        setConfig(c);
        try {
          const draft = await api<{ answers: Record<string, Value>; submitted: boolean; status: string }>("/onboarding");
          if (!active) return;
          setAccount(true);
          if (kind === "creator") { setAnswers(draft.answers); if (draft.submitted) setDone(draft.status); }
        } catch (e) { if (!(e instanceof ApiError && e.status === 401)) throw e; }
        if (active) setReady(true);
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Unable to load registration."); }
    }
    load();
    return () => { active = false; };
  }, [kind, retry]);
  const service = String(answers.service || "");
  useEffect(() => {
    if (!service || kind !== "creator") return;
    let active = true;
    setConfig(undefined);
    api<Config>(`/onboarding/questions?kind=creator&service=${encodeURIComponent(service)}`).then(c => { if (active) setConfig(c); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [service, kind, retry]);
  const credentials: Question[] = [{ id: "name", label: "What is your full name?", type: "text" }, { id: "email", label: "What is your email address?", type: "email" }, { id: "password", label: "Create a password.", type: "password", minLength: 10, help: "Use 10–72 characters." }];
  const visible = (config?.questions || []).filter(q => fieldVisible(q, answers));
  const sequence = account ? visible : kind === "creator" ? [visible.find(q => q.id === "service"), ...credentials].filter(Boolean) : credentials;
  const q = sequence[step];
  const total = account ? visible.length + 1 : sequence.length;
  const set = (id: string, value: Value) => setAnswers(a => ({ ...a, [id]: value }));
  function clean() { return Object.fromEntries(Object.entries(answers).filter(([key]) => !["password", "email", "name"].includes(key))); }
  async function next(e: FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (q && ["image", "images", "multiselect"].includes(q.type) && (!answers[q.id] || (Array.isArray(answers[q.id]) && !(answers[q.id] as string[]).length))) throw new Error("Please complete this question to continue.");
      if (!account && step === sequence.length - 1) {
        await api("/auth/register", { method: "POST", body: JSON.stringify({ name: answers.name, email: answers.email, password: answers.password }) });
        setAccount(true); setAnswers(clean()); setStep(0);
      } else if (account && !q) {
        const result = await api<{ status?: string }>("/onboarding/submit", { method: "POST", body: JSON.stringify({ kind, answers: clean() }) });
        setDone(result.status || "Complete");
      } else {
        if (account) await api("/onboarding", { method: "PUT", body: JSON.stringify({ kind, answers: clean() }) });
        setStep(s => s + 1);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function upload(files: FileList | null) {
    if (!files || !q) return;
    const selected = Array.from(files);
    const current = q.type === "images" ? (answers[q.id] as string[] || []) : [];
    if (current.length + selected.length > 6) { setError("You can upload up to six work samples."); return; }
    if (selected.some(f => f.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(f.type))) { setError("Choose JPEG, PNG or WebP files under 5 MB each."); return; }
    setBusy(true); setError("");
    const values = [...current];
    try {
      for (const file of selected) {
        const body = new FormData(); body.append("image", file);
        const result = await api<{ value: string }>(`/onboarding/upload/${q.id}`, { method: "POST", body, signal: AbortSignal.timeout(90000) });
        values.push(result.value); set(q.id, q.type === "images" ? [...values] : result.value);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed. Try again."); }
    finally { setBusy(false); }
  }
  if (done) return <div className="space-y-5" role="status"><p className="eyebrow">{kind === "creator" ? "CREATOR APPLICATION" : "WELCOME TO MEMOORIA"}</p><h1 className="display text-4xl">{kind === "creator" ? "Your application is saved." : "You're all set."}</h1><p className="muted">{kind === "creator" ? `Status: ${done}. Our team reviews your details and work before your profile appears publicly.` : "Your interests have been saved. Find the right people for your next occasion."}</p><Link className="btn" href="/explore">Explore Memooria</Link></div>;
  if (!ready || !config) return error ? <div role="alert"><p className="error-box">{error}</p><button className="btn" onClick={() => { setError(""); setRetry(r => r + 1); }}>Try again</button></div> : <Loader label="Loading your questions…" />;
  return <div>
    <p className="eyebrow">{kind === "creator" ? "BECOME A CREATOR" : "CREATE YOUR ACCOUNT"}</p>
    <div className="mb-7"><div className="mb-2 flex justify-between text-xs muted"><span>{account ? "Your details" : "Create your login"}</span><span>Step {step + 1} of {total}</span></div><progress className="h-2 w-full accent-[#a65d43]" max={total} value={step + 1} /></div>
    <form onSubmit={next} className="space-y-6">
      <div key={q?.id || "review"}>
        <h1 className="display mb-5 text-3xl" id="question">{q?.label || "Review your details."}</h1>
        {q?.help && <p className="muted mb-4 text-sm">{q.help}</p>}
        {q ? <div className="field">
          {(!["text", "textarea", "email", "password", "tel", "url", "number", "select", "service", "multiselect", "checkbox", "image", "images"].includes(q.type) || (["image", "images"].includes(q.type) && !["profileImage", "workSamples", "idCard"].includes(q.id))) ? <Fields fields={[q]} values={answers} onChange={set} /> : ["select", "service"].includes(q.type) ? <select autoFocus aria-labelledby="question" required value={String(answers[q.id] || "")} onChange={e => set(q.id, e.target.value)}><option value="">Choose an option</option>{(q.type === "service" ? config.services : q.options || []).map(o => <option key={o}>{o}</option>)}</select>
          : q.type === "multiselect" ? <div className="grid gap-3">{(q.options || config.services).map(o => <label key={o} className="flex gap-3 items-center rounded-lg border border-stone-200 p-3"><input type="checkbox" checked={(answers[q.id] as string[] || []).includes(o)} onChange={e => set(q.id, e.target.checked ? [...(answers[q.id] as string[] || []), o] : (answers[q.id] as string[] || []).filter(v => v !== o))} />{o}</label>)}</div>
          : q.type === "checkbox" ? <label className="flex gap-3"><input type="checkbox" required checked={answers[q.id] === true} onChange={e => set(q.id, e.target.checked)} />I agree</label>
          : ["image", "images"].includes(q.type) ? <><input aria-labelledby="question" type="file" accept="image/jpeg,image/png,image/webp" multiple={q.type === "images"} disabled={busy} onChange={e => { void upload(e.target.files); e.target.value = ""; }} /><p className="muted text-xs">JPEG, PNG or WebP, up to 5 MB per image.</p>{answers[q.id] && <div className="flex flex-wrap gap-3">{(Array.isArray(answers[q.id]) ? answers[q.id] as string[] : [String(answers[q.id])]).map((v, i) => <div key={v} className="rounded-lg border p-2">{q.id === "idCard" ? <span>Identity document uploaded</span> : <img src={v} alt={`Uploaded image ${i + 1}`} className="h-24 w-24 rounded object-cover" />}<button type="button" className="block text-xs underline mt-2" disabled={busy} onClick={() => set(q.id, q.type === "images" ? (answers[q.id] as string[]).filter(x => x !== v) : "")}>Remove</button></div>)}</div>}</>
          : q.type === "textarea" ? <textarea autoFocus aria-labelledby="question" required={!q.optional} minLength={q.minLength} maxLength={5000} rows={5} value={String(answers[q.id] ?? "")} onChange={e => set(q.id, e.target.value)} />
          : <input autoFocus aria-labelledby="question" type={q.type} required={!q.optional} minLength={q.minLength} maxLength={q.type === "password" ? 72 : 500} min={q.min ?? 0} max={q.max} step={q.id === "perDayRate" ? "0.01" : "1"} autoComplete={q.type === "password" ? "new-password" : q.id === "name" ? "name" : q.type === "email" ? "email" : "off"} value={String(answers[q.id] ?? "")} onChange={e => set(q.id, q.type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value)} />}
        </div> : <div className="space-y-4">{visible.map((item, index) => <div className="border-b border-stone-100 pb-3" key={item.id}><div className="flex justify-between gap-4"><p className="text-sm font-medium">{item.label}</p><button type="button" className="text-xs text-brand underline" onClick={() => setStep(index)}>Edit</button></div><p className="muted text-sm break-words">{["image", "images"].includes(item.type) ? `${Array.isArray(answers[item.id]) ? (answers[item.id] as string[]).length : answers[item.id] ? 1 : 0} image(s) uploaded` : Array.isArray(answers[item.id]) ? (answers[item.id] as string[]).join(", ") : String(answers[item.id] ?? "Not provided")}</p></div>)}</div>}
      </div>
      {error && <p role="alert" className="error-box">{error}</p>}
      {!config.services.length && <p className="error-box">No services are available yet. Please try again later.</p>}
      <div className="flex gap-3"><button type="button" className="btn btn-outline" disabled={step === 0 || busy} onClick={() => { setError(""); setStep(s => s - 1); }}>Back</button><button className="btn flex-1" disabled={busy || (!config.services.length && ["service", "multiselect"].includes(q?.type || ""))}>{busy ? "Saving…" : !q ? kind === "creator" ? "Submit application" : "Finish registration" : !account && step === sequence.length - 1 ? "Create account & continue" : "Continue"}</button></div>
      {!account && <p className="text-sm muted">Already registered? <Link className="text-brand underline" href={kind === "creator" ? "/login?next=creator" : "/login?next=user"}>Log in to continue</Link></p>}
      {account && kind === "creator" && <p className="text-xs muted">Your answers save when you continue. Return here after signing in to finish your application.</p>}
    </form>
  </div>;
}
