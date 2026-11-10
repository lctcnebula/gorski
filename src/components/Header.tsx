"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { NAV, SITE } from "@/lib/site";
import { Icon } from "./Icon";
import { EASE } from "./Motion";
import { setScrollLocked } from "./SmoothScroll";

/**
 * Site header — three layers:
 *  1. Utility strip (desktop): address with map link and phone. Folds away on scroll.
 *  2. Main bar: logo · centred nav with a sliding hover pill · "Make an Appointment". Glass once scrolled.
 *  3. A hairline scroll-progress beam along the bottom edge.
 * Mobile gets a full-screen menu with large numbered links.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState(pathname);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  // Close the mobile menu on navigation (adjusting state during render, not in an effect).
  if (menuFor !== pathname) {
    setMenuFor(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const active = NAV.find((n) => isActive(n.href))?.href ?? null;
  const pillFor = hovered ?? active;
  const solid = scrolled || open;
  // The appointment link is the header's button, so it doesn't repeat in the pill nav.
  const links = NAV.filter((n) => n.href !== "/appointments");

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* 1 — utility strip */}
      <div
        className={`hidden overflow-hidden bg-ink text-xs text-on-dark-soft transition-[height,opacity] duration-500 lg:block ${
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        }`}
      >
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-10">
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-on-dark"
          >
            <Icon name="pin" className="size-3.5 text-on-dark-soft" />
            {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
            <span className="text-on-dark-soft/60">· Our Location</span>
          </a>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <Icon name="clock" className="size-3.5 text-on-dark-soft" />
              Mon, Wed, Thu 8–12 &amp; 2:30–6:30 · Tue 2:30–6 · Fri–Sun by appointment
            </span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 font-semibold text-on-dark transition-colors hover:text-on-dark">
              <Icon name="phone" className="size-3.5" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 2 — main bar */}
      <div
        className={`relative z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
          solid
            ? "border-b border-line bg-paper/90 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className={`mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center px-5 transition-[height] duration-500 motion-reduce:transition-none sm:px-10 lg:grid-cols-[1fr_auto_1fr] ${scrolled ? "h-[76px]" : "h-[91px]"}`}>
          <Link href="/" aria-label={`${SITE.name} home`} className="inline-flex w-fit">
            <Image src="/images/logo.png" alt={SITE.name} width={325} height={178} preload className={`w-auto object-contain transition-[height] duration-500 motion-reduce:transition-none ${scrolled ? "h-12 sm:h-14" : "h-[63px] sm:h-[71px]"}`} />
          </Link>

          <nav className="hidden lg:block" aria-label="Primary" onPointerLeave={() => setHovered(null)}>
            <ul className="flex items-center gap-1">
              {links.map((item) => (
                <li key={item.href} className="relative" onPointerEnter={() => setHovered(item.href)}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative z-10 block rounded-md px-3.5 py-2 text-[0.9rem] font-medium transition-colors ${
                      pillFor === item.href ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {pillFor === item.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-paper-2"
                      transition={{ type: "spring", stiffness: 400, damping: 36 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <a href={SITE.phoneHref} className="btn btn-outline hidden xl:inline-flex" aria-label={`Call ${SITE.phone}`}>
              <Icon name="phone" className="size-4 text-brand" />
              {SITE.phone}
            </a>
            <Link href="/appointments" className="btn btn-primary hidden sm:inline-flex">
              Make an Appointment
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-md border border-line text-ink lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <Icon name={open ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </div>
        {/* 3 — progress beam */}
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-brand"
        />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`fixed inset-0 z-40 flex flex-col bg-paper transition-[padding-top] duration-500 motion-reduce:transition-none lg:hidden ${scrolled ? "pt-[76px]" : "pt-[91px]"}`}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="display flex items-baseline gap-4 border-b border-line py-3 text-[2rem] text-ink"
                  >
                    <span className="font-sans text-xs text-muted">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid gap-3 px-6 pb-16 text-sm text-ink-soft"
            >
              <a href={SITE.phoneHref} className="btn btn-primary btn-lg justify-between">
                Call {SITE.phone}
                <span className="btn-arrow">
                  <Icon name="phone" className="size-4" />
                </span>
              </a>
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                <Icon name="pin" className="size-4 text-brand" />
                {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
