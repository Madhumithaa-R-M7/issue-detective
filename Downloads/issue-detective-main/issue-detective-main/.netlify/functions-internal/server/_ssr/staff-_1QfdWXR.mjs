import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { c as Section, r as EmptyState, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./badges-8Fc3983k.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as formatDate } from "./ComplaintRow-DfbxR-Ff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-_1QfdWXR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffPage() {
	const { complaints, staff, updateComplaint, updateStaffStatus } = useCivic();
	const [selectedStaffId, setSelectedStaffId] = (0, import_react.useState)("STF-01");
	const [remarks, setRemarks] = (0, import_react.useState)({});
	const me = staff.find((s) => s.id === selectedStaffId) || staff[0];
	const myAssignedComplaints = complaints.filter((c) => c.assignedStaffId === me.id || c.assignment?.staffId === me.id);
	const totalAssigned = myAssignedComplaints.length;
	const criticalCount = myAssignedComplaints.filter((c) => c.priority?.label === "Critical").length;
	const highCount = myAssignedComplaints.filter((c) => c.priority?.label === "High").length;
	const inProgressCount = myAssignedComplaints.filter((c) => c.status === "In Progress").length;
	const resolvedCount = myAssignedComplaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
	const dueSoonCount = myAssignedComplaints.filter((c) => {
		const hours = (Date.now() - new Date(c.submittedAt).getTime()) / 36e5;
		const left = c.slaHours - hours;
		return c.status !== "Resolved" && c.status !== "Closed" && left >= 0 && left <= 4;
	}).length;
	const overdueCount = myAssignedComplaints.filter((c) => {
		const hours = (Date.now() - new Date(c.submittedAt).getTime()) / 36e5;
		return c.status !== "Resolved" && c.status !== "Closed" && hours > c.slaHours;
	}).length;
	const jobs = [...myAssignedComplaints].sort((a, b) => b.priority.overall - a.priority.overall);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Staff Dashboard — ${me.name}`,
			description: `${me.department} · Skills: ${me.skills.join(", ")} — showing only complaints assigned to your profile.`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "select-staff-user",
					className: "mr-1.5 text-xs text-muted-foreground font-semibold",
					children: "Switch Staff Profile:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "select-staff-user",
					value: selectedStaffId,
					onChange: (e) => setSelectedStaffId(e.target.value),
					className: "text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-input bg-card text-foreground",
					children: staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: s.id,
						children: [
							s.name,
							" (",
							s.department,
							")"
						]
					}, s.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "select-duty-status",
					className: "mr-1.5 text-xs text-muted-foreground font-semibold",
					children: "Duty Status:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "select-duty-status",
					value: me.currentStatus,
					onChange: (e) => {
						updateStaffStatus(me.id, e.target.value);
						toast.success(`Updated duty status to ${e.target.value}`);
					},
					className: "text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Available",
							children: "Available"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Busy",
							children: "Busy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Offline",
							children: "Offline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "On Leave",
							children: "On Leave"
						})
					]
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-600",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Demo / Prototype Data:" }), " Staff profile metrics and MCDM criteria ratings are prototype parameters."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-4 lg:grid-cols-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-muted-foreground",
						children: "Total Assigned"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-foreground",
						children: totalAssigned
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-rose-500",
						children: "Critical Priority"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-rose-600",
						children: criticalCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-amber-500",
						children: "High Priority"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-amber-600",
						children: highCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-amber-600",
						children: "Due Soon (<4h)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-amber-700",
						children: dueSoonCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-rose-600",
						children: "SLA Overdue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-rose-700",
						children: overdueCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-blue-500",
						children: "In Progress"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-blue-600",
						children: inProgressCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-emerald-500",
						children: "Resolved"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-emerald-600",
						children: resolvedCount
					})]
				})
			]
		}),
		jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No open jobs assigned",
			hint: "Newly assigned complaints will appear here automatically via MCDM router."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: jobs.map((c) => {
				const factors = c.assignmentFactors;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: `${c.id} — ${c.category}`,
					subtitle: c.description,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
									label: c.priority.label,
									score: c.priority.overall
								}),
								c.assignmentInfo?.mcdmScore !== null && c.assignmentInfo?.mcdmScore !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20",
									children: [
										"MCDM Score: ",
										c.assignmentInfo.mcdmScore.toFixed(1),
										"/10"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										c.location,
										" · ",
										c.detailedLocation,
										" · reported ",
										formatDate(c.submittedAt),
										" · SLA",
										" ",
										c.slaHours,
										"h"
									]
								})
							]
						}),
						factors && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/30 p-2.5 rounded-lg border border-border text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: "Expertise (E)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-bold text-foreground",
									children: [factors.expertise, " / 10"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: "Capacity (W)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-bold text-foreground",
									children: [factors.workload, " / 10"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: "Proximity (D)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-bold text-foreground",
									children: [factors.proximity, " / 10"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: "Response (T)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-bold text-foreground",
									children: [factors.responseTime, " / 10"]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [c.status !== "In Progress" && c.status !== "Resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									updateComplaint(c.id, { status: "In Progress" });
									toast.success(`${c.id} marked as in progress`);
								},
								className: "rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3.5 py-2 text-xs font-semibold hover:bg-amber-500/20",
								children: "Start work"
							}), c.status !== "Resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									updateComplaint(c.id, {
										status: "Resolved",
										resolutionRemarks: remarks[c.id]?.trim() || "Issue inspected on site and rectified."
									});
									toast.success(`${c.id} marked resolved`);
								},
								className: "rounded-lg bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold hover:bg-emerald-600",
								children: "Mark resolved"
							})]
						}),
						c.status !== "Resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: remarks[c.id] ?? "",
							onChange: (e) => setRemarks((r) => ({
								...r,
								[c.id]: e.target.value
							})),
							rows: 2,
							placeholder: "Resolution remarks (what you fixed on site...)",
							className: "mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
						})
					]
				}, c.id);
			})
		})
	] });
}
//#endregion
export { StaffPage as component };
