import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileStack, L as CirclePlus, P as Cpu, V as ChartColumn, W as Bell, b as ListChecks, f as ShieldCheck, g as Map, h as ScanSearch, i as Users, r as Wrench, v as LogOut, x as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-bits-D7lvT2PQ.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var STUDENT_NAV = [
	{
		to: "/report",
		label: "Report an Issue",
		icon: CirclePlus
	},
	{
		to: "/my-complaints",
		label: "My Complaints",
		icon: ListChecks
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	}
];
var ADMIN_NAV = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/admin/complaints",
		label: "Complaint Analysis",
		icon: FileStack
	},
	{
		to: "/admin/staff",
		label: "Staff Roster",
		icon: Users
	},
	{
		to: "/admin/verification",
		label: "Image Verification",
		icon: ScanSearch
	},
	{
		to: "/admin/duplicates",
		label: "Duplicate Review",
		icon: ShieldCheck
	},
	{
		to: "/admin/sla",
		label: "SLA Monitoring",
		icon: ChartColumn
	},
	{
		to: "/admin/map",
		label: "Campus Map",
		icon: Map
	},
	{
		to: "/admin/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/admin/algorithms",
		label: "Algorithm Panel",
		icon: Cpu
	}
];
var STAFF_NAV = [{
	to: "/staff",
	label: "My Assigned Jobs",
	icon: Wrench
}];
function AppShell({ children }) {
	const { role, setRole, notifications, studentName } = useCivic();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const unread = notifications.filter((n) => !n.read).length;
	const nav = pathname.startsWith("/admin") || role === "admin" ? ADMIN_NAV : pathname.startsWith("/staff") || role === "staff" ? STAFF_NAV : STUDENT_NAV;
	const who = role === "admin" ? {
		name: "Admin Office",
		sub: "Campus Administration"
	} : role === "staff" ? {
		name: "Ramesh Kumar",
		sub: "Maintenance / Plumbing"
	} : {
		name: studentName,
		sub: "Student — AI & DS, 2023-2027"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-gradient grid size-10 place-items-center rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-lg leading-tight font-semibold",
						children: "CivicConnect"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-sidebar-foreground/60",
						children: "Smart Campus Platform"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-1 px-3",
					children: nav.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }),
								item.label,
								item.to === "/notifications" && unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto rounded-full bg-critical px-1.5 py-0.5 text-[10px] font-bold text-critical-foreground",
									children: unread
								})
							]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-sidebar-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: who.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-sidebar-foreground/60",
							children: who.sub
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							onClick: () => setRole(null),
							className: "mt-3 inline-flex items-center gap-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Switch role"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 flex items-center gap-2 overflow-x-auto border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden",
				children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: cn("rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap", pathname === item.to ? "bg-primary text-primary-foreground" : "bg-muted"),
					children: item.label
				}, item.to))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8",
				children
			})]
		})]
	});
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold sm:text-3xl",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm text-muted-foreground",
			children: description
		})] }), actions]
	});
}
function Section({ title, subtitle, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("card-surface p-5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm text-muted-foreground",
				children: subtitle
			})]
		}), children]
	});
}
function MetricRow({ label, value, weight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground",
				children: [label, weight !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-1.5 text-xs opacity-70",
					children: ["w=", weight.toFixed(2)]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold tabular-nums",
				children: value.toFixed(1)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "brand-gradient h-full rounded-full",
				style: { width: `${Math.min(100, value * 10)}%` }
			})
		})]
	});
}
function KeyValue({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right font-medium break-all",
			children: value
		})]
	});
}
function Mono({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
		className: cn("rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-all", className),
		children
	});
}
function DetailRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between text-xs py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-muted-foreground",
			children: [label, ":"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-foreground text-right",
			children: value
		})]
	});
}
function EmptyState({ title, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-border p-10 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: title
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: hint
		})]
	});
}
//#endregion
export { MetricRow as a, Section as c, KeyValue as i, cn as l, DetailRow as n, Mono as o, EmptyState as r, PageHeader as s, AppShell as t };
