import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiMapPin, FiCheck, FiArrowUpRight } from "react-icons/fi";
import { api, ApiError, money } from "@/services/api";
import type { Creator } from "@/services/types";
import InquiryForm from "@/components/InquiryForm";
import ReviewForm from "@/components/ReviewForm";
import Gallery from "@/components/Gallery";
import ShareProfile from "@/components/ShareProfile";
const getCreator = cache(async (slug: string) => {
  try {
    return await api<Creator>(`/creators/${encodeURIComponent(slug)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const c = await getCreator((await params).slug);
  return {
    title: `${c.businessName} ${c.city} | ${c.category}`,
    description: c.description.slice(0, 160),
    openGraph: {
      title: c.businessName,
      description: c.description.slice(0, 160),
      images: c.coverImage ? [c.coverImage] : [],
    },
    alternates: { canonical: `/creator/${c.slug}` },
  };
}
export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const c = await getCreator((await params).slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: c.businessName,
    description: c.description,
    image: c.coverImage,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/creator/${c.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.city,
      addressRegion: c.state,
      addressCountry: "IN",
    },
    ...(c.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: c.rating,
        reviewCount: c.reviewCount,
      },
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: c.category,
      itemListElement: c.packages.map((p) => ({
        "@type": "Offer",
        price: p.price,
        priceCurrency: "INR",
        itemOffered: {
          "@type": "Service",
          name: p.name,
          description: p.description,
        },
      })),
    },
  };
  return (
    <div className="wrap py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link href="/explore" className="muted text-xs">
          ← Back to creators
        </Link>
        <ShareProfile name={c.businessName} slug={c.slug} />
      </div>
      <div className="relative mt-5 h-[300px] overflow-hidden rounded-2xl bg-stone-200 md:h-[420px]">
        {c.coverImage && (
          <Image
            src={c.coverImage}
            alt={c.businessName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="relative mx-3 -mt-12 flex flex-col gap-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:mx-8 md:flex-row md:items-center">
        {c.profileImage && (
          <Image
            src={c.profileImage}
            alt={c.ownerName}
            width={80}
            height={80}
            className="size-20 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <p className="eyebrow mb-2">{c.category}</p>
          <h1 className="display mb-2 text-3xl md:text-4xl">
            {c.businessName}
          </h1>
          <p className="muted mb-0 flex items-center gap-2 text-xs">
            <FiMapPin />
            {c.location} <span className="text-[#bb8b37]">★</span>
            {c.reviewCount
              ? `${c.rating} (${c.reviewCount} reviews)`
              : "New to Memooria"}
          </p>
        </div>
        <a href="#inquiry" className="btn">
          Let’s talk about your day <FiArrowUpRight />
        </a>
      </div>
      <div className="grid gap-12 py-12 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="display text-3xl">A little about us</h2>
            <p className="muted whitespace-pre-line text-sm leading-7">
              {c.description}
            </p>
            <div className="flex gap-5">
              {Object.entries(c.socialLinks || {})
                .filter(([, url]) => url)
                .map(([label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs capitalize text-brand underline"
                  >
                    {label} ↗
                  </a>
                ))}
            </div>
          </section>
          <section>
            <h2 className="display text-3xl">What we create</h2>
            <div className="flex flex-wrap gap-3">
              {c.services.map((s) => (
                <span className="badge flex items-center gap-2 !p-3" key={s}>
                  <FiCheck />
                  {s}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h2 className="display text-3xl">Something for your occasion</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {c.packages.map((p) => (
                <article
                  className="rounded-xl border border-[#ded3ea] bg-white p-5"
                  key={p.name}
                >
                  <span className="eyebrow">{p.name}</span>
                  <p className="mt-4 text-xl font-semibold">{money(p.price)}</p>
                  <p className="muted text-xs leading-6">{p.description}</p>
                  <a href="#inquiry" className="text-xs text-brand underline">
                    Ask about this package
                  </a>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2 className="display text-3xl">Through our lens</h2>
            <Gallery images={c.gallery} name={c.businessName} />
          </section>
          <section>
            <h2 className="display text-3xl">Words that mean the world</h2>
            {c.reviews?.map((r) => (
              <article
                key={r._id}
                className="mb-4 rounded-xl border border-stone-200 bg-white p-5"
              >
                <b>{r.customer}</b>
                <span className="float-right text-amber-600">
                  {"★".repeat(r.rating)}
                </span>
                <p className="muted mb-0 mt-3 leading-6">{r.comment}</p>
              </article>
            ))}
            {!c.reviews?.length && (
              <p className="muted">
                No reviews yet. Be the first to share your experience.
              </p>
            )}
            <ReviewForm creator={c._id} />
          </section>
        </div>
        <aside>
          <section
            id="inquiry"
            className="sticky top-28 rounded-2xl border border-[#e5dcec] bg-white p-6 shadow-[0_15px_50px_-30px_#574465] md:p-8"
          >
            <p className="eyebrow">YOUR BEAUTIFUL MOMENT STARTS HERE</p>
            <h2 className="display text-3xl">Let’s make it happen.</h2>
            <p className="muted text-xs leading-6">
              Share your vision with {c.businessName}. Choose an available date
              below.
            </p>
            <InquiryForm
              creator={c._id}
              service={c.category}
              dates={c.availability}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
