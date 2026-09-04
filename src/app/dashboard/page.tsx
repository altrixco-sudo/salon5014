"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  HelpCircle,
  Inbox as InboxIcon,
  Sparkles,
  Users
} from "lucide-react";
import { Card, DemoTag, SectionTitle, SourceBadge, Stat, StatusPill } from "@/components/dashboard/ui";
import { useDashboardData } from "@/components/dashboard/useData";
import { updateLeadStatus } from "@/lib/clientStore";
import type { LeadStatus } from "@/lib/types";
import { cn, displayDate, timeAgo } from "@/lib/utils";

export default function DashboardOverview() {
  const data = useDashboardData();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    data.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  if (!data.ready) return <Loading />;

  const newLeads = data.leads.filter((l) => l.status === "NEW").length;
  const highIntent = data.leads.filter((l) => l.intent === "high").length;
  const followUps = data.leads.filter((l) => l.status === "NEW" || l.status === "CONTACTED").length;

  const allStatuses: LeadStatus[] = ["NEW", "CONTACTED", "BOOKED", "CLOSED"];

  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="serif-display text-3xl font-light text-ink sm:text-4xl">
              Owner Dashboard
            </h1>
            <DemoTag />
          </div>
          <p className="mt-1.5 text-sm text-muted">
            What the AI Front Desk captured for {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.
            Sample records shown; anything you capture in the website chat appears here too.
          </p>
        </div>
        <Link href="/dashboard/inbox" className="btn-solid">
          <InboxIcon className="h-3.5 w-3.5" /> Open inbox
        </Link>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="New Leads" value={newLeads} note="In last 7 days" icon={<Users className="h-4 w-4" />} accent />
        <Stat label="High-Intent Leads" value={highIntent} note="Ready to book" icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Appointments Requested" value={data.bookingsCount} note="Bookings + requests" icon={<CalendarClock className="h-4 w-4" />} />
        <Stat label="Unanswered Questions" value={data.unanswered.length} note="AI needs a hand" icon={<HelpCircle className="h-4 w-4" />} />
        <Stat label="Follow-ups Needed" value={followUps} note="NEW + CONTACTED" icon={<InboxIcon className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* leads table */}
        <div>
          <SectionTitle
            title="Leads"
            sub="Name · interest · intent · contact · source · status"
            right={<DemoTag>Demo data</DemoTag>}
          />
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Service interest</th>
                  <th className="px-4 py-3 font-semibold">Intent</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-cream/70">
                    <td className="px-4 py-3.5 font-medium text-ink">{lead.name}</td>
                    <td className="px-4 py-3.5 text-muted">
                      {lead.serviceInterest || "—"}
                      {lead.preferredTimeframe && (
                        <span className="block text-[11px] text-copper">{lead.preferredTimeframe}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <IntentPill intent={lead.intent} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted">
                      {lead.email && <span className="block">{lead.email}</span>}
                      {lead.phone && <span className="block">{lead.phone}</span>}
                      {!lead.email && !lead.phone && <span className="text-muted/60">no contact yet</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <SourceBadge channel={lead.source} />
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        aria-label={`Status for ${lead.name}`}
                        onChange={(e) => {
                          updateLeadStatus(lead.id, e.target.value as LeadStatus);
                          setTick((t) => t + 1);
                        }}
                        className="cursor-pointer rounded-full border border-line bg-transparent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink outline-none focus:border-copper"
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted">{displayDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* right rail */}
        <div className="space-y-6">
          <div>
            <SectionTitle title="Unanswered questions" right={<DemoTag />} />
            <Card className="divide-y divide-line">
              {data.unanswered.map((u) => (
                <div key={u.q + u.at} className="px-5 py-4">
                  <p className="text-sm leading-relaxed text-ink">“{u.q}”</p>
                  <p className="mt-1 text-[11px] text-muted">
                    Needs a human answer · {timeAgo(u.at)}
                  </p>
                </div>
              ))}
              {data.unanswered.length === 0 && (
                <p className="px-5 py-8 text-sm text-muted">Nothing to review — nice work.</p>
              )}
            </Card>
          </div>

          <div>
            <SectionTitle title="Follow-up automation" right={<DemoTag />} />
            <Card className="p-5">
              <ol className="space-y-0">
                {[
                  ["Lead captured", "Conversation saved from the channel"],
                  ["AI qualification", "Intent + service interest extracted"],
                  ["Booking link sent", "Personalized link when connected"],
                  ["Follow-up reminder", "Automatic nudge after 24h"],
                  ["Salon team notified", "Dashboard + channel alert"]
                ].map(([t, d], i, arr) => (
                  <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                    {i < arr.length - 1 && (
                      <span className="absolute left-[7px] top-4 h-full w-px bg-line" />
                    )}
                    <span className="relative mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-copper bg-ivory">
                      <span className="h-1.5 w-1.5 rounded-full bg-copper" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t}</p>
                      <p className="text-xs text-muted">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
                No emails are sent in demo mode. Connect an email provider to activate
                real follow-ups.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* analytics */}
      <div>
        <SectionTitle
          title="Conversation analytics"
          sub="Sample analytics — illustrative numbers for the demo, not real salon results."
          right={<DemoTag>Sample</DemoTag>}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-wider text-muted">
              This week · chats vs. leads
            </p>
            <div className="flex h-44 items-end gap-3">
              {data.demo.map((d, i) => (
                <div key={d.day} className="group flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full flex-1 items-end justify-center gap-1">
                    <div
                      className="w-2.5 rounded-t-sm bg-line transition-colors group-hover:bg-ink/40"
                      style={{ height: `${d.chats * 4}px` }}
                      title={`${d.chats} chats`}
                    />
                    <div
                      className="w-2.5 rounded-t-sm bg-copper transition-colors group-hover:bg-copper-deep"
                      style={{ height: `${d.leads * 9}px` }}
                      title={`${d.leads} leads`}
                    />
                  </div>
                  <span className="text-[10px] text-muted">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-5 border-t border-line pt-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-line" /> Chats
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-copper" /> Leads
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Top questions
            </p>
            <ul className="space-y-3">
              {data.topQuestions.map((t, i) => (
                <li key={t.q} className="flex items-center gap-3">
                  <span className="w-5 text-right text-sm text-muted">{i + 1}</span>
                  <span className="flex-1 truncate text-sm text-ink">{t.q}</span>
                  <Bar n={t.n} max={data.topQuestions[0]?.n ?? 1} />
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Most requested services
            </p>
            <ul className="space-y-3">
              {data.topServices.map((t) => (
                <li key={t.s} className="flex items-center gap-3">
                  <span className="w-28 truncate text-sm text-ink">{t.s}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full rounded-full bg-copper"
                      style={{ width: `${(t.n / 31) * 100}%` }}
                    />
                  </span>
                  <span className="w-7 text-right text-xs text-muted">{t.n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-line pt-3 text-[11px] text-muted">
              Balayage is a clear front-runner — exactly what the front desk should
              be ready for.
            </p>
          </Card>
        </div>
      </div>

      {/* conversation previews */}
      <div>
        <SectionTitle
          title="Recent conversations"
          sub="How guests reached the AI Front Desk"
          right={
            <Link href="/dashboard/inbox" className="text-xs font-semibold uppercase tracking-wider text-copper hover:text-copper-deep">
              Open inbox →
            </Link>
          }
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {data.convos.slice(0, 3).map((c) => (
            <Card key={c.id} className="flex flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{c.customer}</p>
                <div className="flex items-center gap-2">
                  <SourceBadge channel={c.channel} />
                  <StatusPill status={c.status} />
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted">{c.intent}</p>
              <div className="mt-4 space-y-2 border-l border-line pl-3">
                {c.messages.slice(-3).map((m) => (
                  <p key={m.id} className="text-[13px] leading-relaxed text-muted">
                    <span className={cn("font-semibold", m.from === "guest" ? "text-ink" : m.from === "ai" ? "text-copper" : "text-emerald-800")}>
                      {m.from === "guest" ? "Visitor" : m.from === "ai" ? "AI" : "Salon"}:
                    </span>{" "}
                    {m.text}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntentPill({ intent }: { intent?: "high" | "medium" | "low" }) {
  if (!intent) return <span className="text-xs text-muted/60">—</span>;
  const styles = {
    high: "bg-emerald-100/80 text-emerald-900 border-emerald-200",
    medium: "bg-amber-100/80 text-amber-900 border-amber-200",
    low: "bg-line/60 text-muted border-line"
  };
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", styles[intent])}>
      {intent}
    </span>
  );
}

function Bar({ n, max }: { n: number; max: number }) {
  return (
    <span className="flex h-5 w-16 items-center overflow-hidden rounded-full bg-line">
      <span
        className="h-full rounded-full bg-copper/70"
        style={{ width: `${(n / max) * 100}%` }}
      />
    </span>
  );
}

function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-14 w-2/3 animate-pulse bg-line/60" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse bg-line/60" />
        ))}
      </div>
      <div className="h-96 animate-pulse bg-line/50" />
    </div>
  );
}
