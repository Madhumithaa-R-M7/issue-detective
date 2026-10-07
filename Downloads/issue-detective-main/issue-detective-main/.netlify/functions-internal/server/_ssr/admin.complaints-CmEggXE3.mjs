import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as DEPARTMENTS, s as calculateSlaInfo, v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as Cpu, S as Info, n as X, s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { c as Section, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { t as PriorityBadge } from "./badges-8Fc3983k.mjs";
import { t as SlaCountdown } from "./SlaCountdown-C73kmhom.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.complaints-CmEggXE3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminComplaintsPage() {
	const { complaints, staff, reassignStaff, unassignStaff, rerouteDepartment } = useCivic();
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [filterDept, setFilterDept] = (0, import_react.useState)("all");
	const [activeMcdmModal, setActiveMcdmModal] = (0, import_react.useState)(null);
	const [activeRoutingModal, setActiveRoutingModal] = (0, import_react.useState)(null);
	const categories = Array.from(new Set(complaints.map((c) => c.category)));
	const filtered = complaints.filter((c) => {
		if (filterCategory !== "all" && c.category !== filterCategory) return false;
		if (filterStatus !== "all" && c.status !== filterStatus) return false;
		if (filterDept !== "all" && c.department !== filterDept) return false;
		return true;
	});
	const unassignedCount = complaints.filter((c) => !c.assignedStaffId || c.assignmentStatus === "Unassigned").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Complaint Analysis & MCDM Routing Center",
			description: "Review incoming campus issues, inspect rule-based department routing, evaluate MCDM staff candidates, and override staff assignments."
		}),
		unassignedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between text-amber-600",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						unassignedCount,
						" Unassigned Complaint",
						unassignedCount > 1 ? "s" : ""
					] }), " currently awaiting manual staff allocation (all department staff either offline, on leave, or at maximum capacity)."]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilterStatus("Submitted"),
				className: "rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-500/30",
				children: "Filter Unassigned"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "filter-category",
					className: "mr-2 text-sm font-semibold text-foreground",
					children: "Category:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "filter-category",
					value: filterCategory,
					onChange: (e) => setFilterCategory(e.target.value),
					className: "rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All Categories"
					}), categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: cat,
						children: cat
					}, cat))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "filter-dept",
					className: "mr-2 text-sm font-semibold text-foreground",
					children: "Department:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "filter-dept",
					value: filterDept,
					onChange: (e) => setFilterDept(e.target.value),
					className: "rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All Departments"
					}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: d.name,
						children: d.name
					}, d.id))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "filter-status",
					className: "mr-2 text-sm font-semibold text-foreground",
					children: "Status:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "filter-status",
					value: filterStatus,
					onChange: (e) => setFilterStatus(e.target.value),
					className: "rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
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
							value: "Duplicate",
							children: "Duplicate"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto text-sm text-muted-foreground",
					children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: filtered.length
						}),
						" of ",
						complaints.length,
						" complaints"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "All Campus Complaints & MCDM Allocations",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-xs font-semibold uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "ID & Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Category & Department"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Routing Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "SLA Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "MCDM Staff Assignment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filtered.map((c) => {
							calculateSlaInfo(c.submittedAt, c.slaHours);
							const assignedMember = staff.find((s) => s.id === c.assignedStaffId);
							const isUnassigned = !c.assignedStaffId || c.assignmentStatus === "Unassigned";
							const mcdmScore = c.assignment?.mcdmScore ?? c.assignmentInfo?.mcdmScore;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/complaint/$id",
											params: { id: c.id },
											className: "font-mono font-semibold text-primary hover:underline",
											children: c.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: new Date(c.submittedAt).toLocaleDateString()
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium text-foreground",
												children: c.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-1 mt-0.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													"aria-label": `Department for ${c.id}`,
													value: c.department,
													onChange: (e) => {
														const newDept = e.target.value;
														rerouteDepartment(c.id, newDept, "Admin Portal", `Manual reroute to ${newDept}`);
														toast.success(`Rerouted ${c.id} to ${newDept}`);
													},
													className: "rounded border border-input bg-background px-1.5 py-0.5 text-xs font-semibold text-primary",
													children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: d.name,
														children: d.name
													}, d.id))
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: c.location
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
											label: c.priority.label,
											score: c.priority.overall
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveRoutingModal(c),
											className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted/60 px-2 py-1 rounded border border-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3 text-primary" }), " Routing Reason"]
										})
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
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [isUnassigned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex items-center gap-1 text-xs text-rose-600 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), " Unassigned"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-foreground",
													children: assignedMember?.name || c.assignment?.staffName
												}), mcdmScore !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => setActiveMcdmModal(c),
													className: "text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 hover:bg-emerald-500/20",
													children: [
														"MCDM: ",
														mcdmScore?.toFixed(1),
														"/10"
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": `Assign staff for ${c.id}`,
												value: c.assignedStaffId || "",
												onChange: (e) => {
													const newStaffId = e.target.value;
													if (newStaffId) {
														reassignStaff(c.id, newStaffId, "Admin Complaints Portal", "Manual Admin Assignment");
														const sObj = staff.find((s) => s.id === newStaffId);
														toast.success(`Reassigned ${c.id} to ${sObj?.name}`);
													} else {
														unassignStaff(c.id, "Admin Complaints Portal", "Manual Admin Unassignment");
														toast.info(`Set ${c.id} to Unassigned`);
													}
												},
												className: "w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "-- Unassigned --"
												}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: s.id,
													children: [
														s.name,
														" (",
														s.department,
														" — ",
														s.currentStatus,
														")"
													]
												}, s.id))]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-right space-x-1",
										children: [mcdmScore !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveMcdmModal(c),
											className: "inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-3" }), " MCDM Breakdown"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/complaint/$id",
											params: { id: c.id },
											className: "inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-accent ml-1",
											children: "Details →"
										})]
									})
								]
							}, c.id);
						})
					})]
				})
			})
		}),
		activeMcdmModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-foreground",
							children: "MCDM Assignment Score Breakdown"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Complaint: ",
								activeMcdmModal.id,
								" — ",
								activeMcdmModal.category
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveMcdmModal(null),
							className: "rounded-lg p-1 text-muted-foreground hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-muted/60 p-4 border border-border space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-foreground",
								children: "Staff Member:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-primary",
								children: activeMcdmModal.assignment?.staffName || activeMcdmModal.assignmentInfo?.assignedStaffName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-foreground",
								children: "MCDM Assignment Score:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-lg font-extrabold text-emerald-600",
								children: [(activeMcdmModal.assignment?.mcdmScore ?? activeMcdmModal.assignmentInfo?.mcdmScore)?.toFixed(1), " / 10"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Criteria Factors (0-10 Scale)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2 rounded bg-background border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Expertise (E) — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Weight 35%" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-foreground",
										children: [(activeMcdmModal.assignmentFactors?.expertise ?? 8).toFixed(1), " / 10"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2 rounded bg-background border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Workload / Capacity (W) — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Weight 30%" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-foreground",
										children: [(activeMcdmModal.assignmentFactors?.workload ?? 8).toFixed(1), " / 10"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2 rounded bg-background border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Proximity (D) — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Weight 20%" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-foreground",
										children: activeMcdmModal.assignmentFactors?.proximity !== null ? `${(activeMcdmModal.assignmentFactors?.proximity ?? 7.5).toFixed(1)} / 10` : "N/A (No GPS)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2 rounded bg-background border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Response Time (T) — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Weight 15%" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-foreground",
										children: [(activeMcdmModal.assignmentFactors?.responseTime ?? 8).toFixed(1), " / 10"]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-blue-500/10 p-3 text-xs text-blue-600 border border-blue-500/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Formula:" }),
							" A",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "o" }),
							" = 0.35E + 0.30W + 0.20D + 0.15T",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Score calculated from configured assignment criteria. (Demo / Prototype Data)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveMcdmModal(null),
							className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
							children: "Close"
						})
					})
				]
			})
		}),
		activeRoutingModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-foreground",
							children: "Department Routing Reasoning"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Complaint: ", activeRoutingModal.id]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveRoutingModal(null),
							className: "rounded-lg p-1 text-muted-foreground hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-muted/60 rounded-xl border border-border space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Category:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: activeRoutingModal.category
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Routed Department:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-primary",
										children: activeRoutingModal.routing?.department || activeRoutingModal.department
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Routing Method:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: activeRoutingModal.routing?.method || "Rule-Based Category Routing"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-background rounded-xl border border-border text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground",
								children: "Routing Reason:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									"\"",
									activeRoutingModal.routing?.reason || activeRoutingModal.routingInfo?.routingReason || `Complaint category = ${activeRoutingModal.category}`,
									"\""
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveRoutingModal(null),
							className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
							children: "Close"
						})
					})
				]
			})
		})
	] });
}
//#endregion
export { AdminComplaintsPage as component };
