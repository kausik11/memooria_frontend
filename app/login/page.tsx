"use client";
import { useState, type FormEvent } from "react";
import { api } from "@/services/api";
export default function Login() {
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(`/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      window.location.href = "/explore";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="wrap section">
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8">
        <p className="eyebrow">WELCOME TO MEMOORIA</p>
        <h1 className="display text-4xl">
          {register ? "Your next chapter." : "Lovely to see you again."}
        </h1>
        <form onSubmit={submit} className="grid gap-5">
          {register && (
            <label className="field">
              Full name
              <input name="name" required autoComplete="name" />
            </label>
          )}
          <label className="field">
            Email address
            <input type="email" name="email" required autoComplete="email" />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={10}
              maxLength={72}
              autoComplete={register ? "new-password" : "current-password"}
            />
            <span className="muted text-[10px]">At least 10 characters</span>
          </label>
          {error && (
            <p role="alert" className="error-box">
              {error}
            </p>
          )}
          <button className="btn" disabled={busy}>
            {busy ? "Please wait…" : register ? "Create account" : "Log in"}
          </button>
        </form>
        <button
          className="mt-6 text-xs text-brand underline"
          onClick={() => {
            setRegister(!register);
            setError("");
          }}
        >
          {register
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}
