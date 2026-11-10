// Business details and shared copy, taken from gorskichiro.com. Never hard-code these elsewhere.

export const SITE = {
  name: "Gorski Chiropractic Center",
  shortName: "Gorski Chiropractic",
  url: "https://gorskichiro.com",
  tagline: "Wellness awaits you",
  phone: "(630) 393-6699",
  phoneHref: "tel:+1-630-393-6699",
  address: {
    street: "2S517 Illinois Rte 59",
    city: "Warrenville",
    region: "IL",
    postal: "60555",
    country: "US",
  },
  geo: { lat: 41.8325537, lng: -88.1994794 },
  mapsUrl:
    "https://www.google.com/maps/place/Gorski+Chiropractic+Center/@41.8325577,-88.2020543,17z/data=!3m1!4b1!4m6!3m5!1s0x880eff2c20d816fd:0x131a154be70a3132!8m2!3d41.8325537!4d-88.1994794!16s%2Fg%2F1vlqqt58?authuser=0&entry=ttu",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2972.802179436088!2d-88.20205432506528!3d41.832557668266084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880eff2c20d816fd%3A0x131a154be70a3132!2sGorski%20Chiropractic%20Center!5e0!3m2!1sen!2sus!4v1706414739651!5m2!1sen!2sus",
  /** Office hours exactly as listed on the Contact page. */
  hours: [
    { day: "Monday", time: "8:00am-12:00pm and 2:30pm-6:30pm" },
    { day: "Tuesday", time: "2:30pm – 6:00pm" },
    { day: "Wednesday", time: "8:00am-12:00pm and 2:30pm-6:30pm" },
    { day: "Thursday", time: "8:00am-12:00pm and 2:30pm-6:30pm" },
    { day: "Friday", time: "By appointment only" },
    { day: "Saturday", time: "By appointment only" },
    { day: "Sunday", time: "By appointment only" },
  ],
  /** schema.org openingHours strings matching the list above. */
  openingHours: ["Mo 08:00-12:00", "Mo 14:30-18:30", "Tu 14:30-18:00", "We 08:00-12:00", "We 14:30-18:30", "Th 08:00-12:00", "Th 14:30-18:30"],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/GorskiCC/", icon: "facebook" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/dr-gorski-084a4b17/", icon: "linkedin" },
    { label: "Twitter", href: "https://www.twitter.com/", icon: "twitter" },
  ],
  about:
    "At Gorski Chiropractic Center, our main goal is to provide top-notch chiropractic care to our patients. With over 30 years of experience, we are dedicated to ensuring that our patients receive the best possible care for their well-being.",
  builtBy: { name: "Nebula Web Tech", href: "https://nebulawebtech.com/" },
} as const;

/** Third-party embeds carried over from the WordPress site. */
export const EMBEDS = {
  jotform: {
    appointments: { id: "241156390279056", title: "Appointment form for Gorski Chiro" },
    assessment: { id: "251654657062157", title: "Gorski Chiro Assessment form for Rebirth Workshop" },
    event: { id: "260400168806149", title: "Register For Event" },
  },
  elfsight: {
    reviewsHome: "99ff49e0-3c51-4b30-91b0-1fe452dc3980",
    reviewsPage: "dd354dbf-b62c-43c2-99a3-dd7fdb939548",
  },
  youtube: {
    exam: { id: "grqCFt4mwtI", title: "Chiropractic examination for neck" },
  },
} as const;

/** Primary navigation, in the same order as the live site. The logo links home. */
export const NAV = [
  { label: "Home", href: "/" },
  { label: "Meet the Doctor", href: "/meet-the-doctor" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Migraine Relief", href: "/migraine-relief" },
  { label: "Make an Appointment", href: "/appointments" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact-us" },
] as const;

export const FOOTER_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "HIPAA Policy", href: "/hipaa-notice-of-privacy-practices" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
  { label: "HTML Sitemap", href: "/html-sitemap" },
] as const;

/** Every page on the site, for the HTML sitemap and sitemap.xml. */
export const PAGES = [
  { label: "FAQ", href: "/faq" },
  { label: "Home", href: "/" },
  { label: "Meet the Doctor", href: "/meet-the-doctor" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Migraine Relief", href: "/migraine-relief" },
  { label: "Migraine Severity Assessment Tool", href: "/migraine-severity-assessment-tool" },
  { label: "Make an Appointment", href: "/appointments" },
  { label: "Register for Event", href: "/register-for-event" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "HIPAA Notice of Privacy Practices", href: "/hipaa-notice-of-privacy-practices" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
] as const;

export const REVIEW_LINKS = [
  { label: "Google", href: "https://search.google.com/local/writereview?placeid=ChIJ_RbYICz_DogRMjEK50sVGhM" },
  { label: "Facebook", href: "https://www.facebook.com/GorskiCC/reviews" },
  { label: "Yelp", href: "https://www.yelp.com/biz/gorski-chiropractic-center-warrenville" },
] as const;
