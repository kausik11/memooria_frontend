"use client";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { useSaved } from "@/hooks/useSaved";
import { money } from "@/services/api";
import type { Creator } from "@/services/types";
export default function CreatorCard({ creator: c }: { creator: Creator }) {
  const { saved, toggle } = useSaved(c._id);
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[1.16] overflow-hidden rounded-xl bg-stone-200">
        <Link
          href={`/creator/${c.slug}`}
          aria-label={`View ${c.businessName}`}
          className="absolute inset-0"
        >
          {c.coverImage && (
            <Image
              src={c.coverImage}
              alt={`${c.businessName} portfolio`}
              fill
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </Link>
        {c.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-semibold">
            ✦ Guest favourite
          </span>
        )}
        <button
          aria-label={
            saved ? `Unsave ${c.businessName}` : `Save ${c.businessName}`
          }
          aria-pressed={saved}
          onClick={toggle}
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2.5"
        >
          <FiHeart
            className={saved ? "fill-brand text-brand" : "text-ink"}
            size={15}
          />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-black/25 px-3 py-1 text-[9px] tracking-wide text-white backdrop-blur-md">
          {c.category}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <Link
          href={`/creator/${c.slug}`}
          className="font-semibold text-[15px] transition-colors hover:text-brand"
        >
          {c.businessName}
          {c.verified && <span className="ml-2 text-brand text-xs" title="Verified by Memooria">✓ Verified</span>}
        </Link>
        <span className="flex shrink-0 items-center gap-1 text-xs">
          <span className="text-[#d59d42]">★</span>{" "}
          {c.reviewCount ? c.rating.toFixed(1) : "New"}{" "}
          <span className="text-[10px] text-stone-400">
            {c.reviewCount ? `(${c.reviewCount})` : ""}
          </span>
        </span>
      </div>
      <p className="muted mt-2 flex items-center gap-1 text-[11px]">
        <FiMapPin size={12} />
        {c.location}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-stone-200/70 pt-3">
        <p className="mb-0 text-[11px]">
          {c.packages.length ? (
            <>
              <b className="text-sm">
                {money(Math.min(...c.packages.map((p) => p.price)))}
              </b>
              <span className="muted"> / starting price</span>
            </>
          ) : (
            "Request pricing"
          )}
        </p>
        <Link
          aria-label={`Explore ${c.businessName}`}
          href={`/creator/${c.slug}`}
          className="rounded-full border border-stone-200 p-1.5 transition-colors hover:border-brand hover:bg-purple-50 hover:text-brand"
        >
          <FiArrowUpRight />
        </Link>
      </div>
    </article>
  );
}
