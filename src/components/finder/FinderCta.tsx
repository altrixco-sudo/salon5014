"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceFinderModal } from "@/components/finder/ServiceFinderModal";

export function FinderCta({ label = "Help me find my service" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 bg-ink px-9 py-5 text-[11px] font-semibold uppercase tracking-wide2 text-ivory transition-all duration-300 hover:bg-copper-deep"
      >
        {label}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      <ServiceFinderModal
        open={open}
        onClose={() => setOpen(false)}
        onBookService={(id) => {
          router.push(id === "consultation" ? "/book" : `/book?service=${id}`);
        }}
      />
    </>
  );
}
