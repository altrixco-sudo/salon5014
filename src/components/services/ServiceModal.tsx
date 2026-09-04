"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { SalonService } from "@/lib/types";

type Props = {
  service: SalonService | null;
  onClose: () => void;
};

export function ServiceModal({ service, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => ref.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${service.name} details`}
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg animate-chatIn bg-ivory shadow-2xl outline-none"
      >
        <div className="flex items-start justify-between border-b border-line px-7 py-5">
          <div>
            <p className="label-sm text-copper">{service.categoryLabel}</p>
            <h2 className="serif-display mt-1 text-3xl font-medium text-ink">
              {service.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-7 py-6">
          <div className="flex items-end justify-between border-b border-line pb-5">
            <p className="max-w-[70%] text-[15px] leading-relaxed text-muted">
              {service.blurb}
            </p>
            <p className="serif-display text-3xl font-light text-ink">
              {service.priceLabel}
              <span className="ml-1 align-middle text-xs font-sans text-muted">
                starting at
              </span>
            </p>
          </div>

          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-copper" />
              Price as listed on the Salon 5014 service menu. Exact pricing is
              confirmed when you book.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-copper" />
              New guests reserve with a credit card and a 50% deposit.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-copper" />
              First visit? We recommend booking by phone so we can match you with
              the right stylist.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-line px-7 py-5 sm:flex-row">
          <Link
            href={`/book?service=${service.id}`}
            onClick={onClose}
            className="btn-solid flex-1"
          >
            Book {service.name}
          </Link>
          <a
            href="tel:+14694264308"
            className="btn-outline flex-1 justify-center"
          >
            Call to Book
          </a>
        </div>
      </div>
    </div>
  );
}
