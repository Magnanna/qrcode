"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui";

type ScanEventRow = {
  id: string;
  result: string;
  gate: string | null;
  created_at: string;
  guests: {
    name: string | null;
    is_walkin: boolean;
    organizations: { name: string } | null;
    event_tables: { label: string } | null;
  } | null;
};

export function LiveFeed({ initialEvents }: { initialEvents: ScanEventRow[] }) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const supabase = createClient();

    const refetch = async () => {
      const { data } = await supabase
        .from("scan_events")
        .select("id, result, gate, created_at, guests(name, is_walkin, organizations(name), event_tables(label))")
        .order("created_at", { ascending: false })
        .limit(30);
      if (data) setEvents(data as unknown as ScanEventRow[]);
    };

    const channel = supabase
      .channel("scan_events_feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "scan_events" }, refetch)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (events.length === 0) {
    return <p className="px-6 py-10 text-center text-[14px] text-neutral-500">No scans yet.</p>;
  }

  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
      {events.map((event) => (
        <div key={event.id} className="flex items-center justify-between px-6 py-3.5">
          <div>
            <p className="text-[14px] font-medium">
              {event.guests?.name ?? (event.guests?.is_walkin ? "Walk-in" : "Unknown")}
            </p>
            <p className="text-[13px] text-neutral-500">
              {event.guests?.organizations?.name ?? "—"}
              {event.guests?.event_tables?.label ? ` · Table ${event.guests.event_tables.label}` : ""}
              {event.gate ? ` · Gate ${event.gate}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-neutral-400">
              {new Date(event.created_at).toLocaleTimeString()}
            </span>
            <Badge status={event.result} />
          </div>
        </div>
      ))}
    </div>
  );
}
