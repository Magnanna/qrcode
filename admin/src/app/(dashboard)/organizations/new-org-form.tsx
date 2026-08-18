"use client";

import { useRef, useState, useTransition } from "react";
import { Button, Card, Input } from "@/components/ui";
import { createOrganization } from "./actions";

export function NewOrgForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="secondary">
        + Add Organization
      </Button>
    );
  }

  return (
    <Card>
      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            await createOrganization(formData);
            formRef.current?.reset();
            setOpen(false);
          })
        }
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Input name="name" placeholder="Organization name" required />
        <Input name="allocated_seats" type="number" placeholder="Allocated seats" min={0} required />
        <Input name="coordinator_name" placeholder="Coordinator name" />
        <Input name="coordinator_email" type="email" placeholder="Coordinator email" />
        <Input name="coordinator_phone" placeholder="Coordinator phone" />
        <div className="col-span-1 sm:col-span-2 flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save Organization"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
