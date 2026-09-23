"use client";
import { useState } from "react";
import { api } from "@/services/api";
export default function AskQuestion({ creator }: { creator: string }) { const [error, setError] = useState(""); return <><button className="btn btn-outline w-full mt-3" onClick={async () => { try { await api("/conversations", { method: "POST", body: JSON.stringify({ context: "GENERAL_INQUIRY", entityId: creator }) }); window.location.href = "/customer/messages"; } catch (e) { setError(e instanceof Error ? e.message : "Please sign in to ask a question."); } }}>Ask a question</button>{error && <p className="error-box" role="alert">{error}</p>}</>; }
