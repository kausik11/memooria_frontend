"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";
export default function Hero({
  slides,
}: {
  slides: { image: string; label: string }[];
}) {
  const validSlides = slides
    .filter((slide) => typeof slide.image === "string" && slide.image.trim())
    .map((slide) => ({ ...slide, image: slide.image.trim() }));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const activeIndex = validSlides.length ? index % validSlides.length : 0;
  const activeSlide = validSlides[activeIndex];
  useEffect(() => {
    if (paused || reduced || validSlides.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % validSlides.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [validSlides.length, paused, reduced]);
  return (
    <section
      className="relative mx-3 mt-3 h-[555px] overflow-hidden rounded-2xl bg-[#50403c] md:mx-5 md:h-[580px]"
      aria-roledescription="carousel"
      aria-label="Creative moments"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <AnimatePresence initial={false}>
        {activeSlide && (
          <motion.div
            key={activeSlide.image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 1 }}
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.label}
              fill
              priority={activeIndex === 0}
              sizes="100vw"
              className="object-cover object-[center_55%]"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hero-shade absolute inset-0" />
      <div className="wrap relative flex h-full flex-col justify-center pb-7 text-white">
        <span className="mb-6 flex items-center gap-2 text-[10px] tracking-[.22em]">
          <span className="h-1 w-1 rounded-full bg-[#e8c98e]" /> BEAUTIFUL
          MOMENTS BEGIN HERE
        </span>
        <h1 className="display max-w-[700px] text-[43px] leading-[1.06] md:text-[64px]">
          Capture your beautiful
          <br className="hidden md:block" /> moments with
          <br />
          <em className="text-[#e2c8fa]">trusted creators.</em>
        </h1>
        <p className="mt-5 max-w-[370px] text-[13px] leading-6 text-white/80">
          Find photographers, artists and creative professionals
          <br className="hidden md:block" /> who make your special day truly
          yours.
        </p>
        <div className="mt-7 flex gap-3">
          <Link href="/explore" className="btn">
            Explore services <FiArrowUpRight size={17} />
          </Link>
          <Link
            href="/#contact"
            className="btn !border-white/40 !bg-white/10 !text-white backdrop-blur-sm"
          >
            Contact us
          </Link>
        </div>
        <div className="mt-8 flex items-center gap-3 text-[10px] tracking-wide">
          <span className="text-[#f7d48a]">★★★★★</span>
          <span className="text-white/80">
            Thoughtful creators. Meaningful connections.
          </span>
        </div>
      </div>
      <div className="absolute bottom-7 right-8 flex items-center gap-4 text-white">
        <span className="hidden text-[10px] tracking-widest sm:block">
          {String(activeSlide ? activeIndex + 1 : 0).padStart(2, "0")} /{" "}
          {String(validSlides.length).padStart(2, "0")} —{" "}
          {activeSlide?.label || "YOUR NEXT CHAPTER"}
        </span>
        {validSlides.length > 1 && (
          <>
            <button
              className="rounded-full border border-white/40 p-2"
              aria-label="Previous slide"
              onClick={() =>
                setIndex((index - 1 + validSlides.length) % validSlides.length)
              }
            >
              <FiArrowLeft />
            </button>
            <button
              className="rounded-full border border-white/40 p-2"
              aria-label="Next slide"
              onClick={() => setIndex((index + 1) % validSlides.length)}
            >
              <FiArrowRight />
            </button>
            {/* <button
              className="text-xs underline"
              onClick={() => setPaused(!paused)}
            >
              {paused ? "Play" : "Pause"}
            </button> */}
          </>
        )}
      </div>
    </section>
  );
}
