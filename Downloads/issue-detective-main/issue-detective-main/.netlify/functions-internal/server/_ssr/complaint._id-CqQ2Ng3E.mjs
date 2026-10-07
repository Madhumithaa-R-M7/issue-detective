import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as PRIORITY_WEIGHTS, v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as UserCheck, s as TriangleAlert, u as Star, w as History } from "../_libs/lucide-react.mjs";
import { a as MetricRow, c as Section, i as KeyValue, l as cn, o as Mono, r as EmptyState, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { n as StatusBadge, r as VerificationBadge, t as PriorityBadge } from "./badges-8Fc3983k.mjs";
import { t as SlaCountdown } from "./SlaCountdown-C73kmhom.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as formatDate } from "./ComplaintRow-DfbxR-Ff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaint._id-CqQ2Ng3E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIMELINE = [
	"Submitted",
	"Under Analysis",
	"Assigned",
	"In Progress",
	"Resolved",
	"Closed"
];
function ComplaintDetail() {
	const { id } = useParams({ from: "/complaint/$id" });
	const { complaints, staff, updateComplaint, reassignStaff, role } = useCivic();
	const complaint = complaints.find((c) => c.id === id);
	const [rating, setRating] = (0, import_react.useState)(0);
	const [selectedStaffId, setSelectedStaffId] = (0, import_react.useState)("");
	const [overrideReason, setOverrideReason] = (0, import_react.useState)("");
	if (!complaint) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Complaint not found",
		hint: "It may have been removed from this device."
	}) });
	const assigned = staff.find((s) => s.id === complaint.assignedStaffId);
	const activeIndex = TIMELINE.indexOf(complaint.status);
	const v = complaint.image?.verification;
	const routing = complaint.routingInfo;
	const assignment = complaint.assignmentInfo;
	const factors = complaint.assignmentFactors;
	const handleManualReassign = () => {
		if (!selectedStaffId) {
			toast.error("Please select a staff member to reassign.");
			return;
		}
		reassignStaff(complaint.id, selectedStaffId, "Admin Office", overrideReason || "Manual Admin Override");
		toast.success(`Reassigned ${complaint.id} to ${staff.find((s) => s.id === selectedStaffId)?.name}`);
		setSelectedStaffId("");
		setOverrideReason("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `${complaint.id} — ${complaint.category}`,
			description: complaint.description,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/my-complaints",
				className: "text-sm font-semibold text-primary",
				children: "← All complaints"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: complaint.status }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
					label: complaint.priority.label,
					score: complaint.priority.overall
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlaCountdown, {
					submittedAt: complaint.submittedAt,
					slaHours: complaint.slaHours,
					priorityLabel: complaint.priority.label
				}),
				complaint.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: complaint.image.verification.status }),
				complaint.override && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20",
					children: "Admin Manual Override Applied"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Progress timeline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-3",
							children: TIMELINE.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full", i <= activeIndex && activeIndex >= 0 ? "bg-primary" : "bg-muted") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-sm", i === activeIndex ? "font-semibold text-foreground" : "text-muted-foreground"),
									children: s
								})]
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Intelligent Department Routing & MCDM Staff Assignment",
						subtitle: "Rule-based taxonomy routing and Multi-Criteria Decision Making (MCDM) allocation.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-card border border-border p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs font-semibold text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ROUTING RESULT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: routing?.routingMethod || "Rule-Based Engine"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid sm:grid-cols-2 gap-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground block",
												children: "Assigned Department"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: complaint.department
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground block",
												children: "SLA Time Window"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-emerald-600",
												children: [complaint.slaHours, " Hours"]
											})] })]
										}),
										routing?.routingReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Routing Rationale:" }),
												" ",
												routing.routingReason
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-card border border-border p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "MCDM STAFF ASSIGNMENT"
											}), assignment?.mcdmScore !== null && assignment?.mcdmScore !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-xs font-bold border border-emerald-500/20",
												children: [
													"MCDM Score: ",
													assignment.mcdmScore.toFixed(1),
													" / 10"
												]
											})]
										}),
										assignment?.status === "Unassigned" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }), " Unassigned (No Eligible Staff Available)"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: assignment.unassignedReason || "All department personnel are either offline, on leave, or at maximum capacity." })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm font-semibold text-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4 text-emerald-500" }), assigned?.name || assignment?.assignedStaffName || "Assigned Staff Member"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: "Highest calculated MCDM assignment score based on configured criteria"
											}),
											factors && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 pt-3 border-t border-border space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "bg-muted/40 p-2 rounded-lg text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground font-medium",
																children: "Expertise (35%)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-xs font-bold text-foreground",
																children: [(factors.expertise ?? 8).toFixed(1), " / 10"]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "bg-muted/40 p-2 rounded-lg text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground font-medium",
																children: "Capacity (30%)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-xs font-bold text-foreground",
																children: [(factors.workload ?? 8).toFixed(1), " / 10"]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "bg-muted/40 p-2 rounded-lg text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground font-medium",
																children: "Proximity (20%)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-xs font-bold text-foreground",
																children: factors.proximity !== null ? `${(factors.proximity ?? 7.5).toFixed(1)} / 10` : "N/A"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "bg-muted/40 p-2 rounded-lg text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground font-medium",
																children: "Response (15%)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-xs font-bold text-foreground",
																children: [(factors.responseTime ?? 8).toFixed(1), " / 10"]
															})]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground italic",
													children: [
														"A",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "o" }),
														" = 0.35E + 0.30W + 0.20D + 0.15T — Score calculated from configured assignment criteria. (Demo / Prototype Data)"
													]
												})]
											})
										] }),
										(role === "admin" || !role) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-3 border-t border-border space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-foreground block",
													children: "Admin Manual Staff Override"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid sm:grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: selectedStaffId,
														onChange: (e) => setSelectedStaffId(e.target.value),
														className: "text-xs bg-background border border-input rounded-lg px-2.5 py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Select Staff to Override"
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
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Reason for manual reassignment...",
														value: overrideReason,
														onChange: (e) => setOverrideReason(e.target.value),
														className: "text-xs bg-background border border-input rounded-lg px-2.5 py-1.5"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: handleManualReassign,
													className: "mt-1 w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
													children: "Confirm Reassignment"
												})
											]
										})
									]
								}),
								(complaint.routingHistory && complaint.routingHistory.length > 0 || complaint.assignmentHistory && complaint.assignmentHistory.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-card border border-border p-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4" }), " ROUTING & ASSIGNMENT AUDIT LOG"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-xs",
										children: [complaint.routingHistory?.map((rh, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-md bg-muted/30 border border-border flex items-start justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-foreground",
												children: ["Routed to ", rh.department]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: rh.reason || rh.routingReason
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground font-mono",
												children: new Date(rh.routedAt || rh.timestamp || Date.now()).toLocaleTimeString()
											})]
										}, idx)), complaint.assignmentHistory?.map((ah, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-md bg-muted/30 border border-border space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold text-foreground",
													children: [
														"Assigned to ",
														ah.staffName || "Unassigned",
														ah.override && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20",
															children: "Manual Override"
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: new Date(ah.assignedAt || ah.timestamp || Date.now()).toLocaleTimeString()
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Assigned By: ",
													ah.assignedBy,
													" ",
													ah.reason ? `— (${ah.reason})` : ""
												]
											})]
										}, idx))]
									})]
								})
							]
						})
					}),
					complaint.image && v && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Image verification report",
						subtitle: "SHA-256, perceptual hashing, EXIF and location comparison.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 md:grid-cols-2",
							children: [complaint.image.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: complaint.image.imageUrl,
								alt: "Evidence",
								className: "w-full rounded-xl border border-border"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid aspect-video place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground",
								children: ["Archived photo — ", complaint.image.fileName]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "SHA-256",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: complaint.image.sha256Hash })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "pHash",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: complaint.image.perceptualHash })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Visual similarity",
									value: `${(v.visualSimilarity * 100).toFixed(1)}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Hamming distance",
									value: v.hammingDistance ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Location distance",
									value: v.locationDistance === null ? "—" : `${v.locationDistance} m`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Combined score",
									value: v.combinedScore ? v.combinedScore.toFixed(3) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Matched complaint",
									value: v.matchedComplaintId ?? "None"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Device",
									value: complaint.image.exif.device ?? "Not present"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
									label: "Captured",
									value: complaint.image.exif.captureDate ? `${complaint.image.exif.captureDate} ${complaint.image.exif.captureTime ?? ""}` : "Not present"
								})
							] })]
						})
					}),
					complaint.resolutionRemarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Resolution",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: complaint.resolutionRemarks
						})
					}),
					(complaint.status === "Resolved" || complaint.status === "Closed") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Your feedback",
						subtitle: "Rate how well the issue was handled.",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setRating(n),
								"aria-label": `${n} star`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-7", n <= (rating || (complaint.feedbackRating ?? 0)) ? "fill-warning text-warning" : "text-muted-foreground") })
							}, n))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								updateComplaint(complaint.id, {
									feedbackRating: rating,
									status: "Closed"
								});
								toast.success("Thanks for your feedback");
							},
							disabled: !rating,
							className: "mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40",
							children: "Submit feedback"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Priority breakdown",
					subtitle: "Weighted civic priority score out of 10.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Severity",
								value: complaint.priority.severity,
								weight: PRIORITY_WEIGHTS.severity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Urgency",
								value: complaint.priority.urgency,
								weight: PRIORITY_WEIGHTS.urgency
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Community impact",
								value: complaint.priority.community,
								weight: PRIORITY_WEIGHTS.community
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Location importance",
								value: complaint.priority.location,
								weight: PRIORITY_WEIGHTS.location
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Recurrence",
								value: complaint.priority.recurrence,
								weight: PRIORITY_WEIGHTS.recurrence
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "SLA ageing",
								value: complaint.priority.slaAging,
								weight: PRIORITY_WEIGHTS.slaAging
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: [
							"Overall ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: complaint.priority.overall.toFixed(1) }),
							" —",
							" ",
							complaint.priority.label,
							" · SLA ",
							complaint.slaHours,
							" hours"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Routing Details",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Department",
							value: complaint.department
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Sub-department",
							value: complaint.subDepartment
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Assigned staff",
							value: assigned?.name ?? "Awaiting assignment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Reported by",
							value: complaint.studentName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Reported at",
							value: formatDate(complaint.submittedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Coordinates",
							value: `${complaint.lat.toFixed(5)}, ${complaint.lng.toFixed(5)}`
						})
					]
				})]
			})]
		})
	] });
}
//#endregion
export { ComplaintDetail as component };
