"use client";

import { useState } from "react";
import { Check, CircleHelp, Lock, Plug, Unplug } from "lucide-react";
import { Card, DemoTag, SectionTitle } from "@/components/dashboard/ui";
import { integrationCatalog } from "@/lib/demoData";
import { cn } from "@/lib/utils";

export default function IntegrationsPage() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="serif-display text-3xl font-light text-ink sm:text-4xl">
            Integrations
          </h1>
          <DemoTag>Simulated states</DemoTag>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
          The AI Front Desk is architected to answer identically across every
          channel from one knowledge base. Nothing is live until credentials are
          configured — no tokens ship in frontend code.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {integrationCatalog.map((it) => (
          <Card key={it.id} className="flex flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="serif-display text-2xl font-medium text-ink">{it.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
              </div>
              <StatusChip connected={it.status === "CONNECTED"} label={it.status} />
            </div>
            <div className="mt-4 border-t border-line pt-3">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <CircleHelp className="h-3.5 w-3.5 text-copper" />
                {it.detail}
              </p>
            </div>
            <div className="mt-5 flex-1" />
            {it.status === "CONNECTED" ? (
              <p className="inline-flex w-fit items-center gap-2 border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                <Check className="h-3.5 w-3.5" /> Active on this demo site
              </p>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    `${it.name} can be connected by adding your credentials to .env — see .env.example. No code change needed; the inbox and AI engine already speak this channel.`
                  )
                }
                className="inline-flex w-fit items-center gap-2 border border-ink px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-ivory"
              >
                <Plug className="h-3.5 w-3.5" /> Connect {it.name}
              </button>
            )}
          </Card>
        ))}
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-4 border border-copper/40 bg-copper/8 p-5">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-ink">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
            {notice}
          </p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            className="text-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
      )}

      <div>
        <SectionTitle
          title="How it stays consistent"
          sub="One knowledge base → every channel answers identically."
        />
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-semibold">Guest asks</th>
                <th className="px-5 py-3 font-semibold">Website chat</th>
                <th className="px-5 py-3 font-semibold">Instagram DM</th>
                <th className="px-5 py-3 font-semibold">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                {
                  q: "“What does balayage start at?”",
                  a: "“Balayage starts at $180+.”",
                  b: "“How much is balayage?”",
                  c: "“Price for balayage?”"
                },
                {
                  q: "“Where are you?”",
                  a: "“5014 Miller Ave, Dallas, TX 75206.”",
                  b: "“Where's the salon?”",
                  c: "“Location please”"
                }
              ].map((row) => (
                <tr key={row.q}>
                  <td className="px-5 py-4 text-ink">{row.q}</td>
                  <td className="px-5 py-4 text-muted">{row.a}</td>
                  <td className="px-5 py-4 text-muted">{row.b}</td>
                  <td className="px-5 py-4 text-muted">{row.c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-5 py-3 text-[11px] text-muted">
            Answers are generated by the same reply engine that reads the single
            source of truth (<code className="text-copper">salonData.ts</code>).
          </p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <p className="serif-display text-xl font-medium text-ink">Email follow-up automation</p>
          <ol className="mt-5 space-y-3">
            {[
              "Lead captured → guest answers 3 questions in chat",
              "AI qualification → service + timeframe extracted",
              "Booking link sent → personalized /book?service=…",
              "Follow-up reminder → polite nudge after 24h",
              "Salon team notified → this dashboard + your channel"
            ].map((s) => (
              <li key={s} className="flex gap-3 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
            <Unplug className="mt-0.5 h-3.5 w-3.5 shrink-0 text-copper" />
            No emails are sent while EMAIL_API_KEY is empty — the timeline is
            simulated and labeled as such.
          </p>
        </Card>

        <Card className="bg-[#221C15] p-6 text-ivory">
          <p className="serif-display text-xl font-medium">Roadmap to go live</p>
          <ul className="mt-5 space-y-2.5 text-sm text-ivory/80">
            <li>1 · Point BOOKING_URL at the salon&apos;s real booking system.</li>
            <li>2 · Add an AI_API_KEY to upgrade replies beyond the curated menu.</li>
            <li>3 · Connect Instagram via Meta Graph API + webhook.</li>
            <li>4 · Connect WhatsApp Business Cloud API.</li>
            <li>5 · Add email (Gmail/Outlook) for the follow-up automation.</li>
            <li>6 · Swap local storage for the salon&apos;s CRM.</li>
          </ul>
          <p className="mt-5 border-t border-ivory/10 pt-4 text-[11px] leading-relaxed text-ivory/50">
            Every step is a config change — the front desk, inbox and lead flow
            are already channel-ready.
          </p>
        </Card>
      </div>
    </div>
  );
}

function StatusChip({ connected, label }: { connected: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
        connected
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : "border-amber-300 bg-amber-50 text-amber-800"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-emerald-500" : "bg-amber-500")} />
      {label}
    </span>
  );
}
