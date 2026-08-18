import { type ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-neutral-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950 ${className}`}
    >
      {children}
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-5">
      <p className="text-[13px] font-medium text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </Card>
  );
}

const badgeStyles: Record<string, string> = {
  pending: "bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400",
  checked_in: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  revoked: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  duplicate: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  flagged: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  not_found: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium capitalize ${badgeStyles[status] ?? "bg-neutral-100 text-neutral-600"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const base = "rounded-xl px-4 py-2.5 text-[14px] font-medium transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-900 ${props.className ?? ""}`}
    />
  );
}
