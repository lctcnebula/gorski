# Site QA report

Tested locally against the production build on 4 November 2026.

## Passed

- `npm run lint`.
- `npm run build`, including TypeScript and static page generation.
- All 17 content routes return HTTP 200. A deliberately missing route returns 404.
- All 16 unique internal link targets discovered in server-rendered pages return 200.
- All 33 discovered image/video URLs return 200.
- Every content page has one H1. Robots.txt and sitemap.xml respond successfully. The assessment thank-you page has noindex.
- All content routes checked at 390px width have no document-level horizontal overflow.
- Home also checked at 320px; navigation/header checked at 1024px and 1280px.
- Mobile menu opens, Escape closes it, and selecting Appointments navigates and closes it.
- Our Approach anchor navigation lands with the target below the fixed header.
- Back to top returns the page to scrollY 0 after its animation.
- Three local videos load; the home hero plays. The YouTube play button opens a working player.
- Appointment, assessment, and event forms load and resize their iframes. Visible form content was inspected.
- Elfsight reviews load on the home and reviews pages after deferred loading.

## Findings

1. Medium: small-screen menu clips contact actions. At 320 x 568, Contact occupies y=503..562, the phone button begins at y=546, and the address ends at y=651. The menu has visible overflow while the document is scroll-locked; scrolling the menu does not reveal the bottom. See src/components/Header.tsx:174 and :199.
2. Medium: keyboard focus escapes the open mobile menu. Focus the final address link and press Tab: focus moves to the home page appointment CTA behind the overlay while aria-expanded remains true. The overlay needs focus containment and background inertness. See src/components/Header.tsx:167.
3. Low: the home page has no canonical link, unlike the other indexable content routes. See src/app/(site)/page.tsx:12.
4. Low: the Twitter footer link targets the generic Twitter homepage instead of a clinic profile. See src/lib/site.ts:37.

## Scope and limits

No source code was changed. There is no test script or project test suite configured in package.json. These checks cover the local production build and one browser engine, not every browser/device combination. Live clinic forms were not submitted, so submission delivery, confirmation emails, and the post-submit redirect remain unverified. External phone/social/map destinations were inspected as links or embeds, not exercised as real calls or account actions. No claim is made of a full accessibility or performance audit.
