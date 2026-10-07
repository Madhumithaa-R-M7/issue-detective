import { Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { PriorityBadge, StatusBadge, VerificationBadge } from "./badges";
import type { Complaint } from "@/lib/civic/types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ComplaintRow({ complaint }: { complaint: Complaint }) {
  return (
    <Link
      to="/complaint/$id"
      params={{ id: complaint.id }}
      className="card-surface block p-4 transition-shadow hover:shadow-[var(--shadow-float)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold text-primary">{complaint.id}</span>
        <StatusBadge status={complaint.status} />
        <PriorityBadge label={complaint.priority.label} score={complaint.priority.overall} />
        {complaint.image && <VerificationBadge status={complaint.image.verification.status} />}
      </div>
      <p className="mt-2 line-clamp-2 text-sm">{complaint.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" /> {complaint.location} · {complaint.detailedLocation}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {formatDate(complaint.submittedAt)}
        </span>
        <span>
          {complaint.department} / {complaint.subDepartment}
        </span>
      </div>
    </Link>
  );
}
