import { FiMapPin, FiCalendar, FiCamera, FiSearch } from "react-icons/fi";
import type { Service } from "@/services/types";
export default function SearchBar({
  services,
  values = {},
}: {
  services: Service[];
  values?: Record<string, string | undefined>;
}) {
  return (
    <form
      action="/explore"
      className="relative z-10 grid items-center gap-4 rounded-2xl border border-[#ece7ed] bg-white p-5 shadow-[0_10px_35px_-15px_#4c38662b] md:grid-cols-[1fr_1fr_1fr_auto] md:gap-0 md:rounded-full md:p-3"
    >
      <label className="flex items-center gap-3 md:border-r md:border-stone-200 md:px-6">
        <FiMapPin className="text-brand" size={20} />
        <span className="w-full">
          <span className="block text-[9px] font-bold tracking-[.15em]">
            WHERE
          </span>
          <input
            name="location"
            aria-label="Location"
            defaultValue={values.location}
            placeholder="Choose your city"
            className="mt-1 w-full bg-transparent py-1 text-xs outline-none"
            list="cities"
          />
          <datalist id="cities">
            <option>Kolkata</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Bangalore</option>
          </datalist>
        </span>
      </label>
      <label className="flex items-center gap-3 md:border-r md:border-stone-200 md:px-6">
        <FiCalendar className="text-brand" size={19} />
        <span className="w-full">
          <span className="block text-[9px] font-bold tracking-[.15em]">
            WHEN
          </span>
          <input
            type="date"
            name="date"
            aria-label="Event date"
            defaultValue={values.date}
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full bg-transparent py-1 text-xs outline-none"
          />
        </span>
      </label>
      <label className="flex items-center gap-3 md:px-6">
        <FiCamera className="text-brand" size={20} />
        <span className="w-full">
          <span className="block text-[9px] font-bold tracking-[.15em]">
            WHO
          </span>
          <select
            name="category"
            aria-label="Service category"
            defaultValue={values.category}
            className="mt-1 w-full bg-transparent py-1 text-xs outline-none"
          >
            <option value="">Find your creative match</option>
            {services.map((s) => (
              <option key={s._id}>{s.title}</option>
            ))}
          </select>
        </span>
      </label>
      <button className="btn !py-4">
        <FiSearch size={17} /> Find creators
      </button>
    </form>
  );
}
