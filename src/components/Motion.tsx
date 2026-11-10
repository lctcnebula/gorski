"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

type Tag = "div" | "section" | "p" | "span" | "li" | "article" | "figure";

/** Soft fade, lift and un-blur once on scroll. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; as?: Tag; className?: string } & Omit<
  HTMLMotionProps<"div">,
  "children"
>) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Headline whose lines rise out of a mask, one after another. */
export function MaskLines({
  lines,
  as = "h2",
  className,
  delay = 0,
  onMount = false,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  const M = motion[as] as typeof motion.h2;
  return (
    <M
      className={className}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-8% 0px" } })}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%", rotate: 1.5 },
              show: { y: 0, rotate: 0, transition: { duration: 1.1, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

/** Children appear one after another when the parent scrolls into view. */
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ staggerChildren: gap }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Image that drifts gently as it scrolls through the viewport. */
export function Parallax({ children, className, amount = 24 }: { children: ReactNode; className?: string; amount?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ y: amount }}
      whileInView={{ y: -amount }}
      viewport={{ margin: "0px 0px 0px 0px", amount: 0 }}
      transition={{ duration: 1.8, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
