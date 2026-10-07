import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { StatCard } from "@/components/civic/StatCard";
import { Section } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import { computeSlaAging } from "@/services/slaEngine.js";
import { runDbscanClustering } from "@/services/geospatialEngine.js";
import { DEPARTMENTS } from "@/utils/departments.js";
import { exportToCsv, formatComplaintsForExport } from "@/utils/exportCsv.js";
import {
  BarChart3,
  CheckCircle2,
  FileStack,
  ImageIcon,
  Timer,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Filter,
  Download,
  Calendar,
  Layers,
  MapPin,
  Flame,
  Users,
  Clock,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Campus Analytics — CivicConnect" },
      {
        name: "description",
        content: "Campus complaint analytics, SLA performance metrics, category breakdowns, resolution statistics, image verification metrics, and trends.",
      },
    ],
  }),
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  const { complaints, staff } = useCivic();

  // Filter State
  const [dateRange, setDateRange] = useState<"ALL" | "TODAY" | "LAST_7" | "LAST_30" | "THIS_MONTH">("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterDept, setFilterDept] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterLocation, setFilterLocation] = useState<string>("ALL");

  const categories = useMemo(() => Array.from(new Set(complaints.map((c) => c.category))), [complaints]);
  const locations = useMemo(() => Array.from(new Set(complaints.map((c) => c.location))), [complaints]);

  // Date Filtering Calculation
  const filteredComplaints = useMemo(() => {
    const now = Date.now();

    return complaints.filter((c) => {
      const createdMs = new Date(c.submittedAt).getTime();

      // Date Range Filter
      if (dateRange === "TODAY") {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        if (createdMs < todayStart.getTime()) return false;
      } else if (dateRange === "LAST_7") {
        if (now - createdMs > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (dateRange === "LAST_30") {
        if (now - createdMs > 30 * 24 * 60 * 60 * 1000) return false;
      } else if (dateRange === "THIS_MONTH") {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        if (createdMs < startOfMonth.getTime()) return false;
      }

      // Attribute Filters
      if (filterCategory !== "ALL" && c.category !== filterCategory) return false;
      if (filterPriority !== "ALL" && c.priority?.label !== filterPriority) return false;
      if (filterDept !== "ALL" && c.department !== filterDept) return false;
      if (filterStatus !== "ALL" && c.status !== filterStatus) return false;
      if (filterLocation !== "ALL" && c.location !== filterLocation) return false;

      return true;
    });
  }, [complaints, dateRange, filterCategory, filterPriority, filterDept, filterStatus, filterLocation]);

  // ----------------------------------------------------
  // SECTION A: COMPLAINT OVERVIEW
  // ----------------------------------------------------
  const overview = useMemo(() => {
    const total = filteredComplaints.length;
    const open = filteredComplaints.filter((c) => ["Submitted", "Under Analysis", "Assigned", "In Progress"].includes(c.status)).length;
    const inProgress = filteredComplaints.filter((c) => ["Assigned", "In Progress"].includes(c.status)).length;
    const resolved = filteredComplaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
    const reopened = filteredComplaints.filter((c) => Boolean(c.reopenedAt)).length;
    const rejected = filteredComplaints.filter((c) => c.status === "Closed" && c.feedbackRating === 1).length;

    const critical = filteredComplaints.filter((c) => c.priority?.label === "Critical").length;
    const high = filteredComplaints.filter((c) => c.priority?.label === "High").length;
    const medium = filteredComplaints.filter((c) => c.priority?.label === "Medium").length;
    const low = filteredComplaints.filter((c) => c.priority?.label === "Low").length;

    return { total, open, inProgress, resolved, reopened, rejected, critical, high, medium, low };
  }, [filteredComplaints]);

  // ----------------------------------------------------
  // SECTION B: CATEGORY ANALYSIS
  // ----------------------------------------------------
  const categoryAnalytics = useMemo(() => {
    const map: Record<string, { total: number; open: number; resolved: number; totalPriority: number }> = {};

    filteredComplaints.forEach((c) => {
      const catObj = map[c.category] || { total: 0, open: 0, resolved: 0, totalPriority: 0 };
      catObj.total++;
      if (["Resolved", "Closed"].includes(c.status)) catObj.resolved++;
      else catObj.open++;
      catObj.totalPriority += c.priority?.overall || 5.0;
      map[c.category] = catObj;
    });

    return Object.entries(map).map(([cat, val]) => ({
      category: cat,
      ...val,
      avgPriority: Math.round((val.totalPriority / val.total) * 10) / 10,
    })).sort((a, b) => b.total - a.total);
  }, [filteredComplaints]);

  // ----------------------------------------------------
  // SECTION C & G: PRIORITY & SLA PERFORMANCE
  // ----------------------------------------------------
  const priorityAndSla = useMemo(() => {
    let slaBreached = 0;
    let slaWithin = 0;
    let dueSoon = 0;

    filteredComplaints.forEach((c) => {
      const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
      if (sla.status === "BREACHED" || sla.status === "OVERDUE") slaBreached++;
      else if (sla.status === "DUE_SOON") dueSoon++;
      else slaWithin++;
    });

    const applicableSla = filteredComplaints.filter((c) => c.status !== "Duplicate").length;
    const resolvedComplaints = filteredComplaints.filter((c) => ["Resolved", "Closed"].includes(c.status));
    const resolvedWithinSla = resolvedComplaints.filter((c) => {
      const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
      return sla.status === "WITHIN_SLA" || sla.status === "DUE_SOON";
    }).length;

    const complianceRate = resolvedComplaints.length > 0
      ? Math.round((resolvedWithinSla / resolvedComplaints.length) * 100)
      : null;

    const breachRate = applicableSla > 0
      ? Math.round((slaBreached / applicableSla) * 100)
      : null;

    const reopenRate = resolvedComplaints.length > 0
      ? Math.round((overview.reopened / resolvedComplaints.length) * 100)
      : null;

    const resolutionRate = overview.total > 0
      ? Math.round((overview.resolved / overview.total) * 100)
      : null;

    return { slaBreached, slaWithin, dueSoon, complianceRate, breachRate, reopenRate, resolutionRate };
  }, [filteredComplaints, overview]);

  // ----------------------------------------------------
  // SECTION H: RESOLUTION TIME ANALYTICS
  // ----------------------------------------------------
  const resolutionTimes = useMemo(() => {
    const resolved = filteredComplaints.filter((c) => c.resolvedAt && ["Resolved", "Closed"].includes(c.status));

    if (resolved.length === 0) {
      return { count: 0, avgHours: null, medianHours: null, minHours: null, maxHours: null };
    }

    const timesHours = resolved
      .map((c) => {
        const start = new Date(c.submittedAt).getTime();
        const end = new Date(c.resolvedAt!).getTime();
        return Math.max(0, (end - start) / (1000 * 60 * 60));
      })
      .sort((a, b) => a - b);

    const sum = timesHours.reduce((acc, t) => acc + t, 0);
    const avgHours = Math.round((sum / timesHours.length) * 10) / 10;
    const minHours = Math.round((timesHours[0] ?? 0) * 10) / 10;
    const maxHours = Math.round((timesHours[timesHours.length - 1] ?? 0) * 10) / 10;

    const mid = Math.floor(timesHours.length / 2);
    const medianHours = timesHours.length % 2 !== 0
      ? Math.round((timesHours[mid] ?? 0) * 10) / 10
      : Math.round((((timesHours[mid - 1] ?? 0) + (timesHours[mid] ?? 0)) / 2) * 10) / 10;

    return { count: resolved.length, avgHours, medianHours, minHours, maxHours };
  }, [filteredComplaints]);

  // ----------------------------------------------------
  // SECTION E: DEPARTMENT ANALYTICS
  // ----------------------------------------------------
  const departmentAnalytics = useMemo(() => {
    return DEPARTMENTS.map((d: any) => {
      const deptComplaints = filteredComplaints.filter((c) => c.department === d.name);
      const total = deptComplaints.length;
      const open = deptComplaints.filter((c) => ["Submitted", "Under Analysis"].includes(c.status)).length;
      const inProgress = deptComplaints.filter((c) => ["Assigned", "In Progress"].includes(c.status)).length;
      const resolved = deptComplaints.filter((c) => ["Resolved", "Closed"].includes(c.status)).length;

      let breached = 0;
      let overdue = 0;
      let totalPriority = 0;

      deptComplaints.forEach((c) => {
        const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
        if (sla.status === "BREACHED") breached++;
        if (sla.status === "OVERDUE") overdue++;
        totalPriority += c.priority?.overall || 5.0;
      });

      return {
        id: d.id,
        name: d.name,
        total,
        open,
        inProgress,
        resolved,
        overdue,
        breached,
        avgPriority: total > 0 ? (totalPriority / total).toFixed(1) : "—",
      };
    });
  }, [filteredComplaints]);

  // ----------------------------------------------------
  // SECTION I & J: DUPLICATE & IMAGE VERIFICATION ANALYTICS
  // ----------------------------------------------------
  const verificationAnalytics = useMemo(() => {
    const withImages = filteredComplaints.filter((c) => c.image !== null);
    const newImages = filteredComplaints.filter((c) => c.image?.verification.status === "new" || c.image?.verification.status === "NEW_IMAGE").length;
    const potentialDups = filteredComplaints.filter((c) => c.image?.verification.status === "potential_duplicate" || c.image?.verification.status === "POTENTIAL_DUPLICATE" || c.duplicateAnalysis?.isPotentialDuplicate).length;
    const exactDups = filteredComplaints.filter((c) => c.image?.verification.status === "exact_duplicate" || c.image?.verification.status === "EXACT_DUPLICATE").length;
    const insufficient = filteredComplaints.filter((c) => c.image?.verification.status === "insufficient_evidence" || c.image?.verification.status === "INSUFFICIENT_EVIDENCE").length;
    const manipulated = filteredComplaints.filter((c) => c.image?.verification.status === "POTENTIALLY_MANIPULATED").length;

    const exifAvailable = filteredComplaints.filter((c) => c.image?.exif.available).length;

    return {
      withImagesCount: withImages.length,
      newImages,
      potentialDups,
      exactDups,
      insufficient,
      manipulated,
      exifAvailable,
      exifRate: withImages.length > 0 ? Math.round((exifAvailable / withImages.length) * 100) : 0,
    };
  }, [filteredComplaints]);

  // ----------------------------------------------------
  // SECTION F: LOCATION ANALYTICS
  // ----------------------------------------------------
  const spatialClusters = useMemo(() => runDbscanClustering(filteredComplaints, 80, 2), [filteredComplaints]);

  const handleExportCsv = () => {
    const data = formatComplaintsForExport(filteredComplaints);
    exportToCsv(data, `civicconnect_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Campus Complaint Analytics & Performance"
        description="Dynamic analytics derived from centralized complaint state across volumes, categories, departments, SLA breaches, and image verification metrics."
        actions={
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Download className="size-4" /> Export Filtered Analytics (CSV)
          </button>
        }
      />

      {/* Global Interactive Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Filter className="size-4 text-primary" />
            <span>Analytics Filters:</span>
          </div>

          {/* Date Range Filter */}
          <select
            aria-label="Date Range Filter"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="LAST_7">Last 7 Days</option>
            <option value="LAST_30">Last 30 Days</option>
            <option value="THIS_MONTH">This Month</option>
          </select>

          {/* Category Filter */}
          <select
            aria-label="Category Filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            aria-label="Priority Filter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Department Filter */}
          <select
            aria-label="Department Filter"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            aria-label="Status Filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Analysis">Under Analysis</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Location Filter */}
          <select
            aria-label="Location Filter"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Campus Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          Showing <strong>{filteredComplaints.length}</strong> of {complaints.length} complaints
        </span>
      </div>

      {/* SECTION A: COMPLAINT OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Complaints" value={overview.total} icon={FileStack} />
        <StatCard label="Resolved Successfully" value={overview.resolved} icon={CheckCircle2} tone="success" hint={`Resolution Rate: ${priorityAndSla.resolutionRate !== null ? `${priorityAndSla.resolutionRate}%` : "N/A"}`} />
        <StatCard label="Active Work in Progress" value={overview.inProgress} icon={TrendingUp} hint={`${overview.open} total open`} />
        <StatCard label="SLA Breached / Overdue" value={priorityAndSla.slaBreached} icon={Timer} tone="critical" hint={`Breach Rate: ${priorityAndSla.breachRate !== null ? `${priorityAndSla.breachRate}%` : "N/A"}`} />
      </div>

      {/* SECTION G & H: SLA COMPLIANCE & RESOLUTION TIME ANALYTICS */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Section title="Resolution-Time Performance Analytics">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
            {resolutionTimes.count === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center">
                Not enough resolved complaints in filtered scope to calculate resolution times.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="text-xl font-extrabold text-primary">{resolutionTimes.avgHours}h</div>
                  <div className="text-[11px] text-muted-foreground font-medium">Average Time</div>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="text-xl font-extrabold text-foreground">{resolutionTimes.medianHours}h</div>
                  <div className="text-[11px] text-muted-foreground font-medium">Median Time</div>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="text-xl font-extrabold text-emerald-600">{resolutionTimes.minHours}h</div>
                  <div className="text-[11px] text-muted-foreground font-medium">Min Resolution</div>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="text-xl font-extrabold text-rose-600">{resolutionTimes.maxHours}h</div>
                  <div className="text-[11px] text-muted-foreground font-medium">Max Resolution</div>
                </div>
              </div>
            )}

            <div className="border-t border-border pt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between p-2 rounded bg-muted/30">
                <span className="text-muted-foreground">SLA Compliance Rate:</span>
                <span className="font-bold text-foreground">
                  {priorityAndSla.complianceRate !== null ? `${priorityAndSla.complianceRate}%` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/30">
                <span className="text-muted-foreground">Reopen Rate:</span>
                <span className="font-bold text-foreground">
                  {priorityAndSla.reopenRate !== null ? `${priorityAndSla.reopenRate}%` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* SECTION B: CATEGORY BREAKDOWN */}
        <Section title="Complaint Distribution by Category">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
            {categoryAnalytics.length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center">No categories recorded yet.</div>
            ) : (
              categoryAnalytics.map((c) => {
                const percent = Math.round((c.total / (overview.total || 1)) * 100);
                return (
                  <div key={c.category} className="space-y-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-foreground">{c.category}</span>
                      <span className="text-muted-foreground">{c.total} issues ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(5, percent)}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Section>
      </div>

      {/* SECTION E: DEPARTMENT ANALYTICS TABLE */}
      <Section title="Department Performance Breakdown">
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs mb-6">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3">Total Assigned</th>
                <th className="px-4 py-3">Open / Analysis</th>
                <th className="px-4 py-3">In Progress</th>
                <th className="px-4 py-3">Resolved</th>
                <th className="px-4 py-3">Overdue</th>
                <th className="px-4 py-3">Breached</th>
                <th className="px-4 py-3 text-right">Avg Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departmentAnalytics.map((dept) => (
                <tr key={dept.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-foreground">{dept.name}</td>
                  <td className="px-4 py-3">{dept.total}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{dept.open}</td>
                  <td className="px-4 py-3 text-xs text-blue-600 font-semibold">{dept.inProgress}</td>
                  <td className="px-4 py-3 text-xs text-emerald-600 font-semibold">{dept.resolved}</td>
                  <td className="px-4 py-3 text-xs text-amber-600 font-semibold">{dept.overdue}</td>
                  <td className="px-4 py-3 text-xs text-rose-600 font-bold">{dept.breached}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-primary">{dept.avgPriority}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* SECTION I & J: IMAGE VERIFICATION & DUPLICATE METRICS */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Section title="Image Verification & Provenance Metrics">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-muted/40 rounded-lg border border-border">
                <div className="text-xl font-bold text-emerald-500">{verificationAnalytics.newImages}</div>
                <div className="text-xs text-muted-foreground">Unique Verified Images</div>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border">
                <div className="text-xl font-bold text-amber-500">{verificationAnalytics.potentialDups}</div>
                <div className="text-xs text-muted-foreground">Potential Duplicate Flags</div>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border">
                <div className="text-xl font-bold text-rose-500">{verificationAnalytics.exactDups}</div>
                <div className="text-xs text-muted-foreground">Exact SHA-256 Hashes</div>
              </div>
            </div>

            <div className="border-t border-border pt-3 text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>EXIF Provenance Rate:</span>
                <span className="font-mono text-foreground font-semibold">{verificationAnalytics.exifRate}% available</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Engine Hashing:</span>
                <span className="font-mono text-foreground font-semibold">SHA-256 + pHash 8x8 Matrix</span>
              </div>
            </div>
          </div>
        </Section>

        {/* SECTION K & F: STAFF WORKLOAD & GEOSPATIAL CLUSTERS */}
        <Section title="Staff Roster & Spatial Hotspots Summary">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs text-blue-600">
              <strong>Staff Roster Status:</strong> {staff.filter((s) => s.currentStatus === "Available").length} available on duty. <em>(Prototype / Demo Data)</em>
            </div>

            <div className="flex items-center justify-between text-xs p-3 bg-muted/40 rounded-lg border border-border">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Flame className="size-4 text-rose-500" /> Active Spatial Hotspot Clusters:
              </span>
              <span className="font-bold text-rose-600 text-sm">{spatialClusters.length} Clusters Detected</span>
            </div>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
