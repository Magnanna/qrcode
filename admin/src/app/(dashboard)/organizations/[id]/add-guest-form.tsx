"use client";

import { useRef, useTransition } from "react";
import { Button, Card, Input } from "@/components/ui";
import { addGuest } from "../actions";

export function AddGuestForm({ orgId, tables }: { orgId: string; tables: { id: string; label: string }[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card>
      <h3 className="mb-4 text-[14px] font-semibold">Add Guest</h3>
      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            await addGuest(orgId, formData);
            formRef.current?.reset();
          })
        }
        className="space-y-3"
      >
        <Input name="name" placeholder="Guest name (optional)" />
        <Input name="email" type="email" placeholder="Guest email (optional)" />
        <select
          name="table_id"
          className="select rounded-xl w-full"
        >
          <option value="">No table assigned</option>
          {tables.map((t) => (
            <option key={t.id} value={t.id}>
              Table {t.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-[13px] text-neutral-600">
          <input type="checkbox" name="is_walkin" className="rounded" />
          Walk-in guest
        </label>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Adding…" : "Add Guest"}
        </Button>
      </form>
    </Card>
  );
}
