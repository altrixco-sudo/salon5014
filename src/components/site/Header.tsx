"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = open; // mobile overlay is dark

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled && !open
          ? "bg-cream/90 shadow-[0_1px_0_rgba(34,28,21,0.08)] backdrop-blur-md"
          : !open
            ? "bg-transparent"
            : ""
      )}
    >
      <div
        className={cn(
          "shell flex items-center justify-between transition-all duration-500",
          scrolled ? "py-3.5" : "py-5 lg:py-7"
        )}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Salon 5014 — home"
          className={cn(
            "serif-display text-[22px] font-medium tracking-[0.12em] transition-colors sm:text-2xl",
            dark ? "text-ivory" : "text-ink"
          )}
        >
          SALON&nbsp;5014
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wide2 transition-colors",
                  scrolled || pathname === "/" ? "" : "",
                  active
                    ? "text-copper"
                    : scrolled || pathname !== "/"
                      ? "text-ink/75 hover:text-copper-deep"
                      : "text-ivory/80 hover:text-ivory"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className={cn(
              "group hidden items-center gap-2 border px-6 py-3 text-[11px] font-semibold uppercase tracking-wide2 transition-all duration-300 sm:inline-flex",
              dark || (!scrolled && pathname === "/" && !open)
                ? "border-ivory/60 text-ivory hover:bg-ivory hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-ivory"
            )}
          >
            Book Appointment
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "flex h-11 w-11 items-center justify-center border transition-colors lg:hidden",
              dark ? "border-ivory/40 text-ivory" : "border-ink/30 text-ink"
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile nav */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 top-0 -z-10 flex flex-col bg-[#221C15] transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-8 pt-24">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              className={cn(
                "serif-display border-b border-ivory/10 py-4 text-4xl font-light text-ivory transition-all duration-500 hover:text-copper-soft",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? "380ms" : "0ms" }}
            className={cn(
              "mt-8 inline-flex w-full items-center justify-center gap-2 bg-copper px-7 py-5 text-xs font-semibold uppercase tracking-wide2 text-ivory transition-all duration-500",
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            Book Appointment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="px-8 pb-12">
          <p className="label-sm text-ivory/50">5014 Miller Ave · Dallas, TX</p>
          <p className="mt-1 text-xs text-ivory/40">(469) 426-4308 · @salon5014</p>
        </div>
      </div>
    </header>
  );
}
