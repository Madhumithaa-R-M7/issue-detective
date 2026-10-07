import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as cn, r as EmptyState, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { t as ComplaintRow } from "./ComplaintRow-DfbxR-Ff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-complaints-CGV7KtUw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"All",
	"Open",
	"Resolved",
	"Duplicate"
];
function MyComplaints() {
	const { complaints, studentName } = useCivic();
	const [filter, setFilter] = (0, import_react.useState)("All");
	const shown = (0, import_react.useMemo)(() => complaints.filter((c) => c.studentName === studentName), [complaints, studentName]).filter((c) => {
		if (filter === "All") return true;
		if (filter === "Resolved") return c.status === "Resolved" || c.status === "Closed";
		if (filter === "Duplicate") return c.status === "Duplicate";
		return ![
			"Resolved",
			"Closed",
			"Duplicate"
		].includes(c.status);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Complaints",
			description: "Everything you have reported, with its verification outcome and live status.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/report",
				className: "rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground",
				children: "Report new issue"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 flex flex-wrap gap-2",
			children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(f),
				className: cn("rounded-full px-3.5 py-1.5 text-sm font-medium", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
				children: f
			}, f))
		}),
		shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Nothing here yet",
			hint: "Report an issue with a photo and it will appear in this list."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: shown.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintRow, { complaint: c }, c.id))
		})
	] });
}
//#endregion
export { MyComplaints as component };
