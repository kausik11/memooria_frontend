"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setCount(value);
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1000, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value, reduced]);
  return (
    <div ref={ref}>
      <p className="display mb-2 text-4xl md:text-5xl">
        {count.toLocaleString("en-IN")}
        <span className="text-brand">+</span>
      </p>
      <p className="muted mb-0 text-[11px]">{label}</p>
    </div>
  );
}
export default function Counters({
  stats,
}: {
  stats: { creators: number; users: number; events: number; cities: number };
}) {
  return (
    <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-4">
      <Counter value={stats.users} label="Community members" />
      <Counter value={stats.creators} label="Creative professionals" />
      <Counter value={stats.cities} label="Cities to explore" />
      <Counter value={stats.events} label="Completed inquiries" />
    </div>
  );
}
