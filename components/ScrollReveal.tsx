"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

/** Reveal a section the first time it enters the viewport. */
export default function ScrollReveal({
  children,
  ...props
}: Omit<HTMLMotionProps<"section">, "initial" | "whileInView" | "viewport" | "transition">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
