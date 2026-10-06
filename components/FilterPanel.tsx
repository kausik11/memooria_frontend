"use client";
import { useState } from "react";
import Link from "next/link";
import { FiSliders, FiChevronDown } from "react-icons/fi";

const FILTER_KEYS = [
  "minPrice",
  "maxPrice",
  "rating",
  "startTime",
  "language",
  "experience",
  "businessType",
  "travel",
];

export default function FilterPanel({
  values,
}: {
  values: Record<string, string>;
}) {
  const activeCount = FILTER_KEYS.filter((k) => values[k]).length;
  const [open, setOpen] = useState(activeCount > 0);
  return (
    <div className="my-8">
      <button
        type="button"
        className="btn btn-outline !py-3"
        aria-expanded={open}
        aria-controls="filters-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <FiSliders size={15} />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={15}
        />
      </button>
      {open && (
        <form
          id="filters-panel"
          className="mt-4 flex flex-wrap items-end gap-4"
          action="/explore"
        >
          {["location", "date", "category", "event", "categories"].map((k) => (
            <input key={k} type="hidden" name={k} value={values[k] || ""} />
          ))}
          <label className="field">
            Minimum price (₹)
            <input
              className="!w-36"
              type="number"
              name="minPrice"
              min="0"
              defaultValue={values.minPrice}
              placeholder="Any"
            />
          </label>
          <label className="field">
            Maximum price (₹)
            <input
              className="!w-36"
              type="number"
              name="maxPrice"
              min="0"
              defaultValue={values.maxPrice}
              placeholder="Any"
            />
          </label>
          <label className="field">
            Minimum rating
            <select name="rating" defaultValue={values.rating || ""}>
              <option value="">All ratings</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </label>
          <label className="field">
            Sort by
            <select name="sort" defaultValue={values.sort || "recommended"}>
              <option value="recommended">Recommended</option>
              <option value="price">Price: low to high</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
          <label className="field">
            Start time
            <input type="time" name="startTime" defaultValue={values.startTime} />
          </label>
          <label className="field">
            Language
            <input
              name="language"
              defaultValue={values.language}
              placeholder="Any language"
            />
          </label>
          <label className="field">
            Minimum experience
            <input
              type="number"
              name="experience"
              min="0"
              max="80"
              defaultValue={values.experience}
            />
          </label>
          <label className="field">
            Creator type
            <select name="businessType" defaultValue={values.businessType || ""}>
              <option value="">Any type</option>
              {["INDIVIDUAL", "STUDIO", "AGENCY", "RENTAL_PROVIDER", "VENUE_PROVIDER"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </label>
          <label className="field">
            Travel
            <select name="travel" defaultValue={values.travel || ""}>
              <option value="">Any</option>
              <option value="true">Available to travel</option>
            </select>
          </label>
          <button className="btn">Apply filters</button>
          <Link href="/explore" className="py-3 text-xs underline">
            Reset
          </Link>
        </form>
      )}
    </div>
  );
}
