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

  const sidebarContent = (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-base-100 px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
          <span className="text-sm">◎</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight">Gatekeeper</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-3 border-t border-neutral-200 px-2 pt-4">
        <div>
          <p className="text-[13px] font-medium">{staff?.name ?? user.email}</p>
          <p className="text-[12px] capitalize text-neutral-500">{staff?.role ?? "unassigned"}</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-neutral-50">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        <div className="flex items-center gap-3 border-b border-neutral-200 bg-base-100 px-4 py-3 lg:hidden">
          <label htmlFor="nav-drawer" className="btn btn-square btn-ghost btn-sm" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
            <span className="text-xs">◎</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Gatekeeper</span>
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-10">{children}</main>
      </div>

      <div className="drawer-side z-20">
        <label htmlFor="nav-drawer" aria-label="Close menu" className="drawer-overlay"></label>
        {sidebarContent}
      </div>
    </div>
  );
}
