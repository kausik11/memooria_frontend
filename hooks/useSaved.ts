"use client";
import { useEffect, useState } from "react";
export function useSaved(id: string) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      setSaved(
        JSON.parse(localStorage.getItem("memooria-saved") || "[]").includes(id),
      );
    } catch {}
  }, [id]);
  function toggle() {
    try {
      const values: string[] = JSON.parse(
        localStorage.getItem("memooria-saved") || "[]",
      );
      localStorage.setItem(
        "memooria-saved",
        JSON.stringify(
          saved
            ? values.filter((v) => v !== id)
            : [...new Set([...values, id])],
        ),
      );
      setSaved(!saved);
    } catch {}
  }
  return { saved, toggle };
}
