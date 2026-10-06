"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { FiSliders, FiChevronDown, FiArrowUpRight, FiMapPin, FiCalendar, FiClock, FiBriefcase, FiTrendingUp, FiLayers, FiCheckCircle } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import { useResource } from "@/hooks/useResource";
import { money } from "@/services/api";
import { State, type Row } from "./Workspace";

const PAGE_SIZE = 4;

export default function Opportunities() {
  const reducedMotion = useReducedMotion();
  const r = useResource<Row[]>("/requirements?mode=opportunities");
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState("");
  const [city, setCity] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const events = useMemo(
    () => [...new Set((r.data || []).map((d) => d.event).filter(Boolean))].sort(),
    [r.data],
  );

  const filtered = useMemo(() => {
    let rows = r.data || [];
    if (eventType) rows = rows.filter((d) => d.event === eventType);
    if (city) rows = rows.filter((d) => d.city?.toLowerCase().includes(city.toLowerCase()));
    if (minBudget) rows = rows.filter((d) => (d.budgetMax ?? 0) >= Number(minBudget));
    if (maxBudget) rows = rows.filter((d) => (d.budgetMin ?? 0) <= Number(maxBudget));
    if (sort === "budget") rows = [...rows].sort((a, b) => (b.budgetMax ?? 0) - (a.budgetMax ?? 0));
    else if (sort === "deadline") rows = [...rows].sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""));
    return rows;
  }, [r.data, eventType, city, minBudget, maxBudget, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = [eventType, city, minBudget, maxBudget].filter(Boolean).length;
  const rows = r.data || [];
  const highestBudget = Math.max(0, ...rows.map((row) => row.budgetMax ?? row.budgetMin ?? 0));
  const cities = new Set(rows.map((row) => row.city).filter(Boolean)).size;
  function displayDate(value?: string) {
    if (!value) return "To be confirmed";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  }

  function updateFilter(setter: (v: string) => void) {
    return (value: string) => {
      setter(value);
      setPage(1);
    };
  }
  const setEventTypeAndReset = updateFilter(setEventType);
  const setCityAndReset = updateFilter(setCity);
  const setMinBudgetAndReset = updateFilter(setMinBudget);
  const setMaxBudgetAndReset = updateFilter(setMaxBudget);

  return (
    <div className="opportunities-page">
      <section className="opportunities-hero">
        <div className="opportunities-hero-copy">
          <span className="opportunities-kicker"><FiBriefcase /> YOUR NEXT CREATIVE CHAPTER</span>
          <h1 className="display">Great moments.<br /><em>Even greater possibilities.</em></h1>
          <p>Discover requests from people planning something special. Find your fit, share your vision, and make it unforgettable.</p>
          <Link href="/creator/proposals" className="opportunities-hero-link">Your proposals <FiArrowUpRight /></Link>
        </div>
        <div className="opportunities-hero-art" aria-hidden="true"><div className="opportunities-art-orbit" /><FiBriefcase /><span>MAKE YOUR MARK</span></div>
      </section>
      <div className="opportunities-stats">
        {[
          { icon: FiBriefcase, label: "Open opportunities", value: rows.length, copy: "Your next project starts here" },
          { icon: FiTrendingUp, label: "Highest listed budget", value: highestBudget ? money(highestBudget) : "—", copy: "Explore what’s possible" },
          { icon: FiMapPin, label: "Cities to discover", value: cities, copy: "Create connections near and far" },
        ].map(({ icon: Icon, label, value, copy }) => <div className="opportunities-stat" key={label}><span className="opportunities-stat-icon"><Icon /></span><div><p>{label}</p><strong>{r.loading || r.error ? "—" : value}</strong><small>{copy}</small></div></div>)}
      </div>
      <State {...r} />
      <div className="opportunities-toolbar">
        <div><p className="eyebrow mb-2">CURATED POSSIBILITIES</p><h2 className="display mb-1 text-3xl">Find your next project</h2><p className="muted mb-0 text-xs">Explore requests by event, location, and budget.</p></div>
        <button
          type="button"
          className="btn btn-outline !py-3"
          aria-expanded={open}
          aria-controls="opportunity-filters"
          onClick={() => setOpen((o) => !o)}
        >
          <FiSliders size={15} />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} size={15} />
        </button>
      </div>
        {open && (
          <div id="opportunity-filters" className="mt-4 flex flex-wrap items-end gap-4 rounded-xl border border-stone-200 bg-white p-5">
            <label className="field">
              Event type
              <select value={eventType} onChange={(e) => setEventTypeAndReset(e.target.value)}>
                <option value="">All events</option>
                {events.map((ev) => (
                  <option key={ev}>{ev}</option>
                ))}
              </select>
            </label>
            <label className="field">
              City
              <input value={city} onChange={(e) => setCityAndReset(e.target.value)} placeholder="Any city" />
            </label>
            <label className="field">
              Min budget (₹)
              <input
                className="!w-32"
                type="number"
                min="0"
                value={minBudget}
                onChange={(e) => setMinBudgetAndReset(e.target.value)}
                placeholder="Any"
              />
            </label>
            <label className="field">
              Max budget (₹)
              <input
                className="!w-32"
                type="number"
                min="0"
                value={maxBudget}
                onChange={(e) => setMaxBudgetAndReset(e.target.value)}
                placeholder="Any"
              />
            </label>
            <label className="field">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="budget">Highest budget</option>
                <option value="deadline">Deadline soonest</option>
              </select>
            </label>
            {activeCount > 0 && (
              <button
                type="button"
                className="py-3 text-xs underline"
                onClick={() => {
                  setEventType("");
                  setCity("");
                  setMinBudget("");
                  setMaxBudget("");
                  setPage(1);
                }}
              >
                Reset
              </button>
            )}
          </div>
        )}
      {!r.loading && !r.error && (
        <p className="muted mb-5 text-xs">
          {filtered.length} open requirement{filtered.length === 1 ? "" : "s"}
        </p>
      )}
      <div className="opportunities-grid">
        {pageRows.map((row) => (
          <motion.article className="opportunity-card" key={row._id} initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <div className="opportunity-card-top"><span className="opportunity-event"><FiLayers />{row.event || "Creative project"}</span>{row.status && <span className="opportunity-status"><span />{row.status.replaceAll("_", " ")}</span>}</div>
            <h3 className="display">{row.title || row.event || "A new creative opportunity"}</h3>
            {row.description && <p className="opportunity-description">{row.description}</p>}
            <div className="opportunity-details">
              <div><FiMapPin /><span><small>LOCATION</small><b>{row.city || "To be confirmed"}</b></span></div>
              <div><FiCalendar /><span><small>EVENT DATE</small><b>{displayDate(row.date)}</b></span></div>
              <div><FiBriefcase /><span><small>SERVICES NEEDED</small><b>{row.service || row.services?.join(", ") || "Discuss with client"}</b></span></div>
              <div><FiClock /><span><small>APPLY BY</small><b>{displayDate(row.deadline)}</b></span></div>
            </div>
            {row.matchingReason && <p className="opportunity-match"><FiCheckCircle />{row.matchingReason}</p>}
            <div className="opportunity-card-footer"><div><small>PROJECT BUDGET</small><strong>{row.budgetMin !== undefined && row.budgetMax !== undefined ? `${money(row.budgetMin)} – ${money(row.budgetMax)}` : row.budgetMax !== undefined ? `Up to ${money(row.budgetMax)}` : row.budgetMin !== undefined ? `From ${money(row.budgetMin)}` : "Let’s discuss"}</strong></div><Link href={`/creator/opportunities/${row._id}`} className="opportunity-details-link">View project <FiArrowUpRight /></Link></div>
          </motion.article>
        ))}
      </div>
      {!r.loading && !r.error && filtered.length === 0 && (
        <div className="opportunities-empty">
          <span className="opportunities-stat-icon"><FiBriefcase /></span><h3 className="display text-2xl">Your next opportunity is on its way.</h3>
          <p className="muted">{activeCount ? "Try a different event, city, or budget to discover more projects." : "New client requests will appear here. Keep your services and locations up to date so clients can find you."}</p>
          <Link className="btn btn-outline" href="/creator/services">Manage your services <FiArrowUpRight /></Link>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Requirement pages" className="mt-10 flex justify-center gap-4">
          {currentPage > 1 && (
            <button className="btn btn-outline" onClick={() => setPage(currentPage - 1)}>
              Previous
            </button>
          )}
          <span className="p-4 text-xs">
            Page {currentPage} of {pages}
          </span>
          {currentPage < pages && (
            <button className="btn btn-outline" onClick={() => setPage(currentPage + 1)}>
              Next
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
