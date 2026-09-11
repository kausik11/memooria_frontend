"use client";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
export default function AvailabilityCalendar({ dates }: { dates: string[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const available = [...dates].filter((d) => d >= today).sort();
  const [month, setMonth] = useState(
    () => new Date(`${available[0] || today}T12:00:00`),
  );
  const [selected, setSelected] = useState("");
  const year = month.getFullYear(),
    index = month.getMonth();
  const offset = new Date(year, index, 1).getDay();
  const days = new Date(year, index + 1, 0).getDate();
  return (
    <fieldset className="rounded-xl border border-stone-200 p-4">
      <legend className="px-2 text-xs font-semibold">
        Availability calendar
      </legend>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="p-2"
          onClick={() => setMonth(new Date(year, index - 1, 1))}
        >
          <FiChevronLeft />
        </button>
        <span className="text-xs font-semibold" aria-live="polite">
          {month.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          className="p-2"
          onClick={() => setMonth(new Date(year, index + 1, 1))}
        >
          <FiChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span className="muted py-2" key={d}>
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const date = `${year}-${String(index + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const enabled = available.includes(date);
          return (
            <button
              key={date}
              type="button"
              disabled={!enabled}
              aria-label={date}
              aria-pressed={selected === date}
              onClick={() => setSelected(date)}
              className={`rounded-md py-2 ${selected === date ? "bg-brand text-white" : enabled ? "bg-[#f1eafa] text-[#7952b7]" : "text-stone-400 !cursor-default"}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="muted mb-3 mt-3 text-[9px]">
        Highlighted dates are available for inquiries.
      </p>
      <label className="field">
        Event date
        <select
          name="date"
          required
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setMonth(new Date(`${e.target.value}T12:00:00`));
          }}
        >
          <option value="" disabled>
            {available.length
              ? "Select an available date"
              : "No available dates listed"}
          </option>
          {available.map((d) => (
            <option value={d} key={d}>
              {new Date(`${d}T12:00:00`).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}
