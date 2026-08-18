"use client";

import { useTransition } from "react";
import { deleteTable } from "./actions";

export function DeleteTableButton({ tableId }: { tableId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this table?")) startTransition(() => deleteTable(tableId));
      }}
      className="text-[12px] font-medium text-neutral-400 hover:text-red-600 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
