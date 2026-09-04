import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { GalleryBrowser, type GalleryImage } from "@/components/gallery/GalleryBrowser";
import { salon, team } from "@/data/salonData";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside Salon 5014 — the newly renovated East Dallas studio, its styling floor and its artists. Follow @salon5014 on Instagram for daily client transformations."
};

const SALON_SHOTS = [
  { file: salon.photos.interiorWide, alt: "Long view of the Salon 5014 styling floor" },
  { file: salon.photos.hero, alt: "Elevated view of the Salon 5014 salon" },
  { file: salon.photos.interiorStation, alt: "Styling stations with mirrors at Salon 5014" },
  { file: salon.photos.interiorWindows, alt: "Stations along the windows at Salon 5014" },
  { file: salon.photos.heroAlt, alt: "A styling chair on the Salon 5014 floor" },
  { file: salon.photos.interiorWash, alt: "Shampoo and processing area at Salon 5014" }
];

const images: GalleryImage[] = [
  ...SALON_SHOTS.map((s, i) => ({
    src: s.file,
    alt: s.alt,
    group: "salon" as const,
    ratio: (["landscape", "tall", "portrait", "portrait", "landscape", "landscape"] as const)[i]
  })),
  ...team
    .filter((t) => t.photo)
    .slice(0, 9)
    .map((t) => ({
      src: t.photo,
      alt: `${t.name}, ${t.role} at Salon 5014`,
      group: "artists" as const,
      ratio: "portrait" as const
    }))
];

export default function GalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title={
          <>
            The salon, <em className="text-copper-deep">unfiltered</em>
          </>
        }
        lede={
          <>
            Inside the studio and around the chairs — photography from the official
            {` ${salon.name} `}site. For the latest client transformations and daily
            color work, the real gallery lives on Instagram.
          </>
        }
      />

      <section className="border-t border-line bg-ivory pb-24 pt-12 lg:pb-32">
        <div className="shell">
          <GalleryBrowser images={images} />

          <div className="mt-16 flex flex-col items-center border border-line bg-cream px-6 py-12 text-center">
            <p className="serif-display text-2xl font-light text-ink sm:text-3xl">
              Fresh work, every single day.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Balayage, blonding, lived-in color and more — see what the chairs
              are producing this week.
            </p>
            <a
              href={salon.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid mt-7"
            >
              <Instagram className="h-4 w-4" /> Follow {salon.instagram.handle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
