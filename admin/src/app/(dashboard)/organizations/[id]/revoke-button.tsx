"use client";

import { useTransition } from "react";
import { revokeGuest } from "../actions";

export function RevokeButton({ orgId, guestId }: { orgId: string; guestId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm("Revoke this guest's ticket?")) {
          startTransition(() => revokeGuest(orgId, guestId));
        }
      }}
      className="text-[12px] font-medium text-neutral-400 hover:text-red-600 disabled:opacity-50"
    >
      Revoke
    </button>
  );
}
