"use client";

import type { Channel, Conversation, Lead } from "@/lib/types";
import { uid } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  DEMO SEED DATA — purely illustrative sample records used to        */
/*  show the dashboard concept. Never presented as real salon data.    */
/* ------------------------------------------------------------------ */

const minsAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const DEMO = true;

function demoLead(partial: Partial<Lead> & Pick<Lead, "name" | "serviceInterest">): Lead {
  return {
    id: uid("seed"),
    email: "",
    phone: "",
    preferredTimeframe: "",
    source: "website",
    conversationSummary: "",
    createdAt: minsAgo(60),
    status: "NEW",
    ...partial
  };
}

export function demoLeads(): Lead[] {
  return [
    demoLead({
      name: "Morgan T.",
      serviceInterest: "Balayage",
      preferredTimeframe: "Next 2 weeks",
      source: "website",
      intent: "high",
      conversationSummary:
        "Interested in balayage for brunette hair; unsure which colorist to book.",
      createdAt: minsAgo(38),
      status: "NEW"
    }),
    demoLead({
      name: "Alyssa R.",
      serviceInterest: "Extensions",
      preferredTimeframe: "This month",
      source: "instagram",
      intent: "high",
      conversationSummary:
        "Asked about hand-tied extensions pricing via Instagram DM after a reel.",
      createdAt: minsAgo(130),
      status: "CONTACTED"
    }),
    demoLead({
      name: "Priya S.",
      serviceInterest: "Keratin Complex",
      preferredTimeframe: "This week",
      source: "website",
      intent: "medium",
      conversationSummary: "Asked about smoothing treatments and frizz control.",
      createdAt: minsAgo(260),
      status: "NEW"
    }),
    demoLead({
      name: "Devon K.",
      serviceInterest: "Partial Highlight",
      preferredTimeframe: "Next 2 weeks",
      source: "whatsapp",
      intent: "medium",
      conversationSummary: "Wanted a partial highlight before an event.",
      createdAt: minsAgo(1500),
      status: "BOOKED"
    }),
    demoLead({
      name: "Camille J.",
      serviceInterest: "New guest — cut + color consult",
      preferredTimeframe: "Just exploring",
      source: "email",
      intent: "low",
      conversationSummary: "First-time guest asking how new client bookings work.",
      createdAt: minsAgo(2900),
      status: "CLOSED"
    })
  ];
}

export function demoConversations(): Conversation[] {
  const mk = (
    customer: string,
    channel: Channel,
    intent: string,
    msgs: [string, string][],
    agoMins: number,
    status: Conversation["status"],
    leadId?: string
  ): Conversation => {
    const start = Date.now() - agoMins * 60000;
    return {
      id: uid("seed"),
      customer,
      channel,
      intent,
      status,
      leadId,
      messages: msgs.map(([from, text], i) => ({
        id: uid("m"),
        from: from as Conversation["messages"][number]["from"],
        text,
        at: new Date(start + i * 60000).toISOString()
      })),
      lastMessage: msgs[msgs.length - 1][1],
      updatedAt: minsAgo(Math.max(agoMins - msgs.length, 1))
    };
  };

  return [
    mk(
      "Morgan T.",
      "website",
      "Booking — balayage",
      [
        ["guest", "Hi! I'm interested in balayage but I'm not sure which stylist to book."],
        [
          "ai",
          "Salon 5014 offers balayage starting at $180+. I can help you explore the team or start an appointment."
        ],
        ["guest", "Could you save my info? I'd like a brunette balayage in the next couple weeks."],
        ["ai", "Thanks! We've saved your request. The Salon 5014 team can follow up with you."]
      ],
      38,
      "NEW",
      undefined
    ),
    mk(
      "Alyssa R.",
      "instagram",
      "Extensions pricing",
      [
        ["guest", "How much is extensions at your salon?"],
        ["ai", "Salon 5014 offers extensions starting at $599+. Happy to point you to a stylist!"],
        ["guest", "Yes please — send me more info"],
        ["salon", "Hi Alyssa! Our extension artists would love to meet you — we've noted your request."]
      ],
      130,
      "WAITING"
    ),
    mk(
      "Priya S.",
      "website",
      "Smoothing treatment",
      [
        ["guest", "What do you have for frizzy hair?"],
        [
          "ai",
          "We offer smoothing specialties: Keratin Complex from $350+, Brazilian Blowout from $380+ and Magic Sleek from $380+."
        ],
        ["guest", "I want to book a keratin treatment this week if possible"]
      ],
      260,
      "NEW"
    ),
    mk(
      "Devon K.",
      "whatsapp",
      "Booking — partial highlight",
      [
        ["guest", "Price for a partial highlight?"],
        ["ai", "A Partial Highlight at Salon 5014 starts at $170+. Would you like help finding an appointment?"],
        ["guest", "Yes, next two weeks work"]
      ],
      1500,
      "BOOKED"
    ),
    mk(
      "Camille J.",
      "email",
      "New guest question",
      [
        ["guest", "I've never been before — how do first appointments work?"],
        [
          "ai",
          "For first appointments we recommend booking by phone so we can match you with the right stylist. New guests reserve with a card and a 50% deposit."
        ],
        ["guest", "Thank you, that's helpful!"]
      ],
      2900,
      "CLOSED"
    ),
    mk(
      "Noah B.",
      "instagram",
      "Hours question",
      [
        ["guest", "When are you open this week?"],
        ["ai", "We're open Mon 10–4, Tue–Wed 10–8, Thu–Fri 9–6 and Sat 9–5. Closed Sundays."],
        ["guest", "Thanks!"]
      ],
      4200,
      "WAITING"
    )
  ];
}

