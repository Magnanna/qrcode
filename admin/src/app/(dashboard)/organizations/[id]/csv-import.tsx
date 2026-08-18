"use client";

import { useRef, useState, useTransition } from "react";
import Papa from "papaparse";
import { Button, Card } from "@/components/ui";
import { importGuestsCsv } from "../actions";

export function CsvImport({ orgId }: { orgId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    Papa.parse<{ name?: string; email?: string; table?: string }>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        const rows = results.data
          .map((row) => ({
            name: (row.name ?? "").trim(),
            email: (row.email ?? "").trim(),
            table_label: (row.table ?? "").trim(),
          }))
          .filter((row) => row.name);

        if (rows.length === 0) {
          setStatus("No valid rows found. Expect columns: name, table");
          return;
        }

        startTransition(async () => {
          await importGuestsCsv(orgId, rows);
          setStatus(`Imported ${rows.length} guests.`);
          if (fileRef.current) fileRef.current.value = "";
        });
      },
    });
  };

  return (
    <Card>
      <h3 className="mb-1 text-[14px] font-semibold">Import Guest List</h3>
      <p className="mb-4 text-[13px] text-neutral-500">CSV with columns: name, email, table</p>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        disabled={isPending}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="w-full text-[13px] file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3.5 file:py-2 file:text-[13px] file:font-medium file:text-neutral-700 dark:file:bg-neutral-900 dark:file:text-neutral-300"
      />
      {status && <p className="mt-3 text-[13px] text-neutral-500">{status}</p>}
      {isPending && <p className="mt-3 text-[13px] text-neutral-500">Importing…</p>}
      <Button
        type="button"
        variant="secondary"
        className="mt-3 w-full"
        onClick={() => {
          const csv = "name,email,table\nJane Doe,jane@example.com,A1\nJohn Smith,john@example.com,A1\n";
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "guest-template.csv";
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download Template
      </Button>
    </Card>
  );
}
