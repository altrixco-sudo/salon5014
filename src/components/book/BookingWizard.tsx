"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Phone,
  Sparkles,
  User
} from "lucide-react";
import { allServices, salon, serviceGroups, team } from "@/data/salonData";
import { nextDays, prettyTime, slotsFor, type DayOption } from "@/lib/bookingPlan";
import { saveBooking } from "@/lib/clientStore";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Service", "Stylist", "Date", "Time", "Contact"];

export function BookingWizard() {
  const params = useSearchParams();

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState("");
  const [stylistId, setStylistId] = useState("any");
  const [day, setDay] = useState<DayOption | null>(null);
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [confirm, setConfirm] = useState<string | null>(null);

  const days = useMemo(() => nextDays(14), []);
  const service = allServices.find((s) => s.id === serviceId) ?? null;
  const stylist = team.find((t) => t.id === stylistId && t.booksOnline) ?? null;
  const slots = day ? slotsFor(day) : [];
  const bookable = team.filter((t) => t.booksOnline);

  /* deep links */
  useEffect(() => {
    const s = params.get("service");
    if (s && allServices.some((x) => x.id === s)) {
      setServiceId(s);
      setStep((cur) => Math.max(cur, 1));
    }
    const st = params.get("stylist");
    if (st && bookable.some((x) => x.id === st)) {
      setStylistId(st);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const done = confirm !== null;

  const canNext =
    (step === 0 && !!serviceId) ||
    (step === 1 && true) ||
    (step === 2 && !!day && day.open !== null) ||
    (step === 3 && !!time) ||
    (step === 4 && form.name.trim().length > 1);

  const next = () => {
    if (!canNext) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const submit = () => {
    if (!service || !day || !time) return;
    const booking = saveBooking({
      service: service.name,
      stylist: stylist?.name ?? "Let the salon match me",
      date: day.iso,
      time,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim()
    });
    setConfirm(booking.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="animate-fadeUp border border-line bg-ivory p-8 sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3f9d5f]/15 text-[#2f7a48]">
            <Check className="h-6 w-6" />
          </div>
          <p className="label-sm mt-6 text-copper">Request received</p>
          <h2 className="serif-display mt-2 text-3xl font-medium sm:text-4xl">
            Thank you, {form.name.split(" ")[0] || "friend"}.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            We&apos;ve noted your request for <strong className="text-ink">{service?.name}</strong>
            {stylist ? ` with ${stylist.name}` : ""} on{" "}
            <strong className="text-ink">
              {day ? `${day.dow}, ${day.md}` : ""} at {prettyTime(time)}
            </strong>
            .
          </p>

          <div className="mt-6 border border-[#2f7a48]/25 bg-[#3f9d5f]/8 p-5 text-sm leading-relaxed text-ink">
            <p className="font-semibold">Demo simulation — this did not create a real appointment.</p>
            <p className="mt-1 text-muted">
              This booking flow is a concept demo. To reserve a real visit, call{" "}
              <a className="text-copper underline underline-offset-2" href="tel:+14694264308">
                (469) 426-4308
              </a>{" "}
              or book at{" "}
              <a
                className="text-copper underline underline-offset-2"
                href={salon.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                salon5014.com/book-online
              </a>
              . New guests reserve with a card and 50% deposit.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/services" className="btn-outline flex-1 justify-center">
              Back to Services
            </Link>
            <a href="tel:+14694264308" className="btn-solid flex-1 justify-center">
              <Phone className="h-3.5 w-3.5" /> Call to Confirm
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* demo flag */}
      <div className="mb-8 flex items-start gap-3 border border-copper/30 bg-copper/5 px-5 py-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
        <p className="text-sm leading-relaxed text-muted">
          <strong className="font-semibold text-ink">Simulated booking experience.</strong>{" "}
          This flow demonstrates how online booking will work when connected to the
          salon&apos;s calendar. It does not place a real appointment.
        </p>
      </div>

      {/* steps */}
      <div className="mb-10 flex items-center justify-between">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex flex-col items-center gap-1.5 disabled:cursor-default",
                i === step ? "text-ink" : i < step ? "text-copper" : "text-muted/50"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                  i === step
                    ? "border-ink bg-ink text-ivory"
                    : i < step
                      ? "border-copper bg-copper text-ivory"
                      : "border-line bg-cream"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="label-sm hidden sm:block">{label}</span>
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn("mx-2 h-px flex-1 sm:-mt-6", i < step ? "bg-copper" : "bg-line")} />
            )}
          </div>
        ))}
      </div>

      <div key={step} className="animate-fadeUp">
        {/* STEP 0 — service */}
        {step === 0 && (
          <section aria-label="Choose a service">
            <h2 className="serif-display text-3xl font-medium">Choose your service</h2>
            <p className="mt-2 text-sm text-muted">
              Starting prices as listed on the official Salon 5014 menu.
            </p>
            <div className="mt-7 space-y-8">
              {serviceGroups.map((g) => (
                <div key={g.id}>
                  <p className="label-sm mb-3 text-copper">{g.title}</p>
                  <div className="divide-y divide-line border-y border-line">
                    {g.services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setServiceId(s.id)}
                        aria-pressed={serviceId === s.id}
                        className={cn(
                          "flex w-full items-center justify-between gap-4 py-4 px-1 text-left transition-colors",
                          serviceId === s.id ? "bg-sand/70" : "hover:bg-cream"
                        )}
                      >
                        <span className="flex items-center gap-4">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border",
                              serviceId === s.id ? "border-copper bg-copper" : "border-line"
                            )}
                          >
                            {serviceId === s.id && <Check className="h-3 w-3 text-ivory" />}
                          </span>
                          <span>
                            <span className="serif-display block text-lg font-medium text-ink">
                              {s.name}
                            </span>
                            <span className="block text-xs text-muted">{s.blurb}</span>
                          </span>
                        </span>
                        <span className="serif-display text-lg text-muted">{s.priceLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP 1 — stylist */}
        {step === 1 && (
          <section aria-label="Choose a stylist">
            <h2 className="serif-display text-3xl font-medium">Choose your stylist</h2>
            <p className="mt-2 text-sm text-muted">
              Prefer to decide later? Any artist on our team will take great care of
              you — we&apos;ll match you at booking.
            </p>
            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={() => setStylistId("any")}
                aria-pressed={stylistId === "any"}
                className={cn(
                  "flex w-full items-center gap-4 border px-5 py-4 text-left transition-colors",
                  stylistId === "any"
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-ivory hover:border-ink/40"
                )}
              >
                <User className="h-5 w-5 opacity-60" />
                <div>
                  <p className="font-semibold">Any stylist</p>
                  <p className={cn("text-xs", stylistId === "any" ? "text-ivory/70" : "text-muted")}>
                    Let the salon match you with the right artist
                  </p>
                </div>
              </button>
              {bookable.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setStylistId(t.id)}
                  aria-pressed={stylistId === t.id}
                  className={cn(
                    "flex w-full items-center gap-4 border px-5 py-4 text-left transition-colors",
                    stylistId === t.id
                      ? "border-ink bg-ink text-ivory"
                      : "border-line bg-ivory hover:border-ink/40"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.photo}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className={cn("text-xs", stylistId === t.id ? "text-ivory/70" : "text-muted")}>
                      {t.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 2 — date */}
        {step === 2 && (
          <section aria-label="Choose a date">
            <h2 className="serif-display text-3xl font-medium">Pick a day</h2>
            <p className="mt-2 text-sm text-muted">
              Illustrative availability for the next two weeks — shown as{" "}
              {salon.name} would appear in a connected calendar.
            </p>
            <div className="thin-scroll mt-7 flex gap-2.5 overflow-x-auto pb-2">
              {days.map((d) => {
                const closed = d.open === null;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={closed}
                    onClick={() => {
                      setDay(d);
                      setTime("");
                    }}
                    aria-pressed={day?.iso === d.iso}
                    className={cn(
                      "flex min-w-[86px] flex-col items-center border px-4 py-4 transition-colors",
                      closed && "cursor-not-allowed opacity-35",
                      day?.iso === d.iso
                        ? "border-ink bg-ink text-ivory"
                        : "border-line bg-ivory hover:border-ink/50"
                    )}
                  >
                    <span className={cn("label-sm", day?.iso === d.iso ? "text-ivory/60" : "text-muted")}>
                      {d.dow}
                    </span>
                    <span className="serif-display mt-1 text-xl font-medium">{d.md.split(" ")[1]}</span>
                    <span className={cn("text-[10px]", day?.iso === d.iso ? "text-ivory/60" : "text-muted/70")}>
                      {d.md.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
            {day && day.open !== null && (
              <p className="mt-3 text-xs text-muted">
                <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
                Open {day.dow}: {prettyTime(day.open)} – {prettyTime(day.close!)}
              </p>
            )}
          </section>
        )}

        {/* STEP 3 — time */}
        {step === 3 && day && (
          <section aria-label="Choose a time">
            <h2 className="serif-display text-3xl font-medium">
              Available times <span className="text-muted">· {day.dow}, {day.md}</span>
            </h2>
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {slots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  aria-pressed={time === t}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 border px-4 py-3.5 text-sm font-medium transition-colors",
                    time === t
                      ? "border-ink bg-ink text-ivory"
                      : "border-line bg-ivory hover:border-ink/50"
                  )}
                >
                  <Clock className="h-3.5 w-3.5 opacity-50" />
                  {prettyTime(t)}
                </button>
              ))}
              {slots.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-muted">
                  No illustrated slots for this day — pick another date.
                </p>
              )}
            </div>
          </section>
        )}

        {/* STEP 4 — contact */}
        {step === 4 && (
          <section aria-label="Your details">
            <h2 className="serif-display text-3xl font-medium">Your details</h2>
            <p className="mt-2 text-sm text-muted">
              The salon will use these to confirm your visit.
            </p>
            <div className="mt-7 grid gap-4">
              <label className="block">
                <span className="label-sm mb-2 block text-ink">Full name *</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full border border-line bg-ivory px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label-sm mb-2 block text-ink">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@email.com"
                    className="w-full border border-line bg-ivory px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="label-sm mb-2 block text-ink">Phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(214) 555-0100"
                    className="w-full border border-line bg-ivory px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
                  />
                </label>
              </div>
              <div className="mt-2 border border-line bg-cream/70 px-5 py-4 text-sm leading-relaxed text-muted">
                <p className="font-semibold text-ink">Reservation note</p>
                <p className="mt-1">
                  Per salon policy, new guests reserve with a credit card and a 50%
                  deposit. Cancellations within 24 hours are charged 50% of the
                  service. In this demo, no card is collected.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* nav */}
      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="btn-outline disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <p className="hidden text-xs text-muted sm:block">
          {service ? (
            <>
              {service.name} · from {service.priceLabel}
            </>
          ) : (
            "Step 1 of 5"
          )}
        </p>
        {step < STEP_LABELS.length - 1 ? (
          <button type="button" onClick={next} disabled={!canNext} className="btn-solid disabled:cursor-not-allowed disabled:opacity-35">
            Continue <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={!canNext} className="btn-copper disabled:cursor-not-allowed disabled:opacity-35">
            Request Appointment <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