export function demoUnanswered() {
  return [
    { q: "Do you offer hair extensions for men?", at: minsAgo(900) },
    { q: "What color line do you use for balayage?", at: minsAgo(2200) }
  ];
}

export function demoBookings() {
  return [
    { service: "Balayage", stylist: "Jeremiah Garcia", date: "Next Tue", time: "10:00 AM" },
    { service: "Full Highlight", stylist: "Lali Torres", date: "Next Thu", time: "2:30 PM" },
    { service: "Haircut + Blowout", stylist: "Carlos Gomez", date: "Next Fri", time: "11:00 AM" }
  ];
}

/* Sample weekly series used ONLY for the labeled demo chart. */
export function weeklySeries() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((d, i) => ({
    day: d,
    chats: [9, 13, 11, 16, 15, 8][i],
    leads: [2, 4, 3, 5, 4, 2][i]
  }));
}

export function topQuestions() {
  return [
    { q: "How much is balayage?", n: 24 },
    { q: "Are you taking new clients?", n: 18 },
    { q: "What are your hours?", n: 15 },
    { q: "Do you offer extensions?", n: 12 },
    { q: "How does the first visit work?", n: 9 }
  ];
}

export function topServices() {
  return [
    { s: "Balayage", n: 31 },
    { s: "Full Highlight", n: 19 },
    { s: "Extensions", n: 13 },
    { s: "Keratin Complex", n: 9 },
    { s: "Blowout & Style", n: 8 }
  ];
}

export const integrationCatalog = [
  {
    id: "website",
    name: "Website Chat",
    status: "CONNECTED" as const,
    desc: "The AI Front Desk on salon5014.com is live in demo mode on this concept site.",
    detail: "Knowledge base: salonData.ts · Replies: local engine"
  },
  {
    id: "instagram",
    name: "Instagram",
    status: "READY TO CONNECT" as const,
    desc: "Answer DMs and comments with the same AI Front Desk knowledge base.",
    detail: "Needs INSTAGRAM_ACCESS_TOKEN + Meta webhook"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    status: "READY TO CONNECT" as const,
    desc: "Route WhatsApp conversations through the same engine for consistent answers.",
    detail: "Needs WHATSAPP_ACCESS_TOKEN + WhatsApp Cloud API"
  },
  {
    id: "email",
    name: "Email",
    status: "READY TO CONNECT" as const,
    desc: "Auto-draft replies and follow-ups from the unified inbox.",
    detail: "Needs EMAIL_API_KEY + mailbox connection"
  },
  {
    id: "booking",
    name: "Booking",
    status: "READY TO CONNECT" as const,
    desc: "When a guest confirms intent, hand off to the salon booking provider.",
    detail: "Set BOOKING_URL to a live booking system"
  }
] as const;
