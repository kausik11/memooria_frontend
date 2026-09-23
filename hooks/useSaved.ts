"use client";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/services/api";
export function useSaved(id: string) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { api<{ _id: string }[]>("/saved").then(rows => setSaved(rows.some(r => r._id === id))).catch(() => {}); }, [id]);
  async function toggle() {
    try { await api(`/saved/${id}`, { method: saved ? "DELETE" : "PUT" }); setSaved(!saved); }
    catch (e) { if (e instanceof ApiError && e.status === 401) window.location.href = "/login"; }
  }
  return { saved, toggle };
}
