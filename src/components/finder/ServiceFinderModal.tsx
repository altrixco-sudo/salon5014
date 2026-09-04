"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { allServices, serviceFinderSteps } from "@/data/salonData";
import type { SalonService } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  "Not sure what to book?" interactive service finder                */
/*  Suggests services to DISCUSS with a stylist — never a diagnosis.   */
/* ------------------------------------------------------------------ */

const FIRST_ANSWER_MAP: Record<string, string[]> = {
  Cut: ["haircut"],
  Color: ["face-frame", "toner-gloss", "tint"],
  Highlights: ["partial-highlight", "full-highlight", "foilayage"],
  Balayage: ["balayage", "foilayage"],
  Styling: ["blowout-style", "haircut"],
  Extensions: ["extensions"],
  Smoothing: ["keratin-complex", "brazilian-blowout", "magic-sleek"],
  Treatment: ["deep-conditioning", "keratin-complex"],
  "I'm not sure": ["balayage", "haircut", "partial-highlight"]
};

const CHANGE_ADD: Record<string, string[]> = {
  Refresh: [],
  "Noticeable change": ["face-frame", "balayage"],
  "Major transformation": ["full-highlight", "keratin-complex", "extensions"],
  "Not sure": []
};

type Props = {
  open: boolean;
  onClose: () => void;
  onBookService?: (id: string) => void;
};

export function ServiceFinderModal({ open, onClose, onBookService }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers([]);
  }, []);

  useEffect(() => {
    if (!open) return;
    reset();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panelRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose, reset]);

  const results: SalonService[] = useMemo(() => {
    const wanted = new Set<string>([
      ...(FIRST_ANSWER_MAP[answers[0] ?? ""] ?? []),
      ...(CHANGE_ADD[answers[1] ?? ""] ?? [])
    ]);
    return allServices.filter((s) => wanted.has(s.id));
  }, [answers]);

  if (!open) return null;

  const done = step >= serviceFinderSteps.length;
  const current = serviceFinderSteps[step];

  const choose = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep((s) => s + 1);
  };

  const book = (id?: string) => {
    onClose();
    if (onBookService) onBookService(id ?? "consultation");
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Service finder"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden bg-ivory shadow-2xl outline-none sm:rounded-sm"
      >
        {/* header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-5 sm:px-8">
          <div>
            <p className="label-sm text-copper">Not sure what to book?</p>
            <h2 className="serif-display mt-1 text-2xl font-medium sm:text-3xl">
              {done ? "Services to consider" : "Help me find my service"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service finder"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* progress */}
        {!done && (
          <div className="flex gap-1.5 px-6 pt-5 sm:px-8" aria-hidden="true">
            {serviceFinderSteps.map((s, i) => (
              <span
                key={s.title}
                className={cn(
                  "h-0.5 flex-1 transition-colors duration-500",
                  i < step ? "bg-copper" : i === step ? "bg-ink" : "bg-line"
                )}
              />
            ))}
          </div>
        )}

        {/* body */}
        <div className="thin-scroll flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {!done ? (
            <div key={step} className="animate-fadeUp">
              <p className="eyebrow text-ink/50">Question {step + 1} of 3</p>
              <h3 className="serif-display mt-2 text-2xl font-normal text-ink">
                {current.title}
              </h3>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {current.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(option)}
                    className={cn(
                      "group flex items-center justify-between border border-line bg-cream/60 px-5 py-4 text-left text-sm transition-all duration-300",
                      "hover:border-ink hover:bg-ink hover:text-ivory"
                    )}
                  >
                    <span>{option}</span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fadeUp">
              <p className="text-[15px] leading-relaxed text-muted">
                Based on what you&apos;ve told us, these are the services we&apos;d
                suggest <span className="text-ink">discussing with your stylist</span>.
              </p>

              <div className="mt-5 divide-y divide-line border-y border-line">
                {results.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => book(s.id)}
                    className="group flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <div>
                      <p className="serif-display text-lg font-medium text-ink transition-colors group-hover:text-copper-deep">
                        {s.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{s.blurb}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm text-ink">from {s.priceLabel}</p>
                      <p className="label-sm mt-1 text-copper opacity-0 transition-opacity group-hover:opacity-100">
                        Book →
                      </p>
                    </div>
                  </button>
                ))}
                {results.length === 0 && (
                  <p className="py-4 text-sm text-muted">
                    A consultation is the best place to start — your stylist will tailor
                    everything to your hair.
                  </p>
                )}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted/80">
                Every guest is different — a stylist will confirm the right plan and
                pricing at your appointment.
              </p>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line bg-cream/70 px-6 py-4 sm:px-8">
          {!done ? (
            <>
              <button
                type="button"
                onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide2 text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {step === 0 ? "Cancel" : "Back"}
              </button>
              <p className="hidden text-xs text-muted sm:block">
                Takes about 15 seconds
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={reset}
                className="text-[11px] font-semibold uppercase tracking-wide2 text-muted transition-colors hover:text-ink"
              >
                Start over
              </button>
              <Link
                href="/book"
                onClick={() => book()}
                className="btn-solid"
              >
                Book a Consultation
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
