import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Channel, LeadStatus } from "@/lib/types";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-line bg-ivory", className)}>{children}</div>
  );
}

export function DemoTag({ children = "Demo data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 bg-amber-100/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
      {children}
    </span>
  );
}

export function SectionTitle({
  title,
  sub,
  right
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="serif-display text-xl font-medium text-ink sm:text-2xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

const SOURCE_META: Record<Channel, { label: string; className: string }> = {
  website: { label: "Website", className: "bg-ink/5 text-ink border-ink/15" },
  instagram: { label: "Instagram", className: "bg-pink-100/70 text-pink-900 border-pink-200" },
  whatsapp: { label: "WhatsApp", className: "bg-emerald-100/70 text-emerald-900 border-emerald-200" },
  email: { label: "Email", className: "bg-sky-100/70 text-sky-900 border-sky-200" }
};

export function SourceBadge({ channel }: { channel: Channel }) {
  const meta = SOURCE_META[channel];
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", meta.className)}>
      {meta.label}
    </span>
  );
}

const STATUS_STYLE: Record<LeadStatus | "OPEN" | "WAITING", string> = {
  NEW: "bg-copper/12 text-copper-deep border-copper/30",
  CONTACTED: "bg-amber-100/80 text-amber-900 border-amber-300/60",
  BOOKED: "bg-emerald-100/70 text-emerald-900 border-emerald-200",
  CLOSED: "bg-line/50 text-muted border-line",
  OPEN: "bg-sky-100/70 text-sky-900 border-sky-200",
  WAITING: "bg-violet-100/60 text-violet-900 border-violet-200"
};

export function StatusPill({ status }: { status: LeadStatus | "OPEN" | "WAITING" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        STATUS_STYLE[status]
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Stat({
  label,
  value,
  note,
  icon,
  accent
}: {
  label: string;
  value: ReactNode;
  note?: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden p-5">
      {accent && (
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-copper to-copper-soft" />
      )}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        {icon && <span className="text-copper">{icon}</span>}
      </div>
      <p className="serif-display mt-3 text-4xl font-light text-ink">{value}</p>
      {note && <p className="mt-1.5 text-[11px] text-muted">{note}</p>}
    </Card>
  );
}

export function ChannelIcon({ channel, className }: { channel: Channel; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold",
        SOURCE_META[channel].className.replace("border", "border"),
        className
      )}
      aria-hidden="true"
    >
      {channel === "website" && "W"}
      {channel === "instagram" && "IG"}
      {channel === "whatsapp" && "WA"}
      {channel === "email" && "✉"}
    </span>
  );
}
