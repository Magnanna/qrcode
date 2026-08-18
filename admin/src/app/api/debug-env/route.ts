import { NextResponse } from "next/server";

function inspect(name: string, value: string | undefined) {
  if (value === undefined) return { name, present: false };
  return {
    name,
    present: true,
    length: value.length,
    first20: value.slice(0, 20),
    last20: value.slice(-20),
    charCodesAround15: Array.from(value.slice(10, 20)).map((c) => c.charCodeAt(0)),
    anyCharAbove255: Array.from(value).some((c) => c.charCodeAt(0) > 255),
    firstBadIndex: Array.from(value).findIndex((c) => c.charCodeAt(0) > 255),
  };
}

export async function GET() {
  return NextResponse.json({
    url: inspect("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: inspect("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    resendKey: inspect("RESEND_API_KEY", process.env.RESEND_API_KEY),
    resendFrom: inspect("RESEND_FROM_EMAIL", process.env.RESEND_FROM_EMAIL),
  });
}
