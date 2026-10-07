import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { C as Image, E as Funnel, M as Eye, P as Cpu, R as CircleCheck, T as Hash, _ as MapPin, f as ShieldCheck, j as FileQuestionMark, m as Search, n as X, s as TriangleAlert, z as Check } from "../_libs/lucide-react.mjs";
import { c as Section, o as Mono, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { r as VerificationBadge, t as PriorityBadge } from "./badges-8Fc3983k.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as DuplicateComparisonModal } from "./DuplicateComparisonModal-B0ZNt-w8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.verification-zEu_NyjO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminVerificationPage() {
	const { complaints, updateComplaint } = useCivic();
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("ALL");
	const [priorityFilter, setPriorityFilter] = (0, import_react.useState)("ALL");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [inspectTarget, setInspectTarget] = (0, import_react.useState)(null);
	const totalAnalyzed = complaints.length;
	const newCount = complaints.filter((c) => c.image?.verification.status === "new" || c.image?.verification.status === "NEW_IMAGE").length;
	const potDupCount = complaints.filter((c) => c.image?.verification.status === "potential_duplicate" || c.image?.verification.status === "POTENTIAL_DUPLICATE" || c.duplicateAnalysis?.isPotentialDuplicate).length;
	const exactDupCount = complaints.filter((c) => c.image?.verification.status === "exact_duplicate" || c.image?.verification.status === "EXACT_DUPLICATE").length;
	const insufficientCount = complaints.filter((c) => !c.image || c.image?.verification.status === "insufficient_evidence" || c.image?.verification.status === "INSUFFICIENT_EVIDENCE").length;
	const manipulatedCount = complaints.filter((c) => c.image?.verification.status === "POTENTIALLY_MANIPULATED").length;
	const filteredComplaints = (0, import_react.useMemo)(() => {
		return complaints.filter((c) => {
			const vStatus = c.image?.verification.status || "INSUFFICIENT_EVIDENCE";
			if (statusFilter !== "ALL") {
				if (statusFilter === "NEW_IMAGE" && !(vStatus === "new" || vStatus === "NEW_IMAGE")) return false;
				if (statusFilter === "POTENTIAL_DUPLICATE" && !(vStatus === "potential_duplicate" || vStatus === "POTENTIAL_DUPLICATE")) return false;
				if (statusFilter === "EXACT_DUPLICATE" && !(vStatus === "exact_duplicate" || vStatus === "EXACT_DUPLICATE")) return false;
				if (statusFilter === "INSUFFICIENT_EVIDENCE" && !(vStatus === "insufficient_evidence" || vStatus === "INSUFFICIENT_EVIDENCE" || !c.image)) return false;
				if (statusFilter === "POTENTIALLY_MANIPULATED" && !(vStatus === "POTENTIALLY_MANIPULATED")) return false;
			}
			if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;
			if (priorityFilter !== "ALL" && c.priority.label !== priorityFilter) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchesId = c.id.toLowerCase().includes(q);
				const matchesDesc = c.description.toLowerCase().includes(q);
				const matchesLoc = c.location.toLowerCase().includes(q);
				const matchesSha = c.image?.sha256Hash?.toLowerCase().includes(q) ?? false;
				if (!matchesId && !matchesDesc && !matchesLoc && !matchesSha) return false;
			}
			return true;
		});
	}, [
		complaints,
		statusFilter,
		categoryFilter,
		priorityFilter,
		searchQuery
	]);
	const categories = (0, import_react.useMemo)(() => {
		return Array.from(new Set(complaints.map((c) => c.category))).sort();
	}, [complaints]);
	function handleAdminDecision(complaintId, decision) {
		const patch = { verificationReview: {
			reviewed: true,
			reviewedBy: "Admin",
			reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
			decision,
			remarks: `Admin decision: ${decision}`
		} };
		if (decision === "confirm_duplicate") {
			patch.status = "Duplicate";
			toast.success(`Complaint ${complaintId} confirmed as Duplicate.`);
		} else if (decision === "mark_distinct") {
			patch.status = "Under Analysis";
			toast.info(`Complaint ${complaintId} marked as Distinct Complaint.`);
		} else if (decision === "request_review") {
			patch.status = "Under Analysis";
			toast.warning(`Requested additional verification review for ${complaintId}.`);
		} else toast.success(`Complaint ${complaintId} kept active.`);
		updateComplaint(complaintId, patch);
	}
	const matchedTarget = inspectTarget ? complaints.find((c) => c.id === (inspectTarget.image?.verification.matchedComplaintId || inspectTarget.duplicateAnalysis?.matchedComplaintId)) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Admin Image Verification Center",
			description: "Comprehensive audit center for Image Authenticity and Provenance Verification: cryptographic SHA-256 fingerprints, 8x8 luminance pHash matrix, EXIF camera metadata, and duplicate reviews."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-7 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold text-foreground",
						children: totalAnalyzed
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Total Analyzed"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-7 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold text-foreground",
						children: newCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "New Images"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-7 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold text-foreground",
						children: potDupCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Potential Duplicates"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-7 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold text-foreground",
						children: exactDupCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Exact Duplicates"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileQuestionMark, { className: "size-7 text-slate-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold text-foreground",
						children: insufficientCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Insufficient Evidence"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-7 text-purple-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold text-foreground",
						children: manipulatedCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Potentially Manipulated"
					})] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-border bg-card p-4 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-semibold text-sm text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 text-primary" }), " Filter Verification Records"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-muted-foreground",
						children: "Verification Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: statusFilter,
						onChange: (e) => setStatusFilter(e.target.value),
						className: "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "ALL",
								children: [
									"All Statuses (",
									totalAnalyzed,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "NEW_IMAGE",
								children: [
									"New Images (",
									newCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "POTENTIAL_DUPLICATE",
								children: [
									"Potential Duplicates (",
									potDupCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "EXACT_DUPLICATE",
								children: [
									"Exact Duplicates (",
									exactDupCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "INSUFFICIENT_EVIDENCE",
								children: [
									"Insufficient Evidence (",
									insufficientCount,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "POTENTIALLY_MANIPULATED",
								children: [
									"Potentially Manipulated (",
									manipulatedCount,
									")"
								]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-muted-foreground",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: categoryFilter,
						onChange: (e) => setCategoryFilter(e.target.value),
						className: "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "All Categories"
						}), categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: cat,
							children: cat
						}, cat))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-muted-foreground",
						children: "Priority Level"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: priorityFilter,
						onChange: (e) => setPriorityFilter(e.target.value),
						className: "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground",
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
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-muted-foreground",
						children: "Search ID / SHA / Desc"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2 size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search...",
							className: "w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs font-medium text-foreground"
						})]
					})] })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: `Photo Verification Registry (${filteredComplaints.length} records matching filter)`,
			children: filteredComplaints.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground",
				children: "No image verification records matching the selected filters."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: filteredComplaints.map((c) => {
					const img = c.image;
					const v = img?.verification;
					const vStatus = v?.status || "INSUFFICIENT_EVIDENCE";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm font-bold text-primary",
									children: c.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: [
										"(",
										c.category,
										" — ",
										c.location,
										")"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
										label: c.priority.label,
										score: c.priority.overall
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: vStatus })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [img?.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img.imageUrl,
										alt: `Photo for ${c.id}`,
										className: "h-40 w-full rounded-lg object-cover border border-border bg-muted"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-40 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground",
										children: "No Image Attached"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: img?.fileName || "No File" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: img ? `${img.width}×${img.height} px` : "—" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-foreground flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "size-3.5 text-primary" }), " SHA-256 Fingerprint"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, {
											className: "block truncate text-[11px] bg-muted/60 p-1.5 rounded",
											children: img?.sha256Hash || "Not computed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-foreground flex items-center gap-1 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-3.5 text-primary" }), " Perceptual Hash (8x8 Grid)"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, {
											className: "block truncate text-[11px] bg-muted/60 p-1.5 rounded",
											children: img?.perceptualHash || "Not computed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-foreground flex items-center gap-1 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }), " EXIF Provenance"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-muted/60 p-1.5 rounded space-y-1 text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Device: ", img?.exif.device || "Metadata unavailable"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["GPS: ", img?.exif.gpsAvailable ? "Present" : "Metadata unavailable"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Software: ", img?.exif.software || "Metadata unavailable"] })
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-3 grid grid-cols-2 text-xs gap-2 bg-muted/30 p-2.5 rounded-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Visual Similarity: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: v?.visualSimilarity !== void 0 ? `${Math.round(v.visualSimilarity * 100)}%` : "0%"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Hamming Distance: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: v?.hammingDistance ?? "N/A"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Geo Distance: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: v?.locationDistance !== null && v?.locationDistance !== void 0 ? `${v.locationDistance} m` : "N/A"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Matched Target: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: v?.matchedComplaintId || c.duplicateAnalysis?.matchedComplaintId || "None"
									})] })
								]
							}),
							c.verificationReview?.reviewed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-600 border border-emerald-500/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Admin Review Record:" }),
									" ",
									c.verificationReview.remarks,
									" (",
									new Date(c.verificationReview.reviewedAt).toLocaleDateString(),
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3",
								children: [v?.matchedComplaintId || c.duplicateAnalysis?.matchedComplaintId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setInspectTarget(c),
									className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Inspect Duplicate Modal"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "No candidate duplicate pair"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleAdminDecision(c.id, "confirm_duplicate"),
										className: "inline-flex items-center gap-1 rounded bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Confirm Duplicate"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleAdminDecision(c.id, "mark_distinct"),
										className: "inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), " Mark Distinct"]
									})]
								})]
							})
						]
					}, c.id);
				})
			})
		}),
		inspectTarget && matchedTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DuplicateComparisonModal, {
			isOpen: Boolean(inspectTarget),
			onClose: () => setInspectTarget(null),
			newComplaint: inspectTarget,
			matchedComplaint: matchedTarget,
			analysis: {
				textSimilarity: inspectTarget.duplicateAnalysis?.textSimilarity || 0,
				imageSimilarity: inspectTarget.image?.verification.visualSimilarity || 0,
				locationDistance: inspectTarget.duplicateAnalysis?.locationDistance ?? inspectTarget.image?.verification.locationDistance,
				duplicateScore: inspectTarget.duplicateAnalysis?.duplicateScore || inspectTarget.image?.verification.combinedScore || 0
			},
			onConfirmDuplicate: () => {
				handleAdminDecision(inspectTarget.id, "confirm_duplicate");
				setInspectTarget(null);
			},
			onMarkDistinct: () => {
				handleAdminDecision(inspectTarget.id, "mark_distinct");
				setInspectTarget(null);
			}
		})
	] });
}
//#endregion
export { AdminVerificationPage as component };
