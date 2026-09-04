"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
  group: "salon" | "artists";
  ratio: "portrait" | "landscape" | "tall";
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "salon", label: "The Salon" },
  { id: "artists", label: "The Artists" }
];

export function GalleryBrowser({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => (filter === "all" ? images : images.filter((i) => i.group === filter)),
    [filter, images]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter gallery">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "border px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide2 transition-all duration-300",
              filter === f.id
                ? "border-ink bg-ink text-ivory"
                : "border-line bg-cream text-muted hover:border-ink/50 hover:text-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 columns-2 gap-3 sm:gap-4 lg:columns-3 [&>figure]:mb-3 sm:[&>figure]:mb-4">
        {visible.map((img, i) => (
          <figure key={img.src + i} className="group relative overflow-hidden break-inside-avoid bg-sand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              width={900}
              height={img.ratio === "portrait" ? 1200 : img.ratio === "landscape" ? 675 : 1400}
              className={cn(
                "w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                img.ratio === "portrait" && "aspect-[3/4]",
                img.ratio === "landscape" && "aspect-[4/3]",
                img.ratio === "tall" && "aspect-[3/4.2]"
              )}
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3.5 pt-10 text-xs text-ivory/0 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-ivory/90">
              {img.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
