# Gorski Chiropractic Center — website

A redesign of [gorskichiro.com](https://gorskichiro.com) (Warrenville, IL) built with Next.js. Pages, URLs and copy
are the same as the WordPress site; the design is new.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in .next/
npm start        # serve the production build
```

## Pages

All on the same URLs as the WordPress site.

| Route | Notes |
| --- | --- |
| `/` | Video hero, new patients, Edison quote, Meet the Doctor, Our Approach, Migraine Relief, contact band, Google reviews |
| `/meet-the-doctor` | Dr. Gorski's story, verbatim |
| `/our-approach` | Passion · Nervous system · Stress · Our approach · Steps · Purpose, with anchor nav |
| `/migraine-relief` | The R.E.B.I.R.T.H. Migraine Method page, testimonial, assessment CTA |
| `/appointments` | Native appointment form + phone, address and hours |
| `/migraine-severity-assessment-tool`, `/register-for-event` | Native forms |
| `/thank-you-for-assessment-submission` | Post-assessment page (noindex) |
| `/blog`, `/<post-slug>` | Two existing posts, kept at their root-level WordPress URLs |
| `/reviews` | Elfsight Google Reviews widget |
| `/contact-us` | Address, phone, operating hours, map |
| `/privacy-policy`, `/hipaa-notice-of-privacy-practices`, `/terms-and-conditions`, `/html-sitemap` | Verbatim legal text |

## Where things live

- Business facts: `src/lib/site.ts` (phone, address, hours, embeds, nav). Never hard-code these elsewhere.
- Copy: `src/lib/content.ts` (pages), `src/lib/posts.ts` (blog), `src/lib/legal.ts` (legal). Inline `*em*`, `**strong**` and `[link](href)` render through `src/components/Rich.tsx`.
- Design tokens: `src/app/globals.css` (brick `#944A46` on charcoal `#231F20`, linen paper; Newsreader + Hanken Grotesk). Never hard-code hex in components.
- Chrome: `src/components/Header.tsx`, `Footer.tsx`; shared sections in `Sections.tsx`; motion in `Motion.tsx`; third-party embeds in `Embeds.tsx`.
- Images and the hero video were copied from the live site into `public/images` and `public/video`.

## Carried over from the live site

- Appointment, assessment and event forms submit to the site API and encrypted Neon storage. The assessment preserves the original 30 questions. See `docs/ADMIN.md` for dashboard and notification setup.
- Reviews are the existing Elfsight widgets. Analytics (Google tag `GT-5N59Z367`) was not added; add it in `src/app/layout.tsx` if wanted.
- The hero video (`public/video/hero.mp4`) is 24 MB as served by the old site; consider re-encoding it for faster loads.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, motion, Lenis.
