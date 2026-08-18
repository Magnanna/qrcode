import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";
import { NewOrgForm } from "./new-org-form";

export default async function OrganizationsPage() {
  const supabase = await createClient();

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, allocated_seats, coordinator_name, guests(id, status)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Organizations" subtitle="Allocated seats, submitted guests, and check-in progress" />

      <div className="mb-8">
        <NewOrgForm />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(orgs ?? []).map((org) => {
          const submitted = org.guests?.length ?? 0;
          const checkedIn = org.guests?.filter((g) => g.status === "checked_in").length ?? 0;
          const overCapacity = submitted > org.allocated_seats;

          return (
            <Link key={org.id} href={`/organizations/${org.id}`}>
              <Card className="transition hover:border-neutral-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold">{org.name}</h3>
                    {org.coordinator_name && (
                      <p className="text-[13px] text-neutral-500">{org.coordinator_name}</p>
                    )}
                  </div>
                  {overCapacity && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600">
                      Over capacity
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4 text-[13px] text-neutral-500">
                  <span>
                    <strong className="font-semibold text-black">{checkedIn}</strong> checked in
                  </span>
                  <span>
                    <strong className="font-semibold text-black">{submitted}</strong> submitted
                  </span>
                  <span>
                    <strong className="font-semibold text-black">{org.allocated_seats}</strong> allocated
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}

        {(orgs ?? []).length === 0 && (
          <p className="col-span-2 py-10 text-center text-[14px] text-neutral-500">
            No organizations yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
