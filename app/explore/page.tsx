import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import CreatorCard from "@/components/CreatorCard";
import { api } from "@/services/api";
import type { CreatorResult, Service } from "@/services/types";
export const metadata = { title: "Explore creators" };
export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const values: Record<string, string> = {};
  for (const [key, v] of Object.entries(raw))
    if (typeof v === "string" && v) values[key] = v;
    else if (key === "categories" && Array.isArray(v)) values[key] = v.join(",");
  const query = new URLSearchParams(values);
  const [result, services] = await Promise.all([
    api<CreatorResult>(`/search?${query}`),
    api<Service[]>("/services"),
  ]);
  function pageLink(page: number) {
    const q = new URLSearchParams(query);
    q.set("page", String(page));
    return `/explore?${q}`;
  }
  return (
    <div className="wrap section">
      <p className="eyebrow">YOUR PEOPLE ARE HERE</p>
      <h1 className="display section-title">Find a creator. Make a memory.</h1>
      <SearchBar services={services} values={values} />
      <FilterPanel values={values} />
      <p className="muted mb-7 text-xs">
        {result.total} creators{values.location ? ` in ${values.location}` : ""}
        {values.category ? ` · ${values.category}` : ""}
      </p>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {result.items.map((c) => (
          <CreatorCard key={c._id} creator={c} />
        ))}
      </div>
      {!result.items.length && (
        <div className="py-20 text-center">
          <h2 className="display text-3xl">
            A different search could be the one.
          </h2>
          <p className="muted">
            Try another city, date, or budget to meet more creators.
          </p>
          <Link href="/explore" className="btn">
            Clear filters
          </Link>
        </div>
      )}
      <nav
        aria-label="Search pages"
        className="mt-10 flex justify-center gap-4"
      >
        {result.page > 1 && (
          <Link className="btn btn-outline" href={pageLink(result.page - 1)}>
            Previous
          </Link>
        )}
        {result.pages > 1 && (
          <span className="p-4 text-xs">
            Page {result.page} of {result.pages}
          </span>
        )}
        {result.page < result.pages && (
          <Link className="btn btn-outline" href={pageLink(result.page + 1)}>
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}
