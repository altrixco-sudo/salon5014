import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { salon } from "@/data/salonData";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Salon 5014, an elite Dallas hair salon at 5014 Miller Ave offering haircuts, color, styling and extensions in a newly renovated, inviting space."
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About Salon 5014"
        title={
          <>
            Welcome to <em className="text-copper-deep">5014</em>
          </>
        }
        lede={salon.aboutCopy[0]}
      />

      {/* hero image */}
      <section className="border-t border-line bg-cream pb-24 lg:pb-32">
        <div className="shell">
          <figure className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={salon.photos.interiorStation}
              alt="Styling stations inside the Salon 5014 studio"
              loading="lazy"
              width={2000}
              height={1333}
              className="w-full object-cover"
            />
          </figure>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow text-copper">Our approach</p>
              <h2 className="serif-display mt-5 text-3xl font-light leading-snug sm:text-4xl">
                Quality hair services in an{" "}
                <em className="text-copper-deep">inviting atmosphere</em> — a
                personalized experience for every guest.
              </h2>
            </div>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted">
              <p>{salon.aboutCopy[1]}</p>
              <p>
                We specialize in everything from cut &amp; color to extensions and
                more — blonde balayage, caramel highlights, cowboy copper, precision
                haircuts, blowouts and healthy-hair treatments. Our team of
                experienced stylists has the knowledge and skills to help you
                achieve the look you desire.
              </p>
              <p>
                We encourage you to check out our Instagram page for hair
                inspiration and to find your stylist.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/book" className="btn-solid">
                  Book an Appointment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a href={salon.instagram.url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Find Your Stylist on Instagram
                </a>
              </div>
            </div>
          </div>

          {/* highlights strip */}
          <ul className="mt-20 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {salon.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 bg-cream px-6 py-7">
                <Check className="h-4 w-4 shrink-0 text-copper" strokeWidth={1.5} />
                <span className="text-sm leading-snug text-ink">{h}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
            {salon.name} · {salon.address.street}, {salon.address.city},{" "}
            {salon.address.state} {salon.address.zip}. Open Monday through Saturday —
            view{" "}
            <Link href="/contact" className="text-copper underline underline-offset-4">
              hours &amp; contact
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
