import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatTile, Card } from "@/components/ui";
import { LiveFeed } from "./live-feed";

export default async function LivePage() {
  const supabase = await createClient();

  const [{ count: totalGuests }, { count: checkedIn }, { count: orgCount }, { data: recentEvents }] =
    await Promise.all([
      supabase.from("guests").select("*", { count: "exact", head: true }),
      supabase.from("guests").select("*", { count: "exact", head: true }).eq("status", "checked_in"),
      supabase.from("organizations").select("*", { count: "exact", head: true }),
      supabase
        .from("scan_events")
        .select("id, result, gate, created_at, guests(name, is_walkin, organizations(name), event_tables(label))")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

  return (
    <div>
      <PageHeader title="Live" subtitle="Real-time check-in activity across all gates" />

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="Total Guests" value={totalGuests ?? 0} />
        <StatTile label="Checked In" value={checkedIn ?? 0} />
        <StatTile label="Organizations" value={orgCount ?? 0} />
      </div>

      <Card className="p-0">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h2 className="text-[15px] font-semibold">Recent Scans</h2>
        </div>
        <LiveFeed initialEvents={recentEvents ?? []} />
      </Card>
    </div>
  );
}
