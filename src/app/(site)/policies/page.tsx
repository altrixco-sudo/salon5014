import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { policies, salon } from "@/data/salonData";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Salon 5014 booking, cancellation, deposit and return policies in Dallas, TX — exactly as published by the salon."
};

export default function PoliciesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Policies"
        title={
          <>
            We care about you. We also care about{" "}
            <em className="text-copper-deep">your hair.</em>
          </>
        }
        lede="Check out our policies to make sure we all have the same hair dreams. Text below is reproduced from the official Salon 5014 policies page."
      />

      <section className="border-t border-line bg-ivory pb-24 pt-6 lg:pb-32">
        <div className="shell grid gap-6 lg:grid-cols-2">
          {policies.map((p) => (
            <article
              key={p.id}
              className="border border-line bg-cream p-8 transition-colors duration-300 hover:border-ink/30 sm:p-10"
            >
              <p className="label-sm text-copper">Policy</p>
              <h2 className="serif-display mt-3 text-2xl font-medium text-ink sm:text-3xl">
                {p.title}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">
                {p.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          ))}

          <article className="border border-ink bg-[#221C15] p-8 text-ivory sm:p-10 lg:col-span-2 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="eyebrow text-copper-soft">Reserve online</p>
              <p className="serif-display mt-4 max-w-2xl text-2xl font-light leading-snug sm:text-3xl">
                All appointments are reserved online or via phone — let&apos;s find
                your time.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <Link href="/book" className="btn-copper justify-center">
                Book Appointment
              </Link>
              <a
                href={salon.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light justify-center"
              >
                salon5014.com
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
