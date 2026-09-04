"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutGrid, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { overview: LayoutGrid, inbox: Inbox, integrations: Plug } as const;

export type DashNavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

export const DASH_NAV: DashNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/inbox", label: "Conversations", icon: "inbox" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "integrations" }
];

export function DashNav({
  item,
  mobile
}: {
  item: DashNavItem;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = ICONS[item.icon];
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-sm text-[13px] font-medium transition-colors",
        mobile
          ? "shrink-0 whitespace-nowrap px-3 py-2 text-ivory/70 " +
              (active ? "bg-ivory/15 text-ivory" : "hover:text-ivory")
          : "px-3 py-2.5 text-ivory/65 " +
              (active ? "bg-ivory/12 text-ivory" : "hover:bg-ivory/5 hover:text-ivory")
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
