import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Star, ShieldCheck, UserCheck, Wrench, AlertTriangle, ArrowRight, History, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { PriorityBadge, StatusBadge, VerificationBadge } from "@/components/civic/badges";
import { formatDate } from "@/components/civic/ComplaintRow";
import { EmptyState, KeyValue, MetricRow, Mono, Section } from "@/components/civic/ui-bits";
import { PRIORITY_WEIGHTS } from "@/lib/civic/algorithms";
import { useCivic } from "@/lib/civic/store";
import { SlaCountdown } from "@/components/civic/SlaCountdown";
import type { ComplaintStatus } from "@/lib/civic/types";
import { cn } from "@/lib/utils";
import { computeStaffMcdmScore } from "@/services/mcdmRouter.js";

export const Route = createFileRoute("/complaint/$id")({
  head: () => ({
    meta: [
      { title: "Complaint Detail — CivicConnect" },
      {
        name: "description",
        content:
          "Full complaint timeline with image verification results, priority breakdown, MCDM staff assignment, and audit history.",
      },
      { property: "og:title", content: "Complaint Detail — CivicConnect" },
      {
        property: "og:description",
        content: "Verification results, priority breakdown and MCDM staff assignment for a campus complaint.",
      },
    ],
  }),
  component: ComplaintDetail,
});

