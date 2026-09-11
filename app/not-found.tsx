import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap section text-center">
      <p className="eyebrow">404 · A MOMENTARY DETOUR</p>
      <h1 className="display section-title">This page has moved on.</h1>
      <Link href="/explore" className="btn">
        Discover our creators
      </Link>
    </div>
  );
}
