import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-surface p-5", className)}>
      <header className="mb-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

export function MetricRow({
  label,
  value,
  weight,
}: {
  label: string;
  value: number;
  weight?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">
          {label}
          {weight !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">w={weight.toFixed(2)}</span>
          )}
        </span>
        <span className="font-semibold tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="brand-gradient h-full rounded-full"
          style={{ width: `${Math.min(100, value * 10)}%` }}
        />
      </div>
    </div>
  );
}

export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium break-all">{value}</span>
    </div>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-all", className)}>{children}</code>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs py-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
