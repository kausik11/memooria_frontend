"use client";
import { useState, type FormEvent } from "react";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { api } from "@/services/api";
export default function InquiryForm({
  creator,
  service,
  dates,
}: {
  creator?: string;
  service?: string;
  dates?: string[];
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      await api("/inquiry", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          ...(creator && { creator }),
          ...(service && { service }),
        }),
      });
      setDone(true);
      form.reset();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="success-box" role="status">
        <FiCheckCircle size={26} className="mb-3" />
        <b>Your inquiry is on its way.</b>
        <p className="mt-2 text-sm">
          Our team will get in touch using the details you shared. Your event is
          not booked until confirmed with the creator.
        </p>
        <button className="underline" onClick={() => setDone(false)}>
          Send another inquiry
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          Your name
          <input
            name="name"
            placeholder="Full name"
            required
            maxLength={100}
            autoComplete="name"
          />
        </label>
        <label className="field">
          Phone number
          <input
            name="phone"
            type="tel"
            placeholder="+91"
            required
            minLength={7}
            maxLength={30}
            autoComplete="tel"
          />
        </label>
      </div>
      <label className="field">
        Email address
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </label>
      {creator && <AvailabilityCalendar dates={dates || []} />}
      <label className="field">
        Tell us about your moment
        <textarea
          name="message"
          placeholder="A little about your event, your vision, and what you need…"
          required
          minLength={10}
          maxLength={5000}
        />
      </label>
      {status && (
        <p role="alert" className="error-box text-xs">
          {status}
        </p>
      )}
      <button disabled={busy} className="btn">
        {busy ? "Sending…" : "Send inquiry"} <FiArrowUpRight />
      </button>
      <p className="muted mb-0 text-center text-[10px]">
        No commitment. Just the start of something beautiful.
      </p>
    </form>
  );
}
