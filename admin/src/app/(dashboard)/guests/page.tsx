import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Badge } from "@/components/ui";
import { GuestSearch } from "./guest-search";

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("guests")
    .select("id, name, status, is_walkin, organizations(name), event_tables(label)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (q) query = query.ilike("name", `%${q}%`);

  const { data: guests } = await query;

  return (
    <div>
      <PageHeader title="Guests" subtitle="Search and review every guest across all organizations" />

      <div className="mb-6">
        <GuestSearch defaultValue={q ?? ""} />
      </div>

      <Card className="p-0">
        <div className="divide-y divide-neutral-100">
          {(guests ?? []).map((guest) => (
            <div key={guest.id} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="text-[14px] font-medium">{guest.name ?? "Unnamed guest"}</p>
                <p className="text-[13px] text-neutral-500">
                  {guest.organizations?.name ?? "—"}
                  {guest.event_tables?.label ? ` · Table ${guest.event_tables.label}` : ""}
                </p>
              </div>
              <Badge status={guest.status} />
            </div>
          ))}
          {(guests ?? []).length === 0 && (
            <p className="px-6 py-10 text-center text-[14px] text-neutral-500">No guests found.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
