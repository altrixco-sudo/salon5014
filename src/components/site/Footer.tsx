import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { allServices, hours, salon } from "@/data/salonData";

export function Footer() {
  return (
    <footer className="bg-[#221C15] text-ivory">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-24">
        {/* Brand */}
        <div>
          <p className="serif-display text-3xl font-medium tracking-[0.1em]">SALON 5014</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/60">
            An elite Dallas hair salon providing quality hair services in an inviting
            atmosphere.
          </p>
          <a
            href={salon.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide2 text-ivory/80 transition-colors hover:text-copper-soft"
          >
            <Instagram className="h-4 w-4" />
            Follow {salon.instagram.handle}
          </a>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <p className="label-sm text-ivory/40">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            {[
              ["Services", "/services"],
              ["Meet the Team", "/team"],
              ["Gallery", "/gallery"],
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Salon Policies", "/policies"]
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-ivory">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Popular services */}
        <div>
          <p className="label-sm text-ivory/40">Popular Services</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            {["balayage", "full-highlight", "extensions", "haircut", "keratin-complex"]
              .map((id) => allServices.find((s) => s.id === id))
              .filter(Boolean)
              .map((s) => (
                <li key={s!.id}>
                  <Link
                    href={`/services?s=${s!.id}`}
                    className="group inline-flex items-center gap-1 transition-colors hover:text-ivory"
                  >
                    {s!.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Visit */}
        <div>
          <p className="label-sm text-ivory/40">Visit</p>
          <address className="mt-5 text-sm not-italic leading-relaxed text-ivory/75">
            5014 Miller Ave
            <br />
            Dallas, TX 75206
          </address>
          <a
            href={`tel:${salon.phone.tel}`}
            className="mt-3 block text-sm text-ivory/75 transition-colors hover:text-ivory"
          >
            {salon.phone.display}
          </a>
          <div className="mt-6 space-y-1.5 text-[13px] text-ivory/55">
            {hours
              .filter((h) => h.open)
              .map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="text-ivory/75">{h.display}</span>
                </div>
              ))}
            <div className="flex justify-between gap-4">
              <span>Sunday</span>
              <span className="text-ivory/40">Closed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="shell flex flex-col items-start justify-between gap-3 py-6 text-xs text-ivory/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Salon 5014 · Dallas, Texas</p>
          <div className="flex items-center gap-5">
            <Link href="/book" className="transition-colors hover:text-ivory/80">
              Book an appointment
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-ivory/80">
              Owner dashboard (demo)
            </Link>
            <span>·</span>
            <a
              href="https://www.salon5014.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ivory/80"
            >
              salon5014.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
