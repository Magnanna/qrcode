"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui";

export function GuestSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  return (
    <Input
      placeholder="Search guest by name…"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        const params = new URLSearchParams(searchParams);
        if (e.target.value) params.set("q", e.target.value);
        else params.delete("q");
        router.replace(`/guests?${params.toString()}`);
      }}
    />
  );
}
