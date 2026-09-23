"use client";
import DemoLogin from "@/components/DemoLogin";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { api } from "@/services/api";
export default function Login() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const user = await api<{ role: string }>("/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
      const next = new URLSearchParams(window.location.search).get("next");
      const target = new URLSearchParams(window.location.search).get("returnTo");
      window.location.href = target && target.startsWith("/") && !target.startsWith("//") && !target.includes("\\") ? target : next === "creator" ? "/join" : next === "user" ? "/register" : user.role === "creator" ? "/creator/dashboard" : "/customer/dashboard";
    } catch (e) { setError(e instanceof Error ? e.message : "Try again."); }
    finally { setBusy(false); }
  }
  return <div className="wrap section"><div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8">
    <p className="eyebrow">WELCOME TO MEMOORIA</p><h1 className="display text-4xl">Lovely to see you again.</h1>
    <form onSubmit={submit} className="grid gap-5">
      <label className="field">Email address<input type="email" name="email" required autoComplete="email" /></label>
      <label className="field">Password<input type="password" name="password" required minLength={1} maxLength={72} autoComplete="current-password" /></label>
      {error && <p role="alert" className="error-box">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Please wait…" : "Log in"}</button>
    </form>
        <DemoLogin />
    <div className="mt-6 flex flex-col gap-3 text-xs text-brand underline"><Link href="/register">New here? Create an account</Link><Link href="/join">Become a creator</Link></div>
  </div></div>;
}
