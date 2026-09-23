"use client";
import { useState } from "react";
import { useResource } from "@/hooks/useResource";
export default function EventDiscovery() {
  const { data, error } = useResource<{ title: string; slug: string; services: string[] }[]>("/events");
  const [event, setEvent] = useState(""), [next, setNext] = useState(false);
  const selected = data?.find(e => e.title === event);
  return <form action="/explore" className="relative z-10 rounded-xl border bg-white p-6 shadow-sm"><div className="grid gap-4 sm:grid-cols-4"><label className="field">What are you planning?<select name="event" required value={event} onChange={e => { setEvent(e.target.value); setNext(false); }}><option value="">Choose your event</option>{data?.map(e => <option key={e.slug}>{e.title}</option>)}</select></label><label className="field">Where?<input name="location" required placeholder="Your city" /></label><label className="field">When?<input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label>{next ? <button className="btn self-end">Find creators</button> : <button type="button" className="btn self-end" disabled={!event} onClick={() => setNext(true)}>Choose services</button>}</div>{next && <fieldset className="mt-5"><legend className="font-semibold text-sm mb-3">What services do you need?</legend><div className="flex flex-wrap gap-4">{selected?.services.map(s => <label className="flex gap-2 items-center text-sm" key={s}><input type="checkbox" name="categories" value={s} />{s}</label>)}</div><p className="muted text-xs mt-3">Select multiple services or leave them empty to browse all matches.</p></fieldset>}{error && <p className="error-box" role="alert">{error}</p>}</form>;
}
