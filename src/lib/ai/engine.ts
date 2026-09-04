/* ------------------------------------------------------------------ */
/*  AI Front Desk engine                                                */
/*                                                                      */
/*  Channel-agnostic: the exact same reply() powers the website chat    */
/*  today and the Instagram / WhatsApp / email inbox later.             */
/*  It answers ONLY from salonData.ts (single source of truth).         */
/*  No availability lookups, no invented facts.                         */
/* ------------------------------------------------------------------ */

import {
  allServices,
  faqs,
  hours,
  policies,
  salon,
  team,
  serviceGroups
} from "@/data/salonData";
import type { ChatAction, EngineReply } from "@/lib/types";

type Context = { channel?: string };

const T = salon.name;

const strip = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const has = (input: string, tokens: string[]) =>
  tokens.some((t) => input.includes(t));

function action(type: ChatAction["type"], label: string, value?: string): ChatAction {
  return { type, label, value };
}

function bookAction(label = "Book Appointment"): ChatAction {
  return action("book", label);
}
function humanActions(): ChatAction[] {
  const acts: ChatAction[] = [action("call", "Call the Salon")];
  const ig = action("instagram", "DM @salon5014", salon.instagram.url);
  acts.push(ig);
  acts.push(action("book", "Book Appointment"));
  return acts;
}

/* ------------------------------------------------ lookups */

function findService(q: string) {
  const norm = strip(q);
  const scores = allServices.map((s) => {
    let score = 0;
    for (const k of s.keywords) {
      const kw = strip(k);
      if (norm.includes(kw)) score += kw.split(" ").length > 1 ? 3 : 2;
      if (norm === kw) score += 2;
    }
    // name tokens
    const parts = s.name.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    if (parts.every((p) => norm.includes(p))) score += 4;
    return { s, score };
  });
  const best = [...scores].sort((a, b) => b.score - a.score)[0];
  return best && best.score >= 2 ? best.s : null;
}

const findStylist = (q: string) => {
  const norm = strip(q);
  const t = team.find((m) => strip(m.name).split(" ").every((p) => norm.includes(p)));
  return t ?? null;
};

const hourText = () => {
  const open = hours.filter((h) => h.open);
  const last = open[open.length - 1];
  return `${open[0].day}–${last.day === "Saturday" ? "Sat" : last.day}: ${open.map((h) => h.display).join(", ")} · Sunday closed`;
};

/* ------------------------------------------------ intent router */

const BOOKING_HINTS =
  /\b(book|booking|appointment|reserve|reservation|schedule|availability|available|open slot|slot)\b/;

