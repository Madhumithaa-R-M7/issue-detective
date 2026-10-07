import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Copy, FileStack, ImageIcon, Timer, MapPin, Zap } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { StatCard } from "@/components/civic/StatCard";
import { ComplaintRow } from "@/components/civic/ComplaintRow";
import { Section } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import { runDbscanClustering } from "@/services/geospatialEngine.js";
import { computeSlaAging } from "@/services/slaEngine.js";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — CivicConnect" },
      {
        name: "description",
        content:
          "Campus-wide complaint overview: priority levels, DBSCAN spatial hotspots, verified images, duplicates detected, and SLA aging.",
      },
      { property: "og:title", content: "Admin Dashboard — CivicConnect" },
      {
        property: "og:description",
        content: "Campus complaint overview with verification, duplicates, SLA and spatial hotspot tracking.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { complaints } = useCivic();

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
  const open = complaints.filter((c) => !["Resolved", "Closed", "Duplicate"].includes(c.status));
  const inProgress = complaints.filter((c) => c.status === "In Progress" || c.status === "Assigned").length;

  const criticalCount = complaints.filter((c) => c.priority.label === "Critical").length;
  const highCount = complaints.filter((c) => c.priority.label === "High").length;
  const mediumCount = complaints.filter((c) => c.priority.label === "Medium").length;
  const lowCount = complaints.filter((c) => c.priority.label === "Low").length;

  const overdueCount = complaints.filter((c) => {
    const sla = computeSlaAging(c.submittedAt, c.priority.label, c.slaHours);
    return sla.status === "Overdue" || sla.status === "SLA Breached" || sla.status === "Escalated";
  }).length;

  const imagesCount = complaints.filter((c) => c.image !== null).length;
  const potDupCount = complaints.filter(
    (c) =>
      c.image?.verification.status === "potential_duplicate" ||
      c.image?.verification.status === "POTENTIAL_DUPLICATE" ||
      c.duplicateAnalysis?.isPotentialDuplicate
  ).length;

  // DBSCAN Hotspots
  const clusters = runDbscanClustering(complaints, 80, 2);
  const hotspotCount = clusters.filter((cl) => cl.isHotspot).length;

  const topPriority = [...open].sort((a, b) => b.priority.overall - a.priority.overall).slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        title="Administration Dashboard"
        description="Live campus intelligence: weighted priority distribution, SLA compliance, spatial hotspots, and verification statistics."
      />

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Active Complaints" value={total} icon={FileStack} />
        <StatCard
          label="Resolved & Closed"
          value={resolved}
          icon={CheckCircle2}
          tone="success"
          hint={`${total > 0 ? Math.round((resolved / total) * 100) : 0}% resolution rate`}
        />
        <StatCard label="In Progress Work" value={inProgress} icon={Timer} hint="Assigned campus staff" />
        <StatCard label="Overdue SLA Breaches" value={overdueCount} icon={AlertTriangle} tone="critical" />
      </div>

      {/* Secondary Intelligence Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">Critical Priority</div>
            <div className="text-2xl font-bold text-rose-500">{criticalCount}</div>
          </div>
          <Zap className="size-6 text-rose-500" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">High Priority</div>
            <div className="text-2xl font-bold text-amber-500">{highCount}</div>
          </div>
          <Zap className="size-6 text-amber-500" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">Potential Duplicates</div>
            <div className="text-2xl font-bold text-primary">{potDupCount}</div>
          </div>
          <Copy className="size-6 text-primary" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">DBSCAN Hotspot Clusters</div>
            <div className="text-2xl font-bold text-emerald-500">{hotspotCount}</div>
          </div>
          <MapPin className="size-6 text-emerald-500" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section
            title="Highest priority open complaints"
            subtitle="Ranked by Weighted Civic Priority (P = 0.25S + 0.20U + 0.15C + 0.15G + 0.10R + 0.15A)."
          >
            <div className="space-y-3">
              {topPriority.map((c) => (
                <ComplaintRow key={c.id} complaint={c} />
              ))}
            </div>
          </Section>
        </div>

        <Section title="Quick actions">
          <div className="space-y-2 text-sm">
            {[
              { to: "/admin/complaints", label: "Analyse and assign complaints" },
              { to: "/admin/verification", label: "Open Image Verification Center" },
              { to: "/admin/duplicates", label: "Review potential duplicates" },
              { to: "/admin/map", label: "View campus map & hotspots" },
              { to: "/admin/analytics", label: "See analytics and trends" },
              { to: "/admin/algorithms", label: "Inspect the algorithm panel" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="block rounded-lg bg-secondary px-3.5 py-2.5 font-medium hover:bg-accent"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
