import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { TeamGrid } from "@/components/team/TeamGrid";
import { salon } from "@/data/salonData";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Meet the stylists and colorists of Salon 5014 in Dallas — stylists, colorists and stylist + colorists specializing in color, balayage, cuts and extensions."
};

export default function TeamPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Artists"
        title={
          <>
            Meet the <em className="text-copper-deep">team</em>
          </>
        }
        lede={
          <>
            At {salon.name}, our team is the heart of everything we do. A group of
            experienced Dallas artists — stylists, colorists and stylist + colorists
            — ready to help you find your look.
          </>
        }
      >
        <p className="text-xs text-muted">
          Artist roles are as listed on the official {salon.name} site. Book with
          the artist of your choice, or let the salon match you.
        </p>
      </PageIntro>

      <section className="border-t border-line bg-ivory pb-24 pt-12 lg:pb-32">
        <div className="shell">
          {/* team group photo from the official site */}
          <figure className="mb-16 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="overflow-hidden bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={salon.photos.teamGroup}
                alt="Group photo of the Salon 5014 team"
                loading="lazy"
                width={1400}
                height={900}
                className="w-full object-cover"
              />
            </div>
            <figcaption className="max-w-sm">
              <p className="serif-display text-2xl font-light leading-snug text-ink lg:text-[28px]">
                A group of elite Dallas-based artists specializing in everything
                from cut &amp; color to extensions &amp; more.
              </p>
              <p className="mt-3 text-xs text-muted">
                {salon.name} · {salon.address.street}, Dallas
              </p>
            </figcaption>
          </figure>

          <TeamGrid />
        </div>
      </section>
    </>
  );
}
