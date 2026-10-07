import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useCivic } from "./store-B0cKa5ln.mjs";
import { W as Bell } from "../_libs/lucide-react.mjs";
import { l as cn, r as EmptyState, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { n as formatDate } from "./ComplaintRow-DfbxR-Ff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-DER1igEc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Notifications() {
	const { notifications, markNotificationsRead } = useCivic();
	(0, import_react.useEffect)(() => {
		const t = setTimeout(markNotificationsRead, 1200);
		return () => clearTimeout(t);
	}, [markNotificationsRead]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		description: "Every update on the issues you reported."
	}), notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "No notifications yet" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("card-surface flex gap-3 p-4", !n.read && "border-l-4 border-l-primary"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 rounded-lg bg-info-soft p-2 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: n.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-muted-foreground",
					children: n.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground",
					children: formatDate(n.at)
				})
			] })]
		}, n.id))
	})] });
}
//#endregion
export { Notifications as component };
