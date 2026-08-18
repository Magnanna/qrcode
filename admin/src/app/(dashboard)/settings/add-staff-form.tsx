"use client";

import { useRef, useState, useTransition } from "react";
import { Button, Card, Input } from "@/components/ui";
import { addStaff } from "./actions";

export function AddStaffForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card>
      <h3 className="mb-1 text-[14px] font-semibold">Add Staff Member</h3>
      <p className="mb-4 text-[13px] text-neutral-500">They must sign up at /signup first, then grant their role here.</p>
      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            setError(null);
            try {
              await addStaff(formData);
              formRef.current?.reset();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Something went wrong.");
            }
          })
        }
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Input name="name" placeholder="Full name" required />
        <Input name="email" type="email" placeholder="Email" required />
        <select
          name="role"
          className="select rounded-xl"
        >
          <option value="scanner">Scanner</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
        {error && (
          <p className="col-span-1 sm:col-span-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isPending} className="col-span-1 sm:col-span-3">
          {isPending ? "Adding…" : "Grant Access"}
        </Button>
      </form>
    </Card>
  );
}
