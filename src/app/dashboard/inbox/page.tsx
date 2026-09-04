"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Send, Sparkles, UserRound, X } from "lucide-react";
import { Card, ChannelIcon, DemoTag, SourceBadge, StatusPill } from "@/components/dashboard/ui";
import { useDashboardData } from "@/components/dashboard/useData";
import { reply } from "@/lib/ai/engine";
import { setConversationMeta, upsertConversation } from "@/lib/clientStore";
import type { Channel, Conversation } from "@/lib/types";
import { cn, timeAgo, uid } from "@/lib/utils";

const TABS: { id: Channel | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "website", label: "Website" },
  { id: "instagram", label: "Instagram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" }
];

export default function InboxPage() {
  const data = useDashboardData();
  const [tab, setTab] = useState<Channel | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [list, setList] = useState<Conversation[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (data.ready) {
      setList(data.convos);
      setSelectedId((cur) => cur ?? data.convos[0]?.id ?? null);
    }
  }, [data.ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(
    () => (tab === "all" ? list : list.filter((c) => c.channel === tab)),
    [list, tab]
  );
  const selected = list.find((c) => c.id === selectedId) ?? null;

  /** demo seeds are cloned into the live store on first interaction */
  const ensureLive = (conv: Conversation) => {
    if (!conv.id.startsWith("seed")) {
      upsertConversation(conv);
      return conv;
    }
    const live = upsertConversation({ ...conv, id: uid("conv") });
    setList((l) => l.map((c) => (c.id === conv.id ? live : c)));
    setSelectedId(live.id);
    setTick((t) => t + 1);
    return live;
  };

  const mutate = (id: string, fn: (c: Conversation) => Conversation) => {
    const conv = list.find((c) => c.id === id);
    if (!conv) return;
    const next = ensureLive(fn(conv));
    setList((l) => l.map((c) => (c.id === next.id ? next : c)));
  };

  if (!data.ready) {
    return <div className="h-96 animate-pulse bg-line/50" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="serif-display text-3xl font-light text-ink sm:text-4xl">Inbox</h1>
            <DemoTag />
          </div>
          <p className="mt-1.5 text-sm text-muted">
            One place for every conversation — the same AI knowledge base powers
            website, Instagram, WhatsApp and email.
          </p>
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Channel filter">
          {TABS.map((t) => {
            const count = t.id === "all" ? list.length : list.filter((c) => c.channel === t.id).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                  tab === t.id
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-ivory text-muted hover:border-ink/40 hover:text-ink"
                )}
              >
                {t.label}
                <span className={cn("ml-1.5", tab === t.id ? "text-ivory/60" : "text-copper")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-h-[560px] gap-0 border border-line bg-ivory lg:grid-cols-[minmax(320px,380px)_1fr]">
        {/* ------- list ------- */}
        <div className={cn("border-line lg:border-r", selected ? "hidden lg:block" : "block")}>
          <ul className="divide-y divide-line">
            {visible.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-cream/70",
                    selectedId === c.id && "bg-sand/80 hover:bg-sand/80"
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <ChannelIcon channel={c.channel} />
                      <span className="truncate text-sm font-semibold text-ink">
                        {c.customer}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] text-muted">{timeAgo(c.updatedAt)}</span>
                  </span>
                  <span className="pl-9 text-xs text-muted">{c.intent}</span>
                  <span className="flex items-center justify-between gap-2 pl-9">
                    <span className="truncate text-[13px] text-ink/80">“{c.lastMessage}”</span>
                    <StatusPill status={c.status} />
                  </span>
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="px-6 py-16 text-center text-sm text-muted">
                No conversations on this channel yet.
              </li>
            )}
          </ul>
        </div>

        {/* ------- thread ------- */}
        <div className={cn("flex min-h-[560px] flex-col", !selected && "hidden lg:flex")}>
          {selected ? (
            <ThreadPanel
              conv={selected}
              onBack={() => setSelectedId(null)}
              onChange={(c) => mutate(c.id, () => c)}
              onMutate={(fn) => mutate(selected.id, fn)}
              tick={tick}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">
              Select a conversation to view the thread
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ThreadPanel({
  conv,
  onBack,
  onChange,
  onMutate,
  tick
}: {
  conv: Conversation;
  onBack: () => void;
  onChange: (c: Conversation) => void;
  onMutate: (fn: (c: Conversation) => Conversation) => void;
  tick: number;
}) {
  const [draft, setDraft] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [justReplied, setJustReplied] = useState(false);

  const lastGuest = [...conv.messages].reverse().find((m) => m.from === "guest");

  const suggest = () => {
    if (!lastGuest) return;
    setSuggestion(reply(lastGuest.text, { channel: conv.channel }).text);
  };

  const sendReply = () => {
    const text = draft.trim();
    if (!text) return;
    const at = new Date().toISOString();
    const next: Conversation = {
      ...conv,
      lastMessage: text,
      updatedAt: at,
      status: conv.status === "NEW" ? "CONTACTED" : conv.status,
      messages: [...conv.messages, { id: uid("m"), from: "salon", text, at }]
    };
    onChange(next);
    setDraft("");
    setSuggestion(null);
    setJustReplied(true);
    window.setTimeout(() => setJustReplied(false), 2000);
  };

  const quickAction = (label: string, fn: () => void) => (
    <button
      key={label}
      type="button"
      onClick={fn}
      className="rounded-full border border-line px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
    >
      {label}
    </button>
  );

  void tick;
  void onMutate;
  const actions = [
    quickAction("Mark as lead", () =>
      onMutate((c) => setMeta(c, { status: "NEW", assignee: c.assignee ?? "You" }))
    ),
    quickAction("Book", () =>
      onMutate((c) => setMeta(c, { status: "BOOKED", assignee: c.assignee ?? "You" }))
    ),
    quickAction("Assign", () =>
      onMutate((c) =>
        setMeta(c, { assignee: c.assignee === "You" ? "Unassigned" : "You" })
      )
    ),
    quickAction("Close", () => onMutate((c) => setMeta(c, { status: "CLOSED" })))
  ];

  return (
    <>
      {/* thread header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversation list"
            className="flex h-9 w-9 items-center justify-center border border-line lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <ChannelIcon channel={conv.channel} />
          <div>
            <p className="text-sm font-semibold text-ink">{conv.customer}</p>
            <p className="text-[11px] text-muted">
              {conv.intent}
              {conv.assignee && conv.assignee !== "Unassigned" && (
                <span className="ml-2 text-copper">· assigned to {conv.assignee}</span>
              )}
            </p>
          </div>
        </div>
        <StatusPill status={conv.status} />
      </div>

      {/* messages */}
      <div className="thin-scroll flex-1 space-y-3 overflow-y-auto bg-cream/50 px-5 py-6">
        {conv.messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex",
              m.from === "guest" ? "justify-start" : m.from === "ai" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[78%] rounded-sm px-4 py-3 text-[13.5px] leading-relaxed",
                m.from === "guest" && "border border-line bg-ivory text-ink",
                m.from === "ai" && "bg-sand text-ink",
                m.from === "salon" && "bg-ink text-ivory"
              )}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              <p
                className={cn(
                  "mt-1.5 text-[10px]",
                  m.from === "salon" ? "text-ivory/50" : "text-muted"
                )}
              >
                {m.from === "guest" ? conv.customer : m.from === "ai" ? "AI Front Desk" : "You"} ·{" "}
                {new Date(m.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {justReplied && (
          <p className="flex items-center gap-2 pt-1 text-xs text-emerald-700">
            <Check className="h-3.5 w-3.5" /> Reply sent on the {conv.channel} channel
            (simulated — connect the channel to send for real).
          </p>
        )}
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-ivory px-5 py-3">
        {actions}
      </div>

      {/* composer */}
      <div className="border-t border-line bg-ivory px-5 py-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={suggest}
            disabled={!lastGuest}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-copper/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-copper transition-colors hover:bg-copper hover:text-ivory disabled:opacity-40"
          >
            <Sparkles className="h-3 w-3" /> AI suggest reply
          </button>
        </div>
        {suggestion && (
          <div className="mt-2 rounded-sm border border-copper/25 bg-copper/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-copper">Suggested (same knowledge base as the website chat)</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink">{suggestion}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(suggestion);
                  setSuggestion(null);
                }}
                className="border border-copper px-3 py-1.5 text-[11px] font-semibold text-copper hover:bg-copper hover:text-ivory"
              >
                Use this reply
              </button>
              <button
                type="button"
                onClick={() => setSuggestion(null)}
                aria-label="Dismiss suggestion"
                className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="mt-3 flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder={`Reply on ${conv.channel}…`}
            className="min-h-[52px] flex-1 resize-none border border-line bg-cream/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
          />
          <button
            type="button"
            onClick={sendReply}
            disabled={!draft.trim()}
            aria-label="Send reply"
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center bg-ink text-ivory transition-colors hover:bg-copper-deep disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-muted">
          Demo inbox — sending simulates the channel. Connect Instagram / WhatsApp /
          Email to deliver real messages.
        </p>
      </div>
    </>
  );
}

function setMeta(
  c: Conversation,
  meta: Partial<Pick<Conversation, "status" | "assignee">>
): Conversation {
  const next = { ...c, ...meta, updatedAt: new Date().toISOString() };
  // persist (seed conversations are cloned into the live store by the caller)
  if (!next.id.startsWith("seed")) {
    setConversationMeta(next.id, meta);
  }
  return next;
}
