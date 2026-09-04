"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import { allServices, serviceGroups } from "@/data/salonData";
import type { SalonService } from "@/lib/types";
import { ServiceModal } from "@/components/services/ServiceModal";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "cut-style", label: "Cut + Style" },
  { id: "color", label: "Color" },
  { id: "specialty", label: "Specialty" }
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function ServiceBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<SalonService | null>(null);

  const deepLink = params.get("s");

  useEffect(() => {
    if (!deepLink) return;
    const found = allServices.find((s) => s.id === deepLink);
    if (found) setActive(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allServices.filter((s) => {
      if (filter !== "all" && s.category !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.blurb.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q))
      );
    });
  }, [filter, query]);

  const openService = (s: SalonService) => {
    setActive(s);
    router.replace(`/services?s=${s.id}`, { scroll: false });
  };

  const closeService = () => {
    setActive(null);
    router.replace("/services", { scroll: false });
  };

  return (
    <div>
      {/* filter + search */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Service categories"
        >
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services"
            aria-label="Search services"
            className="w-full border border-line bg-ivory py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
          />
        </div>
      </div>

      {/* groups when unfiltered + unqueried */}
      {filter === "all" && !query && (
        <div className="mt-10 space-y-12">
          {serviceGroups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <div className="mb-5 flex items-baseline justify-between gap-6">
                <h3
                  id={`group-${group.id}`}
                  className="serif-display text-2xl font-medium text-ink sm:text-[28px]"
                >
                  {group.title}
                </h3>
                <p className="label-sm hidden text-muted sm:block">
                  As listed at salon5014.com
                </p>
              </div>
              <ServiceRows services={group.services} onOpen={openService} />
            </section>
          ))}
        </div>
      )}

      {/* flat result list when filtering/searching */}
      {(filter !== "all" || query) && (
        <div className="mt-10">
          <p className="mb-5 text-sm text-muted" role="status">
            {visible.length} {visible.length === 1 ? "service" : "services"}
          </p>
          <ServiceRows services={visible} onOpen={openService} />
          {visible.length === 0 && (
            <p className="border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
              No services match — try a different search or{" "}
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="text-copper underline underline-offset-4"
              >
                view everything
              </button>
              .
            </p>
          )}
        </div>
      )}

      <ServiceModal service={active} onClose={closeService} />
    </div>
  );
}

function ServiceRows({
  services,
  onOpen
}: {
  services: SalonService[];
  onOpen: (s: SalonService) => void;
}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {services.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onOpen(s)}
          className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left transition-colors sm:grid-cols-[1.6fr_1fr_auto_auto] sm:py-6"
        >
          <div>
            <p className="serif-display text-xl font-medium text-ink transition-colors duration-300 group-hover:text-copper-deep sm:text-2xl">
              {s.name}
            </p>
            <p className="mt-1 hidden max-w-md text-sm leading-relaxed text-muted sm:block">
              {s.blurb}
            </p>
          </div>
          <p className="label-sm hidden text-muted sm:block">{s.categoryLabel}</p>
          <p className="text-right text-sm text-ink sm:pl-8">
            from <span className="serif-display text-lg">{s.priceLabel}</span>
          </p>
          <span className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </button>
      ))}
    </div>
  );
}
