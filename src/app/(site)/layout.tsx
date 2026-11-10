import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE } from "@/lib/site";
import { QuickLinks } from "@/components/QuickLinks";

const organization = {
  "@context": "https://schema.org",
  "@type": "Chiropractic",
  "@id": `${SITE.url}/#org`,
  name: SITE.name,
  url: SITE.url,
  telephone: "+1-630-393-6699",
  image: `${SITE.url}/images/office.jpg`,
  logo: `${SITE.url}/images/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postal,
    addressCountry: SITE.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  hasMap: SITE.mapsUrl,
  openingHours: SITE.openingHours,
  sameAs: SITE.socials.map((s) => s.href),
  founder: { "@type": "Person", name: "Dr. Andrew Gorski", jobTitle: "Chiropractor" },
};

/** The public site: header, footer, Lenis smooth scrolling and the Organization JSON-LD. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <JsonLd data={organization} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <QuickLinks />
    </SmoothScroll>
  );
}
