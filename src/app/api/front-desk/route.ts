import { NextResponse } from "next/server";
import { reply } from "@/lib/ai/engine";

/* ------------------------------------------------------------------ */
/*  POST /api/front-desk                                                */
/*                                                                      */
/*  Frontend → this route → (optional) AI provider.                     */
/*                                                                      */
/*  DEMO MODE (default): no AI_API_KEY present → answers come from      */
/*  the local Salon 5014 knowledge base engine. Same answers the        */
/*  widget computes client-side today.                                  */
/*                                                                      */
/*  CONNECTED: set AI_API_KEY + AI_ENDPOINT in .env; the prompt is      */
/*  built from salonData and sent to the provider. Keys never ship to   */
/*  the browser.                                                        */
/* ------------------------------------------------------------------ */

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { message?: string; channel?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const channel = body.channel ?? "website";
  const apiKey = process.env.AI_API_KEY;

  if (apiKey) {
    const endpoint = process.env.AI_ENDPOINT ?? "https://api.openai.com/v1/chat/completions";
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "gpt-4o-mini",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You are the Salon 5014 virtual front desk. Answer ONLY from the facts below. Never invent services, prices, availability, stylists or policies. If the answer is not in these facts say: \"I don't have that information yet. I can help you contact the salon.\" Keep replies warm, concise and human. " +
                "Facts: services with starting prices; location 5014 Miller Ave, Dallas TX 75206; phone (469) 426-4308; instagram @salon5014; hours Mon 10-4, Tue-Wed 10-8, Thu-Fri 9-6, Sat 9-5, Sun closed; new guests reserve by card + 50% deposit; cancellations within 24h charged 50%; no-shows 50%; first adjustment free within 7 days if you contact your stylist."
            },
            { role: "user", content: message }
          ]
        })
      });
      const data = await r.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text) return NextResponse.json({ text, channel });
      return NextResponse.json({ text: "I don't have that information yet. I can help you contact the salon.", channel });
    } catch {
      return NextResponse.json(
        { text: "I'm having trouble connecting right now — the salon team is reachable by phone at (469) 426-4308.", channel },
        { status: 502 }
      );
    }
  }

  /* ---- DEMO MODE ---- */
  const res = reply(message, { channel });
  return NextResponse.json({ text: res.text, actions: res.actions ?? [], channel });
}
