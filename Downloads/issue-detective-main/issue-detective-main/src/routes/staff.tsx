import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Wrench, UserCheck, Clock, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { PriorityBadge, StatusBadge } from "@/components/civic/badges";
import { formatDate } from "@/components/civic/ComplaintRow";
import { EmptyState, Section } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import type { StaffStatus } from "@/lib/civic/types";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Assigned Jobs — CivicConnect Staff" },
      {
        name: "description",
        content: "Maintenance staff view: assigned campus jobs, priority order, MCDM dispatch metrics, and resolution updates.",
      },
      { property: "og:title", content: "Assigned Jobs — CivicConnect Staff" },
      {
        property: "og:description",
        content: "Assigned campus jobs in priority order with resolution updates.",
      },
    ],
  }),
  component: StaffPage,
});

const STAFF_ID = "STF-01";

function StaffPage() {
  const { complaints, staff, updateComplaint, updateStaffStatus } = useCivic();
  const [selectedStaffId, setSelectedStaffId] = useState<string>("STF-01");
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const me = staff.find((s) => s.id === selectedStaffId) || staff[0]!;

  // Strict isolation: ONLY complaints assigned to this staff member
  const myAssignedComplaints = complaints.filter(
    (c) => c.assignedStaffId === me.id || c.assignment?.staffId === me.id
  );

  const totalAssigned = myAssignedComplaints.length;
  const criticalCount = myAssignedComplaints.filter((c) => c.priority?.label === "Critical").length;
  const highCount = myAssignedComplaints.filter((c) => c.priority?.label === "High").length;
  const inProgressCount = myAssignedComplaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = myAssignedComplaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;

  const dueSoonCount = myAssignedComplaints.filter((c) => {
    const hours = (Date.now() - new Date(c.submittedAt).getTime()) / (1000 * 60 * 60);
    const left = c.slaHours - hours;
    return c.status !== "Resolved" && c.status !== "Closed" && left >= 0 && left <= 4;
  }).length;

  const overdueCount = myAssignedComplaints.filter((c) => {
    const hours = (Date.now() - new Date(c.submittedAt).getTime()) / (1000 * 60 * 60);
    return c.status !== "Resolved" && c.status !== "Closed" && hours > c.slaHours;
  }).length;

  const jobs = [...myAssignedComplaints].sort((a, b) => b.priority.overall - a.priority.overall);

  return (
    <AppShell>
      <PageHeader
        title={`Staff Dashboard — ${me.name}`}
        description={`${me.department} · Skills: ${me.skills.join(", ")} — showing only complaints assigned to your profile.`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label htmlFor="select-staff-user" className="mr-1.5 text-xs text-muted-foreground font-semibold">Switch Staff Profile:</label>
              <select
                id="select-staff-user"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-input bg-card text-foreground"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-duty-status" className="mr-1.5 text-xs text-muted-foreground font-semibold">Duty Status:</label>
              <select
                id="select-duty-status"
                value={me.currentStatus}
                onChange={(e) => {
                  updateStaffStatus(me.id, e.target.value as StaffStatus);
                  toast.success(`Updated duty status to ${e.target.value}`);
                }}
                className="text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Prototype Disclaimer */}
      <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-600">
        <strong>Demo / Prototype Data:</strong> Staff profile metrics and MCDM criteria ratings are prototype parameters.
      </div>

      {/* KPI & Workload Cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-muted-foreground">Total Assigned</p>
          <p className="mt-1 text-xl font-bold text-foreground">{totalAssigned}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-rose-500">Critical Priority</p>
          <p className="mt-1 text-xl font-bold text-rose-600">{criticalCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-amber-500">High Priority</p>
          <p className="mt-1 text-xl font-bold text-amber-600">{highCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-amber-600">Due Soon (&lt;4h)</p>
          <p className="mt-1 text-xl font-bold text-amber-700">{dueSoonCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-rose-600">SLA Overdue</p>
          <p className="mt-1 text-xl font-bold text-rose-700">{overdueCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-blue-500">In Progress</p>
          <p className="mt-1 text-xl font-bold text-blue-600">{inProgressCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-medium text-emerald-500">Resolved</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{resolvedCount}</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No open jobs assigned" hint="Newly assigned complaints will appear here automatically via MCDM router." />
      ) : (
        <div className="space-y-4">
          {jobs.map((c) => {
            const factors = c.assignmentFactors;
            return (
              <Section key={c.id} title={`${c.id} — ${c.category}`} subtitle={c.description}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <StatusBadge status={c.status} />
                  <PriorityBadge label={c.priority.label} score={c.priority.overall} />
                  {c.assignmentInfo?.mcdmScore !== null && c.assignmentInfo?.mcdmScore !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                      MCDM Score: {c.assignmentInfo.mcdmScore.toFixed(1)}/10
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {c.location} · {c.detailedLocation} · reported {formatDate(c.submittedAt)} · SLA{" "}
                    {c.slaHours}h
                  </span>
                </div>

                {/* MCDM Factors Callout */}
                {factors && (
                  <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/30 p-2.5 rounded-lg border border-border text-center">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium">Expertise (E)</div>
                      <div className="text-xs font-bold text-foreground">{factors.expertise} / 10</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium">Capacity (W)</div>
                      <div className="text-xs font-bold text-foreground">{factors.workload} / 10</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium">Proximity (D)</div>
                      <div className="text-xs font-bold text-foreground">{factors.proximity} / 10</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium">Response (T)</div>
                      <div className="text-xs font-bold text-foreground">{factors.responseTime} / 10</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {c.status !== "In Progress" && c.status !== "Resolved" && (
                    <button
                      onClick={() => {
                        updateComplaint(c.id, { status: "In Progress" });
                        toast.success(`${c.id} marked as in progress`);
                      }}
                      className="rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3.5 py-2 text-xs font-semibold hover:bg-amber-500/20"
                    >
                      Start work
                    </button>
                  )}
                  {c.status !== "Resolved" && (
                    <button
                      onClick={() => {
                        updateComplaint(c.id, {
                          status: "Resolved",
                          resolutionRemarks:
                            remarks[c.id]?.trim() || "Issue inspected on site and rectified.",
                        });
                        toast.success(`${c.id} marked resolved`);
                      }}
                      className="rounded-lg bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold hover:bg-emerald-600"
                    >
                      Mark resolved
                    </button>
                  )}
                </div>

                {c.status !== "Resolved" && (
                  <textarea
                    value={remarks[c.id] ?? ""}
                    onChange={(e) => setRemarks((r) => ({ ...r, [c.id]: e.target.value }))}
                    rows={2}
                    placeholder="Resolution remarks (what you fixed on site...)"
                    className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}
              </Section>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
