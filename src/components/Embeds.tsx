"use client";

import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import { EMBEDS } from "@/lib/site";

/** The Elfsight Google Reviews widget carried over from the WordPress site. */
export function Elfsight({ widget }: { widget: keyof typeof EMBEDS.elfsight }) {
  const id = EMBEDS.elfsight[widget];
  return (
    <>
      <div className={`elfsight-app-${id}`} data-elfsight-app-lazy />
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
    </>
  );
}

/** A YouTube video behind a poster image; the iframe only loads once the visitor presses play. */
export function YouTube({ video, poster }: { video: keyof typeof EMBEDS.youtube; poster: string }) {
  const { id, title } = EMBEDS.youtube[video];
  const [playing, setPlaying] = useState(false);
  return (
    <div className="frame aspect-video bg-ink">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`} className="group absolute inset-0">
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors group-hover:bg-ink/35">
            <span className="grid size-16 place-items-center rounded-full bg-paper text-ink shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" aria-hidden className="ml-1 size-6 fill-current">
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
