import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, UserCheck, Clock, AlertTriangle, Shield, MapPin, CheckCircle2, Wrench, Search, Filter } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { StatCard } from "@/components/civic/StatCard";
import { Section } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import type { StaffStatus } from "@/lib/civic/types";
import { DEPARTMENTS } from "@/utils/departments.js";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({
    meta: [
      { title: "Staff Management — CivicConnect" },
      {
        name: "description",
        content: "Campus maintenance staff roster, availability status, workload ratios, and MCDM capacity management.",
      },
    ],
  }),
  component: AdminStaffManagement,
});

export function AdminStaffManagement() {
  const { staff, updateStaffStatus, complaints } = useCivic();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expertiseFilter, setExpertiseFilter] = useState<string>("ALL");

  const totalStaff = staff.length;
  const availableCount = staff.filter((s) => s.currentStatus === "Available").length;
  const busyCount = staff.filter((s) => s.currentStatus === "Busy").length;
  const offlineCount = staff.filter((s) => s.currentStatus === "Offline" || s.currentStatus === "On Leave").length;

  const avgResponse = Math.round(staff.reduce((acc, s) => acc + (s.avgResponseMinutes || 0), 0) / Math.max(1, totalStaff));

  const allExpertiseOptions = Array.from(
    new Set(
      staff.flatMap((s) => (Array.isArray(s.expertise) ? s.expertise : [s.expertise]))
    )
  ).filter(Boolean);

  const overCapacityCount = staff.filter((s) => {
    const active = complaints.filter((c) => c.assignedStaffId === s.id && c.status !== "Resolved" && c.status !== "Closed").length;
    return active > s.maxWorkload;
  }).length;

  const filteredStaff = staff.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));

    const matchDept = deptFilter === "ALL" || s.department === deptFilter;
    const matchStatus = statusFilter === "ALL" || s.currentStatus === statusFilter;
    const matchExp =
      expertiseFilter === "ALL" ||
      (Array.isArray(s.expertise)
        ? s.expertise.includes(expertiseFilter)
        : s.expertise === expertiseFilter);

    return matchQuery && matchDept && matchStatus && matchExp;
  });

  return (
    <AppShell>
      <PageHeader
        title="Staff Management & Capacity Center"
        description="Monitor maintenance personnel, dynamic workload ratios, response speeds, and update availability status for MCDM assignment."
      />

      {/* Prototype Data Notice */}
      <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-600 flex items-center justify-between">
        <span>
          <strong>Notice:</strong> Staff profiles, coordinates, and response metrics displayed below are configured <strong>Demo / Prototype Data</strong> used for MCDM assignment testing.
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Staff Members" value={totalStaff} icon={Users} />
        <StatCard
          label="Available On Duty"
          value={availableCount}
          icon={UserCheck}
          tone="success"
          hint={`${busyCount} currently busy, ${offlineCount} offline`}
        />
        <StatCard label="Avg Response Speed" value={`${avgResponse} min`} icon={Clock} hint="Mean dispatch-to-onsite time" />
        {overCapacityCount > 0 ? (
          <StatCard
            label="Over Capacity Staff"
            value={overCapacityCount}
            icon={AlertTriangle}
            tone="critical"
            hint="Active jobs exceed max workload"
          />
        ) : (
          <StatCard
            label="Over Capacity Staff"
            value={overCapacityCount}
            icon={AlertTriangle}
            hint="Active jobs exceed max workload"
          />
        )}
      </div>

      {/* Filter Toolbar */}
      <Section title="Staff Roster & MCDM Allocation">
        <div className="mb-4 flex flex-wrap gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search staff name, skills, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background rounded-lg border border-input focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs bg-background border border-input rounded-lg px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-background border border-input rounded-lg px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
              <option value="On Leave">On Leave</option>
            </select>

            <select
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              className="text-xs bg-background border border-input rounded-lg px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Expertise</option>
              {allExpertiseOptions.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredStaff.map((member) => {
            const activeJobs = complaints.filter(
              (c) => c.assignedStaffId === member.id && c.status !== "Resolved" && c.status !== "Closed"
            ).length;
            const maxCap = member.maxWorkload || 5;
            const loadRatio = Math.round((activeJobs / maxCap) * 100);

            let loadBadgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            let loadLabel = "0–30% Low Load";
            let barColor = "bg-emerald-500";

            if (loadRatio > 100) {
              loadBadgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";
              loadLabel = ">100% Over Capacity";
              barColor = "bg-rose-500";
            } else if (loadRatio > 70) {
              loadBadgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
              loadLabel = "71–100% High Load";
              barColor = "bg-amber-500";
            } else if (loadRatio > 30) {
              loadBadgeColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
              loadLabel = "31–70% Moderate Load";
              barColor = "bg-blue-500";
            }

            return (
              <div key={member.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">{member.name}</h3>
                        <span className="text-xs text-muted-foreground font-mono">({member.id})</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={member.currentStatus}
                    onChange={(e) => updateStaffStatus(member.id, e.target.value as StaffStatus)}
                    className="text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer bg-background"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium"
                    >
                      <Wrench className="size-3 text-muted-foreground" />
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Workload Capacity Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Workload Ratio (W Factor)</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${loadBadgeColor}`}>
                      {activeJobs} / {maxCap} Jobs ({loadRatio}%) — {loadLabel}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-300`}
                      style={{ width: `${Math.min(100, loadRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                  <div className="bg-muted/40 p-2 rounded-lg">
                    <div className="text-[10px] text-muted-foreground font-medium">Avg Speed</div>
                    <div className="text-xs font-bold text-foreground">{member.avgResponseMinutes} min</div>
                  </div>
                  <div className="bg-muted/40 p-2 rounded-lg">
                    <div className="text-[10px] text-muted-foreground font-medium">Resolved</div>
                    <div className="text-xs font-bold text-emerald-600">{member.resolvedCount} jobs</div>
                  </div>
                  <div className="bg-muted/40 p-2 rounded-lg">
                    <div className="text-[10px] text-muted-foreground font-medium">Rating</div>
                    <div className="text-xs font-bold text-amber-500">★ {member.rating.toFixed(1)} / 5</div>
                  </div>
                </div>

                {/* GPS Coordinates */}
                <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <MapPin className="size-3 text-primary" /> Lat: {member.latitude.toFixed(4)}, Lng: {member.longitude.toFixed(4)}
                  </span>
                  <span className="text-[10px] font-sans text-muted-foreground/80">
                    Highest MCDM score evaluated dynamically
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </AppShell>
  );
}
