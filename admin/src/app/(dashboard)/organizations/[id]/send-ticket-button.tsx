"use client";

import { useState, useTransition } from "react";
import { sendGuestTicket } from "../actions";

export function SendTicketButton({
  orgId,
  guestId,
  hasEmail,
}: {
  orgId: string;
  guestId: string;
  hasEmail: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!hasEmail) {
    return <span className="text-[12px] text-neutral-300">No email</span>;
  }

  return (
    <button
      disabled={isPending}
      title={error ?? undefined}
      onClick={() =>
        startTransition(async () => {
          setError(null);
          try {
            await sendGuestTicket(orgId, guestId);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to send");
          }
        })
      }
      className={`text-[12px] font-medium disabled:opacity-50 ${error ? "text-red-600" : "text-neutral-400 hover:text-black"}`}
    >
      {isPending ? "Sending…" : error ? "Failed" : "Send Ticket"}
    </button>
  );
}
