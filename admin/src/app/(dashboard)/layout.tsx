import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

const NAV = [
  { href: "/", label: "Live" },
  { href: "/organizations", label: "Organizations" },
  { href: "/guests", label: "Guests" },
  { href: "/tables", label: "Tables" },
  { href: "/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: staff } = await supabase
    .from("staff")
    .select("name, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-black">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 px-4 py-6 dark:border-neutral-900">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <span className="text-sm">◎</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Gatekeeper</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-neutral-200 pt-4 px-2 dark:border-neutral-900">
          <div>
            <p className="text-[13px] font-medium">{staff?.name ?? user.email}</p>
            <p className="text-[12px] capitalize text-neutral-500">{staff?.role ?? "unassigned"}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
    </div>
  );
}
