import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";
import { AddStaffForm } from "./add-staff-form";
import { RemoveStaffButton } from "./remove-staff-button";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me } = await supabase.from("staff").select("role").eq("id", user!.id).maybeSingle();
  const isAdmin = me?.role === "admin";

  const { data: staff } = await supabase.from("staff").select("id, name, role, created_at").order("created_at");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Staff accounts and roles" />

      {isAdmin ? (
        <>
          <div className="mb-8">
            <AddStaffForm />
          </div>

          <Card className="p-0">
            <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-900">
              <h2 className="text-[15px] font-semibold">Staff</h2>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {(staff ?? []).map((s) => (
                <div key={s.id} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-[14px] font-medium">{s.name}</p>
                    <p className="text-[13px] capitalize text-neutral-500">{s.role}</p>
                  </div>
                  {s.id !== user!.id && <RemoveStaffButton staffId={s.id} />}
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-[14px] text-neutral-500">Only admins can manage staff accounts.</p>
        </Card>
      )}
    </div>
  );
}
