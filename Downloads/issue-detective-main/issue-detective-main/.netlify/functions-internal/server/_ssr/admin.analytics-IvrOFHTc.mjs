import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as runDbscanClustering, i as DEPARTMENTS, u as computeSlaAging, v as useCivic } from "./store-B0cKa5ln.mjs";
import { A as FileStack, D as Flame, E as Funnel, N as Download, R as CircleCheck, c as TrendingUp, l as Timer } from "../_libs/lucide-react.mjs";
import { c as Section, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { t as StatCard } from "./StatCard-DO-Hpi6m.mjs";
import { n as formatComplaintsForExport, t as exportToCsv } from "./exportCsv-E5kC_OFX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-IvrOFHTc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAnalyticsPage() {
	const { complaints, staff } = useCivic();
	const [dateRange, setDateRange] = (0, import_react.useState)("ALL");
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("ALL");
	const [filterPriority, setFilterPriority] = (0, import_react.useState)("ALL");
	const [filterDept, setFilterDept] = (0, import_react.useState)("ALL");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("ALL");
	const [filterLocation, setFilterLocation] = (0, import_react.useState)("ALL");
	const categories = (0, import_react.useMemo)(() => Array.from(new Set(complaints.map((c) => c.category))), [complaints]);
	const locations = (0, import_react.useMemo)(() => Array.from(new Set(complaints.map((c) => c.location))), [complaints]);
	const filteredComplaints = (0, import_react.useMemo)(() => {
		const now = Date.now();
		return complaints.filter((c) => {
			const createdMs = new Date(c.submittedAt).getTime();
			if (dateRange === "TODAY") {
				const todayStart = /* @__PURE__ */ new Date();
				todayStart.setHours(0, 0, 0, 0);
				if (createdMs < todayStart.getTime()) return false;
			} else if (dateRange === "LAST_7") {
				if (now - createdMs > 6048e5) return false;
			} else if (dateRange === "LAST_30") {
				if (now - createdMs > 2592e6) return false;
			} else if (dateRange === "THIS_MONTH") {
				if (createdMs < new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).getTime()) return false;
			}
			if (filterCategory !== "ALL" && c.category !== filterCategory) return false;
			if (filterPriority !== "ALL" && c.priority?.label !== filterPriority) return false;
			if (filterDept !== "ALL" && c.department !== filterDept) return false;
			if (filterStatus !== "ALL" && c.status !== filterStatus) return false;
			if (filterLocation !== "ALL" && c.location !== filterLocation) return false;
			return true;
		});
	}, [
		complaints,
		dateRange,
		filterCategory,
		filterPriority,
		filterDept,
		filterStatus,
		filterLocation
	]);
	const overview = (0, import_react.useMemo)(() => {
		return {
			total: filteredComplaints.length,
			open: filteredComplaints.filter((c) => [
				"Submitted",
				"Under Analysis",
				"Assigned",
				"In Progress"
			].includes(c.status)).length,
			inProgress: filteredComplaints.filter((c) => ["Assigned", "In Progress"].includes(c.status)).length,
			resolved: filteredComplaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length,
			reopened: filteredComplaints.filter((c) => Boolean(c.reopenedAt)).length,
			rejected: filteredComplaints.filter((c) => c.status === "Closed" && c.feedbackRating === 1).length,
			critical: filteredComplaints.filter((c) => c.priority?.label === "Critical").length,
			high: filteredComplaints.filter((c) => c.priority?.label === "High").length,
			medium: filteredComplaints.filter((c) => c.priority?.label === "Medium").length,
			low: filteredComplaints.filter((c) => c.priority?.label === "Low").length
		};
	}, [filteredComplaints]);
	const categoryAnalytics = (0, import_react.useMemo)(() => {
		const map = {};
		filteredComplaints.forEach((c) => {
			const catObj = map[c.category] || {
				total: 0,
				open: 0,
				resolved: 0,
				totalPriority: 0
			};
			catObj.total++;
			if (["Resolved", "Closed"].includes(c.status)) catObj.resolved++;
			else catObj.open++;
			catObj.totalPriority += c.priority?.overall || 5;
			map[c.category] = catObj;
		});
		return Object.entries(map).map(([cat, val]) => ({
			category: cat,
			...val,
			avgPriority: Math.round(val.totalPriority / val.total * 10) / 10
		})).sort((a, b) => b.total - a.total);
	}, [filteredComplaints]);
	const priorityAndSla = (0, import_react.useMemo)(() => {
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
		const complianceRate = resolvedComplaints.length > 0 ? Math.round(resolvedWithinSla / resolvedComplaints.length * 100) : null;
		const breachRate = applicableSla > 0 ? Math.round(slaBreached / applicableSla * 100) : null;
		const reopenRate = resolvedComplaints.length > 0 ? Math.round(overview.reopened / resolvedComplaints.length * 100) : null;
		const resolutionRate = overview.total > 0 ? Math.round(overview.resolved / overview.total * 100) : null;
		return {
			slaBreached,
			slaWithin,
			dueSoon,
			complianceRate,
			breachRate,
			reopenRate,
			resolutionRate
		};
	}, [filteredComplaints, overview]);
	const resolutionTimes = (0, import_react.useMemo)(() => {
		const resolved = filteredComplaints.filter((c) => c.resolvedAt && ["Resolved", "Closed"].includes(c.status));
		if (resolved.length === 0) return {
			count: 0,
			avgHours: null,
			medianHours: null,
			minHours: null,
			maxHours: null
		};
		const timesHours = resolved.map((c) => {
			const start = new Date(c.submittedAt).getTime();
			const end = new Date(c.resolvedAt).getTime();
			return Math.max(0, (end - start) / 36e5);
		}).sort((a, b) => a - b);
		const sum = timesHours.reduce((acc, t) => acc + t, 0);
		const avgHours = Math.round(sum / timesHours.length * 10) / 10;
		const minHours = Math.round((timesHours[0] ?? 0) * 10) / 10;
		const maxHours = Math.round((timesHours[timesHours.length - 1] ?? 0) * 10) / 10;
		const mid = Math.floor(timesHours.length / 2);
		const medianHours = timesHours.length % 2 !== 0 ? Math.round((timesHours[mid] ?? 0) * 10) / 10 : Math.round(((timesHours[mid - 1] ?? 0) + (timesHours[mid] ?? 0)) / 2 * 10) / 10;
		return {
			count: resolved.length,
			avgHours,
			medianHours,
			minHours,
			maxHours
		};
	}, [filteredComplaints]);
	const departmentAnalytics = (0, import_react.useMemo)(() => {
		return DEPARTMENTS.map((d) => {
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
				totalPriority += c.priority?.overall || 5;
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
				avgPriority: total > 0 ? (totalPriority / total).toFixed(1) : "—"
			};
		});
	}, [filteredComplaints]);
	const verificationAnalytics = (0, import_react.useMemo)(() => {
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
			exifRate: withImages.length > 0 ? Math.round(exifAvailable / withImages.length * 100) : 0
		};
	}, [filteredComplaints]);
	const spatialClusters = (0, import_react.useMemo)(() => runDbscanClustering(filteredComplaints, 80, 2), [filteredComplaints]);
	const handleExportCsv = () => {
		const data = formatComplaintsForExport(filteredComplaints);
		exportToCsv(data, `civicconnect_analytics_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Campus Complaint Analytics & Performance",
			description: "Dynamic analytics derived from centralized complaint state across volumes, categories, departments, SLA breaches, and image verification metrics.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleExportCsv,
				className: "inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export Filtered Analytics (CSV)"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-bold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analytics Filters:" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Date Range Filter",
						value: dateRange,
						onChange: (e) => setDateRange(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "TODAY",
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "LAST_7",
								children: "Last 7 Days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "LAST_30",
								children: "Last 30 Days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "THIS_MONTH",
								children: "This Month"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Category Filter",
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Priority Filter",
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
								children: "Critical"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "High",
								children: "High"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Medium",
								children: "Medium"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Low",
								children: "Low"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Department Filter",
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
						"aria-label": "Status Filter",
						value: filterStatus,
						onChange: (e) => setFilterStatus(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Submitted",
								children: "Submitted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Under Analysis",
								children: "Under Analysis"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Assigned",
								children: "Assigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "In Progress",
								children: "In Progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Resolved",
								children: "Resolved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Closed",
								children: "Closed"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Location Filter",
						value: filterLocation,
						onChange: (e) => setFilterLocation(e.target.value),
						className: "rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "All Campus Locations"
						}), locations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: loc,
							children: loc
						}, loc))]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs font-semibold text-muted-foreground",
				children: [
					"Showing ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: filteredComplaints.length }),
					" of ",
					complaints.length,
					" complaints"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Complaints",
					value: overview.total,
					icon: FileStack
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Resolved Successfully",
					value: overview.resolved,
					icon: CircleCheck,
					tone: "success",
					hint: `Resolution Rate: ${priorityAndSla.resolutionRate !== null ? `${priorityAndSla.resolutionRate}%` : "N/A"}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active Work in Progress",
					value: overview.inProgress,
					icon: TrendingUp,
					hint: `${overview.open} total open`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "SLA Breached / Overdue",
					value: priorityAndSla.slaBreached,
					icon: Timer,
					tone: "critical",
					hint: `Breach Rate: ${priorityAndSla.breachRate !== null ? `${priorityAndSla.breachRate}%` : "N/A"}`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Resolution-Time Performance Analytics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs",
					children: [resolutionTimes.count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground py-6 text-center",
						children: "Not enough resolved complaints in filtered scope to calculate resolution times."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-extrabold text-primary",
									children: [resolutionTimes.avgHours, "h"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: "Average Time"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-extrabold text-foreground",
									children: [resolutionTimes.medianHours, "h"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: "Median Time"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-extrabold text-emerald-600",
									children: [resolutionTimes.minHours, "h"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: "Min Resolution"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-extrabold text-rose-600",
									children: [resolutionTimes.maxHours, "h"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: "Max Resolution"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-3 grid grid-cols-2 gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between p-2 rounded bg-muted/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "SLA Compliance Rate:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: priorityAndSla.complianceRate !== null ? `${priorityAndSla.complianceRate}%` : "N/A"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between p-2 rounded bg-muted/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Reopen Rate:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: priorityAndSla.reopenRate !== null ? `${priorityAndSla.reopenRate}%` : "N/A"
							})]
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Complaint Distribution by Category",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs",
					children: categoryAnalytics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground py-6 text-center",
						children: "No categories recorded yet."
					}) : categoryAnalytics.map((c) => {
						const percent = Math.round(c.total / (overview.total || 1) * 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: c.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										c.total,
										" issues (",
										percent,
										"%)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full rounded-full bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary rounded-full transition-all",
									style: { width: `${Math.max(5, percent)}%` }
								})
							})]
						}, c.category);
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Department Performance Breakdown",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-card shadow-xs mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-xs font-semibold uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Department Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Total Assigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Open / Analysis"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "In Progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Resolved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Overdue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Breached"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Avg Priority"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: departmentAnalytics.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-semibold text-foreground",
									children: dept.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: dept.total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-muted-foreground",
									children: dept.open
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-blue-600 font-semibold",
									children: dept.inProgress
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-emerald-600 font-semibold",
									children: dept.resolved
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-amber-600 font-semibold",
									children: dept.overdue
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-rose-600 font-bold",
									children: dept.breached
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right font-mono font-bold text-primary",
									children: [dept.avgPriority, "/10"]
								})
							]
						}, dept.id))
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Image Verification & Provenance Metrics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl font-bold text-emerald-500",
									children: verificationAnalytics.newImages
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Unique Verified Images"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl font-bold text-amber-500",
									children: verificationAnalytics.potentialDups
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Potential Duplicate Flags"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl font-bold text-rose-500",
									children: verificationAnalytics.exactDups
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Exact SHA-256 Hashes"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-3 text-xs text-muted-foreground space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EXIF Provenance Rate:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-foreground font-semibold",
								children: [verificationAnalytics.exifRate, "% available"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verification Engine Hashing:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground font-semibold",
								children: "SHA-256 + pHash 8x8 Matrix"
							})]
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Staff Roster & Spatial Hotspots Summary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs text-blue-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Staff Roster Status:" }),
							" ",
							staff.filter((s) => s.currentStatus === "Available").length,
							" available on duty. ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "(Prototype / Demo Data)" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs p-3 bg-muted/40 rounded-lg border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4 text-rose-500" }), " Active Spatial Hotspot Clusters:"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-rose-600 text-sm",
							children: [spatialClusters.length, " Clusters Detected"]
						})]
					})]
				})
			})]
		})
	] });
}
//#endregion
export { AdminAnalyticsPage as component };
