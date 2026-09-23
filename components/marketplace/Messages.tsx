"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useResource } from "@/hooks/useResource";
import { Upload, FileLink } from "./Fields";
import { State } from "./Workspace";
type Conversation = { _id: string; title: string; context: string; entityId: string };
type Message = { _id: string; text: string; sender: string; createdAt: string; moderated: boolean; attachments?: string[] };
export default function Messages() {
  const conversations = useResource<Conversation[]>("/conversations"); const [selected, setSelected] = useState("");
  return <><p className="muted text-sm">Keep communication inside Memooria. Contact details are masked until the booking reaches its configured unlock stage.</p><State {...conversations} /><div className="grid gap-5 md:grid-cols-[220px_1fr]"><div className="space-y-2">{conversations.data?.map(c => <button className={`block w-full text-left border rounded-lg p-4 text-sm ${selected === c._id ? "bg-purple-50" : "bg-white"}`} key={c._id} onClick={() => setSelected(c._id)}>{c.title}<span className="block muted text-xs mt-2">{c.context}</span></button>)}</div>{selected ? <Thread id={selected} booking={conversations.data?.find(c => c._id === selected && c.context === "BOOKING")?.entityId} /> : <p className="muted p-6">{conversations.data?.length ? "Choose a conversation." : "No conversations yet. Start one from a creator profile, proposal or booking."}</p>}</div></>;
}
function Thread({ id, booking }: { id: string; booking?: string }) {
  const r = useResource<Message[]>(`/conversations/${id}/messages`), [text, setText] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  useEffect(() => { setAttachments([]); setText(""); }, [id]);
  useEffect(() => { const interval = setInterval(() => { void r.reload(); }, 15000); return () => clearInterval(interval); }, [r.reload]);
  return <div className="rounded-xl border bg-white p-5"><State loading={!r.data && r.loading} error={r.error} reload={r.reload} /><div className="max-h-[480px] overflow-auto space-y-4 mb-5" aria-live="polite">{r.data?.map(m => <div className="rounded-lg bg-stone-50 p-4" key={m._id}><p className="whitespace-pre-wrap text-sm">{m.text}</p>{m.attachments?.map(id => <FileLink key={id} id={id} />)}<p className="muted text-xs">{new Date(m.createdAt).toLocaleString()}{m.moderated ? " · Contact details masked" : ""}</p></div>)}</div><form className="space-y-3" onSubmit={async e => { e.preventDefault(); setBusy(true); setError(""); try { await api(`/conversations/${id}/messages`, { method: "POST", body: JSON.stringify({ text, attachments }) }); setText(""); setAttachments([]); await r.reload(); } catch (e) { setError(e instanceof Error ? e.message : "Message failed."); } finally { setBusy(false); } }}><textarea className="input" aria-label="Your message" required maxLength={5000} value={text} onChange={e => setText(e.target.value)} />{booking && <details><summary className="cursor-pointer text-xs text-brand">Attach project files (after confirmation)</summary><Upload purpose="project" contextId={booking} values={attachments} onChange={setAttachments} /></details>}<button className="btn" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>{error && <p role="alert" className="error-box">{error}</p>}</form></div>;
}
