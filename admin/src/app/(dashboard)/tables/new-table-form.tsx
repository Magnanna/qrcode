"use client";

import { useRef, useState, useTransition } from "react";
import { Button, Card, Input } from "@/components/ui";
import { createTable } from "./actions";

export function NewTableForm({ orgs }: { orgs: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="secondary">
        + Add Table
      </Button>
    );
  }

  return (
    <Card>
      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            await createTable(formData);
            formRef.current?.reset();
            setOpen(false);
          })
        }
        className="grid grid-cols-3 gap-4"
      >
        <Input name="label" placeholder="Table label (e.g. A1)" required />
        <Input name="capacity" type="number" placeholder="Capacity" defaultValue={10} min={1} required />
        <select
          name="org_id"
          className="select rounded-xl"
        >
          <option value="">Unassigned</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        <div className="col-span-3 flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save Table"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
