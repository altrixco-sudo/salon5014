import { NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  POST /api/booking                                                   */
/*                                                                      */
/*  When BOOKING_URL (Vagaro / Calendly / Wix Bookings / etc.) is set,  */
/*  this route forwards the request to the salon's live booking system. */
/*  Until then, it answers in demo mode — no appointment is created.    */
/* ------------------------------------------------------------------ */

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bookingUrl = process.env.BOOKING_URL;

  if (bookingUrl) {
    try {
      const r = await fetch(bookingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await r.json().catch(() => ({}));
      return NextResponse.json({
        ok: r.ok,
        provider: bookingUrl,
        reference: (data as { id?: string }).id ?? null
      });
    } catch {
      return NextResponse.json({ error: "Booking provider unreachable" }, { status: 502 });
    }
  }

  return NextResponse.json({
    ok: true,
    demo: true,
    message:
      "Demo booking recorded locally. Connect BOOKING_URL to create real appointments.",
    reference: `DEMO-${Date.now().toString(36).toUpperCase()}`
  });
}
