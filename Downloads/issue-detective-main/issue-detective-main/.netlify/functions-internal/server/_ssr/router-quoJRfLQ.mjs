import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { i as DEPARTMENTS, r as CivicProvider, v as useCivic } from "./store-B0cKa5ln.mjs";
import { b as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Funnel, I as Clock, _ as MapPin, a as UserCheck, i as Users, m as Search, r as Wrench, s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { c as Section, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { t as StatCard } from "./StatCard-DO-Hpi6m.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-quoJRfLQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-xcIRT_-_.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CivicProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$13 = () => import("./routes-DVoPMpJx.mjs");
var Route$14 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "CivicConnect — Smart Campus Complaint & Image Verification" },
		{
			name: "description",
			content: "Report campus issues with photo evidence. CivicConnect verifies images with SHA-256 and perceptual hashing, detects duplicates, scores priority and routes work to the right staff."
		},
		{
			property: "og:title",
			content: "CivicConnect — Smart Campus Complaint Platform"
		},
		{
			property: "og:description",
			content: "Photo-verified campus complaints with duplicate detection, priority scoring and automatic staff assignment."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./my-complaints-CGV7KtUw.mjs");
var Route$13 = createFileRoute("/my-complaints")({
	head: () => ({ meta: [
		{ title: "My Complaints — CivicConnect" },
		{
			name: "description",
			content: "Track every campus issue you reported, its verification result and current status."
		},
		{
			property: "og:title",
			content: "My Complaints — CivicConnect"
		},
		{
			property: "og:description",
			content: "Track your reported campus issues and their verification results."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./notifications-DER1igEc.mjs");
var Route$12 = createFileRoute("/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — CivicConnect" },
		{
			name: "description",
			content: "Status updates, duplicate alerts and resolution notices for your campus reports."
		},
		{
			property: "og:title",
			content: "Notifications — CivicConnect"
		},
		{
			property: "og:description",
			content: "Status updates and duplicate alerts for your campus reports."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./report-XTR_A8K4.mjs");
var Route$11 = createFileRoute("/report")({
	head: () => ({ meta: [
		{ title: "Report an Issue — CivicConnect" },
		{
			name: "description",
			content: "Report a campus issue with photo evidence. The image is verified for authenticity and provenance, location match, and duplicate detection before submission."
		},
		{
			property: "og:title",
			content: "Report an Issue — CivicConnect"
		},
		{
			property: "og:description",
			content: "Submit a verified campus complaint with automatic duplicate detection."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./staff-_1QfdWXR.mjs");
var Route$10 = createFileRoute("/staff")({
	head: () => ({ meta: [
		{ title: "Assigned Jobs — CivicConnect Staff" },
		{
			name: "description",
			content: "Maintenance staff view: assigned campus jobs, priority order, MCDM dispatch metrics, and resolution updates."
		},
		{
			property: "og:title",
			content: "Assigned Jobs — CivicConnect Staff"
		},
		{
			property: "og:description",
			content: "Assigned campus jobs in priority order with resolution updates."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.index-LxSMBMRE.mjs");
var Route$9 = createFileRoute("/admin/")({
	head: () => ({ meta: [
		{ title: "Admin Dashboard — CivicConnect" },
		{
			name: "description",
			content: "Campus-wide complaint overview: priority levels, DBSCAN spatial hotspots, verified images, duplicates detected, and SLA aging."
		},
		{
			property: "og:title",
			content: "Admin Dashboard — CivicConnect"
		},
		{
			property: "og:description",
			content: "Campus complaint overview with verification, duplicates, SLA and spatial hotspot tracking."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.algorithms-DCIq8a0v.mjs");
var Route$8 = createFileRoute("/admin/algorithms")({
	head: () => ({ meta: [{ title: "CCI-PIRA Research Dashboard — CivicConnect" }, {
		name: "description",
		content: "Transparent mathematical breakdown and explainable pipeline inspector for CivicConnect algorithms: classification, verification, NLP urgency, severity, Haversine geospatial impact, DBSCAN spatial clustering, SLA aging, Weighted Civic Priority, and MCDM staff assignment."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.analytics-IvrOFHTc.mjs");
var Route$7 = createFileRoute("/admin/analytics")({
	head: () => ({ meta: [{ title: "Campus Analytics — CivicConnect" }, {
		name: "description",
		content: "Campus complaint analytics, SLA performance metrics, category breakdowns, resolution statistics, image verification metrics, and trends."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.complaints-CmEggXE3.mjs");
var Route$6 = createFileRoute("/admin/complaints")({
	head: () => ({ meta: [{ title: "Complaint Management & Routing — CivicConnect" }, {
		name: "description",
		content: "Analyze complaints, review MCDM staff recommendations, re-assign department staff, and monitor SLAs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.duplicates-nJMKVr7B.mjs");
var Route$5 = createFileRoute("/admin/duplicates")({
	head: () => ({ meta: [{ title: "Duplicate Review Center — CivicConnect" }, {
		name: "description",
		content: "Review potential duplicate complaints, inspect text cosine similarity, perceptual image similarity, and location proximity."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.map-DXjNlEfm.mjs");
var Route$4 = createFileRoute("/admin/map")({
	head: () => ({ meta: [{ title: "Campus Map & Hotspots — CivicConnect" }, {
		name: "description",
		content: "Interactive campus spatial view displaying complaint locations and DBSCAN density-based issue clusters."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.sla-DjeVo3cc.mjs");
var Route$3 = createFileRoute("/admin/sla")({
	head: () => ({ meta: [{ title: "SLA Monitoring & Breach Center — CivicConnect" }, {
		name: "description",
		content: "Monitor SLA countdowns, breach detections, escalation levels, and active resolution windows across campus departments."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$2 = createFileRoute("/admin/staff")({
	head: () => ({ meta: [{ title: "Staff Management — CivicConnect" }, {
		name: "description",
		content: "Campus maintenance staff roster, availability status, workload ratios, and MCDM capacity management."
	}] }),
	component: AdminStaffManagement
});
function AdminStaffManagement() {
	const { staff, updateStaffStatus, complaints } = useCivic();
	const [search, setSearch] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("ALL");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [expertiseFilter, setExpertiseFilter] = (0, import_react.useState)("ALL");
	const totalStaff = staff.length;
	const availableCount = staff.filter((s) => s.currentStatus === "Available").length;
	const busyCount = staff.filter((s) => s.currentStatus === "Busy").length;
	const offlineCount = staff.filter((s) => s.currentStatus === "Offline" || s.currentStatus === "On Leave").length;
	const avgResponse = Math.round(staff.reduce((acc, s) => acc + (s.avgResponseMinutes || 0), 0) / Math.max(1, totalStaff));
	const allExpertiseOptions = Array.from(new Set(staff.flatMap((s) => Array.isArray(s.expertise) ? s.expertise : [s.expertise]))).filter(Boolean);
	const overCapacityCount = staff.filter((s) => {
		return complaints.filter((c) => c.assignedStaffId === s.id && c.status !== "Resolved" && c.status !== "Closed").length > s.maxWorkload;
	}).length;
	const filteredStaff = staff.filter((s) => {
		const matchQuery = s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase()) || s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));
		const matchDept = deptFilter === "ALL" || s.department === deptFilter;
		const matchStatus = statusFilter === "ALL" || s.currentStatus === statusFilter;
		const matchExp = expertiseFilter === "ALL" || (Array.isArray(s.expertise) ? s.expertise.includes(expertiseFilter) : s.expertise === expertiseFilter);
		return matchQuery && matchDept && matchStatus && matchExp;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Staff Management & Capacity Center",
			description: "Monitor maintenance personnel, dynamic workload ratios, response speeds, and update availability status for MCDM assignment."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-600 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Notice:" }),
				" Staff profiles, coordinates, and response metrics displayed below are configured ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Demo / Prototype Data" }),
				" used for MCDM assignment testing."
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Staff Members",
					value: totalStaff,
					icon: Users
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Available On Duty",
					value: availableCount,
					icon: UserCheck,
					tone: "success",
					hint: `${busyCount} currently busy, ${offlineCount} offline`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Avg Response Speed",
					value: `${avgResponse} min`,
					icon: Clock,
					hint: "Mean dispatch-to-onsite time"
				}),
				overCapacityCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Over Capacity Staff",
					value: overCapacityCount,
					icon: TriangleAlert,
					tone: "critical",
					hint: "Active jobs exceed max workload"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Over Capacity Staff",
					value: overCapacityCount,
					icon: TriangleAlert,
					hint: "Active jobs exceed max workload"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Staff Roster & MCDM Allocation",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search staff name, skills, or department...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full pl-9 pr-4 py-2 text-sm bg-background rounded-lg border border-input focus:outline-none focus:ring-1 focus:ring-primary"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: deptFilter,
							onChange: (e) => setDeptFilter(e.target.value),
							className: "text-xs bg-background border border-input rounded-lg px-2.5 py-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Departments"
							}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.name,
								children: d.name
							}, d.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: statusFilter,
							onChange: (e) => setStatusFilter(e.target.value),
							className: "text-xs bg-background border border-input rounded-lg px-2.5 py-2 font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ALL",
									children: "All Statuses"
								}),
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: expertiseFilter,
							onChange: (e) => setExpertiseFilter(e.target.value),
							className: "text-xs bg-background border border-input rounded-lg px-2.5 py-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Expertise"
							}), allExpertiseOptions.map((exp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: exp,
								children: exp
							}, exp))]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: filteredStaff.map((member) => {
					const activeJobs = complaints.filter((c) => c.assignedStaffId === member.id && c.status !== "Resolved" && c.status !== "Closed").length;
					const maxCap = member.maxWorkload || 5;
					const loadRatio = Math.round(activeJobs / maxCap * 100);
					let loadBadgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
					let loadLabel = "0–30% Low Load";
					let barColor = "bg-emerald-500";
					if (loadRatio > 100) {
						loadBadgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";
						loadLabel = ">100% Over Capacity";
						barColor = "bg-rose-500";
					} else if (loadRatio > 70) {
						loadBadgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
						loadLabel = "71–100% High Load";
						barColor = "bg-amber-500";
					} else if (loadRatio > 30) {
						loadBadgeColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
						loadLabel = "31–70% Moderate Load";
						barColor = "bg-blue-500";
					}
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20",
										children: member.name.split(" ").map((n) => n[0]).join("")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-base text-foreground",
											children: member.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground font-mono",
											children: [
												"(",
												member.id,
												")"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: member.department
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: member.currentStatus,
									onChange: (e) => updateStaffStatus(member.id, e.target.value),
									className: "text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer bg-background",
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
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: member.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-3 text-muted-foreground" }), skill]
								}, skill))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-medium",
										children: "Workload Ratio (W Factor)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `px-2 py-0.5 rounded-full border text-[10px] font-bold ${loadBadgeColor}`,
										children: [
											activeJobs,
											" / ",
											maxCap,
											" Jobs (",
											loadRatio,
											"%) — ",
											loadLabel
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full ${barColor} transition-all duration-300`,
										style: { width: `${Math.min(100, loadRatio)}%` }
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 pt-2 border-t border-border text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-muted/40 p-2 rounded-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium",
											children: "Avg Speed"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-bold text-foreground",
											children: [member.avgResponseMinutes, " min"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-muted/40 p-2 rounded-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium",
											children: "Resolved"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-bold text-emerald-600",
											children: [member.resolvedCount, " jobs"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-muted/40 p-2 rounded-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium",
											children: "Rating"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-bold text-amber-500",
											children: [
												"★ ",
												member.rating.toFixed(1),
												" / 5"
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground flex items-center justify-between pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-primary" }),
										" Lat: ",
										member.latitude.toFixed(4),
										", Lng: ",
										member.longitude.toFixed(4)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-sans text-muted-foreground/80",
									children: "Highest MCDM score evaluated dynamically"
								})]
							})
						]
					}, member.id);
				})
			})]
		})
	] });
}
var $$splitComponentImporter$1 = () => import("./admin.verification-zEu_NyjO.mjs");
var Route$1 = createFileRoute("/admin/verification")({
	head: () => ({ meta: [{ title: "Image Verification Center — CivicConnect" }, {
		name: "description",
		content: "Inspect SHA-256 fingerprints, perceptual luminance hashes (pHash), EXIF camera metadata, and spatial location matches."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./complaint._id-CqQ2Ng3E.mjs");
var Route = createFileRoute("/complaint/$id")({
	head: () => ({ meta: [
		{ title: "Complaint Detail — CivicConnect" },
		{
			name: "description",
			content: "Full complaint timeline with image verification results, priority breakdown, MCDM staff assignment, and audit history."
		},
		{
			property: "og:title",
			content: "Complaint Detail — CivicConnect"
		},
		{
			property: "og:description",
			content: "Verification results, priority breakdown and MCDM staff assignment for a campus complaint."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var MyComplaintsRoute = Route$13.update({
	id: "/my-complaints",
	path: "/my-complaints",
	getParentRoute: () => Route$15
});
var NotificationsRoute = Route$12.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => Route$15
});
var ReportRoute = Route$11.update({
	id: "/report",
	path: "/report",
	getParentRoute: () => Route$15
});
var StaffRoute = Route$10.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => Route$15
});
var AdminIndexRoute = Route$9.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$15
});
var rootRouteChildren = {
	IndexRoute,
	MyComplaintsRoute,
	NotificationsRoute,
	ReportRoute,
	StaffRoute,
	AdminAlgorithmsRoute: Route$8.update({
		id: "/admin/algorithms",
		path: "/admin/algorithms",
		getParentRoute: () => Route$15
	}),
	AdminAnalyticsRoute: Route$7.update({
		id: "/admin/analytics",
		path: "/admin/analytics",
		getParentRoute: () => Route$15
	}),
	AdminComplaintsRoute: Route$6.update({
		id: "/admin/complaints",
		path: "/admin/complaints",
		getParentRoute: () => Route$15
	}),
	AdminDuplicatesRoute: Route$5.update({
		id: "/admin/duplicates",
		path: "/admin/duplicates",
		getParentRoute: () => Route$15
	}),
	AdminMapRoute: Route$4.update({
		id: "/admin/map",
		path: "/admin/map",
		getParentRoute: () => Route$15
	}),
	AdminSlaRoute: Route$3.update({
		id: "/admin/sla",
		path: "/admin/sla",
		getParentRoute: () => Route$15
	}),
	AdminStaffRoute: Route$2.update({
		id: "/admin/staff",
		path: "/admin/staff",
		getParentRoute: () => Route$15
	}),
	AdminVerificationRoute: Route$1.update({
		id: "/admin/verification",
		path: "/admin/verification",
		getParentRoute: () => Route$15
	}),
	ComplaintIdRoute: Route.update({
		id: "/complaint/$id",
		path: "/complaint/$id",
		getParentRoute: () => Route$15
	}),
	AdminIndexRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
