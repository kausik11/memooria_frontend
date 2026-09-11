import Link from "next/link";
import { Logo } from "./Header";
export default function Footer() {
  return (
    <footer className="border-t border-[#e6dfea] bg-[#f7f3fa] py-12">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <Logo />
            <p className="muted mt-4 max-w-[270px] text-xs leading-6">
              Extraordinary people. Unforgettable moments.
              <br />
              Your story deserves the right creator.
            </p>
          </div>
          <div className="flex gap-16 text-xs">
            <div className="flex flex-col gap-4">
              <b>Discover</b>
              <Link href="/explore">Find a creator</Link>
              <Link href="/#services">Explore services</Link>
              <Link href="/#stories">Real stories</Link>
            </div>
            <div className="flex flex-col gap-4">
              <b>Memooria</b>
              <Link href="/join">Become a creator</Link>
              <Link href="/#contact">Contact us</Link>
              <Link href="/privacy">Privacy & terms</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#e6dfea] pt-6 text-[10px] text-[#8c8296]">
          <span>
            © {new Date().getFullYear()} Memooria. All rights reserved.
          </span>
          <span>Made for moments that matter. ♡</span>
          <span>India · English · INR ₹</span>
        </div>
      </div>
    </footer>
  );
}
