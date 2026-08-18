import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";
import { NewTableForm } from "./new-table-form";
import { DeleteTableButton } from "./delete-table-button";

export default async function TablesPage() {
  const supabase = await createClient();

  const [{ data: tables }, { data: orgs }] = await Promise.all([
    supabase
      .from("event_tables")
      .select("id, label, capacity, organizations(name), guests(id, status)")
      .order("label"),
    supabase.from("organizations").select("id, name").order("name"),
  ]);

  return (
    <div>
      <PageHeader title="Tables" subtitle="Table assignments and live occupancy" />

      <div className="mb-8">
        <NewTableForm orgs={orgs ?? []} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(tables ?? []).map((table) => {
          const occupancy = table.guests?.filter((g) => g.status === "checked_in").length ?? 0;
          const assigned = table.guests?.length ?? 0;
          return (
            <Card key={table.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold">Table {table.label}</h3>
                  <p className="text-[13px] text-neutral-500">{table.organizations?.name ?? "Unassigned"}</p>
                </div>
                <DeleteTableButton tableId={table.id} />
              </div>
              <p className="mt-4 text-[13px] text-neutral-500">
                <strong className="font-semibold text-black">{occupancy}</strong> checked in ·{" "}
                {assigned} assigned / {table.capacity} capacity
              </p>
            </Card>
          );
        })}
        {(tables ?? []).length === 0 && (
          <p className="col-span-3 py-10 text-center text-[14px] text-neutral-500">No tables yet.</p>
        )}
      </div>
    </div>
  );
}
