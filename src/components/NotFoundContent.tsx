import Link from "next/link";
import { Icon } from "./Icon";
import { CONTAINER, PageHero } from "./Sections";

export function NotFoundContent() {
  return (
    <>
      <PageHero eyebrow="404" title="Page not found" lines={["We couldn't find", <span key="accent-line">that page.</span>]} lede="The link may be out of date. Try one of these instead." />
      <section className={`${CONTAINER} flex flex-wrap gap-3 pb-24`}>
        <Link href="/" className="btn btn-primary btn-lg">
          Back home
          <span className="btn-arrow">
            <Icon name="arrowUpRight" className="size-4" />
          </span>
        </Link>
        <Link href="/appointments" className="btn btn-outline btn-lg">
          Make an Appointment
        </Link>
      </section>
    </>
  );
}
