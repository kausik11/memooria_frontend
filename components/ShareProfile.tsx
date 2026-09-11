"use client";

import { useState } from "react";
import { FiShare2 } from "react-icons/fi";

export default function ShareProfile({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const [message, setMessage] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function share() {
    const url = new URL(
      `/creator/${encodeURIComponent(slug)}`,
      window.location.origin,
    ).href;
    setMessage("");
    setManualUrl("");
    setBusy(true);
    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${name} | Memooria`,
            text: `Discover ${name} on Memooria`,
            url,
          });
          return;
        } catch (error) {
          // Closing the system share sheet is not a failure or a request to copy.
          if (error instanceof DOMException && error.name === "AbortError")
            return;
        }
      }
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setMessage("Profile link copied!");
    } catch {
      setManualUrl(url);
      setMessage("Copy this link to share the profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        className="btn btn-outline"
        onClick={share}
        disabled={busy}
      >
        <FiShare2 aria-hidden="true" /> Share profile
      </button>
      <span role="status" className="text-xs text-brand">
        {message}
      </span>
      {manualUrl && (
        <label className="field max-w-full">
          Profile link
          <input
            aria-label="Profile link"
            readOnly
            value={manualUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
