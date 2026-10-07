import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Copy, M as Eye, n as X, z as Check } from "../_libs/lucide-react.mjs";
import { c as Section, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { n as StatusBadge } from "./badges-8Fc3983k.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { r as analyzeDuplicates, t as DUPLICATE_THRESHOLD } from "./duplicateEngine-pj392S2i.mjs";
import { t as DuplicateComparisonModal } from "./DuplicateComparisonModal-B0ZNt-w8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.duplicates-nJMKVr7B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDuplicatesPage() {
	const { complaints, updateComplaint } = useCivic();
	const [modalPair, setModalPair] = (0, import_react.useState)(null);
	const duplicatePairs = [];
	for (let i = 0; i < complaints.length; i++) for (let j = i + 1; j < complaints.length; j++) {
		const c1 = complaints[i];
		const c2 = complaints[j];
		const analysis = analyzeDuplicates(c2, [c1]);
		const dScore = Math.round(analysis.duplicateScore * 100);
		if (dScore >= 40 || c1.status === "Duplicate" || c2.status === "Duplicate" || c1.image?.verification?.status === "exact_duplicate" || c2.image?.verification?.status === "exact_duplicate") duplicatePairs.push({
			source: c1,
			target: c2,
			phashSim: Math.round((analysis.phashSimilarity || 0) * 100),
			cnnSim: Math.round((analysis.cnnFeatureSimilarity || 0) * 100),
			textSim: Math.round((analysis.descriptionSimilarity || analysis.textSimilarity || 0) * 100),
			imgSim: Math.round((analysis.imageSimilarity || 0) * 100),
			locSim: Math.round((analysis.locationSimilarity || 0) * 100),
			catSim: Math.round((analysis.categorySimilarity || 0) * 100),
			distMeters: analysis.locationDistance || 0,
			dScore,
			analysis
		});
	}
	duplicatePairs.sort((a, b) => b.dScore - a.dScore);
	function handleConfirmDuplicate(targetId, sourceId) {
		updateComplaint(targetId, {
			status: "Duplicate",
			verificationReview: {
				reviewed: true,
				reviewedBy: "Admin",
				reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
				decision: "confirm_duplicate",
				remarks: `Confirmed as duplicate of ${sourceId}`
			}
		});
		toast.success(`Marked ${targetId} as Duplicate of ${sourceId}`);
	}
	function handleMarkDistinct(targetId) {
		updateComplaint(targetId, {
			status: "Under Analysis",
			verificationReview: {
				reviewed: true,
				reviewedBy: "Admin",
				reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
				decision: "mark_distinct",
				remarks: "Marked as distinct complaint after admin review"
			}
		});
		toast.info(`Marked ${targetId} as distinct complaint`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Duplicate Review Center",
			description: "Side-by-side comparative inspection of candidate duplicate complaints matching on text cosine similarity, perceptual image hashing, and campus GPS proximity."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border border-border bg-card p-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold text-foreground",
				children: "5-Factor Duplicate Algorithm Threshold:"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-sm font-bold text-primary",
				children: [(DUPLICATE_THRESHOLD * 100).toFixed(0), "% (pHash + CNN + Haversine + Category + TF-IDF)"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Candidate Duplicate Pairs",
			children: duplicatePairs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card p-8 text-center text-muted-foreground",
				children: "No duplicate complaints detected in the system."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: duplicatePairs.map(({ source, target, textSim, imgSim, locSim, distMeters, dScore }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 bg-muted/50 p-3 rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-5 text-amber-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Duplicate Match Score:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-base font-bold ${dScore >= 80 ? "text-rose-500" : "text-amber-500"}`,
										children: [dScore, "%"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 text-xs font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Text Sim: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [textSim, "%"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Image Sim: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [imgSim, "%"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Proximity: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										locSim,
										"% (",
										distMeters,
										"m)"
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setModalPair({
											source,
											target,
											analysis: {
												textSimilarity: textSim / 100,
												imageSimilarity: imgSim / 100,
												locationDistance: distMeters,
												duplicateScore: dScore / 100
											}
										}),
										className: "inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 ml-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Compare Modal"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-4 space-y-3 bg-background",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/complaint/$id",
											params: { id: source.id },
											className: "font-mono font-bold text-primary hover:underline",
											children: [source.id, " (Existing)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: source.status })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold",
										children: [
											source.category,
											" — ",
											source.location
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground bg-muted/40 p-2.5 rounded border border-border",
										children: [
											"\"",
											source.description,
											"\""
										]
									}),
									source.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: source.image.imageUrl,
										alt: "",
										className: "h-28 w-full rounded object-cover border border-border"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-4 space-y-3 bg-background",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/complaint/$id",
											params: { id: target.id },
											className: "font-mono font-bold text-primary hover:underline",
											children: [target.id, " (Candidate)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: target.status })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold",
										children: [
											target.category,
											" — ",
											target.location
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground bg-muted/40 p-2.5 rounded border border-border",
										children: [
											"\"",
											target.description,
											"\""
										]
									}),
									target.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: target.image.imageUrl,
										alt: "",
										className: "h-28 w-full rounded object-cover border border-border"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleConfirmDuplicate(target.id, source.id),
								className: "inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " Confirm as Duplicate"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleMarkDistinct(target.id),
								className: "inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Mark as Distinct"]
							})]
						})
					]
				}, `${source.id}-${target.id}`))
			})
		}),
		modalPair && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DuplicateComparisonModal, {
			isOpen: Boolean(modalPair),
			onClose: () => setModalPair(null),
			newComplaint: modalPair.target,
			matchedComplaint: modalPair.source,
			analysis: modalPair.analysis,
			onConfirmDuplicate: () => {
				handleConfirmDuplicate(modalPair.target.id, modalPair.source.id);
				setModalPair(null);
			},
			onMarkDistinct: () => {
				handleMarkDistinct(modalPair.target.id);
				setModalPair(null);
			}
		})
	] });
}
//#endregion
export { AdminDuplicatesPage as component };
