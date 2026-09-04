"use client";

import { useEffect, useState } from "react";
import {
  listBookings,
  listConversations,
  listLeads,
  listUnanswered
} from "@/lib/clientStore";
import {
  demoBookings,
  demoConversations,
  demoLeads,
  demoUnanswered,
  topQuestions,
  topServices,
  weeklySeries
} from "@/lib/demoData";
import type { Conversation, Lead } from "@/lib/types";

export interface DashboardData {
  ready: boolean;
  leads: Lead[];
  convos: Conversation[];
  unanswered: { q: string; at: string }[];
  bookingsCount: number;
  demo: ReturnType<typeof weeklySeries>;
  topQuestions: ReturnType<typeof topQuestions>;
  topServices: ReturnType<typeof topServices>;
  refresh: () => void;
}

export function useDashboardData(): DashboardData {
  const [ready, setReady] = useState(false);
  const [snapshot, setSnapshot] = useState<DashboardData>({
    ready: false,
    leads: [],
    convos: [],
    unanswered: [],
    bookingsCount: 0,
    demo: [],
    topQuestions: [],
    topServices: [],
    refresh: () => undefined
  });

  const refresh = () => {
    const next: DashboardData = {
      ready: true,
      leads: [...demoLeads(), ...listLeads()],
      convos: [...demoConversations(), ...listConversations()],
      unanswered: [...demoUnanswered(), ...listUnanswered()],
      bookingsCount: demoBookings().length + listBookings().length,
      demo: weeklySeries(),
      topQuestions: topQuestions(),
      topServices: topServices(),
      refresh
    };
    setSnapshot(next);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...snapshot, ready, refresh };
}
