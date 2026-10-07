import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as FingerprintPattern, P as Cpu, V as ChartColumn, _ as MapPin, f as ShieldCheck, h as ScanSearch, i as Users, r as Wrench } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DVoPMpJx.js
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	{
		role: "student",
		title: "Student",
		desc: "Report an issue with a photo, track status and give feedback.",
		to: "/report",
		icon: Users
	},
	{
		role: "admin",
		title: "Administrator",
		desc: "Review verified images, duplicates, hotspots and assign departments.",
		to: "/admin",
		icon: ShieldCheck
	},
	{
		role: "staff",
		title: "Maintenance Staff",
		desc: "See assigned jobs, update progress and submit resolution proof.",
		to: "/staff",
		icon: Wrench
	}
];
var PIPELINE = [
	{
		icon: FingerprintPattern,
		title: "SHA-256 fingerprint",
		body: "Every uploaded photo is hashed. An identical hash means the exact same file was already submitted."
	},
	{
		icon: ScanSearch,
		title: "Perceptual hash + Hamming",
		body: "An 8x8 average hash compares how the photo looks, so re-shot or resized copies are still caught."
	},
	{
		icon: MapPin,
		title: "Location match",
		body: "Haversine distance between the two reports decides whether they describe the same spot on campus."
	},
	{
		icon: ChartColumn,
		title: "Priority score",
		body: "Severity, urgency, community impact, location, recurrence and SLA ageing produce a 0-10 score."
	},
	{
		icon: Users,
		title: "Staff assignment",
		body: "Expertise, availability, proximity, response time and workload rank the best person for the job."
	},
	{
		icon: Cpu,
		title: "Hotspot clustering",
		body: "DBSCAN groups nearby complaints to reveal repeat-problem zones across the campus map."
	}
];
function Landing() {
	const { setRole } = useCivic();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "brand-gradient text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), " Image-verified civic reporting"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 max-w-3xl font-display text-4xl leading-tight font-bold sm:text-5xl",
							children: "CivicConnect — campus issues reported once, verified properly, fixed faster."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-base text-primary-foreground/85",
							children: "Students report problems with a photo. The platform checks the image for duplicates, confirms the location, scores how urgent it is and routes it to the right department and staff member — all before an administrator opens it."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/report",
								onClick: () => setRole("student"),
								className: "rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-float)]",
								children: "Report an issue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								onClick: () => setRole("admin"),
								className: "rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold",
								children: "Open admin dashboard"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-14 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Choose how you want to sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "This prototype runs entirely in your browser — pick a role to explore that experience."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-4 sm:grid-cols-3",
						children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setRole(r.role);
								navigate({ to: r.to });
							},
							className: "card-surface p-5 text-left transition-shadow hover:shadow-[var(--shadow-float)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "brand-gradient inline-grid size-11 place-items-center rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, { className: "size-5 text-primary-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-display text-lg font-semibold",
									children: r.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: r.desc
								})
							]
						}, r.role))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-secondary/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-14 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold",
							children: "What happens behind the screen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl text-sm text-muted-foreground",
							children: "Six checks run on every submission. Each one is visible in the app, so you can show the working, not just the result."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: PIPELINE.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-surface p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "size-5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 font-display text-base font-semibold",
										children: p.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: p.body
									})
								]
							}, p.title))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-8 text-center text-xs text-muted-foreground",
				children: "CivicConnect · Smart Campus Civic Issue Reporting & Image Verification Platform"
			})
		]
	});
}
//#endregion
export { Landing as component };
