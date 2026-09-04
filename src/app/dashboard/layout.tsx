import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, Settings } from "lucide-react";
import { DashNav, type DashNavItem } from "@/components/dashboard/DashNav";

const NAV: DashNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/inbox", label: "Conversations", icon: "inbox" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "integrations" }
];

export const metadata: Metadata = {
  title: { default: "Owner Dashboard | Salon 5014", template: "%s | Salon 5014" },
  robots: { index: false, follow: false }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#F3EDE3]">
      <div className="mx-auto flex max-w-[1500px]">
        {/* sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-[#221C15] px-5 py-7 text-ivory lg:flex">
          <Link href="/" className="serif-display text-lg font-medium tracking-[0.1em]">
            SALON 5014
          </Link>
          <p className="label-sm mt-1 text-ivory/40">Owner Dashboard</p>

          <nav className="mt-10 space-y-1" aria-label="Dashboard">
            {NAV.map((item) => (
              <DashNav key={item.href} item={item} />
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-sm border border-ivory/12 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300/90">
                <Database className="h-3 w-3" /> Demo mode
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ivory/50">
                Sample data &amp; simulated integrations. Connect credentials in
                .env to go live.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-ivory/10 pt-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs text-ivory/60 transition-colors hover:text-ivory"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to the website
              </Link>
              <Link
                href="/dashboard/integrations"
                className="flex items-center gap-2 text-xs text-ivory/60 transition-colors hover:text-ivory"
              >
                <Settings className="h-3.5 w-3.5" /> Integrations
              </Link>
            </div>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1">
          {/* mobile top nav */}
          <div className="sticky top-0 z-30 border-b border-line bg-[#221C15]/95 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3 text-ivory">
              <Link href="/" className="serif-display text-base font-medium tracking-[0.1em]">
                SALON 5014{" "}
                <span className="ml-1 font-sans text-[10px] text-ivory/50">
                  Owner Dashboard
                </span>
              </Link>
              <Link
                href="/"
                aria-label="Back to site"
                className="flex h-9 w-9 items-center justify-center border border-ivory/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-4 pb-2">
              {NAV.map((item) => (
                <DashNav key={item.href} item={item} mobile />
              ))}
            </nav>
          </div>

          <main className="px-4 py-8 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
