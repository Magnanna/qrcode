"use client";

import { useTransition } from "react";
import { removeStaff } from "./actions";

export function RemoveStaffButton({ staffId }: { staffId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm("Remove this staff member's access?")) startTransition(() => removeStaff(staffId));
      }}
      className="text-[12px] font-medium text-neutral-400 hover:text-red-600 disabled:opacity-50"
    >
      Remove
    </button>
  );
}
