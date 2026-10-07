import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { StatCard } from "@/components/civic/StatCard";
import { PriorityBadge } from "@/components/civic/badges";
import { Section } from "@/components/civic/ui-bits";
import { SlaCountdown } from "@/components/civic/SlaCountdown";
import { useCivic } from "@/lib/civic/store";
import { computeSlaAging } from "@/services/slaEngine.js";
import { getEscalationLevel } from "@/services/escalationEngine.js";
import { DEPARTMENTS } from "@/utils/departments.js";
import { exportToCsv, formatSlaReportForExport } from "@/utils/exportCsv.js";
import { SLA_CONFIG } from "@/utils/slaConfig.js";
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Filter,
  Download,
  ArrowUpDown,
  History,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/admin/sla")({
  head: () => ({
    meta: [
      { title: "SLA Monitoring & Breach Center — CivicConnect" },
      {
        name: "description",
        content: "Monitor SLA countdowns, breach detections, escalation levels, and active resolution windows across campus departments.",
      },
    ],
  }),
  component: AdminSlaMonitoringPage,
});

function AdminSlaMonitoringPage() {
  const { complaints, staff, escalations } = useCivic();

  // Filters
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterDept, setFilterDept] = useState<string>("ALL");
  const [filterSlaStatus, setFilterSlaStatus] = useState<string>("ALL");
  const [filterStaff, setFilterStaff] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Sorting
  const [sortBy, setSortBy] = useState<"urgent" | "oldest" | "nearest_deadline" | "highest_priority">("urgent");

  // Only open complaints or complaints with SLA obligations are relevant for SLA tracking
  const openComplaints = useMemo(
    () => complaints.filter((c) => c.status !== "Resolved" && c.status !== "Closed" && c.status !== "Duplicate"),
    [complaints]
  );

  // SLA Computations
  const slaMetrics = useMemo(() => {
    let withinSla = 0;
    let dueSoon = 0;
    let overdue = 0;
    let breached = 0;

    openComplaints.forEach((c) => {
      const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
      if (sla.status === "WITHIN_SLA") withinSla++;
      else if (sla.status === "DUE_SOON") dueSoon++;
      else if (sla.status === "OVERDUE") overdue++;
      else if (sla.status === "BREACHED") breached++;
    });

    return {
      totalOpen: openComplaints.length,
      withinSla,
      dueSoon,
      overdue,
      breached,
    };
  }, [openComplaints]);

  const categories = useMemo(() => Array.from(new Set(complaints.map((c) => c.category))), [complaints]);

  // Filtering Logic
  const filteredComplaints = useMemo(() => {
    return openComplaints.filter((c) => {
      const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);

      if (filterPriority !== "ALL" && c.priority?.label !== filterPriority) return false;
      if (filterDept !== "ALL" && c.department !== filterDept) return false;
      if (filterSlaStatus !== "ALL" && sla.status !== filterSlaStatus) return false;
      if (filterStaff !== "ALL") {
        if (filterStaff === "UNASSIGNED" && c.assignedStaffId) return false;
        if (filterStaff !== "UNASSIGNED" && c.assignedStaffId !== filterStaff) return false;
      }
      if (filterCategory !== "ALL" && c.category !== filterCategory) return false;

      return true;
    });
  }, [openComplaints, filterPriority, filterDept, filterSlaStatus, filterStaff, filterCategory]);

  // Sorting Logic
  const sortedComplaints = useMemo(() => {
    const list = [...filteredComplaints];

    return list.sort((a, b) => {
      const slaA = computeSlaAging(a.submittedAt, a.priority?.label, a.slaHours);
      const slaB = computeSlaAging(b.submittedAt, b.priority?.label, b.slaHours);

      if (sortBy === "urgent") {
        return slaA.remainingHours - slaB.remainingHours;
      }
      if (sortBy === "nearest_deadline") {
        return new Date(slaA.dueAt).getTime() - new Date(slaB.dueAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      if (sortBy === "highest_priority") {
        return (b.priority?.overall || 0) - (a.priority?.overall || 0);
      }
      return 0;
    });
  }, [filteredComplaints, sortBy]);

  const handleExportSlaReport = () => {
    const exportData = formatSlaReportForExport(filteredComplaints, computeSlaAging);
    exportToCsv(exportData, `civicconnect_sla_report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <AppShell>
      <PageHeader
        title="SLA Monitoring & Escalation Center"
        description="Real-time SLA countdown timers, multi-level breach detection, and SLA escalation tracking powered by dynamic complaint state."
        actions={
          <button
            onClick={handleExportSlaReport}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Download className="size-4" /> Export SLA Report (CSV)
          </button>
        }
      />

      {/* SLA Disclaimer Banner */}
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-600 flex items-center justify-between">
        <span>
          <strong>Notice:</strong> SLA durations (Critical: 4h, High: 12h, Medium: 24h, Low: 72h) are <strong>{SLA_CONFIG.disclaimer}</strong> configured for testing issue escalation workflows.
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatCard label="Total Open Issues" value={slaMetrics.totalOpen} icon={FileText} />
        <StatCard label="Within SLA" value={slaMetrics.withinSla} icon={CheckCircle2} tone="success" />
        <StatCard label="Due Soon" value={slaMetrics.dueSoon} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={slaMetrics.overdue} icon={AlertTriangle} tone="critical" />
        <StatCard label="SLA Breached" value={slaMetrics.breached} icon={ShieldAlert} tone="critical" hint="Escalation Level 3" />
      </div>

      {/* Toolbar & Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Filter className="size-4 text-primary" />
            <span>Filters:</span>
          </div>

          {/* Priority Filter */}
          <select
            aria-label="Filter by Priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical (4h SLA)</option>
            <option value="High">High (12h SLA)</option>
            <option value="Medium">Medium (24h SLA)</option>
            <option value="Low">Low (72h SLA)</option>
          </select>

          {/* Department Filter */}
          <select
            aria-label="Filter by Department"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((d: any) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* SLA Status Filter */}
          <select
            aria-label="Filter by SLA Status"
            value={filterSlaStatus}
            onChange={(e) => setFilterSlaStatus(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All SLA Statuses</option>
            <option value="WITHIN_SLA">Within SLA (0-70%)</option>
            <option value="DUE_SOON">Due Soon (70-100%)</option>
            <option value="OVERDUE">Overdue (&gt;100%)</option>
            <option value="BREACHED">Breached (&gt;150% / &gt;12h)</option>
          </select>

          {/* Assigned Staff Filter */}
          <select
            aria-label="Filter by Assigned Staff"
            value={filterStaff}
            onChange={(e) => setFilterStaff(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Staff</option>
            <option value="UNASSIGNED">Unassigned Only</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.department})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            aria-label="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Sort:</span>
          <select
            aria-label="Sort Order"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="urgent">Most Urgent (Time Left)</option>
            <option value="nearest_deadline">Nearest SLA Deadline</option>
            <option value="highest_priority">Highest Priority Rating</option>
            <option value="oldest">Oldest Created First</option>
          </select>
        </div>
      </div>

      {/* Main SLA Monitoring Table */}
      <Section title="Active Complaint SLA Table">
        {sortedComplaints.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
            No complaints match the selected SLA filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Complaint ID</th>
                  <th className="px-4 py-3">Category & Dept</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assigned Staff</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3">Due At</th>
                  <th className="px-4 py-3">Dynamic Live Countdown</th>
                  <th className="px-4 py-3">Escalation Level</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedComplaints.map((c) => {
                  const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
                  const escLevel = getEscalationLevel(sla.status);
                  const assignedMember = staff.find((s) => s.id === c.assignedStaffId);

                  return (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link to="/complaint/$id" params={{ id: c.id }} className="font-mono font-bold text-primary hover:underline">
                          {c.id}
                        </Link>
                        <div className="text-[11px] text-muted-foreground">{c.status}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{c.category}</div>
                        <div className="text-xs text-muted-foreground">{c.department}</div>
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge label={c.priority?.label || "Medium"} score={c.priority?.overall} />
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {assignedMember ? (
                          <div className="font-semibold text-foreground">{assignedMember.name}</div>
                        ) : (
                          <span className="text-rose-600 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                        {new Date(sla.createdAt).toLocaleDateString()}<br />
                        {new Date(sla.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                        {new Date(sla.dueAt).toLocaleDateString()}<br />
                        {new Date(sla.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <SlaCountdown
                          submittedAt={c.submittedAt}
                          slaHours={c.slaHours}
                          priorityLabel={c.priority?.label}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                            escLevel.level === 3
                              ? "bg-rose-500/20 text-rose-700 border-rose-500/40"
                              : escLevel.level === 2
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : escLevel.level === 1
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          }`}
                        >
                          {escLevel.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to="/complaint/$id"
                          params={{ id: c.id }}
                          className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-accent"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* SLA Escalation History Audit Log */}
      <Section title="SLA Escalation Audit Log">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2 text-sm">
            <History className="size-4 text-primary" />
            <span>Recorded Escalation Events ({escalations.length})</span>
          </div>

          {escalations.length === 0 ? (
            <p className="text-xs text-muted-foreground">No SLA breach or warning escalations recorded in this session.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {escalations.map((esc) => (
                <div key={esc.id} className="p-3 rounded-lg border border-border bg-muted/40 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <span className="font-mono text-primary">{esc.complaintId}</span>
                      <span>—</span>
                      <span className="text-rose-600 font-bold">{esc.escalationName}</span>
                    </div>
                    <p className="text-muted-foreground">{esc.reason}</p>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground font-mono">
                    {new Date(esc.triggeredAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </AppShell>
  );
}