const TIMELINE: ComplaintStatus[] = [
  "Submitted",
  "Under Analysis",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

function ComplaintDetail() {
  const { id } = useParams({ from: "/complaint/$id" });
  const { complaints, staff, updateComplaint, reassignStaff, role } = useCivic();
  const complaint = complaints.find((c) => c.id === id);
  const [rating, setRating] = useState(0);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState<string>("");

  if (!complaint) {
    return (
      <AppShell>
        <EmptyState title="Complaint not found" hint="It may have been removed from this device." />
      </AppShell>
    );
  }

  const assigned = staff.find((s) => s.id === complaint.assignedStaffId);
  const activeIndex = TIMELINE.indexOf(complaint.status);
  const v = complaint.image?.verification;

  const routing = complaint.routingInfo;
  const assignment = complaint.assignmentInfo;
  const factors = complaint.assignmentFactors;

  const handleManualReassign = () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member to reassign.");
      return;
    }
    reassignStaff(complaint.id, selectedStaffId, "Admin Office", overrideReason || "Manual Admin Override");
    toast.success(`Reassigned ${complaint.id} to ${staff.find((s) => s.id === selectedStaffId)?.name}`);
    setSelectedStaffId("");
    setOverrideReason("");
  };

  return (
    <AppShell>
      <PageHeader
        title={`${complaint.id} — ${complaint.category}`}
        description={complaint.description}
        actions={
          <Link to="/my-complaints" className="text-sm font-semibold text-primary">
            ← All complaints
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={complaint.status} />
        <PriorityBadge label={complaint.priority.label} score={complaint.priority.overall} />
        <SlaCountdown
          submittedAt={complaint.submittedAt}
          slaHours={complaint.slaHours}
          priorityLabel={complaint.priority.label}
        />
        {complaint.image && <VerificationBadge status={complaint.image.verification.status} />}
        {complaint.override && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
            Admin Manual Override Applied
          </span>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Progress Timeline */}
          <Section title="Progress timeline">
            <ol className="space-y-3">
              {TIMELINE.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      i <= activeIndex && activeIndex >= 0 ? "bg-primary" : "bg-muted",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      i === activeIndex ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Phase 5 Intelligent Routing & MCDM Staff Assignment */}
          <Section
            title="Intelligent Department Routing & MCDM Staff Assignment"
            subtitle="Rule-based taxonomy routing and Multi-Criteria Decision Making (MCDM) allocation."
          >
            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>ROUTING RESULT</span>
                  <span className="text-primary">{routing?.routingMethod || "Rule-Based Engine"}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Assigned Department</span>
                    <span className="font-semibold text-foreground">{complaint.department}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">SLA Time Window</span>
                    <span className="font-semibold text-emerald-600">{complaint.slaHours} Hours</span>
                  </div>
                </div>
                {routing?.routingReason && (
                  <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border">
                    <strong>Routing Rationale:</strong> {routing.routingReason}
                  </p>
                )}
              </div>

              {/* MCDM Assignment Card */}
              <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">MCDM STAFF ASSIGNMENT</span>
                  {assignment?.mcdmScore !== null && assignment?.mcdmScore !== undefined && (
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-xs font-bold border border-emerald-500/20">
                      MCDM Score: {assignment.mcdmScore.toFixed(1)} / 10
                    </span>
                  )}
                </div>

                {assignment?.status === "Unassigned" ? (
                  <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="size-4" /> Unassigned (No Eligible Staff Available)
                    </div>
                    <p>{assignment.unassignedReason || "All department personnel are either offline, on leave, or at maximum capacity."}</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <UserCheck className="size-4 text-emerald-500" />
                      {assigned?.name || assignment?.assignedStaffName || "Assigned Staff Member"}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Highest calculated MCDM assignment score based on configured criteria
                    </p>

                    {/* Factors Breakdown */}
                    {factors && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-muted/40 p-2 rounded-lg text-center">
                            <div className="text-[10px] text-muted-foreground font-medium">Expertise (35%)</div>
                            <div className="text-xs font-bold text-foreground">{(factors.expertise ?? 8).toFixed(1)} / 10</div>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-lg text-center">
                            <div className="text-[10px] text-muted-foreground font-medium">Capacity (30%)</div>
                            <div className="text-xs font-bold text-foreground">{(factors.workload ?? 8).toFixed(1)} / 10</div>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-lg text-center">
                            <div className="text-[10px] text-muted-foreground font-medium">Proximity (20%)</div>
                            <div className="text-xs font-bold text-foreground">
                              {factors.proximity !== null ? `${(factors.proximity ?? 7.5).toFixed(1)} / 10` : "N/A"}
                            </div>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-lg text-center">
                            <div className="text-[10px] text-muted-foreground font-medium">Response (15%)</div>
                            <div className="text-xs font-bold text-foreground">{(factors.responseTime ?? 8).toFixed(1)} / 10</div>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                          A<sub>o</sub> = 0.35E + 0.30W + 0.20D + 0.15T — Score calculated from configured assignment criteria. (Demo / Prototype Data)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Manual Reassignment */}
                {(role === "admin" || !role) && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <label className="text-xs font-semibold text-foreground block">Admin Manual Staff Override</label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        className="text-xs bg-background border border-input rounded-lg px-2.5 py-1.5"
                      >
                        <option value="">Select Staff to Override</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.department} — {s.currentStatus})
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Reason for manual reassignment..."
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        className="text-xs bg-background border border-input rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <button
                      onClick={handleManualReassign}
                      className="mt-1 w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Confirm Reassignment
                    </button>
                  </div>
                )}
              </div>

              {/* Routing & Assignment History */}
              {((complaint.routingHistory && complaint.routingHistory.length > 0) ||
                (complaint.assignmentHistory && complaint.assignmentHistory.length > 0)) && (
                <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <History className="size-4" /> ROUTING & ASSIGNMENT AUDIT LOG
                  </div>
                  <div className="space-y-2 text-xs">
                    {complaint.routingHistory?.map((rh, idx) => (
                      <div key={idx} className="p-2 rounded-md bg-muted/30 border border-border flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-foreground">Routed to {rh.department}</span>
                          <p className="text-[11px] text-muted-foreground">{rh.reason || rh.routingReason}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(rh.routedAt || rh.timestamp || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}

                    {complaint.assignmentHistory?.map((ah, idx) => (
                      <div key={idx} className="p-2 rounded-md bg-muted/30 border border-border space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            Assigned to {ah.staffName || "Unassigned"}
                            {ah.override && (
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                                Manual Override
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(ah.assignedAt || ah.timestamp || Date.now()).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Assigned By: {ah.assignedBy} {ah.reason ? `— (${ah.reason})` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Image Verification Report */}
          {complaint.image && v && (
            <Section
              title="Image verification report"
              subtitle="SHA-256, perceptual hashing, EXIF and location comparison."
            >
              <div className="grid gap-5 md:grid-cols-2">
                {complaint.image.imageUrl ? (
                  <img
                    src={complaint.image.imageUrl}
                    alt="Evidence"
                    className="w-full rounded-xl border border-border"
                  />
                ) : (
                  <div className="grid aspect-video place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                    Archived photo — {complaint.image.fileName}
                  </div>
                )}
                <div>
                  <KeyValue label="SHA-256" value={<Mono>{complaint.image.sha256Hash}</Mono>} />
                  <KeyValue label="pHash" value={<Mono>{complaint.image.perceptualHash}</Mono>} />
                  <KeyValue
                    label="Visual similarity"
                    value={`${(v.visualSimilarity * 100).toFixed(1)}%`}
                  />
                  <KeyValue label="Hamming distance" value={v.hammingDistance ?? "—"} />
                  <KeyValue
                    label="Location distance"
                    value={v.locationDistance === null ? "—" : `${v.locationDistance} m`}
                  />
                  <KeyValue label="Combined score" value={v.combinedScore ? v.combinedScore.toFixed(3) : "—"} />
                  <KeyValue label="Matched complaint" value={v.matchedComplaintId ?? "None"} />
                  <KeyValue label="Device" value={complaint.image.exif.device ?? "Not present"} />
                  <KeyValue
                    label="Captured"
                    value={
                      complaint.image.exif.captureDate
                        ? `${complaint.image.exif.captureDate} ${complaint.image.exif.captureTime ?? ""}`
                        : "Not present"
                    }
                  />
                </div>
              </div>
            </Section>
          )}

          {complaint.resolutionRemarks && (
            <Section title="Resolution">
              <p className="text-sm">{complaint.resolutionRemarks}</p>
            </Section>
          )}

          {(complaint.status === "Resolved" || complaint.status === "Closed") && (
            <Section title="Your feedback" subtitle="Rate how well the issue was handled.">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} aria-label={`${n} star`}>
                    <Star
                      className={cn(
                        "size-7",
                        n <= (rating || (complaint.feedbackRating ?? 0))
                          ? "fill-warning text-warning"
                          : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  updateComplaint(complaint.id, { feedbackRating: rating, status: "Closed" });
                  toast.success("Thanks for your feedback");
                }}
                disabled={!rating}
                className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Submit feedback
              </button>
            </Section>
          )}
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-5">
          <Section title="Priority breakdown" subtitle="Weighted civic priority score out of 10.">
            <div className="space-y-3">
              <MetricRow
                label="Severity"
                value={complaint.priority.severity}
                weight={PRIORITY_WEIGHTS.severity}
              />
              <MetricRow
                label="Urgency"
                value={complaint.priority.urgency}
                weight={PRIORITY_WEIGHTS.urgency}
              />
              <MetricRow
                label="Community impact"
                value={complaint.priority.community}
                weight={PRIORITY_WEIGHTS.community}
              />
              <MetricRow
                label="Location importance"
                value={complaint.priority.location}
                weight={PRIORITY_WEIGHTS.location}
              />
              <MetricRow
                label="Recurrence"
                value={complaint.priority.recurrence}
                weight={PRIORITY_WEIGHTS.recurrence}
              />
              <MetricRow
                label="SLA ageing"
                value={complaint.priority.slaAging}
                weight={PRIORITY_WEIGHTS.slaAging}
              />
            </div>
            <p className="mt-4 text-sm">
              Overall <strong>{complaint.priority.overall.toFixed(1)}</strong> —{" "}
              {complaint.priority.label} · SLA {complaint.slaHours} hours
            </p>
          </Section>

          <Section title="Routing Details">
            <KeyValue label="Department" value={complaint.department} />
            <KeyValue label="Sub-department" value={complaint.subDepartment} />
            <KeyValue label="Assigned staff" value={assigned?.name ?? "Awaiting assignment"} />
            <KeyValue label="Reported by" value={complaint.studentName} />
            <KeyValue label="Reported at" value={formatDate(complaint.submittedAt)} />
            <KeyValue
              label="Coordinates"
              value={`${complaint.lat.toFixed(5)}, ${complaint.lng.toFixed(5)}`}
            />
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
