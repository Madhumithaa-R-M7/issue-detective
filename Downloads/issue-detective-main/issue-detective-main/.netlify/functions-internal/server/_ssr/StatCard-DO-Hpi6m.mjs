import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as cn } from "./ui-bits-D7lvT2PQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatCard-DO-Hpi6m.js
var import_jsx_runtime = require_jsx_runtime();
var TONES = {
	default: "bg-info-soft text-primary",
	success: "bg-success-soft text-success",
	warning: "bg-warning-soft text-warning-foreground",
	critical: "bg-critical-soft text-critical"
};
function StatCard({ label, value, icon: Icon, tone = "default", hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "card-surface p-4 transition-shadow hover:shadow-[var(--shadow-float)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl font-semibold",
					children: value
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-xl p-2.5", TONES[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			})]
		})
	});
}
//#endregion
export { StatCard as t };
