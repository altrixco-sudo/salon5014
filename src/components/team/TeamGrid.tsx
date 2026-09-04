"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { team } from "@/data/salonData";
import type { TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "stylist-colorist", label: "Stylist + Colorist" },
  { id: "stylist", label: "Stylist" },
  { id: "colorist", label: "Colorist" },
  { id: "other", label: "Leadership & Makeup" }
];

function matches(t: TeamMember, f: string) {
  if (f === "all") return true;
  if (f === "stylist-colorist") return t.role === "Stylist + Colorist";
  if (f === "stylist") return t.role === "Stylist";
  if (f === "colorist") return t.role === "Colorist";
  return !["Stylist + Colorist", "Stylist", "Colorist"].includes(t.role);
}

export function TeamGrid() {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return team.filter((t) => {
      if (!matches(t, filter)) return false;
      if (!query) return true;
      return t.name.toLowerCase().includes(query) || t.role.toLowerCase().includes(query);
    });
  }, [filter, q]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter the team">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide2 transition-all duration-300",
                filter === f.id
                  ? "border-ink bg-ink text-ivory"
                  : "border-line bg-cream text-muted hover:border-ink/50 hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find an artist"
            aria-label="Search the team"
            className="w-full border border-line bg-ivory py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
          />
        </div>
      </div>

      {visible.length === 0 && (
        <p className="border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
          No one matches that search.
        </p>
      )}

      <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((t, i) => (
          <li key={t.id} style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
            <Link
              href={t.booksOnline ? `/book?stylist=${t.id}` : "/contact"}
              className="group block"
              aria-label={
                t.booksOnline ? `Book with ${t.name}` : `${t.name} — contact the salon`
              }
            >
              {t.photo ? (
                <div className="overflow-hidden bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.photo}
                    alt={`${t.name}, ${t.role} at Salon 5014`}
                    loading="lazy"
                    width={900}
                    height={1200}
                    className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-sand">
                  <p className="serif-display px-6 text-center text-2xl leading-snug text-muted">
                    {t.name}
                  </p>
                </div>
              )}
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <p className="serif-display text-lg font-medium leading-tight text-ink sm:text-xl">
                    {t.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                    {t.role}
                  </p>
                </div>
                {t.booksOnline && (
                  <span className="label-sm mt-0.5 text-copper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Book
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
