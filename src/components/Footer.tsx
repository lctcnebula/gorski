import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, SITE } from "@/lib/site";
import { Icon, type IconName } from "./Icon";
import { publicContactEmails } from "@/lib/server/email-settings";
import { BackToTop } from "./BackToTop";

export async function Footer() {
  const contacts = await publicContactEmails();
  return (
    <footer className="dark-section relative mt-0 border-t border-line-dark">
      <div className="mx-auto max-w-[1400px] px-5 pt-16 pb-20 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <Image src="/images/logo-footer.png" alt={SITE.name} width={225} height={123} className="h-16 w-auto" />

            <h3 className="mt-8 text-xs font-medium tracking-[0.06em] text-on-dark-soft uppercase">About Us</h3>
            <p className="mt-8 max-w-md text-[0.975rem] leading-relaxed text-on-dark-soft">{SITE.about}</p>
            <ul className="mt-8 flex gap-2">
              {SITE.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-md border border-line-dark text-on-dark-soft transition-colors hover:border-on-dark hover:text-on-dark"
                  >
                    <Icon name={s.icon as IconName} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Useful links">
            <h3 className="text-xs font-medium tracking-[0.06em] text-on-dark-soft uppercase">Useful Links</h3>
            <ul className="mt-8 grid gap-2.5 text-[0.975rem]">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-on-dark-soft transition-colors hover:text-on-dark">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="text-xs font-medium tracking-[0.06em] text-on-dark-soft uppercase">Our Location</h3>
            <div className="mt-8 overflow-hidden rounded-lg border border-line-dark">
              <iframe
                src={SITE.mapsEmbed}
                title={`Map to ${SITE.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-56 w-full grayscale-[30%]"
              />
            </div>
            <h3 className="mt-8 text-xs font-medium tracking-[0.06em] text-on-dark-soft uppercase">Contact</h3>
            <ul className="mt-4 grid gap-2.5 text-[0.975rem] text-on-dark-soft">
              <li>
                <a href={SITE.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-on-dark">
                  <Icon name="phone" className="size-4 text-on-dark-soft" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 transition-colors hover:text-on-dark">
                  <Icon name="pin" className="mt-1 size-4 shrink-0 text-on-dark-soft" />
                  <span>
                    {SITE.address.street}
                    <br />
                    {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
                  </span>
                </a>
              </li>
              {contacts.map(contact => <li key={contact.email}>
                <span className="block text-xs text-on-dark-soft">{contact.label}</span>
                <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-on-dark">{contact.email}</a>
              </li>)}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-dark pt-6 text-sm text-on-dark-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © Copyright{" "}
            <Link href="/" className="text-on-dark transition-colors hover:text-on-dark">
              {SITE.name}
            </Link>
            . By{" "}
            <a href={SITE.builtBy.href} target="_blank" rel="noreferrer" className="text-on-dark transition-colors hover:text-on-dark">
              {SITE.builtBy.name}
            </a>
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
