"use client";

import { Icon } from "./Icon";
import { scrollToTop } from "./SmoothScroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex items-center gap-2 text-sm text-on-dark-soft transition-colors hover:text-on-dark"
    >
      Back to top
      <span className="grid size-8 place-items-center rounded-md border border-line-dark">
        <Icon name="arrowUp" className="size-3.5" />
      </span>
    </button>
  );
}
