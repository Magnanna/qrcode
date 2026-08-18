"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendTicketEmail } from "@/lib/email/ticket-email";

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("organizations").insert({
    name: String(formData.get("name")),
    allocated_seats: Number(formData.get("allocated_seats") ?? 0),
    coordinator_name: String(formData.get("coordinator_name") ?? "") || null,
    coordinator_email: String(formData.get("coordinator_email") ?? "") || null,
    coordinator_phone: String(formData.get("coordinator_phone") ?? "") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/organizations");
}

export async function updateOrganization(orgId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("organizations")
    .update({
      name: String(formData.get("name")),
      allocated_seats: Number(formData.get("allocated_seats") ?? 0),
      coordinator_name: String(formData.get("coordinator_name") ?? "") || null,
      coordinator_email: String(formData.get("coordinator_email") ?? "") || null,
      coordinator_phone: String(formData.get("coordinator_phone") ?? "") || null,
    })
    .eq("id", orgId);

  if (error) throw new Error(error.message);

  revalidatePath(`/organizations/${orgId}`);
}

export async function addGuest(orgId: string, formData: FormData) {
  const supabase = await createClient();

  const tableId = String(formData.get("table_id") ?? "");

  const { error } = await supabase.from("guests").insert({
    org_id: orgId,
    name: String(formData.get("name") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    table_id: tableId || null,
    is_walkin: formData.get("is_walkin") === "on",
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/organizations/${orgId}`);
}

export async function importGuestsCsv(
  orgId: string,
  rows: { name: string; email?: string; table_label?: string }[],
) {
  const supabase = await createClient();

  const { data: tables } = await supabase.from("event_tables").select("id, label").eq("org_id", orgId);
  const tableByLabel = new Map((tables ?? []).map((t) => [t.label.toLowerCase(), t.id]));

  const inserts = rows.map((row) => ({
    org_id: orgId,
    name: row.name || null,
    email: row.email || null,
    table_id: row.table_label ? tableByLabel.get(row.table_label.toLowerCase()) ?? null : null,
  }));

  const { error } = await supabase.from("guests").insert(inserts);
  if (error) throw new Error(error.message);

  revalidatePath(`/organizations/${orgId}`);
}

export async function sendGuestTicket(orgId: string, guestId: string) {
  const supabase = await createClient();

  const { data: guest, error } = await supabase
    .from("guests")
    .select("id, name, email, token, organizations(name), event_tables(label)")
    .eq("id", guestId)
    .single();

  if (error || !guest) throw new Error(error?.message ?? "Guest not found");
  if (!guest.email) throw new Error("This guest has no email address on file.");

  await sendTicketEmail({
    to: guest.email,
    guestName: guest.name ?? "Guest",
    orgName: guest.organizations?.name ?? "the event",
    tableLabel: guest.event_tables?.label ?? null,
    token: guest.token,
  });

  const { error: updateError } = await supabase
    .from("guests")
    .update({ ticket_sent_at: new Date().toISOString() })
    .eq("id", guestId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/organizations/${orgId}`);
}

export async function sendAllPendingTickets(orgId: string) {
  const supabase = await createClient();

  const { data: guests, error } = await supabase
    .from("guests")
    .select("id, name, email, token, organizations(name), event_tables(label)")
    .eq("org_id", orgId)
    .eq("status", "pending")
    .is("ticket_sent_at", null)
    .not("email", "is", null);

  if (error) throw new Error(error.message);

  let sent = 0;
  const failures: string[] = [];

  for (const guest of guests ?? []) {
    try {
      await sendTicketEmail({
        to: guest.email!,
        guestName: guest.name ?? "Guest",
        orgName: guest.organizations?.name ?? "the event",
        tableLabel: guest.event_tables?.label ?? null,
        token: guest.token,
      });
      await supabase.from("guests").update({ ticket_sent_at: new Date().toISOString() }).eq("id", guest.id);
      sent += 1;
    } catch {
      failures.push(guest.name ?? guest.id);
    }
  }

  revalidatePath(`/organizations/${orgId}`);
  return { sent, failed: failures.length };
}

export async function revokeGuest(orgId: string, guestId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("guests").update({ status: "revoked" }).eq("id", guestId);
  if (error) throw new Error(error.message);
  revalidatePath(`/organizations/${orgId}`);
}

export async function deleteOrganization(orgId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", orgId);
  if (error) throw new Error(error.message);
  revalidatePath("/organizations");
  redirect("/organizations");
}
