"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError } from "@/services/api";
export default function ReviewForm({ creator }: { creator: string }) {
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setLogin(false);
    const f = e.currentTarget,
      d = new FormData(f);
    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          creator,
          rating: Number(d.get("rating")),
          comment: d.get("comment"),
        }),
      });
      setMessage("Thank you! Your review will appear after moderation.");
      f.reset();
    } catch (e) {
      setLogin(e instanceof ApiError && e.status === 401);
      setMessage(e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="mt-7 grid gap-4 rounded-xl border border-stone-200 p-5"
    >
      <h3 className="mb-0 font-semibold">Share your experience</h3>
      <label className="field">
        Rating
        <select name="rating" defaultValue="5">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Your review
        <textarea name="comment" required minLength={10} maxLength={2000} />
      </label>
      <button className="btn justify-self-start" disabled={busy}>
        Submit review
      </button>
      {message && (
        <p role="status" className="text-sm">
          {message}{" "}
          {login && (
            <Link href="/login" className="text-brand underline">
              Sign in
            </Link>
          )}
        </p>
      )}
    </form>
  );
}
