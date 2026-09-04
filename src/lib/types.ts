/* ------------------------------------------------------------------ */
/* Shared domain types for Salon 5014                                  */
/* ------------------------------------------------------------------ */

export type ServiceCategory = "cut-style" | "color" | "specialty";

export interface SalonService {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string; // official section heading on salon5014.com
  priceFrom: number; // numeric starting price, USD
  priceLabel: string; // official "from" string, e.g. "$78+"
  blurb: string; // short neutral description of the technique (not a claim)
  keywords: string[]; // matching terms used by search + AI retrieval
}

export interface SalonServiceGroup {
  id: string;
  title: string;
  note?: string;
  services: SalonService[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string; // official role on salon5014.com
  photo: string;
  booksOnline: boolean; // whether the role receives appointments
  blurb?: string;
}

export interface WeekHours {
  day: string;
  label: string; // short label for the day column
  open: string | null; // "10:00"
  close: string | null;
  display: string; // "10 AM – 4 PM" or "Closed"
}

export interface Policy {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  preferredTimeframe: string;
  source: Channel;
  conversationSummary: string;
  createdAt: string; // ISO
  status: LeadStatus;
  intent?: "high" | "medium" | "low";
}

export type LeadStatus = "NEW" | "CONTACTED" | "BOOKED" | "CLOSED";

export type Channel = "website" | "instagram" | "whatsapp" | "email";

export interface ConversationMessage {
  id: string;
  from: "guest" | "ai" | "salon";
  text: string;
  at: string; // ISO
}

export interface Conversation {
  id: string;
  customer: string;
  channel: Channel;
  intent: string;
  status: LeadStatus | "OPEN" | "WAITING";
  lastMessage: string;
  updatedAt: string;
  messages: ConversationMessage[];
  leadId?: string;
  assignee?: string;
}

export interface ChatAction {
  type:
    | "book"
    | "bookWithStylist"
    | "call"
    | "instagram"
    | "services"
    | "finder"
    | "human"
    | "team"
    | "menu";
  label: string;
  value?: string;
}

export interface EngineReply {
  text: string;
  actions?: ChatAction[];
  /** set true when the message was not answerable → surfaced in the owner dashboard */
  unanswered?: boolean;
}
