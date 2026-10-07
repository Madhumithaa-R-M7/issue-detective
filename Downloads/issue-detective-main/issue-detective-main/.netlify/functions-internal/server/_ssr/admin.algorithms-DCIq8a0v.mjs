import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as getEscalationLevel, p as processComplaintIntelligence, u as computeSlaAging, v as useCivic } from "./store-B0cKa5ln.mjs";
import { B as ChartNoAxesColumnIncreasing, I as Clock, K as Activity, P as Cpu, R as CircleCheck, U as BookOpen, _ as MapPin, f as ShieldCheck, m as Search, r as Wrench, t as Zap } from "../_libs/lucide-react.mjs";
import { c as Section, i as KeyValue, n as DetailRow, o as Mono, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.algorithms-DCIq8a0v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALGORITHM_EXPLANATIONS = [
	{
		name: "TF-IDF + Cosine Similarity",
		input: "Complaint text descriptions & category lexicons",
		output: "Similarity score (0.00 – 1.00)",
		purpose: "Compare textual similarity between submitted complaints and historical database items."
	},
	{
		name: "SHA-256 Hash Cryptographic Verification",
		input: "Raw image binary data byte stream",
		output: "64-character hexadecimal digest",
		purpose: "Detect 100% exact byte-for-byte duplicate image uploads instantaneously."
	},
	{
		name: "pHash (Perceptual Hashing)",
		input: "Image luminance channel reduced to 8x8 matrix",
		output: "64-bit binary fingerprint string",
		purpose: "Match visually identical or re-compressed photos despite resizing, cropping, or minor edits."
	},
	{
		name: "Hamming Distance",
		input: "Two 64-bit pHash binary fingerprint strings",
		output: "Bit difference count (0 to 64)",
		purpose: "Calculate bitwise distance between perceptual image hashes (smaller distance = higher visual similarity)."
	},
	{
		name: "CNN Feature Similarity Interface",
		input: "Normalized deep feature vectors from CNN layer",
		output: "Feature vector Cosine Similarity score (0.00 – 1.00)",
		purpose: "Evaluate semantic image content similarity beyond pixel luminance matrix matching."
	},
	{
		name: "Haversine Distance Formula",
		input: "Geographic coordinates (Lat1, Lng1) and (Lat2, Lng2)",
		output: "Great-circle distance in meters (m) or kilometers (km)",
		purpose: "Compute exact physical distance on Earth's surface considering spherical curvature."
	},
	{
		name: "DBSCAN Spatial Clustering",
		input: "Array of complaint coordinates, radius eps (80m), minPts (2)",
		output: "Cluster IDs & centroid coordinates",
		purpose: "Automatically detect high-density complaint spatial hotspots without requiring prior cluster count specs."
	},
	{
		name: "TF-IDF Lexicon Vectorization",
		input: "Unstructured text descriptions",
		output: "Term Frequency-Inverse Document Frequency weight vectors",
		purpose: "Transform text descriptions into mathematical feature vectors based on keyword rarity."
	},
	{
		name: "Weighted Civic Priority Score Matrix",
		input: "Severity (S), Urgency (U), Community (C), Location (G), Recurrence (R), SLA Aging (A)",
		output: "Overall Civic Priority Score (0.0 – 10.0)",
		purpose: "Fairly prioritize campus complaints using formula P = 0.25S + 0.20U + 0.15C + 0.15G + 0.10R + 0.15A."
	},
	{
		name: "Multi-Criteria Decision Making (MCDM)",
		input: "Expertise (E), Workload Capacity (W), Proximity (D), Response Speed (T)",
		output: "Composite Staff Assignment Score Ao (0.0 – 10.0)",
		purpose: "Rank maintenance personnel for optimal job routing using Ao = 0.35E + 0.30W + 0.20D + 0.15T."
	}
];
function AdminAlgorithmsPage() {
	const { complaints, staff } = useCivic();
	const [selectedId, setSelectedId] = (0, import_react.useState)(complaints[0]?.id || "");
	const activeComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];
	const intel = activeComplaint ? processComplaintIntelligence(activeComplaint, complaints, staff) : null;
	const slaInfo = activeComplaint ? computeSlaAging(activeComplaint.submittedAt, activeComplaint.priority?.label, activeComplaint.slaHours) : null;
	const escLevel = slaInfo ? getEscalationLevel(slaInfo.status) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "CCI-PIRA Research Dashboard & Explainable Pipeline",
			description: "End-to-end traceable algorithmic inspector for classification, image provenance, description similarity, geospatial impact, priority weighting, department routing, MCDM staff assignment, and SLA aging."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					htmlFor: "complaint-select-alg",
					className: "text-sm font-semibold text-foreground flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Target Complaint for Algorithmic Inspection:" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "complaint-select-alg",
					"aria-label": "Select Target Complaint",
					value: selectedId,
					onChange: (e) => setSelectedId(e.target.value),
					className: "rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
					children: complaints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.id,
						children: [
							c.id,
							" — ",
							c.category,
							" (",
							c.location,
							")"
						]
					}, c.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs font-mono text-muted-foreground",
				children: ["Calculated At: ", intel?.priorityUpdatedAt ? new Date(intel.priorityUpdatedAt).toLocaleTimeString() : "Just now"]
			})]
		}),
		activeComplaint && intel && slaInfo && escLevel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Inspected Complaint Context",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Complaint ID",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: activeComplaint.id })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Category",
							value: activeComplaint.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Campus Location",
							value: activeComplaint.location
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Assigned Department",
							value: activeComplaint.department
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border",
					children: [
						"\"",
						activeComplaint.description,
						"\""
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Traceable Algorithmic Pipeline Output (Sections A – I)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A. Classification Engine" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Predicted Category",
										value: intel.classificationInfo.predictedCategory
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Confidence",
										value: `${Math.round(intel.classificationInfo.predictionConfidence * 100)}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Final Category",
										value: intel.classificationInfo.finalCategory
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Method",
										value: intel.classificationInfo.classificationMethod
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Model Type",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-500 font-semibold",
											children: intel.classificationInfo.modelType
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "B. Image Verification" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "SHA-256 Hash",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, {
											className: "text-[10px]",
											children: activeComplaint.image?.sha256Hash?.slice(0, 16) || "—"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "pHash",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, {
											className: "text-[10px]",
											children: activeComplaint.image?.perceptualHash || "—"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Hamming Distance",
										value: `${activeComplaint.image?.verification.hammingDistance ?? "—"}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "CNN Feature Sim.",
										value: activeComplaint.image?.verification.visualSimilarity ? `${(activeComplaint.image.verification.visualSimilarity * 100).toFixed(1)}%` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "EXIF Available",
										value: activeComplaint.image?.exif.available ? "Yes" : "No EXIF"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Status",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground",
											children: activeComplaint.image?.verification.status || "NEW_IMAGE"
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "C. Description Similarity" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Similarity Engine",
										value: "TF-IDF + Cosine Similarity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Duplicate Score",
										value: `${(activeComplaint.duplicateAnalysis?.duplicateScore || 0).toFixed(2)}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Matched Issue",
										value: activeComplaint.duplicateAnalysis?.matchedComplaintId || "None"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Threshold (0.80)",
										value: activeComplaint.duplicateAnalysis?.isPotentialDuplicate ? "Flagged Duplicate" : "Distinct Issue"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "D. Location Analysis" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Latitude",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: activeComplaint.lat.toFixed(5) })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Longitude",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: activeComplaint.lng.toFixed(5) })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Haversine Radius",
										value: "80 meters"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Nearby Issue Count",
										value: `${intel.geospatialInfo.nearbyComplaintCount} issues`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "DBSCAN Hotspot",
										value: intel.geospatialInfo.isHotspot ? `🔥 Cluster ${intel.geospatialInfo.clusterId}` : "Isolated Zone"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "E. Recurrence Engine" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Recurrence Count",
										value: `${intel.recurrenceInfo.recurrenceCount} matches`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Recurrence Score",
										value: `${intel.recurrenceInfo.recurrenceScore} / 10`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Related Complaint IDs",
										value: intel.recurrenceInfo.relatedComplaintIds.join(", ") || "None"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Lookback Window",
										value: "30 Days"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "F. Weighted Civic Priority" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Severity S (25%)",
										value: `${intel.priorityFactors.severity}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Urgency U (20%)",
										value: `${intel.priorityFactors.urgency}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Community C (15%)",
										value: `${intel.priorityFactors.communityImpact}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Location G (15%)",
										value: `${intel.priorityFactors.locationImpact}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Recurrence R (10%)",
										value: `${intel.priorityFactors.recurrence}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "SLA Aging A (15%)",
										value: `${intel.priorityFactors.slaAging}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Priority Score P",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-primary",
											children: [intel.priority.overall, " / 10"]
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "G. Department Routing" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Final Category",
										value: activeComplaint.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Routed Department",
										value: intel.routingInfo?.department || activeComplaint.department
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Routing Method",
										value: intel.routingInfo?.routingMethod || "rule-based"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Routing Reason",
										value: intel.routingInfo?.routingReason || `Category = ${activeComplaint.category}`
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "H. MCDM Staff Assignment" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Assigned Staff",
										value: intel.assignmentInfo?.assignedStaffName || "Unassigned"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "MCDM Score (Ao)",
										value: intel.assignmentInfo?.mcdmScore ? `${intel.assignmentInfo.mcdmScore.toFixed(1)} / 10` : "N/A"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Expertise E (35%)",
										value: `${(intel.assignmentFactors?.expertise ?? 8).toFixed(1)} / 10`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Workload W (30%)",
										value: `${(intel.assignmentFactors?.workload ?? 8).toFixed(1)} / 10`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Proximity D (20%)",
										value: intel.assignmentFactors?.proximity !== null ? `${(intel.assignmentFactors?.proximity ?? 7.5).toFixed(1)} / 10` : "N/A"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Response T (15%)",
										value: `${(intel.assignmentFactors?.responseTime ?? 8).toFixed(1)} / 10`
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I. SLA & Escalation Engine" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "SLA Window",
										value: `${slaInfo.slaHours} hours`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Hours Open",
										value: `${slaInfo.hoursOpen}h`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Time Remaining",
										value: `${slaInfo.remainingHours}h`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Consumed (%)",
										value: `${slaInfo.percentageConsumed}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "SLA Status",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground",
											children: slaInfo.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
										label: "Escalation Level",
										value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-rose-600",
											children: escLevel.name
										})
									})
								]
							})]
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Explainable Algorithm Specifications (10 Platform Algorithms)",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-8",
				children: ALGORITHM_EXPLANATIONS.map((alg, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-bold text-foreground text-sm border-b border-border pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono",
							children: index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: alg.name })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-xs pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-muted-foreground",
									children: "Input:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: alg.input
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-muted-foreground",
									children: "Output:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: alg.output
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-muted-foreground",
									children: "Purpose:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: alg.purpose
								})
							] })
						]
					})]
				}, alg.name))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Research Evaluation Metrics & Future Benchmarks",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold text-foreground text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Platform Benchmark Framework" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20",
							children: "Prototype Implementation"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-muted/40 rounded-xl border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground",
									children: "Classification Accuracy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-amber-600",
									children: "Evaluation dataset not configured."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-muted/40 rounded-xl border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground",
									children: "Duplicate Detection Precision"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-amber-600",
									children: "Evaluation dataset not configured."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-muted/40 rounded-xl border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground",
									children: "Correct Routing Rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-amber-600",
									children: "Evaluation dataset not configured."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-muted/40 rounded-xl border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground",
									children: "SLA Compliance Rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-amber-600",
									children: "Evaluation dataset not configured."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-lg border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Disclaimer:" }), " Quantitative accuracy metrics (Accuracy, Precision, Recall, F1-Score) require ground-truth labelled evaluation datasets. This dashboard displays transparent prototype calculations without unverified scientific accuracy claims."]
					})
				]
			})
		})
	] });
}
//#endregion
export { AdminAlgorithmsPage as component };
