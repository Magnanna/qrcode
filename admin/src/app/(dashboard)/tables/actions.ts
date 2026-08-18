"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTable(formData: FormData) {
  const supabase = await createClient();
  const orgId = String(formData.get("org_id") ?? "");

  const { error } = await supabase.from("event_tables").insert({
    label: String(formData.get("label")),
    capacity: Number(formData.get("capacity") ?? 10),
    org_id: orgId || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/tables");
}

export async function deleteTable(tableId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("event_tables").delete().eq("id", tableId);
  if (error) throw new Error(error.message);
  revalidatePath("/tables");
}
