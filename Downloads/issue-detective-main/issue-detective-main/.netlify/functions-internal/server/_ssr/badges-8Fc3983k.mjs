import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as cn } from "./ui-bits-D7lvT2PQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-8Fc3983k.js
var import_jsx_runtime = require_jsx_runtime();
var base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";
var STATUS_STYLES = {
	Submitted: "bg-info-soft text-primary",
	"Under Analysis": "bg-info-soft text-primary",
	Assigned: "bg-accent text-accent-foreground",
	"In Progress": "bg-warning-soft text-warning-foreground",
	Resolved: "bg-success-soft text-success",
	Closed: "bg-muted text-muted-foreground",
	Duplicate: "bg-critical-soft text-critical"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(base, STATUS_STYLES[status]),
		children: status
	});
}
var PRIORITY_STYLES = {
	Low: "bg-muted text-muted-foreground",
	Medium: "bg-info-soft text-primary",
	High: "bg-warning-soft text-warning-foreground",
	Critical: "bg-critical-soft text-critical"
};
function PriorityBadge({ label, score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn(base, PRIORITY_STYLES[label]),
		children: [label, score !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "opacity-70",
			children: score.toFixed(1)
		})]
	});
}
var VERIFICATION_LABEL = {
	new: "New Image",
	NEW_IMAGE: "New Image",
	potential_duplicate: "Potential Duplicate",
	POTENTIAL_DUPLICATE: "Potential Duplicate",
	exact_duplicate: "Exact Duplicate",
	EXACT_DUPLICATE: "Exact Duplicate",
	insufficient_evidence: "Insufficient Evidence",
	INSUFFICIENT_EVIDENCE: "Insufficient Evidence",
	POTENTIALLY_MANIPULATED: "Potentially Manipulated"
};
var VERIFICATION_STYLES = {
	new: "bg-success-soft text-success",
	NEW_IMAGE: "bg-success-soft text-success",
	potential_duplicate: "bg-warning-soft text-warning-foreground",
	POTENTIAL_DUPLICATE: "bg-warning-soft text-warning-foreground",
	exact_duplicate: "bg-critical-soft text-critical",
	EXACT_DUPLICATE: "bg-critical-soft text-critical",
	insufficient_evidence: "bg-muted text-muted-foreground",
	INSUFFICIENT_EVIDENCE: "bg-muted text-muted-foreground",
	POTENTIALLY_MANIPULATED: "bg-amber-500/15 text-amber-600 border border-amber-500/30"
};
function VerificationBadge({ status }) {
	const label = VERIFICATION_LABEL[status] || status || "Unknown";
	const style = VERIFICATION_STYLES[status] || "bg-muted text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(base, style),
		children: label
	});
}
//#endregion
export { StatusBadge as n, VerificationBadge as r, PriorityBadge as t };
