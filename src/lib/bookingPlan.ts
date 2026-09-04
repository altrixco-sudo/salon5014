import { hours } from "@/data/salonData";

/* ------------------------------------------------------------------ */
/*  Simulated availability — derived ONLY from the salon's real hours  */
/*  (the demo is not connected to the salon's live calendar).          */
/* ------------------------------------------------------------------ */

const DAY_ISO = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface DayOption {
  iso: string; // yyyy-mm-dd
  dow: string; // Mon
  md: string; // Sep 12
  today: boolean;
  open: string | null; // "10:00"
  close: string | null;
}

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nextDays(count = 14): DayOption[] {
  const out: DayOption[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getTime() + (i + 1) * 86400000); // starts tomorrow
    const dow = DAY_ISO[d.getDay()];
    const h = hours.find((x) => x.label === dow.slice(0, 3));
    out.push({
      iso: toIso(d),
      dow,
      md: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      today: i === 0,
      open: h?.open ?? null,
      close: h?.close ?? null
    });
  }
  return out;
}

/** one-hour appointment starts within the day's window */
export function slotsFor(day: DayOption): string[] {
  if (!day.open || !day.close) return [];
  const [oh, om] = day.open.split(":").map(Number);
  const [ch, cm] = day.close.split(":").map(Number);
  const start = oh * 60 + om;
  const end = ch * 60 + cm - 60; // last start an hour before close
  const slots: string[] = [];
  for (let t = start; t <= end; t += 60) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;
    slots.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return slots;
}

export function prettyTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hr}:${String(m).padStart(2, "0")} ${ampm}` : `${hr} ${ampm}`;
}
