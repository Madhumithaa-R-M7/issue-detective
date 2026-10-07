import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Clock, _ as MapPin } from "../_libs/lucide-react.mjs";
import { n as StatusBadge, r as VerificationBadge, t as PriorityBadge } from "./badges-8Fc3983k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ComplaintRow-DfbxR-Ff.js
var import_jsx_runtime = require_jsx_runtime();
function formatDate(iso) {
	return new Date(iso).toLocaleString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function ComplaintRow({ complaint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/complaint/$id",
		params: { id: complaint.id },
		className: "card-surface block p-4 transition-shadow hover:shadow-[var(--shadow-float)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs font-semibold text-primary",
						children: complaint.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: complaint.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
						label: complaint.priority.label,
						score: complaint.priority.overall
					}),
					complaint.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: complaint.image.verification.status })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 text-sm",
				children: complaint.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
							" ",
							complaint.location,
							" · ",
							complaint.detailedLocation
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
							" ",
							formatDate(complaint.submittedAt)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						complaint.department,
						" / ",
						complaint.subDepartment
					] })
				]
			})
		]
	});
}
//#endregion
export { formatDate as n, ComplaintRow as t };
