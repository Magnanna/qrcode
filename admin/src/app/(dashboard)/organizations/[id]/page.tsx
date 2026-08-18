import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Badge, StatTile } from "@/components/ui";
import { AddGuestForm } from "./add-guest-form";
import { CsvImport } from "./csv-import";
import { RevokeButton } from "./revoke-button";
import { SendTicketButton } from "./send-ticket-button";
import { BulkSendTickets } from "./bulk-send-tickets";

export default async function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: org }, { data: guests }, { data: tables }] = await Promise.all([
    supabase.from("organizations").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("guests")
      .select("id, name, email, status, is_walkin, checked_in_at, ticket_sent_at, event_tables(label)")
      .eq("org_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("event_tables").select("id, label").eq("org_id", id),
  ]);

  if (!org) notFound();

  const submitted = guests?.length ?? 0;
  const checkedIn = guests?.filter((g) => g.status === "checked_in").length ?? 0;

  return (
    <div>
      <Link href="/organizations" className="mb-4 inline-block text-[13px] text-neutral-500 hover:text-black">
        ← Organizations
      </Link>
      <PageHeader title={org.name} subtitle={org.coordinator_email ?? undefined} />

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="Allocated" value={org.allocated_seats} />
        <StatTile label="Submitted" value={submitted} />
        <StatTile label="Checked In" value={checkedIn} />
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AddGuestForm orgId={org.id} tables={tables ?? []} />
        <CsvImport orgId={org.id} />
      </div>

      <Card className="p-0">
        <div className="flex flex-col gap-2 border-b border-neutral-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[15px] font-semibold">Guests</h2>
          <BulkSendTickets orgId={org.id} />
        </div>
        <div className="divide-y divide-neutral-100">
          {(guests ?? []).map((guest) => (
            <div key={guest.id} className="flex flex-col gap-2 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[14px] font-medium">{guest.name ?? "Unnamed guest"}</p>
                <p className="text-[13px] text-neutral-500">
                  {guest.event_tables?.label ? `Table ${guest.event_tables.label}` : "No table"}
                  {guest.is_walkin ? " · Walk-in" : ""}
                  {guest.ticket_sent_at ? " · Ticket sent" : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Badge status={guest.status} />
                {guest.status !== "revoked" && (
                  <>
                    <SendTicketButton orgId={org.id} guestId={guest.id} hasEmail={!!guest.email} />
                    <RevokeButton orgId={org.id} guestId={guest.id} />
                  </>
                )}
              </div>
            </div>
          ))}
          {(guests ?? []).length === 0 && (
            <p className="px-6 py-10 text-center text-[14px] text-neutral-500">No guests yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
