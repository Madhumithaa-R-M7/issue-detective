import { cn } from "@/lib/utils";
import type { ComplaintStatus, PriorityLabel, VerificationStatus } from "@/lib/civic/types";

const base =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  Submitted: "bg-info-soft text-primary",
  "Under Analysis": "bg-info-soft text-primary",
  Assigned: "bg-accent text-accent-foreground",
  "In Progress": "bg-warning-soft text-warning-foreground",
  Resolved: "bg-success-soft text-success",
  Closed: "bg-muted text-muted-foreground",
  Duplicate: "bg-critical-soft text-critical",
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={cn(base, STATUS_STYLES[status])}>{status}</span>;
}

const PRIORITY_STYLES: Record<PriorityLabel, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-info-soft text-primary",
  High: "bg-warning-soft text-warning-foreground",
  Critical: "bg-critical-soft text-critical",
};

export function PriorityBadge({ label, score }: { label: PriorityLabel; score?: number }) {
  return (
    <span className={cn(base, PRIORITY_STYLES[label])}>
      {label}
      {score !== undefined && <span className="opacity-70">{score.toFixed(1)}</span>}
    </span>
  );
}

export const VERIFICATION_LABEL: Record<string, string> = {
  new: "New Image",
  NEW_IMAGE: "New Image",
  potential_duplicate: "Potential Duplicate",
  POTENTIAL_DUPLICATE: "Potential Duplicate",
  exact_duplicate: "Exact Duplicate",
  EXACT_DUPLICATE: "Exact Duplicate",
  insufficient_evidence: "Insufficient Evidence",
  INSUFFICIENT_EVIDENCE: "Insufficient Evidence",
  POTENTIALLY_MANIPULATED: "Potentially Manipulated",
};

const VERIFICATION_STYLES: Record<string, string> = {
  new: "bg-success-soft text-success",
  NEW_IMAGE: "bg-success-soft text-success",
  potential_duplicate: "bg-warning-soft text-warning-foreground",
  POTENTIAL_DUPLICATE: "bg-warning-soft text-warning-foreground",
  exact_duplicate: "bg-critical-soft text-critical",
  EXACT_DUPLICATE: "bg-critical-soft text-critical",
  insufficient_evidence: "bg-muted text-muted-foreground",
  INSUFFICIENT_EVIDENCE: "bg-muted text-muted-foreground",
  POTENTIALLY_MANIPULATED: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
};

export function VerificationBadge({ status }: { status: VerificationStatus | string }) {
  const label = VERIFICATION_LABEL[status] || status || "Unknown";
  const style = VERIFICATION_STYLES[status] || "bg-muted text-muted-foreground";
  return <span className={cn(base, style)}>{label}</span>;
}
