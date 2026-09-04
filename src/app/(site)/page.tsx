import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Instagram } from "lucide-react";
import { hours, salon, serviceGroups, team } from "@/data/salonData";
import { CtaLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FinderCta } from "@/components/finder/FinderCta";
import { JsonLd } from "@/components/JsonLd";
import { buildOrgSchema, buildServicesSchema } from "@/lib/seo";

const TEAM_SPOTLIGHT = ["jeremiah-garcia", "lali-torres", "william-peck", "angel-dickholtz"];

export default function HomePage() {
  return (
    <>
      <JsonLd data={[buildOrgSchema(), buildServicesSchema()]} />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#221C15] text-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={salon.photos.hero}
          alt="Interior of the Salon 5014 studio in Dallas"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,13,8,0.62)_0%,rgba(18,13,8,0.42)_45%,rgba(18,13,8,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgba(18,13,8,0.5)_100%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-24 pt-36 text-center sm:px-8">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-ivory/85">
              <span className="h-px w-8 bg-ivory/50" />
              Dallas, Texas
              <span className="h-px w-8 bg-ivory/50" />
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="serif-display mt-7 text-[15vw] font-light leading-[1.02] tracking-tight sm:text-7xl lg:text-[92px]">
              Your Hair. Your Style.
              <br />
              <em className="font-normal italic text-copper-soft">Your 5014.</em>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ivory/85 sm:text-lg">
              An elevated Dallas salon experience for color, cuts, styling,
              extensions and healthy hair.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/book" className="btn-copper w-full px-9 py-5 sm:w-auto">
                Book an Appointment
              </Link>
              <Link
                href="/services"
                className="btn-ghost-light w-full justify-center px-9 py-5 sm:w-auto"
              >
                Explore Services
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-ivory/60">
          <ArrowDown className="h-5 w-5 animate-bounce" />
          <span className="sr-only">Scroll for more</span>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="overflow-hidden border-y border-line bg-ivory py-4" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[0, 1].map((n) => (
            <div key={n} className="flex gap-10">
              {[
                "Haircuts",
                "Balayage",
                "Lived-in Color",
                "Extensions",
                "Blowouts",
                "Keratin",
                "Blonding",
                "Healthy Hair"
              ].map((word) => (
                <span key={word} className="eyebrow flex items-center gap-10 text-muted">
                  {word}
                  <span className="text-copper">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ INTRO ============ */}
      <section className="bg-cream">
        <div className="shell grid gap-14 py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-36">
          <Reveal>
            <p className="eyebrow text-copper">Salon 5014 · Miller Ave, Dallas</p>
            <h2 className="serif-display mt-6 text-4xl font-light leading-[1.12] sm:text-5xl lg:text-[54px]">
              An elite salon with an
              <em className="text-copper-deep"> inviting</em> atmosphere — and
              stylists who know their craft.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted sm:text-base">
              {salon.aboutCopy.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                Whether you&apos;re refreshing your lived-in balayage, dreaming of
                cowboy copper, or starting with something completely new — we have
                you covered.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <CtaLink href="/about" variant="outline">
                  Our Story <ArrowRight className="h-3.5 w-3.5" />
                </CtaLink>
                <CtaLink href="/team" variant="none" className="px-2 text-[11px] font-semibold uppercase tracking-wide2 text-ink underline decoration-line underline-offset-8 hover:text-copper-deep">
                  Meet the stylists
                </CtaLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES PREVIEW ============ */}
      <section id="services" className="border-t border-line bg-ivory">
        <div className="shell py-24 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow text-copper">Services &amp; Pricing</p>
              <h2 className="serif-display mt-5 text-4xl font-light sm:text-5xl">
                The menu, <em className="text-copper-deep">as listed</em>
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                Starting prices straight from the official Salon 5014 menu. Your
                stylist confirms the exact price at booking.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <CtaLink href="/services" variant="solid">
                View Full Menu <ArrowRight className="h-3.5 w-3.5" />
              </CtaLink>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-3">
            {serviceGroups.map((group, gi) => (
              <Reveal key={group.id} delay={gi * 100}>
                <h3 className="serif-display border-b border-line pb-4 text-2xl font-medium text-ink">
                  {group.title}
                </h3>
                <ul className="mt-1 divide-y divide-line">
                  {group.services.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/services?s=${s.id}`}
                        className="group flex items-center justify-between py-3.5 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-[15px] text-ink transition-colors group-hover:text-copper-deep">
                          {s.name}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-70" />
                        </span>
                        <span className="serif-display text-base text-muted">
                          {s.priceLabel}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-14 border-t border-line pt-6 text-sm text-muted">
              Not sure where to begin?{" "}
              <Link href="/services" className="font-semibold text-copper underline underline-offset-4 hover:text-copper-deep">
                Browse all services
              </Link>{" "}
              or ask the AI Front Desk below — it knows the menu by heart.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICE FINDER ============ */}
      <section className="bg-sand">
        <div className="shell py-24 text-center lg:py-28">
          <Reveal>
            <p className="eyebrow text-copper-deep">Not sure what to book?</p>
            <h2 className="serif-display mx-auto mt-5 max-w-3xl text-4xl font-light leading-[1.15] sm:text-5xl">
              Tell us three small things.
              <br />
              <em>We&apos;ll point you the right way.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
              A short, one-handed finder that suggests services worth discussing
              with your stylist — it&apos;s not a diagnosis, it&apos;s a starting
              point.
            </p>
            <div className="mt-9">
              <FinderCta label="Help me find my service" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TEAM PREVIEW ============ */}
      <section className="border-t border-line bg-cream">
        <div className="shell py-24 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow text-copper">The Artists</p>
              <h2 className="serif-display mt-5 text-4xl font-light sm:text-5xl">
                The team is the <em className="text-copper-deep">heart</em> of it all
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <CtaLink href="/team" variant="outline">
                Meet everyone <ArrowRight className="h-3.5 w-3.5" />
              </CtaLink>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {TEAM_SPOTLIGHT.map((id, i) => {
              const member = team.find((t) => t.id === id);
              if (!member) return null;
              return (
                <Reveal key={id} delay={i * 90}>
                  <Link href={`/book?stylist=${member.id}`} className="group block">
                    <div className="overflow-hidden bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photo}
                        alt={`${member.name}, ${member.role} at Salon 5014`}
                        loading="lazy"
                        width={900}
                        height={1200}
                        className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <p className="serif-display text-xl font-medium text-ink">
                          {member.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{member.role}</p>
                      </div>
                      <span className="text-copper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Book →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ GALLERY TEASER ============ */}
      <section className="border-t border-line bg-ivory">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <p className="eyebrow text-center text-copper">The Studio</p>
            <h2 className="serif-display mt-5 text-center text-4xl font-light sm:text-5xl">
              Inside <em className="text-copper-deep">5014</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center text-[15px] leading-relaxed text-muted">
              {salon.name} is a newly renovated East Dallas salon — come see it in
              person, or browse the space here.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            <GalleryTile src={salon.photos.interiorWide} alt="Long view of the Salon 5014 styling floor" tall />
            <GalleryTile src={salon.photos.heroAlt} alt="Styling chair at Salon 5014" />
            <GalleryTile src={salon.photos.interiorStation} alt="Salon stations with mirrors inside Salon 5014" tall />
            <GalleryTile src={salon.photos.interiorWash} alt="Shampoo area at Salon 5014" />
            <GalleryTile src={salon.photos.interiorWindows} alt="Styling stations along the windows at Salon 5014" className="hidden lg:block" />
          </div>
          <Reveal delay={100}>
            <div className="mt-12 text-center">
              <a
                href={salon.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Instagram className="h-4 w-4" />
                Follow {salon.instagram.handle}
              </a>
              <p className="mt-3 text-xs text-muted">
                Client transformations and daily looks live on Instagram.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ VISIT / HOURS ============ */}
      <section className="bg-[#221C15] text-ivory">
        <div className="shell grid gap-14 py-24 lg:grid-cols-2 lg:py-32">
          <Reveal>
            <p className="eyebrow text-copper-soft">Visit</p>
            <h2 className="serif-display mt-5 text-4xl font-light sm:text-5xl">
              Find us on <em className="text-copper-soft">Miller Ave</em>
            </h2>
            <address className="mt-8 text-lg not-italic leading-relaxed text-ivory/80">
              {salon.address.street}
              <br />
              {salon.address.city}, {salon.address.state} {salon.address.zip}
            </address>
            <a
              href={`tel:${salon.phone.tel}`}
              className="mt-3 inline-block text-lg text-ivory/80 transition-colors hover:text-ivory"
            >
              {salon.phone.display}
            </a>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/book" className="btn-copper">
                Book an Appointment
              </Link>
              <Link href="/contact" className="btn-ghost-light">
                Contact &amp; Directions
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border border-ivory/15 px-8 py-8 sm:px-10">
              <p className="label-sm text-ivory/50">Salon hours</p>
              <dl className="mt-6 space-y-2.5">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between border-b border-ivory/10 pb-2.5"
                  >
                    <dt className="text-[15px] text-ivory/85">{h.day}</dt>
                    <dd className={h.open ? "text-[15px] text-ivory" : "text-sm text-ivory/40"}>
                      {h.display}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-ivory/55">
                New guests are always welcome. First visit?{" "}
                <Link href="/contact" className="text-copper-soft underline underline-offset-4 hover:text-ivory">
                  Give us a call
                </Link>{" "}
                and we&apos;ll match you with the right stylist.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function GalleryTile({
  src,
  alt,
  tall,
  className = ""
}: {
  src: string;
  alt: string;
  tall?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="group overflow-hidden bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          width={900}
          height={tall ? 1100 : 900}
          className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
            tall ? "aspect-[4/5]" : "aspect-[4/3]"
          }`}
        />
      </div>
    </Reveal>
  );
}
