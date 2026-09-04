import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { hours, policies, salon } from "@/data/salonData";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Salon 5014 in Dallas, TX — call (469) 426-4308, DM @salon5014, or visit 5014 Miller Ave. Open Monday–Saturday."
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={
          <>
            Let&apos;s find your <em className="text-copper-deep">next look</em>
          </>
        }
        lede="Questions, first-visit nerves or a specific request — the salon team is one call or DM away."
      />

      <section className="border-t border-line bg-ivory pb-24 pt-14 lg:pb-32">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Phone,
                label: "Call the salon",
                value: salon.phone.display,
                sub: "Best for first-time bookings",
                href: `tel:${salon.phone.tel}`,
                ext: false
              },
              {
                icon: Instagram,
                label: "Instagram",
                value: salon.instagram.handle,
                sub: "Hair inspiration & DMs",
                href: salon.instagram.url,
                ext: true
              },
              {
                icon: MapPin,
                label: "The studio",
                value: `${salon.address.street}, Dallas, TX ${salon.address.zip}`,
                sub: "East Dallas · newly renovated",
                href: "https://maps.google.com/?q=5014+Miller+Ave+Dallas+TX+75206",
                ext: true
              }
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col justify-between border border-line bg-cream p-8 transition-all duration-300 hover:border-ink"
              >
                <div>
                  <c.icon className="h-5 w-5 text-copper" strokeWidth={1.5} />
                  <p className="label-sm mt-6 text-muted">{c.label}</p>
                  <p className="serif-display mt-2 text-2xl font-medium leading-snug text-ink transition-colors group-hover:text-copper-deep">
                    {c.value}
                  </p>
                  <p className="mt-2 text-xs text-muted">{c.sub}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide2 text-copper">
                  {c.ext ? "Open" : "Call now"} →
                </span>
              </a>
            ))}
          </div>

          {/* hours + first visit note */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="border border-line bg-cream p-8 sm:p-10">
              <p className="eyebrow flex items-center gap-2 text-copper">
                <Clock className="h-4 w-4" /> Hours
              </p>
              <dl className="mt-6 max-w-md space-y-2.5">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between gap-6 border-b border-line pb-2.5 last:border-0"
                  >
                    <dt className="text-[15px] text-ink">{h.day}</dt>
                    <dd className={h.open ? "text-[15px] text-muted" : "text-sm text-muted/50"}>
                      {h.display}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="border border-line bg-[#221C15] p-8 text-ivory sm:p-10">
              <p className="eyebrow text-copper-soft">First visit?</p>
              <p className="serif-display mt-4 text-2xl font-light leading-snug">
                New guests are encouraged to book over the phone or in person.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                That way we can hear your hair story and match you with your dream
                stylist. New guests reserve with a credit card and a 50% deposit.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`tel:${salon.phone.tel}`} className="btn-copper">
                  <Phone className="h-3.5 w-3.5" /> Call to book
                </a>
                <Link href="/book" className="btn-ghost-light">
                  Try online booking
                </Link>
              </div>
            </div>
          </div>

          {/* policies preview */}
          <div className="mt-14 border-t border-line pt-10">
            <p className="label-sm text-muted">Policies</p>
            <div className="mt-4 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {policies.map((p) => (
                <Link
                  key={p.id}
                  href="/policies"
                  className="group flex items-center justify-between border-b border-line py-3 text-[15px] text-ink transition-colors hover:text-copper-deep"
                >
                  {p.title}
                  <span className="text-copper opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted">
              Cancellation, deposit and revision details — everything is on the{" "}
              <Link href="/policies" className="text-copper underline underline-offset-4">
                policies page
              </Link>
              , exactly as the salon publishes it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
