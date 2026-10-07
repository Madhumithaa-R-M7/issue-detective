import "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as Copy, H as Calendar, _ as MapPin, n as X, s as TriangleAlert, z as Check } from "../_libs/lucide-react.mjs";
import { o as Mono } from "./ui-bits-D7lvT2PQ.mjs";
import { r as VerificationBadge } from "./badges-8Fc3983k.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
/**
* 10. DUPLICATE COMPARISON MODAL
* Side-by-side comparison UI for potential duplicate complaints
*/
function DuplicateComparisonModal({ isOpen, onClose, newComplaint, matchedComplaint, analysis, onConfirmDuplicate, onMarkDistinct, readOnly = false }) {
	if (!isOpen || !newComplaint || !matchedComplaint) return null;
	const phashSim = analysis?.phashSimilarity !== void 0 ? Math.round(analysis.phashSimilarity * 100) : Math.round((analysis?.imageSimilarity || 0) * 100);
	const cnnSim = analysis?.cnnFeatureSimilarity !== void 0 ? Math.round(analysis.cnnFeatureSimilarity * 100) : Math.round((analysis?.imageSimilarity || 0) * 100);
	const locSim = analysis?.locationSimilarity !== void 0 ? Math.round(analysis.locationSimilarity * 100) : 0;
	const catSim = analysis?.categorySimilarity !== void 0 ? Math.round(analysis.categorySimilarity * 100) : 0;
	const descSim = analysis?.descriptionSimilarity !== void 0 ? Math.round(analysis.descriptionSimilarity * 100) : Math.round((analysis?.textSimilarity || 0) * 100);
	const distMeters = analysis?.locationDistance !== null && analysis?.locationDistance !== void 0 ? `${analysis.locationDistance} m` : "N/A";
	const duplicateScore = analysis?.duplicateScore !== void 0 ? Math.round(analysis.duplicateScore * 100) : 0;
	const isDuplicate = duplicateScore >= 80;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-amber-500/10 p-2.5 text-amber-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-foreground",
							children: "5-Factor Duplicate Analysis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "pHash + CNN Features + Haversine Location + Category Match + TF-IDF Description"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-6 bg-muted/60 p-4 rounded-xl border border-border text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-background rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: "pHash Sim"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold text-foreground",
								children: [phashSim, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-background rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: "CNN Features"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold text-foreground",
								children: [cnnSim, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-background rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: [
									"Haversine (",
									distMeters,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold text-foreground",
								children: [locSim, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-background rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: "Category Match"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold text-foreground",
								children: [catSim, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-background rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: "TF-IDF Desc"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold text-foreground",
								children: [descSim, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-2 rounded-lg border ${isDuplicate ? "bg-rose-500/10 border-rose-500/30" : "bg-emerald-500/10 border-emerald-500/30"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: "Overall Score"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-base font-extrabold ${isDuplicate ? "text-rose-500" : "text-emerald-500"}`,
								children: [duplicateScore, "%"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-background p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold uppercase tracking-wider text-primary",
								children: "New Complaint"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, {
								className: "text-xs font-bold text-foreground",
								children: newComplaint.id || "Draft"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: newComplaint.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }),
										" ",
										newComplaint.location
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-primary" }),
										" ",
										newComplaint.submittedAt ? new Date(newComplaint.submittedAt).toLocaleString() : "Just now"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border min-h-[60px]",
									children: [
										"\"",
										newComplaint.description,
										"\""
									]
								}),
								newComplaint.image?.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: newComplaint.image.imageUrl,
										alt: "New submission evidence",
										className: "h-44 w-full rounded-lg object-cover border border-border"
									}), newComplaint.image.verification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: newComplaint.image.verification.status })]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-44 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground",
									children: "No image attached"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-background p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold uppercase tracking-wider text-amber-500",
								children: "Possible Match"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, {
								className: "text-xs font-bold text-foreground",
								children: matchedComplaint.id
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: matchedComplaint.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-amber-500" }),
										" ",
										matchedComplaint.location
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-amber-500" }),
										" ",
										new Date(matchedComplaint.submittedAt).toLocaleString()
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border min-h-[60px]",
									children: [
										"\"",
										matchedComplaint.description,
										"\""
									]
								}),
								matchedComplaint.image?.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: matchedComplaint.image.imageUrl,
										alt: "Matching complaint evidence",
										className: "h-44 w-full rounded-lg object-cover border border-border"
									}), matchedComplaint.image.verification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: matchedComplaint.image.verification.status })]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-44 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground",
									children: "No image attached on archived complaint"
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl p-3 text-xs flex items-start gap-2 border ${isDuplicate ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "bg-blue-500/10 border-blue-500/30 text-blue-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Algorithm Decision Rule (Threshold 0.80):" }),
						" ",
						isDuplicate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Overall Score ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [duplicateScore, "% ≥ 80%"] }),
							" → Flagged as potential duplicate of existing record ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: matchedComplaint.id }),
							". Confirming will show existing record and mark state as ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "IN_PROGRESS" }),
							"."
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Overall Score ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [duplicateScore, "% < 80%"] }),
							" → Below duplicate threshold. Verified as distinct submission; proceed to create new report."
						] })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-end gap-3 border-t border-border pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted",
							children: "Close"
						}),
						!readOnly && onMarkDistinct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onMarkDistinct,
							className: "inline-flex items-center gap-1.5 rounded-xl border border-input bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Keep as Distinct Complaint"]
						}),
						!readOnly && onConfirmDuplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onConfirmDuplicate,
							className: "inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " Confirm as Duplicate"]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { DuplicateComparisonModal as t };
