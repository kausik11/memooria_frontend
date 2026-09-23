"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
export function useResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null), [error, setError] = useState(""), [loading, setLoading] = useState(true);
  const reload = useCallback(async () => { setLoading(true); try { setData(await api<T>(path)); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load."); } finally { setLoading(false); } }, [path]);
  useEffect(() => { void reload(); }, [reload]); return { data, error, loading, reload };
}
