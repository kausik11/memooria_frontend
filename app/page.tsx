import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import CreatorCard from "@/components/CreatorCard";
import InquiryForm from "@/components/InquiryForm";
import Counters from "@/components/Counters";
import { api } from "@/services/api";
import type { Service, Content, CreatorResult } from "@/services/types";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [services, result, content] = await Promise.all([
    api<Service[]>("/services"),
    api<CreatorResult>("/creators?featured=true&limit=4"),
    api<Content>("/content"),
  ]);
  return (
    <>
      <Hero slides={content.slides} />
      <div className="wrap relative -mt-5 md:-mt-9">
        <SearchBar services={services} />
        <p className="muted mt-4 text-center text-[10px]">
          A little planning. A perfect match. A lifetime of memories.
        </p>
      </div>
      <section id="services" className="section wrap !pb-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">EVERY DETAIL, BEAUTIFULLY COVERED</p>
            <h2 className="display section-title mb-0">
              One occasion. Endless possibilities.
            </h2>
          </div>
          <Link
            href="/explore"
            className="hidden items-center gap-2 text-xs font-semibold sm:flex"
          >
            All services <FiArrowUpRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {services
            .filter((s) => s.kind === "category")
            .map((s) => (
              <Link
                href={`/explore?category=${encodeURIComponent(s.title)}`}
                key={s._id}
                className="group"
              >
                <div className="relative aspect-[.88] overflow-hidden rounded-[70px_70px_14px_14px] bg-stone-200">
                  {s.image && (
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width:767px) 50vw,15vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute bottom-2 right-2 rounded-full bg-white/90 p-1.5">
                    <FiArrowUpRight size={12} />
                  </span>
                </div>
                <h3 className="mb-1 mt-3 text-center text-[11px] font-semibold">
                  {s.title}
                </h3>
                <p className="muted line-clamp-2 text-center text-[9px] leading-4">
                  {s.description}
                </p>
                <span className="mt-2 block text-center text-[9px] font-semibold text-brand">
                  Contact a creator <FiArrowUpRight className="inline" />
                </span>
              </Link>
            ))}
        </div>
      </section>
      <section className="section wrap !pt-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">EXCEPTIONAL TALENT. PERSONAL CONNECTIONS.</p>
            <h2 className="display section-title mb-2">
              Meet your memory makers.
            </h2>
            <p className="muted mb-0 text-xs">
              Handpicked professionals who care about your moments as much as
              you do.
            </p>
          </div>
          <Link
            href="/explore"
            className="btn btn-outline hidden !text-xs sm:flex"
          >
            Explore all creators <FiArrowUpRight />
          </Link>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {result.items.map((c) => (
            <CreatorCard key={c._id} creator={c} />
          ))}
        </div>
        {!result.items.length && (
          <p className="muted">
            Our creator collection is growing. Check back soon.
          </p>
        )}
      </section>
      <section id="how-it-works" className="bg-[#f1ecf7] py-7">
        <div className="wrap grid gap-7 md:grid-cols-3">
          {[
            {
              icon: FiCheckCircle,
              title: "Discover your perfect match",
              copy: "Browse portfolios. Find a style that feels like you.",
            },
            {
              icon: FiMessageCircle,
              title: "Connect, without the complications",
              copy: "Share your plans directly with your chosen creator.",
            },
            {
              icon: FiHeart,
              title: "Be in the moment",
              copy: "Let the professionals bring your vision to life.",
            },
          ].map((x) => (
            <div key={x.title} className="flex items-center gap-4">
              <x.icon size={25} className="shrink-0 text-[#8b65af]" />
              <div>
                <h3 className="mb-1 text-xs font-semibold">{x.title}</h3>
                <p className="muted mb-0 text-[10px]">{x.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="gallery" className="section wrap">
        <div className="mb-9 text-center">
          <p className="eyebrow">A LITTLE INSPIRATION FOR YOUR BIG DAY</p>
          <h2 className="display section-title mb-3">
            Moments that say <em className="text-[#9c7bb8]">everything.</em>
          </h2>
          <p className="muted text-xs">
            The stolen glances. The happy tears. The magic in between.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {content.gallery
            .filter((src) => typeof src === "string" && src.trim())
            .slice(0, 4)
            .map((src, i) => (
              <Link
                href="/explore"
                key={`${src}-${i}`}
                className={`group relative overflow-hidden rounded-xl ${i % 2 ? "mt-7 h-[240px] md:h-[340px]" : "h-[240px] md:h-[340px]"}`}
              >
                <Image
                  src={src}
                  alt={`Creative event inspiration ${i + 1}`}
                  fill
                  sizes="(max-width:767px) 50vw,25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 text-xs text-white">
                  Made to be remembered{" "}
                  <FiArrowUpRight className="float-right" />
                </span>
              </Link>
            ))}
        </div>
      </section>
      <section id="stories" className="section bg-white">
        <div className="wrap">
          <div className="mb-9 text-center">
            <p className="eyebrow">FROM THEIR HEARTS, TO YOURS</p>
            <h2 className="display section-title">
              Beautiful days. Even better stories.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {content.reviews.map((r) => (
              <article
                key={r._id}
                className="rounded-xl border border-stone-200 p-7"
              >
                <span className="text-sm tracking-widest text-[#c9994e]">
                  {"★".repeat(r.rating)}
                </span>
                <p className="display mb-6 mt-5 text-xl leading-relaxed">
                  “{r.comment}”
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#f2eaf9] text-[#9472af]">
                    {r.customer[0]}
                  </span>
                  <div>
                    <b className="text-xs">{r.customer}</b>
                    <p className="muted mb-0 mt-1 text-[10px]">
                      Memooria community
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!content.reviews.length && (
            <p className="muted text-center">
              Your story could be the first. Find your creator and share your
              experience.
            </p>
          )}
        </div>
      </section>
      <section className="section wrap">
        <p className="eyebrow mb-8 text-center">
          A GROWING COMMUNITY OF BEAUTIFUL POSSIBILITIES
        </p>
        <Counters stats={content.stats} />
      </section>
      <section id="contact" className="section !pt-4">
        <div className="wrap grid overflow-hidden rounded-2xl border border-[#e9e0ef] bg-[#f6f0fa] md:grid-cols-2">
          <div className="p-8 md:p-14">
            <p className="eyebrow">LET’S MAKE SOMETHING BEAUTIFUL</p>
            <h2 className="display section-title max-w-sm">
              Your next chapter
              <br />
              starts with <em className="text-[#9973b8]">hello.</em>
            </h2>
            <p className="muted max-w-xs text-sm leading-7">
              A big celebration or a small, meaningful moment — we’re here to
              help you find the right people.
            </p>
            <span className="mt-9 inline-block text-[65px] text-[#b496ca]">
              ✳
            </span>
          </div>
          <div className="bg-white/65 p-7 md:p-10">
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
