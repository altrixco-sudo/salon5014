"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  Instagram,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X
} from "lucide-react";
import { greetingMessage, reply } from "@/lib/ai/engine";
import { allServices, salon } from "@/data/salonData";
import type { ChatAction } from "@/lib/types";
import {
  leadAutomationTimeline,
  recordUnanswered,
  saveConversation,
  saveLead
} from "@/lib/clientStore";
import { ServiceFinderModal } from "@/components/finder/ServiceFinderModal";
import { cn, uid } from "@/lib/utils";

type TextBubble = { id: string; role: "ai" | "user"; text: string };

type KindBubble = { id: string; role: "ai"; kind: "typing" } |
  { id: string; role: "ai"; kind: "actions"; actions: ChatAction[] } |
  { id: string; role: "ai"; kind: "offer" } |
  { id: string; role: "ai"; kind: "timeline"; name: string } |
  { id: string; role: "ai"; kind: "done" };

type Bubble = TextBubble | KindBubble;

type Awaiting = "name" | "contact" | null;

const OFFER_RE =
  /\b(book|booking|appointment|reserve|schedule|call me|call back|reach (out|me)|interested|want|need|looking for|not sure|unsure)\b/i;

const TIMEFRAME_RE =
  /(this week|next week|next 2 weeks|next two weeks|this month|next month|asap|soon|just exploring|weekend)/i;

