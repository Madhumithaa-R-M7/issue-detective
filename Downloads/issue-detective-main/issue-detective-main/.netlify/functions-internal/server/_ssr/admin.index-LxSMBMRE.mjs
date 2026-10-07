import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as runDbscanClustering, u as computeSlaAging, v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileStack, F as Copy, R as CircleCheck, _ as MapPin, l as Timer, s as TriangleAlert, t as Zap } from "../_libs/lucide-react.mjs";
import { c as Section, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { t as StatCard } from "./StatCard-DO-Hpi6m.mjs";
import { t as ComplaintRow } from "./ComplaintRow-DfbxR-Ff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-LxSMBMRE.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const { complaints } = useCivic();
	const total = complaints.length;
	const resolved = complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
	const open = complaints.filter((c) => ![
		"Resolved",
		"Closed",
		"Duplicate"
	].includes(c.status));
	const inProgress = complaints.filter((c) => c.status === "In Progress" || c.status === "Assigned").length;
	const criticalCount = complaints.filter((c) => c.priority.label === "Critical").length;
	const highCount = complaints.filter((c) => c.priority.label === "High").length;
	complaints.filter((c) => c.priority.label === "Medium").length;
	complaints.filter((c) => c.priority.label === "Low").length;
	const overdueCount = complaints.filter((c) => {
		const sla = computeSlaAging(c.submittedAt, c.priority.label, c.slaHours);
		return sla.status === "Overdue" || sla.status === "SLA Breached" || sla.status === "Escalated";
	}).length;
	complaints.filter((c) => c.image !== null).length;
	const potDupCount = complaints.filter((c) => c.image?.verification.status === "potential_duplicate" || c.image?.verification.status === "POTENTIAL_DUPLICATE" || c.duplicateAnalysis?.isPotentialDuplicate).length;
	const hotspotCount = runDbscanClustering(complaints, 80, 2).filter((cl) => cl.isHotspot).length;
	const topPriority = [...open].sort((a, b) => b.priority.overall - a.priority.overall).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Administration Dashboard",
			description: "Live campus intelligence: weighted priority distribution, SLA compliance, spatial hotspots, and verification statistics."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Active Complaints",
					value: total,
					icon: FileStack
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Resolved & Closed",
					value: resolved,
					icon: CircleCheck,
					tone: "success",
					hint: `${total > 0 ? Math.round(resolved / total * 100) : 0}% resolution rate`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In Progress Work",
					value: inProgress,
					icon: Timer,
					hint: "Assigned campus staff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Overdue SLA Breaches",
					value: overdueCount,
					icon: TriangleAlert,
					tone: "critical"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-medium",
						children: "Critical Priority"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-rose-500",
						children: criticalCount
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-6 text-rose-500" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-medium",
						children: "High Priority"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-amber-500",
						children: highCount
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-6 text-amber-500" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-medium",
						children: "Potential Duplicates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-primary",
						children: potDupCount
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-6 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-medium",
						children: "DBSCAN Hotspot Clusters"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-emerald-500",
						children: hotspotCount
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-6 text-emerald-500" })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-5 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Highest priority open complaints",
					subtitle: "Ranked by Weighted Civic Priority (P = 0.25S + 0.20U + 0.15C + 0.15G + 0.10R + 0.15A).",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: topPriority.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintRow, { complaint: c }, c.id))
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Quick actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 text-sm",
					children: [
						{
							to: "/admin/complaints",
							label: "Analyse and assign complaints"
						},
						{
							to: "/admin/verification",
							label: "Open Image Verification Center"
						},
						{
							to: "/admin/duplicates",
							label: "Review potential duplicates"
						},
						{
							to: "/admin/map",
							label: "View campus map & hotspots"
						},
						{
							to: "/admin/analytics",
							label: "See analytics and trends"
						},
						{
							to: "/admin/algorithms",
							label: "Inspect the algorithm panel"
						}
					].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: a.to,
						className: "block rounded-lg bg-secondary px-3.5 py-2.5 font-medium hover:bg-accent",
						children: a.label
					}, a.to))
				})
			})]
		})
	] });
}
//#endregion
export { AdminDashboard as component };
