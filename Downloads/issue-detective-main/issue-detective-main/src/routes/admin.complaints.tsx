import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, UserCheck, Shield, Wrench, Info, Cpu, MapPin, X } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { PriorityBadge, StatusBadge, VerificationBadge } from "@/components/civic/badges";
import { Section } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import { calculateSlaInfo } from "@/lib/civic/algorithms";
import { SlaCountdown } from "@/components/civic/SlaCountdown";
import { DEPARTMENTS } from "@/utils/departments.js";
import type { Complaint } from "@/lib/civic/types";

export const Route = createFileRoute("/admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaint Management & Routing — CivicConnect" },
      {
        name: "description",
        content: "Analyze complaints, review MCDM staff recommendations, re-assign department staff, and monitor SLAs.",
      },
    ],
  }),
  component: AdminComplaintsPage,
});

function AdminComplaintsPage() {
  const { complaints, staff, reassignStaff, unassignStaff, rerouteDepartment } = useCivic();
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [activeMcdmModal, setActiveMcdmModal] = useState<Complaint | null>(null);
  const [activeRoutingModal, setActiveRoutingModal] = useState<Complaint | null>(null);

  const categories = Array.from(new Set(complaints.map((c) => c.category)));

  const filtered = complaints.filter((c) => {
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterDept !== "all" && c.department !== filterDept) return false;
    return true;
  });

  const unassignedCount = complaints.filter(
    (c) => !c.assignedStaffId || c.assignmentStatus === "Unassigned"
  ).length;

  return (
    <AppShell>
      <PageHeader
        title="Complaint Analysis & MCDM Routing Center"
        description="Review incoming campus issues, inspect rule-based department routing, evaluate MCDM staff candidates, and override staff assignments."
      />

      {/* Unassigned Banner Alert if any unassigned */}
      {unassignedCount > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between text-amber-600">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0" />
            <div className="text-sm font-medium">
              <strong>{unassignedCount} Unassigned Complaint{unassignedCount > 1 ? "s" : ""}</strong> currently awaiting manual staff allocation (all department staff either offline, on leave, or at maximum capacity).
            </div>
          </div>
          <button
            onClick={() => setFilterStatus("Submitted")}
            className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-500/30"
          >
            Filter Unassigned
          </button>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <label htmlFor="filter-category" className="mr-2 text-sm font-semibold text-foreground">Category:</label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-dept" className="mr-2 text-sm font-semibold text-foreground">Department:</label>
          <select
            id="filter-dept"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-status" className="mr-2 text-sm font-semibold text-foreground">Status:</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Analysis">Under Analysis</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Duplicate">Duplicate</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {complaints.length} complaints
        </div>
      </div>

      {/* Complaints Table */}
      <Section title="All Campus Complaints & MCDM Allocations">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ID & Date</th>
                <th className="px-4 py-3">Category & Department</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Routing Info</th>
                <th className="px-4 py-3">SLA Status</th>
                <th className="px-4 py-3">MCDM Staff Assignment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => {
                const sla = calculateSlaInfo(c.submittedAt, c.slaHours);
                const assignedMember = staff.find((s) => s.id === c.assignedStaffId);
                const isUnassigned = !c.assignedStaffId || c.assignmentStatus === "Unassigned";
                const mcdmScore = c.assignment?.mcdmScore ?? c.assignmentInfo?.mcdmScore;

                return (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link to="/complaint/$id" params={{ id: c.id }} className="font-mono font-semibold text-primary hover:underline">
                        {c.id}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {new Date(c.submittedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{c.category}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <select
                          aria-label={`Department for ${c.id}`}
                          value={c.department}
                          onChange={(e) => {
                            const newDept = e.target.value;
                            rerouteDepartment(c.id, newDept, "Admin Portal", `Manual reroute to ${newDept}`);
                            toast.success(`Rerouted ${c.id} to ${newDept}`);
                          }}
                          className="rounded border border-input bg-background px-1.5 py-0.5 text-xs font-semibold text-primary"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{c.location}</div>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge label={c.priority.label} score={c.priority.overall} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActiveRoutingModal(c)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted/60 px-2 py-1 rounded border border-border"
                      >
                        <Info className="size-3 text-primary" /> Routing Reason
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <SlaCountdown
                        submittedAt={c.submittedAt}
                        slaHours={c.slaHours}
                        priorityLabel={c.priority?.label}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {isUnassigned ? (
                          <div className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <AlertTriangle className="size-3" /> Unassigned
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-foreground">{assignedMember?.name || c.assignment?.staffName}</span>
                            {mcdmScore !== null && (
                              <button
                                onClick={() => setActiveMcdmModal(c)}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 hover:bg-emerald-500/20"
                              >
                                MCDM: {mcdmScore?.toFixed(1)}/10
                              </button>
                            )}
                          </div>
                        )}

                        <select
                          aria-label={`Assign staff for ${c.id}`}
                          value={c.assignedStaffId || ""}
                          onChange={(e) => {
                            const newStaffId = e.target.value;
                            if (newStaffId) {
                              reassignStaff(c.id, newStaffId, "Admin Complaints Portal", "Manual Admin Assignment");
                              const sObj = staff.find((s) => s.id === newStaffId);
                              toast.success(`Reassigned ${c.id} to ${sObj?.name}`);
                            } else {
                              unassignStaff(c.id, "Admin Complaints Portal", "Manual Admin Unassignment");
                              toast.info(`Set ${c.id} to Unassigned`);
                            }
                          }}
                          className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">-- Unassigned --</option>
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.department} — {s.currentStatus})
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {mcdmScore !== null && (
                        <button
                          onClick={() => setActiveMcdmModal(c)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
                        >
                          <Cpu className="size-3" /> MCDM Breakdown
                        </button>
                      )}
                      <Link
                        to="/complaint/$id"
                        params={{ id: c.id }}
                        className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-accent ml-1"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* MCDM Score Explanation Modal */}
      {activeMcdmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">MCDM Assignment Score Breakdown</h3>
                <p className="text-xs text-muted-foreground">Complaint: {activeMcdmModal.id} — {activeMcdmModal.category}</p>
              </div>
              <button onClick={() => setActiveMcdmModal(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Staff Member:</span>
                <span className="text-sm font-bold text-primary">{activeMcdmModal.assignment?.staffName || activeMcdmModal.assignmentInfo?.assignedStaffName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">MCDM Assignment Score:</span>
                <span className="text-lg font-extrabold text-emerald-600">
                  {(activeMcdmModal.assignment?.mcdmScore ?? activeMcdmModal.assignmentInfo?.mcdmScore)?.toFixed(1)} / 10
                </span>
              </div>
            </div>

            {/* Criteria Factor Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Criteria Factors (0-10 Scale)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                  <span>Expertise (E) — <strong>Weight 35%</strong></span>
                  <span className="font-mono font-bold text-foreground">
                    {(activeMcdmModal.assignmentFactors?.expertise ?? 8.0).toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                  <span>Workload / Capacity (W) — <strong>Weight 30%</strong></span>
                  <span className="font-mono font-bold text-foreground">
                    {(activeMcdmModal.assignmentFactors?.workload ?? 8.0).toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                  <span>Proximity (D) — <strong>Weight 20%</strong></span>
                  <span className="font-mono font-bold text-foreground">
                    {activeMcdmModal.assignmentFactors?.proximity !== null
                      ? `${(activeMcdmModal.assignmentFactors?.proximity ?? 7.5).toFixed(1)} / 10`
                      : "N/A (No GPS)"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                  <span>Response Time (T) — <strong>Weight 15%</strong></span>
                  <span className="font-mono font-bold text-foreground">
                    {(activeMcdmModal.assignmentFactors?.responseTime ?? 8.0).toFixed(1)} / 10
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-3 text-xs text-blue-600 border border-blue-500/20">
              <strong>Formula:</strong> A<sub>o</sub> = 0.35E + 0.30W + 0.20D + 0.15T<br />
              <em>Score calculated from configured assignment criteria. (Demo / Prototype Data)</em>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setActiveMcdmModal(null)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing Info Modal */}
      {activeRoutingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Department Routing Reasoning</h3>
                <p className="text-xs text-muted-foreground">Complaint: {activeRoutingModal.id}</p>
              </div>
              <button onClick={() => setActiveRoutingModal(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Category:</span>
                  <span className="font-semibold">{activeRoutingModal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Routed Department:</span>
                  <span className="font-bold text-primary">{activeRoutingModal.routing?.department || activeRoutingModal.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Routing Method:</span>
                  <span className="font-mono text-xs">{activeRoutingModal.routing?.method || "Rule-Based Category Routing"}</span>
                </div>
              </div>

              <div className="p-3 bg-background rounded-xl border border-border text-xs space-y-1">
                <div className="font-semibold text-foreground">Routing Reason:</div>
                <p className="text-muted-foreground">
                  "{activeRoutingModal.routing?.reason || activeRoutingModal.routingInfo?.routingReason || `Complaint category = ${activeRoutingModal.category}`}"
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setActiveRoutingModal(null)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

