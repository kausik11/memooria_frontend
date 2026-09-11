"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { api } from "@/services/api";
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Memooria home"
      className="flex items-center gap-2.5"
    >
      <span className="text-brand text-[34px] leading-none">✳</span>
      <span className="display text-[31px] tracking-[-1.5px]">
        memooria<span className="text-brand">.</span>
      </span>
    </Link>
  );
}
export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  useEffect(() => {
    api<{ name: string }>("/auth/me")
      .then(setUser)
      .catch(() => {});
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-paper/95 backdrop-blur-xl">
      <div className="wrap flex h-[82px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-[12px] font-semibold md:flex">
          <Link href="/explore">Explore creators</Link>
          <Link href="/#services">Our services</Link>
          <Link href="/#how-it-works">How it works</Link>
        </nav>
        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <button
              className="text-xs"
              onClick={async () => {
                await api("/auth/logout", { method: "POST" });
                setUser(null);
              }}
            >
              Sign out · {user.name.split(" ")[0]}
            </button>
          ) : (
            <Link href="/login" className="text-xs font-semibold">
              Log in
            </Link>
          )}
          <Link href="/join" className="btn btn-outline !py-2.5 !px-4 !text-xs">
            Become a creator <FiArrowUpRight />
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          className="flex flex-col gap-5 border-t border-stone-200 px-6 py-6 md:hidden"
          onClick={() => setOpen(false)}
        >
          <Link href="/explore">Explore creators</Link>
          <Link href="/#services">Our services</Link>
          <Link href="/join">Become a creator</Link>
          <Link href="/login">Your account</Link>
        </nav>
      )}
    </header>
  );
}
