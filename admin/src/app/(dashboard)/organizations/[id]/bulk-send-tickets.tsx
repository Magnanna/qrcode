"use client";

import { useState, useTransition } from "react";
import { sendAllPendingTickets } from "../actions";

export function BulkSendTickets({ orgId }: { orgId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      {result && <span className="text-[12px] text-neutral-500">{result}</span>}
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setResult(null);
            const { sent, failed } = await sendAllPendingTickets(orgId);
            setResult(`Sent ${sent}${failed ? `, ${failed} failed` : ""}`);
          })
        }
        className="text-[13px] font-medium text-neutral-500 hover:text-black disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send All Pending Tickets"}
      </button>
    </div>
  );
}
