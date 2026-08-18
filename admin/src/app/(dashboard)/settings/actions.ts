"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addStaff(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("add_staff_by_email", {
    p_email: String(formData.get("email")),
    p_name: String(formData.get("name")),
    p_role: String(formData.get("role")) as "scanner" | "supervisor" | "admin",
  });

  if (error) throw new Error(error.message);
  const result = data as { ok: boolean; reason?: string };
  if (!result.ok) {
    throw new Error(
      result.reason === "user_not_found"
        ? "No account with that email. They must sign up first at /signup."
        : "Could not add staff member.",
    );
  }

  revalidatePath("/settings");
}

export async function removeStaff(staffId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("staff").delete().eq("id", staffId);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
