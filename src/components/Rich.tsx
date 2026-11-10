import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the light inline markup used in lib/content: **strong**, *em* and [text](href).
 * Enough for the site's copy without pulling in a markdown parser.
 */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={i++}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<em key={i++}>{m[2]}</em>);
    else if (m[3] !== undefined) {
      const href = m[4];
      out.push(
        href.startsWith("/") ? (
          <Link key={i++} href={href}>
            {m[3]}
          </Link>
        ) : (
          <a key={i++} href={href} target="_blank" rel="noreferrer">
            {m[3]}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
