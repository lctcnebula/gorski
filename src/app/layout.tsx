import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Only the document shell lives here. The site's header, footer and smooth scrolling are in (site)/layout.tsx.

// Newsreader is a sober editorial serif with optical sizes; Hanken Grotesk is a quiet grotesk for everything else.
const body = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin"] });

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Chiropractic Care at Gorski Chiropractic | Warrenville, IL",
    template: "%s | Gorski Chiropractic Center",
  },
  description:
    "Gorski Chiropractic Center in Warrenville, IL. Over 30 years of natural chiropractic care focused on nervous system function, stress and the R.E.B.I.R.T.H. Migraine Method.",
  openGraph: {
    title: SITE.name,
    description: "Wellness awaits you. Your journey to wellness begins here.",
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    images: ["/images/office.jpg"],
  },
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
    apple: "/images/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#231f20",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} antialiased`}>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-brand px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
