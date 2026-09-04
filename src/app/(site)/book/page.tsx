import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/book/BookingWizard";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your appointment at Salon 5014 in Dallas — choose your service, stylist and time. Demo flow shown until the live calendar is connected."
};

export default function BookPage() {
  return (
    <section className="bg-cream pb-24 pt-32 sm:pt-40">
      <div className="shell">
        <header className="mb-12 max-w-2xl">
          <p className="eyebrow text-copper">Book an appointment</p>
          <h1 className="serif-display mt-5 text-4xl font-light leading-tight sm:text-6xl">
            Reserve your <em className="text-copper-deep">visit</em>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Choose a service, pick your artist and find a time that works. Prefer
            to talk it through?{" "}
            <a href="tel:+14694264308" className="text-copper underline underline-offset-4">
              Call (469) 426-4308
            </a>{" "}
            — especially lovely for first visits.
          </p>
        </header>

        <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
          <BookingWizard />
        </Suspense>
      </div>
    </section>
  );
}