export function AiFrontDesk() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Bubble[]>([]);
  const [input, setInput] = useState("");
  const [awaiting, setAwaiting] = useState<Awaiting>(null);
  const [showFinder, setShowFinder] = useState(false);
  const [timelineDone, setTimelineDone] = useState(false);

  const transcriptRef = useRef<{ role: "guest" | "ai"; text: string }[]>([]);
  const draftRef = useRef<{
    name?: string;
    email?: string;
    phone?: string;
    serviceInterest?: string;
    preferredTimeframe?: string;
  }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const askedOfferRef = useRef(false);
  const leadSavedRef = useRef(false);
  const busyRef = useRef(false);

  const scrollDown = useCallback(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, []);

  useEffect(() => scrollDown(), [msgs, open, scrollDown]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 380);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open || msgs.length) return;
    setMsgs([{ id: uid("m"), role: "ai", text: greetingMessage }]);
  }, [open, msgs.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const push = (b: Bubble) => setMsgs((m) => [...m, b]);
  const sayAi = (text: string) => push({ id: uid("m"), role: "ai", text });

  /** simulate the assistant composing for a beat, then run */
  const think = (then: () => void) => {
    if (busyRef.current) return;
    busyRef.current = true;
    push({ id: uid("m"), role: "ai", kind: "typing" });
    window.setTimeout(() => {
      setMsgs((m) => m.filter((x) => !("kind" in x) || x.kind !== "typing"));
      busyRef.current = false;
      then();
    }, 700 + Math.random() * 550);
  };

  const handleAction = (a: ChatAction) => {
    switch (a.type) {
      case "book":
        setOpen(false);
        router.push(a.value ? `/book?service=${a.value}` : "/book");
        break;
      case "bookWithStylist":
        setOpen(false);
        router.push(a.value ? `/book?stylist=${a.value}` : "/book");
        break;
      case "team":
        setOpen(false);
        router.push("/team");
        break;
      case "services":
        setOpen(false);
        router.push("/services");
        break;
      case "finder":
        setShowFinder(true);
        break;
      case "call":
        window.location.href = a.value ?? salon.phone.tel;
        break;
      case "instagram":
        window.open(a.value ?? salon.instagram.url, "_blank", "noopener");
        break;
      case "human":
        think(() => {
          sayAi(
            "Of course. Here are the easiest ways to reach the Salon 5014 team directly:"
          );
          push({
            id: uid("m"),
            role: "ai",
            kind: "actions",
            actions: [
              { type: "call", label: "Call the Salon" },
              { type: "instagram", label: "DM @salon5014", value: salon.instagram.url },
              { type: "book", label: "Book Appointment" }
            ]
          });
        });
        break;
      case "menu":
        push({
          id: uid("m"),
          role: "ai",
          kind: "actions",
          actions: [
            { type: "services", label: "Browse Services" },
            { type: "finder", label: "Help Me Choose" },
            { type: "human", label: "Talk to the Salon" },
            { type: "book", label: "Book Appointment" }
          ]
        });
        break;
      default:
        break;
    }
  };

  /* capture intent context from whatever the guest typed */
  const noteInterest = (text: string) => {
    const lower = text.toLowerCase();
    const service =
      allServices.find((s) => {
        const first = s.name.split(" ")[0].toLowerCase();
        return first.length > 3 && lower.includes(first);
      }) ??
      allServices.find((s) =>
        s.keywords.some((k) => k.split(" ").length === 1 && lower.includes(k))
      );
    const timeframe = TIMEFRAME_RE.exec(text)?.[0] ?? "";
    if (service) draftRef.current.serviceInterest = service.name;
    if (timeframe) draftRef.current.preferredTimeframe = timeframe;
  };

  const offerLeadCapture = () => {
    if (askedOfferRef.current || leadSavedRef.current) return;
    askedOfferRef.current = true;
    push({ id: uid("m"), role: "ai", kind: "offer" });
  };

  /* ---------------- lead capture flow ---------------- */

  const finishLead = () => {
    const d = draftRef.current;
    const lead = saveLead({
      name: d.name || "Chat guest",
      email: d.email ?? "",
      phone: d.phone ?? "",
      serviceInterest: d.serviceInterest ?? "",
      preferredTimeframe: d.preferredTimeframe ?? "",
      source: "website",
      conversationSummary: transcriptRef.current
        .slice(-8)
        .map((m) => `${m.role === "guest" ? "Visitor" : "AI"}: ${m.text}`)
        .join(" · ")
        .slice(0, 420)
    });
    leadSavedRef.current = true;
    saveConversation({
      customer: lead.name,
      channel: "website",
      intent: lead.serviceInterest
        ? `Booking — ${lead.serviceInterest}`
        : "Lead capture",
      leadId: lead.id,
      messages: transcriptRef.current.map((m, i) => ({
        id: uid("m"),
        from: m.role,
        text: m.text,
        at: new Date(Date.now() - (transcriptRef.current.length - i) * 25000).toISOString()
      }))
    });
    push({ id: uid("m"), role: "ai", kind: "timeline", name: lead.name.split(" ")[0] || "friend" });
    setTimelineDone(false);
    const steps = leadAutomationTimeline();
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        window.clearInterval(tick);
        setTimelineDone(true);
        window.setTimeout(() => {
          push({ id: uid("m"), role: "ai", kind: "done" });
          window.setTimeout(() => {
            sayAi("Anything else I can help with — or would you like to book right now?");
            push({
              id: uid("m"),
              role: "ai",
              kind: "actions",
              actions: [{ type: "book", label: "Book Appointment" }, { type: "menu", label: "Ask something else" }]
            });
          }, 500);
        }, 700);
      }
    }, 850);
  };

  const captureAnswer = (raw: string) => {
    const t = raw.trim();
    const emailLike = /\S+@\S+\.\S+/.test(t);
    const digits = t.replace(/\D/g, "");
    const phoneLike = digits.length >= 7;
    const d = draftRef.current;

    if (awaiting === "name") {
      d.name = t.replace(/^my (name is|first name is)\s+/i, "") || "friend";
      setAwaiting("contact");
      sayAi(
        `Nice to meet you, ${d.name.split(" ")[0]}! What's the best email or phone for the team to reach you?`
      );
      return;
    }
    // awaiting === "contact"
    if (emailLike) d.email = t;
    if (phoneLike) d.phone = t;
    if (!emailLike && !phoneLike) {
      sayAi("No worries — you can also tap “No thanks” if you'd rather not share anything.");
      setAwaiting(null);
      return;
    }
    if (emailLike && !phoneLike) {
      sayAi("Perfect — and a phone number in case email isn't best?");
      return; // stay in "contact", they may type a number next
    }
    finishLead();
  };

  /* ---------------- main entry ---------------- */

  const onUserText = (raw: string) => {
    const text = raw.trim();
    if (!text || busyRef.current) return;
    setInput("");
    push({ id: uid("m"), role: "user", text });

    /* mid-capture answers route to the flow */
    if (awaiting) {
      transcriptRef.current.push({ role: "guest", text });
      if (/^(no|nah|not really|skip|never mind|no thanks|pass)\b/i.test(text)) {
        setAwaiting(null);
        think(() => sayAi("No problem at all. Is there anything else I can help with?"));
        return;
      }
      think(() => captureAnswer(text));
      return;
    }

    noteInterest(text);
    transcriptRef.current.push({ role: "guest", text });

    think(() => {
      const res = reply(text);
      if (res.unanswered) recordUnanswered(text);
      sayAi(res.text);
      if (res.actions?.length) {
        push({ id: uid("m"), role: "ai", kind: "actions", actions: res.actions });
      }
      if (OFFER_RE.test(text) && !askedOfferRef.current && !leadSavedRef.current) {
        window.setTimeout(offerLeadCapture, 650);
      }
    });
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with the Salon 5014 AI Front Desk"
          className="group fixed bottom-5 right-5 z-[70] flex items-center sm:bottom-7 sm:right-7"
        >
          <span className="mr-3 hidden rounded-full border border-ink/15 bg-ivory px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide2 text-ink shadow-card transition-all duration-300 group-hover:-translate-x-1 md:block">
            AI Front Desk
          </span>
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-ivory shadow-lift transition-all duration-300 group-hover:scale-105 group-hover:bg-copper-deep sm:h-16 sm:w-16">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-cream bg-[#3f9d5f]" />
          </span>
        </button>
      )}

      {open && (
        <section
          aria-label="Salon 5014 AI Front Desk chat"
          className="fixed inset-0 z-[75] flex animate-chatIn flex-col bg-cream sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100dvh-120px))] sm:w-[400px] sm:border sm:border-line sm:shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#221C15] px-5 py-4 text-ivory">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25">
                <Sparkles className="h-4 w-4 text-copper-soft" />
              </div>
              <div>
                <p className="text-[13px] font-semibold tracking-wide">AI Front Desk</p>
                <p className="text-[11px] text-ivory/55">
                  Salon 5014 · demo knowledge base
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-ivory"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </header>

          <div ref={listRef} className="thin-scroll flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            <div className="space-y-4">
              {msgs.map((m) => (
                <MessageView
                  key={m.id}
                  m={m}
                  timelineDone={timelineDone}
                  onAction={handleAction}
                  onAccept={() => {
                    think(() => {
                      setAwaiting("name");
                      sayAi(
                        "I'd be happy to help you get that started. May I have your first name?"
                      );
                    });
                  }}
                  onDecline={() => {
                    setAwaiting(null);
                    sayAi("No problem at all. Is there anything else I can help with?");
                  }}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-line bg-ivory/85 px-4 pb-4 pt-3 backdrop-blur-sm sm:px-5">
            {msgs.length <= 2 && (
              <div className="thin-scroll mb-3 flex gap-2 overflow-x-auto pb-1">
                {[
                  "Browse services",
                  "What does balayage cost?",
                  "Help me choose a service",
                  "Find an appointment",
                  "Talk to the salon"
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => onUserText(chip)}
                    className="shrink-0 rounded-full border border-line bg-cream px-4 py-2 text-xs font-medium text-ink transition-all hover:border-ink"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onUserText(input)}
                type="text"
                enterKeyHint="send"
                aria-label="Message the front desk"
                placeholder={
                  awaiting === "name"
                    ? "Your first name…"
                    : awaiting
                      ? "Email or phone number…"
                      : "Ask about services, prices, hours…"
                }
                className="min-h-[48px] flex-1 border border-line bg-ivory px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
              />
              <button
                type="button"
                onClick={() => onUserText(input)}
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink text-ivory transition-colors hover:bg-copper-deep disabled:opacity-35"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted/70">
              Demo assistant — answers come from the Salon 5014 knowledge base only
            </p>
          </div>
        </section>
      )}

      <ServiceFinderModal
        open={showFinder}
        onClose={() => setShowFinder(false)}
        onBookService={(id) => {
          setOpen(false);
          router.push(id === "consultation" ? "/book" : `/book?service=${id}`);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */

function MessageView({
  m,
  timelineDone,
  onAction,
  onAccept,
  onDecline
}: {
  m: Bubble;
  timelineDone: boolean;
  onAction: (a: ChatAction) => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  if ("kind" in m && m.kind === "typing") {
    return (
      <div className="flex justify-start">
        <div className="flex items-center gap-1 rounded-full bg-sand px-4 py-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40 [animation-delay:140ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40 [animation-delay:280ms]" />
        </div>
      </div>
    );
  }

  if ("kind" in m && m.kind === "actions") {
    return (
      <div className="flex flex-wrap gap-2 animate-chatIn">
        {m.actions.map((a) => (
          <ActionChip key={a.label} a={a} onAction={onAction} />
        ))}
      </div>
    );
  }

  if ("kind" in m && m.kind === "offer") {
    return (
      <div className="animate-chatIn space-y-2.5">
        <p className="max-w-[90%] rounded-sm bg-sand px-4 py-3 text-[14px] leading-relaxed text-ink">
          Would you like me to save your request so the Salon 5014 team can follow
          up with you?
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center gap-1.5 bg-copper px-4 py-3 text-[11px] font-semibold uppercase tracking-wide2 text-ivory transition-colors hover:bg-copper-deep"
          >
            Yes, save my details <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="border border-line bg-ivory px-4 py-3 text-[11px] font-semibold uppercase tracking-wide2 text-muted transition-colors hover:border-ink hover:text-ink"
          >
            No thanks
          </button>
        </div>
      </div>
    );
  }

  if ("kind" in m && m.kind === "timeline") {
    return (
      <div className="animate-chatIn space-y-2.5 rounded-sm border border-line bg-ivory p-4">
        <p className="text-[13px] font-semibold text-ink">
          Saving your request, {m.name}…
        </p>
        <ol className="space-y-1.5">
          {leadAutomationTimeline().map((s, i) => (
            <li key={s.step} className="flex items-center gap-2.5 text-xs text-muted">
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] transition-colors",
                  timelineDone
                    ? "border-[#3f9d5f] bg-[#3f9d5f] text-white"
                    : "border-line bg-cream"
                )}
              >
                {timelineDone ? "✓" : i + 1}
              </span>
              <span className="flex-1">{s.step}</span>
              <span className="font-medium text-copper">
                {timelineDone ? "done" : "…"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if ("kind" in m && m.kind === "done") {
    return (
      <p className="max-w-[90%] animate-chatIn rounded-sm bg-copper px-4 py-3 text-[14px] leading-relaxed text-ivory">
        Thanks! We&apos;ve saved your request. The Salon 5014 team can follow up
        with you — no need to do anything else.
      </p>
    );
  }

  const isUser = !("kind" in m) && m.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-sm px-4 py-3 text-[14px] leading-relaxed",
          isUser ? "bg-ink text-ivory" : "bg-sand text-ink"
        )}
      >
        <p className="whitespace-pre-line">{m.text}</p>
      </div>
    </div>
  );
}

function ActionChip({ a, onAction }: { a: ChatAction; onAction: (a: ChatAction) => void }) {
  const Icon =
    a.type === "book" || a.type === "bookWithStylist"
      ? CalendarCheck
      : a.type === "call"
        ? Phone
        : a.type === "instagram"
          ? Instagram
          : a.type === "human" || a.type === "menu" || a.type === "finder" || a.type === "team"
            ? ArrowRight
            : ArrowRight;
  const primary =
    a.type === "book" ||
    a.type === "bookWithStylist" ||
    a.type === "call" ||
    a.type === "human";
  return (
    <button
      type="button"
      onClick={() => onAction(a)}
      className={cn(
        "inline-flex min-h-[42px] items-center gap-2 px-4 text-[11px] font-semibold uppercase tracking-wide2 transition-colors",
        primary
          ? "bg-copper text-ivory hover:bg-copper-deep"
          : "border border-ink/25 bg-ivory text-ink hover:border-ink hover:bg-ink hover:text-ivory"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {a.label}
    </button>
  );
}
