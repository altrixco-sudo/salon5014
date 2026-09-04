"use client";

import type { Channel, Conversation, ConversationMessage, Lead, LeadStatus } from "@/lib/types";
import { uid } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Local demo persistence (no backend configured).                    */
/*  When the salon connects a CRM / booking provider, these writes     */
/*  become the payloads posted to the integration layer.               */
/* ------------------------------------------------------------------ */

const KEYS = {
  leads: "s5014_leads_v1",
  convos: "s5014_convos_v1",
  bookings: "s5014_bookings_v1",
  unanswered: "s5014_unanswered_v1"
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / private mode — demo continues without persistence */
  }
}

/* ------------------------------------------------ leads */

export type LeadInput = {
  name: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  preferredTimeframe?: string;
  source: Channel;
  conversationSummary?: string;
};

export function saveLead(input: LeadInput): Lead {
  const lead: Lead = {
    id: uid("lead"),
    name: input.name || "Guest",
    email: input.email ?? "",
    phone: input.phone ?? "",
    serviceInterest: input.serviceInterest ?? "",
    preferredTimeframe: input.preferredTimeframe ?? "",
    source: input.source,
    conversationSummary: input.conversationSummary ?? "",
    createdAt: new Date().toISOString(),
    status: "NEW"
  };
  const leads = read<Lead[]>(KEYS.leads, []);
  leads.unshift(lead);
  write(KEYS.leads, leads);
  return lead;
}

export function listLeads(): Lead[] {
  return read<Lead[]>(KEYS.leads, []);
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  const leads = listLeads().map((l) => (l.id === id ? { ...l, status } : l));
  write(KEYS.leads, leads);
}

export function leadAutomationTimeline() {
  return [
    { step: "Lead captured", desc: "Conversation saved from the channel" },
    { step: "AI qualification", desc: "Intent + service interest extracted" },
    { step: "Booking link sent", desc: "Personalized link when connected" },
    { step: "Follow-up reminder", desc: "Automatic nudge after 24h" },
    { step: "Salon team notified", desc: "Slack / dashboard alert" }
  ];
}

/* ------------------------------------------------ conversations */

export function saveConversation(c: {
  customer: string;
  channel: Channel;
  intent: string;
  messages: ConversationMessage[];
  leadId?: string;
}): Conversation {
  const last = c.messages[c.messages.length - 1];
  const conv: Conversation = {
    id: uid("conv"),
    customer: c.customer,
    channel: c.channel,
    intent: c.intent,
    status: "NEW",
    lastMessage: last?.text ?? "",
    updatedAt: new Date().toISOString(),
    messages: c.messages,
    leadId: c.leadId
  };
  const convos = read<Conversation[]>(KEYS.convos, []);
  convos.unshift(conv);
  write(KEYS.convos, convos);
  return conv;
}

export function listConversations(): Conversation[] {
  return read<Conversation[]>(KEYS.convos, []);
}

export function appendMessage(
  convId: string,
  msg: Pick<ConversationMessage, "from" | "text">
) {
  const convos = listConversations().map((c) =>
    c.id === convId
      ? {
          ...c,
          lastMessage: msg.text,
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, { ...msg, id: uid("m"), at: new Date().toISOString() }]
        }
      : c
  );
  write(KEYS.convos, convos);
}

export function replyToConversation(convId: string, reply: string) {
  appendMessage(convId, { from: "salon", text: reply });
}

export function upsertConversation(c: Conversation): Conversation {
  const convos = listConversations();
  const i = convos.findIndex((x) => x.id === c.id);
  if (i >= 0) convos[i] = c;
  else convos.unshift(c);
  write(KEYS.convos, convos);
  return c;
}

export function setConversationMeta(
  convId: string,
  meta: Partial<Pick<Conversation, "status" | "assignee">>
) {
  const convos = listConversations().map((c) =>
    c.id === convId ? { ...c, ...meta } : c
  );
  write(KEYS.convos, convos);
}

/* ------------------------------------------------ bookings */

export interface DemoBooking {
  id: string;
  service: string;
  stylist: string;
  date: string; // ISO date
  time: string; // 24h
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export function saveBooking(b: Omit<DemoBooking, "id" | "createdAt">): DemoBooking {
  const booking: DemoBooking = { ...b, id: uid("bk"), createdAt: new Date().toISOString() };
  const all = read<DemoBooking[]>(KEYS.bookings, []);
  all.unshift(booking);
  write(KEYS.bookings, all);
  return booking;
}

export function listBookings(): DemoBooking[] {
  return read<DemoBooking[]>(KEYS.bookings, []);
}

/* ------------------------------------------------ unanswered questions */

export function recordUnanswered(q: string) {
  const all = read<{ q: string; at: string }[]>(KEYS.unanswered, []);
  all.unshift({ q, at: new Date().toISOString() });
  write(KEYS.unanswered, all.slice(0, 50));
}

export function listUnanswered() {
  return read<{ q: string; at: string }[]>(KEYS.unanswered, []);
}

/* ------------------------------------------------ shared helpers */

export function resetDemoData() {
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}

export { KEYS };