export function reply(rawInput: string, ctx: Context = {}): EngineReply {
  const input = strip(rawInput);
  if (!input) {
    return {
      text: "I'm happy to help. Ask me about services, pricing, hours or booking an appointment.",
      actions: quickActions()
    };
  }

  const service = findService(input);
  const stylist = findStylist(input);

  const askPrice = /(price|cost|how much|start at|starting at|rate|pricing|cheap|expensive)/.test(
    input
  );
  const wantsBooking = BOOKING_HINTS.test(input);
  const wantsTeam = /(stylist|colorist|artist|who (does|is)|team|staff|book with|jeremiah|carlos|angel|dani|lali|william|tiffany|zoey|cheryl|joan|jose|monica|olivia|renee|stephanie|dylan|fatema|jeka)/.test(
    input
  );
  const wantsHuman = /(talk to (a |the )?(person|human|stylist|receptionist)|call me|human|real person|someone (call|from the salon)|agent|speak with)/.test(input);
  const wantsContact = /(contact|phone|number|call|reach|email|address|where|location|directions|parking|insta|instagram)/.test(input);
  const wantsPolicies = /(policy|cancel|deposit|no.?show|reschedule|late|refund|return|revision|first (time|visit)|new guest|24 hour)/.test(input);
  const wantsHours = /(hour|open|close|when are you|time)/.test(input);
  const wantsServices = /(service|menu|offer|do you do|what (do|can) you|price list|treatments|cut and color|everything)/.test(input);
  const wantsExt = /(extension|length|volume|weft)/.test(input);
  const wantsColor = /(color|colour|blonde|brunette|copper|caramel|dimension|tone|gloss)/.test(input);
  const wantsBalayage = /balayage|bronde|lived.?in/.test(input);
  const greeting = /^(hi|hello|hey|howdy|good (morning|afternoon|evening)|yo|hola)\b/.test(input);
  const thanks = /(thank|thanks|appreciate|great|awesome|perfect|sounds good)/.test(input);
  const bye = /(bye|goodbye|see you|have a good)/.test(input);
  const helpChoose = /(help me (choose|find|pick|decide)|not sure|don'?t know|which service|what (should|do) i (get|need|book)|recommend|suggest|unsure|advise)/.test(input);
  const whoAreYou = /(who are you|are you (a )?(robot|real)|are you ai|what are you)/.test(input);
  const qaQuestion = /(what|how|who|where|when|do you|can you|is it)\b/.test(input) && /\?$/.test(rawInput.trim());

  /* human handoff first (they explicitly asked) */
  if (wantsHuman) {
    return {
      text: `Of course. I can connect you with the ${T} team — they'll be happy to help personally.`,
      actions: humanActions()
    };
  }

  if (whoAreYou) {
    return {
      text: `I'm the ${T} virtual front desk — I can share our services and starting prices, hours, location and help you start an appointment. Anything I can't answer, I'll point you to the salon team.`,
      actions: quickActions()
    };
  }

  /* specific stylist */
  if (stylist && stylist.booksOnline) {
    const act = action("bookWithStylist", `Book with ${stylist.name.split(" ")[0]}`, stylist.id);
    return {
      text: `${stylist.name} is ${/^[aeiou]/i.test(stylist.role) ? "an" : "a"} ${stylist.role} at ${T}. I can start an appointment with ${stylist.name.split(" ")[0]} for you.`,
      actions: [act, action("team", "See the whole team")]
    };
  }
  if (stylist && !stylist.booksOnline) {
    return {
      text: `${stylist.name} is our ${stylist.role.toLowerCase()} — the front desk can point you to the right artist for your visit. You can call us at ${salon.phone.display}.`,
      actions: [action("call", "Call the Salon")]
    };
  }
  if (wantsTeam) {
    return {
      text: `Our team includes experienced stylists, colorists and stylist+colorists, led by our team leader and salon coordinator, with the Glam Haus Collective on makeup. Most artists specialize in color and extensions — tell me who you'd like to see, or let me know what you need and we'll match you.`,
      actions: [bookAction("Start Booking"), action("services", "Browse Services")]
    };
  }

  /* price for an actual service */
  if (service && (askPrice || /how much/.test(input))) {
    return {
      text: `${service.name} is one of our ${service.categoryLabel.toLowerCase()} and starts at ${service.priceLabel}. Exact pricing is confirmed when you book — I can start that for you.`,
      actions: [action("book", `Book ${service.name}`, service.id), action("services", "See Full Menu")]
    };
  }

  if (wantsExt && !service) {
    return {
      text: `${T} offers extensions starting at $599+. Ask about hand-tied extensions when you book — your stylist can recommend the right approach for your hair.`,
      actions: [bookAction("Ask About Extensions")]
    };
  }

  if (helpChoose) {
    return {
      text: `Happy to help narrow it down. A quick way is our service finder — three short questions and we'll suggest services to discuss with your stylist. Or tell me what you're hoping to change about your hair.`,
      actions: [action("finder", "Help Me Find My Service"), action("services", "Browse Services")]
    };
  }

  if (wantsPolicies) {
    const p = policies.find((x) =>
      has(input, ["cancel", "no-show", "no show", "reschedule", "late", "24 hour"])
    ) ?? policies[0];
    const out = `${p.title}: ${p.paragraphs[0]}`;
    return {
      text: `${out}\n\nYou can read the full ${T} policies on our site — or I can walk you through booking.`,
      actions: [bookAction()]
    };
  }

  if (wantsHours) {
    return { text: `We're open ${hourText()}. Want me to help you find an appointment?`, actions: [bookAction("Find an Appointment")] };
  }

  /* booking intent w/ context → suggest capture */
  if (wantsBooking && service) {
    return {
      text: `I'd be happy to help you get that started. ${service.name} starts at ${service.priceLabel} — shall we look for a time that works?`,
      actions: [action("book", `Book ${service.name}`, service.id)]
    };
  }
  if (wantsBooking) {
    return {
      text: `I'd be happy to help you get that started. You can pick your service and stylist right here — or tell me what you're interested in and roughly when, and I'll save your request for the ${T} team.`,
      actions: [bookAction(), action("human", "Talk to the Salon")]
    };
  }

  /* location & contact */
  if (wantsContact && /(where|location|address|direction)/.test(input)) {
    return {
      text: `We're at ${salon.address.street}, ${salon.address.city}, TX ${salon.address.zip}. We're open ${hourText()}.`,
      actions: [action("call", "Call the Salon"), action("instagram", "DM @salon5014", salon.instagram.url)]
    };
  }
  if (wantsContact) {
    return {
      text: `You can reach ${T} at ${salon.phone.display}, or DM us at ${salon.instagram.handle} — we're also open ${hourText()}.`,
      actions: [action("call", `Call ${salon.phone.display}`, salon.phone.tel), action("instagram", "DM on Instagram", salon.instagram.url)]
    };
  }

  /* specific service informational */
  if (service) {
    const hint = service.category === "specialty" ? "This is listed under our Hair Specialties on the official menu." : `It's part of our ${service.categoryLabel.toLowerCase()}.`;
    return {
      text: `${service.name} is offered at ${T} and starts at ${service.priceLabel}. ${hint} I can start an appointment if you'd like.`,
      actions: [action("book", `Book ${service.name}`, service.id), action("services", "See Full Menu")]
    };
  }

  if (wantsServices || qaQuestion || /menu/.test(input)) {
    const list = serviceGroups
      .map(
        (g) =>
          `${g.title}\n${g.services.map((s) => `  • ${s.name} — from ${s.priceLabel}`).join("\n")}`
      )
      .join("\n");
    return {
      text: `Here's our menu as listed at ${T}:\n\n${list}\n\nTell me which service you'd like and I'll share more or start your booking.`,
      actions: [action("services", "Open Full Menu"), bookAction()]
    };
  }

  if (greeting) {
    return {
      text: `Hi! Welcome to ${T}. How can I help today — services, pricing, hours, or booking an appointment?`,
      actions: quickActions()
    };
  }
  if (thanks) {
    return {
      text: "You're so welcome! Anything else I can help with?",
      actions: quickActions()
    };
  }
  if (bye) {
    return {
      text: `Thanks for visiting ${T} — we'd love to see you soon. Have a beautiful day!`,
      actions: quickActions()
    };
  }

  /* FAQ keywords fallback */
  const faq = faqs.find((f) => {
    const q = strip(f.q);
    return q.split(" ").filter((w) => w.length > 3).some((w) => input.includes(w));
  });
  if (faq) return { text: faq.a, actions: quickActions() };

  /* colour-intent but no service matched */
  if (wantsColor || wantsBalayage) {
    return {
      text: `We'd love to talk color. ${T} specializes in blonde balayage, caramel highlights and lived-in dimension — balayage starts at $180+ and full highlights at $200+. Tell me the look you're after and I'll point you in the right direction.`,
      actions: [bookAction("Start With a Consultation"), action("services", "See Color Menu")]
    };
  }

  return {
    text: "I don't have that information yet. I can help you contact the salon.",
    actions: humanActions(),
    unanswered: true
  };
}

function quickActions(): ChatAction[] {
  return [
    action("services", "Browse Services"),
    action("book", "Book Appointment"),
    action("finder", "Help Me Choose"),
    action("human", "Talk to the Salon")
  ];
}

export const greetingMessage = `Hi! I'm the ${T} virtual front desk. I can help with services, pricing, hours and booking. How can I help?`;
