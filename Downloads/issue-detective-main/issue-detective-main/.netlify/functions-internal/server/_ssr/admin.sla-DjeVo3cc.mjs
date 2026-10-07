import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as getEscalationLevel, i as DEPARTMENTS, o as SLA_CONFIG, u as computeSlaAging, v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Funnel, G as ArrowUpDown, I as Clock, N as Download, R as CircleCheck, k as FileText, p as ShieldAlert, s as TriangleAlert, w as History } from "../_libs/lucide-react.mjs";
import { c as Section, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { t as StatCard } from "./StatCard-DO-Hpi6m.mjs";
import { r as formatSlaReportForExport, t as exportToCsv } from "./exportCsv-E5kC_OFX.mjs";
import { t as PriorityBadge } from "./badges-8Fc3983k.mjs";
import { t as SlaCountdown } from "./SlaCountdown-C73kmhom.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.sla-DjeVo3cc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSlaMonitoringPage() {
	const { complaints, staff, escalations } = useCivic();
	const [filterPriority, setFilterPriority] = (0, import_react.useState)("ALL");
	const [filterDept, setFilterDept] = (0, import_react.useState)("ALL");
	const [filterSlaStatus, setFilterSlaStatus] = (0, import_react.useState)("ALL");
	const [filterStaff, setFilterStaff] = (0, import_react.useState)("ALL");
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("ALL");
	const [sortBy, setSortBy] = (0, import_react.useState)("urgent");
	const openComplaints = (0, import_react.useMemo)(() => complaints.filter((c) => c.status !== "Resolved" && c.status !== "Closed" && c.status !== "Duplicate"), [complaints]);
	const slaMetrics = (0, import_react.useMemo)(() => {
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
			breached
		};
	}, [openComplaints]);
	const categories = (0, import_react.useMemo)(() => Array.from(new Set(complaints.map((c) => c.category))), [complaints]);
	const filteredComplaints = (0, import_react.useMemo)(() => {
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
	}, [
		openComplaints,
		filterPriority,
		filterDept,
		filterSlaStatus,
		filterStaff,
		filterCategory
	]);
	const sortedComplaints = (0, import_react.useMemo)(() => {
		return [...filteredComplaints].sort((a, b) => {
			const slaA = computeSlaAging(a.submittedAt, a.priority?.label, a.slaHours);
			const slaB = computeSlaAging(b.submittedAt, b.priority?.label, b.slaHours);
			if (sortBy === "urgent") return slaA.remainingHours - slaB.remainingHours;
			if (sortBy === "nearest_deadline") return new Date(slaA.dueAt).getTime() - new Date(slaB.dueAt).getTime();
			if (sortBy === "oldest") return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
			if (sortBy === "highest_priority") return (b.priority?.overall || 0) - (a.priority?.overall || 0);
			return 0;
		});
	}, [filteredComplaints, sortBy]);
	const handleExportSlaReport = () => {
		const exportData = formatSlaReportForExport(filteredComplaints, computeSlaAging);
		exportToCsv(exportData, `civicconnect_sla_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "SLA Monitoring & Escalation Center",
			description: "Real-time SLA countdown timers, multi-level breach detection, and SLA escalation tracking powered by dynamic complaint state.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleExportSlaReport,
				className: "inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export SLA Report (CSV)"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-600 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Notice:" }),
				" SLA durations (Critical: 4h, High: 12h, Medium: 24h, Low: 72h) are ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: SLA_CONFIG.disclaimer }),
				" configured for testing issue escalation workflows."
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Open Issues",
					value: slaMetrics.totalOpen,
					icon: FileText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Within SLA",
					value: slaMetrics.withinSla,
					icon: CircleCheck,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Due Soon",
					value: slaMetrics.dueSoon,
					icon: Clock,
					tone: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Overdue",
					value: slaMetrics.overdue,
					icon: TriangleAlert,
					tone: "critical"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "SLA Breached",
					value: slaMetrics.breached,
					icon: ShieldAlert,
					tone: "critical",
					hint: "Escalation Level 3"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-bold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filters:" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Filter by Priority",
						value: filterPriority,
						onChange: (e) => setFilterPriority(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Priorities"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Critical",
								children: "Critical (4h SLA)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "High",
								children: "High (12h SLA)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Medium",
								children: "Medium (24h SLA)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Low",
								children: "Low (72h SLA)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Filter by Department",
						value: filterDept,
						onChange: (e) => setFilterDept(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "All Departments"
						}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.name,
							children: d.name
						}, d.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Filter by SLA Status",
						value: filterSlaStatus,
						onChange: (e) => setFilterSlaStatus(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All SLA Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "WITHIN_SLA",
								children: "Within SLA (0-70%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DUE_SOON",
								children: "Due Soon (70-100%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "OVERDUE",
								children: "Overdue (>100%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "BREACHED",
								children: "Breached (>150% / >12h)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Filter by Assigned Staff",
						value: filterStaff,
						onChange: (e) => setFilterStaff(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Staff"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "UNASSIGNED",
								children: "Unassigned Only"
							}),
							staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.id,
								children: [
									s.name,
									" (",
									s.department,
									")"
								]
							}, s.id))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Filter by Category",
						value: filterCategory,
						onChange: (e) => setFilterCategory(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "All Categories"
						}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c
						}, c))]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3.5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground font-medium",
						children: "Sort:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Sort Order",
						value: sortBy,
						onChange: (e) => setSortBy(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "urgent",
								children: "Most Urgent (Time Left)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "nearest_deadline",
								children: "Nearest SLA Deadline"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "highest_priority",
								children: "Highest Priority Rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "oldest",
								children: "Oldest Created First"
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Active Complaint SLA Table",
			children: sortedComplaints.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground",
				children: "No complaints match the selected SLA filter criteria."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-card shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-xs font-semibold uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Complaint ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Category & Dept"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Assigned Staff"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Created At"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Due At"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Dynamic Live Countdown"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Escalation Level"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Details"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: sortedComplaints.map((c) => {
							const sla = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
							const escLevel = getEscalationLevel(sla.status);
							const assignedMember = staff.find((s) => s.id === c.assignedStaffId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/complaint/$id",
											params: { id: c.id },
											className: "font-mono font-bold text-primary hover:underline",
											children: c.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: c.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground",
											children: c.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: c.department
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
											label: c.priority?.label || "Medium",
											score: c.priority?.overall
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs",
										children: assignedMember ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: assignedMember.name
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-600 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20",
											children: "Unassigned"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-xs font-mono text-muted-foreground",
										children: [
											new Date(sla.createdAt).toLocaleDateString(),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											new Date(sla.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-xs font-mono text-muted-foreground",
										children: [
											new Date(sla.dueAt).toLocaleDateString(),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											new Date(sla.dueAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlaCountdown, {
											submittedAt: c.submittedAt,
											slaHours: c.slaHours,
											priorityLabel: c.priority?.label
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${escLevel.level === 3 ? "bg-rose-500/20 text-rose-700 border-rose-500/40" : escLevel.level === 2 ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : escLevel.level === 1 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}`,
											children: escLevel.name
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/complaint/$id",
											params: { id: c.id },
											className: "inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-accent",
											children: "Inspect →"
										})
									})
								]
							}, c.id);
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "SLA Escalation Audit Log",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Recorded Escalation Events (",
						escalations.length,
						")"
					] })]
				}), escalations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No SLA breach or warning escalations recorded in this session."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 max-h-60 overflow-y-auto pr-1 text-xs",
					children: escalations.map((esc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-border bg-muted/40 flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-primary",
										children: esc.complaintId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "—" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-600 font-bold",
										children: esc.escalationName
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: esc.reason
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right text-[10px] text-muted-foreground font-mono",
							children: new Date(esc.triggeredAt).toLocaleTimeString()
						})]
					}, esc.id))
				})]
			})
		})
	] });
}
//#endregion
export { AdminSlaMonitoringPage as component };
