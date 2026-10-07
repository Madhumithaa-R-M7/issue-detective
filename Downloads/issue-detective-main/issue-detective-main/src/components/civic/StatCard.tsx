import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "critical";

const TONES: Record<Tone, string> = {
  default: "bg-info-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-foreground",
  critical: "bg-critical-soft text-critical",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}) {
  return (
    <div className="card-surface p-4 transition-shadow hover:shadow-[var(--shadow-float)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("rounded-xl p-2.5", TONES[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
