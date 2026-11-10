"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { REVIEW_LINKS, SITE } from "@/lib/site";
import { Icon, type IconName } from "./Icon";

const links: { label: string; href: string; icon: IconName }[] = [
  { label: "Make an appointment", href: "/appointments", icon: "calendar" },
  { label: "R.E.B.I.R.T.H. Program", href: "/migraine-relief", icon: "heart" },
  { label: "Reviews", href: "/reviews", icon: "star" },
  { label: "Contact us", href: "/contact-us", icon: "pin" },
  { label: "FAQ", href: "/faq", icon: "quote" },
  { label: "Call us", href: SITE.phoneHref, icon: "phone" },
];

export function QuickLinks() {
  const pathname = usePathname();
  return <QuickLinksMenu key={pathname} reviewsPage={pathname === "/reviews"} />;
}

function QuickLinksMenu({ reviewsPage }: { reviewsPage: boolean }) {
  const [open, setOpen] = useState(false);
  const [reviewLinks, setReviewLinks] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open, reviewLinks]);

  return (
    <div ref={container} className="fixed right-5 bottom-5 z-[70] flex flex-col items-end" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {open && (
        <div ref={panel} id="quick-links-panel" role="dialog" aria-label={reviewLinks ? "Write a review" : "Quick links"} data-lenis-prevent className="mb-3 max-h-[70svh] w-[min(19rem,calc(100vw-2.5rem))] overflow-y-auto rounded-xl border border-line bg-paper p-3 text-ink shadow-xl">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold">{reviewLinks ? "Write a review" : "How can we help?"}</p>
            <button type="button" aria-label="Close quick links" onClick={() => { setOpen(false); trigger.current?.focus(); }} className="grid size-9 place-items-center rounded-full hover:bg-paper-2"><Icon name="close" className="size-4" /></button>
          </div>
          {reviewLinks ? (
            <>
              <p className="px-3 pb-2 text-sm text-ink-soft">Choose where to share your experience.</p>
              {REVIEW_LINKS.map(link => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-paper-2">{link.label}<Icon name="arrowUpRight" className="size-4" /></a>)}
              <button type="button" onClick={() => setReviewLinks(false)} className="mt-2 min-h-11 w-full rounded-lg border border-line text-sm">Back to quick links</button>
            </>
          ) : (
            <>
              {reviewsPage && <button type="button" onClick={() => setReviewLinks(true)} className="flex min-h-12 w-full items-center gap-3 rounded-lg bg-brand px-3 py-3 text-left text-sm font-semibold text-white"><Icon name="star" className="size-4" />Write a review</button>}
              <nav aria-label="Quick links">
                {links.map(link => <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-paper-2"><Icon name={link.icon} className="size-4 text-brand" />{link.label}</Link>)}
              </nav>
            </>
          )}
        </div>
      )}
      <button ref={trigger} type="button" aria-label={open ? "Close quick links" : "Open quick links"} aria-expanded={open} aria-controls={open ? "quick-links-panel" : undefined} aria-haspopup="dialog" onClick={() => { setReviewLinks(false); setOpen(!open); }} className="grid size-14 place-items-center rounded-full border border-white/20 bg-brand text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
        <Icon name={open ? "close" : "menu"} className="size-6" />
      </button>
    </div>
  );
}
