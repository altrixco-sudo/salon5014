import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { ServiceBrowser } from "@/components/services/ServiceBrowser";
import { FinderCta } from "@/components/finder/FinderCta";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/data/salonData";
import { buildFaqSchema, buildServicesSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Explore the Salon 5014 service menu — haircuts, balayage, highlights, color, extensions, keratin and smoothing treatments with starting prices in Dallas, TX."
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[buildServicesSchema(), buildFaqSchema()]} />
      <PageIntro
        eyebrow="Services & Pricing"
        title={
          <>
            Every look begins
            <em className="text-copper-deep"> here</em>
          </>
        }
        lede={
          <>
            Looking for a new haircut, a fresh blonde or a monthly retouch of your
            go-to shade? Salon 5014 specializes in delivering your best look —
            blonde balayage, caramel highlights, cowboy copper and everything in
            between. Prices below are the starting prices listed on the official
            menu.
          </>
        }
      />

      <section className="border-t border-line bg-ivory pb-24 pt-12 lg:pb-32">
        <div className="shell">
          <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading menu…</div>}>
            <ServiceBrowser />
          </Suspense>
        </div>
      </section>

      {/* finder band */}
      <section className="border-t border-line bg-sand py-20 text-center lg:py-24">
        <p className="eyebrow text-copper-deep">Overwhelmed? Same.</p>
        <h2 className="serif-display mx-auto mt-4 max-w-2xl text-3xl font-light sm:text-4xl">
          Answer three questions, <em>skip the guesswork.</em>
        </h2>
        <div className="mt-8">
          <FinderCta />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cream py-20 lg:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow text-copper">Good to know</p>
            <h2 className="serif-display mt-4 text-3xl font-light sm:text-4xl">
              Questions, <em>answered</em>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Straight from the salon — policies, booking and first-visit details.
              The full policy text lives on the{" "}
              <Link href="/policies" className="text-copper underline underline-offset-4">
                policies page
              </Link>
              .
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                  <span className="serif-display text-xl font-medium text-ink transition-colors group-open:text-copper-deep">
                    {f.q}
                  </span>
                  <span className="shrink-0 text-copper transition-transform duration-300 group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
