import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as runDbscanClustering, t as CAMPUS_LOCATIONS, v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Flame, _ as MapPin, n as X } from "../_libs/lucide-react.mjs";
import { c as Section, i as KeyValue, o as Mono, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.map-DXjNlEfm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminMapPage() {
	const { complaints } = useCivic();
	const [selectedHotspot, setSelectedHotspot] = (0, import_react.useState)(null);
	const clusters = runDbscanClustering(complaints, 80, 2);
	const hasLocationData = complaints.some((c) => c.lat && c.lng);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Campus Map & Spatial Hotspot Detection",
			description: "Spatial distribution of campus complaints with live DBSCAN density-based hotspot clustering operating on Haversine distance."
		}),
		!hasLocationData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground",
			children: "Location data unavailable."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Campus Spatial View (VIT Campus Bounds)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground font-mono",
						children: [complaints.length, " active complaint markers"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-[380px] w-full rounded-lg border border-border bg-slate-950 p-4 text-slate-100 overflow-hidden flex flex-col justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-slate-200",
									children: "Campus Center Coordinates"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-slate-400",
									children: "12.9721° N, 79.1601° E"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }),
									" ",
									clusters.length,
									" DBSCAN Hotspots Active"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-6",
							children: CAMPUS_LOCATIONS.slice(0, 9).map((loc) => {
								const locComplaints = complaints.filter((c) => c.location === loc.name);
								const matchingCluster = clusters.find((cl) => cl.locationName === loc.name);
								const isHotspot = Boolean(matchingCluster);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => matchingCluster && setSelectedHotspot(matchingCluster),
									className: `p-3 rounded-lg border text-xs text-left transition-all cursor-pointer ${isHotspot ? "bg-rose-950/50 border-rose-500/60 text-rose-200 hover:bg-rose-900/60 ring-1 ring-rose-500/30" : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loc.name }), isHotspot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5 text-rose-400 animate-pulse" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center justify-between text-[11px] text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [locComplaints.length, " issues"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono",
											children: [
												loc.lat.toFixed(3),
												", ",
												loc.lng.toFixed(3)
											]
										})]
									})]
								}, loc.name);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 text-[11px] text-slate-400 flex justify-between items-center bg-slate-900/80 p-2 rounded border border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DBSCAN parameters: eps = 80m, minPts = 2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Distance Metric: Haversine Formula" })]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "DBSCAN Hotspot Clusters",
					children: clusters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground text-center",
						children: "No spatial hotspot clusters detected."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: clusters.map((cl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setSelectedHotspot(cl),
							className: "rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2 hover:bg-rose-500/10 cursor-pointer transition-colors shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-rose-600 text-sm flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" }),
										" ",
										cl.clusterId,
										": ",
										cl.locationName
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs bg-rose-500/20 text-rose-700 px-2 py-0.5 rounded-full font-bold",
									children: [cl.nearbyComplaintCount, " Issues"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Main: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: cl.mainCategory })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Avg Priority: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [cl.avgPriority, "/10"] })] })]
							})]
						}, cl.clusterId))
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Location Complaint Registry",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-card shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-xs font-semibold uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Location Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Coordinates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Total Issues"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status Breakdown"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Hotspot Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: CAMPUS_LOCATIONS.map((loc) => {
							const locComplaints = complaints.filter((c) => c.location === loc.name);
							const matchingCluster = clusters.find((cl) => cl.locationName === loc.name);
							const isHotspot = Boolean(matchingCluster);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-foreground",
										children: loc.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 font-mono text-xs text-muted-foreground",
										children: [
											loc.lat,
											", ",
											loc.lng
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-semibold",
										children: locComplaints.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs text-muted-foreground",
										children: locComplaints.length > 0 ? locComplaints.map((c) => c.category).join(", ") : "No reported issues"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: isHotspot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setSelectedHotspot(matchingCluster),
											className: "inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3" }),
												" 🔥 Hotspot (",
												matchingCluster.nearbyComplaintCount,
												")"
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground",
											children: "Normal"
										})
									})
								]
							}, loc.name);
						})
					})]
				})
			})
		}),
		selectedHotspot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-rose-600 font-bold text-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5" }),
								" Hotspot Detail — ",
								selectedHotspot.clusterId
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedHotspot(null),
							className: "rounded p-1 text-muted-foreground hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Location Zone",
								value: selectedHotspot.locationName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Nearby Complaint Count",
								value: `${selectedHotspot.nearbyComplaintCount} complaints within 80m`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Main Category",
								value: selectedHotspot.mainCategory
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Average Priority Rating",
								value: `${selectedHotspot.avgPriority} / 10`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Centroid Coordinates",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Mono, { children: [
									selectedHotspot.centroid.lat.toFixed(4),
									", ",
									selectedHotspot.centroid.lng.toFixed(4)
								] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold mb-2",
							children: "Related Complaint IDs:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5 max-h-40 overflow-y-auto pr-1",
							children: selectedHotspot.points.map((pt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between bg-muted/40 p-2 rounded text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/complaint/$id",
										params: { id: pt.id },
										className: "font-mono font-bold text-primary hover:underline",
										children: pt.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pt.category }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [pt.priority, "/10"]
									})
								]
							}, pt.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border pt-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedHotspot(null),
							className: "rounded-xl border border-input px-4 py-2 text-xs font-semibold hover:bg-muted",
							children: "Close"
						})
					})
				]
			})
		})
	] });
}
//#endregion
export { AdminMapPage as component };
