import type { SVGProps } from "react";

const PATHS = {
  arrowRight: <path d="M4 12h16m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  quote: <path d="M10 11H6a4 4 0 0 1 4-4V5a6 6 0 0 0-6 6v8h6v-8zm10 0h-4a4 4 0 0 1 4-4V5a6 6 0 0 0-6 6v8h6v-8z" />,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  check: <path d="m5 12 5 5L20 7" />,
  arrowUp: <path d="M12 20V4m-6 6 6-6 6 6" />,
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" />,
  linkedin: (
    <>
      <path d="M8 10v7M8 7v.01M12 17v-7m0 3a3 3 0 0 1 6 0v4" />
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </>
  ),
  twitter: <path d="M4 4l6.5 8.6L4.3 20h2.4l5-5.9 4.4 5.9H20l-6.8-9 5.9-7h-2.4l-4.6 5.4L8 4H4z" />,
  leaf: <path d="M20 4c-8 0-14 4-14 12 0 1.5.3 2.8.8 4C9 14 13 10 20 4zM6.8 20C4 17 5 12 8 9" />,
  heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />,
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className, ...rest }: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
