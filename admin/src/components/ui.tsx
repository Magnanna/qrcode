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
  return <div className={`card card-border rounded-2xl bg-base-100 border-base-200 p-6 ${className}`}>{children}</div>;
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
  pending: "badge-neutral",
  checked_in: "badge-success",
  revoked: "badge-error",
  success: "badge-success",
  duplicate: "badge-warning",
  flagged: "badge-error",
  not_found: "badge-error",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={`badge badge-soft ${badgeStyles[status] ?? "badge-neutral"} capitalize`}>
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
  const styles = variant === "primary" ? "btn-neutral" : "btn-outline";
  return (
    <button className={`btn rounded-xl ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input rounded-xl w-full ${props.className ?? ""}`} />;
}
