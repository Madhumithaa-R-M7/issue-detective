import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { u as computeSlaAging } from "./store-B0cKa5ln.mjs";
import { I as Clock, p as ShieldAlert, s as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SlaCountdown-C73kmhom.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SlaCountdown({ submittedAt, slaHours, priorityLabel = "Medium", className = "", showIcon = true }) {
	const [slaData, setSlaData] = (0, import_react.useState)(() => computeSlaAging(submittedAt, priorityLabel, slaHours));
	(0, import_react.useEffect)(() => {
		const update = () => setSlaData(computeSlaAging(submittedAt, priorityLabel, slaHours));
		update();
		const timer = setInterval(update, 3e4);
		return () => clearInterval(timer);
	}, [
		submittedAt,
		slaHours,
		priorityLabel
	]);
	const remHours = Math.abs(slaData.remainingHours);
	const hours = Math.floor(remHours);
	const formattedTime = `${hours}h ${Math.round((remHours - hours) * 60)}m`;
	let badgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
	let labelText = `SLA Due In: ${formattedTime}`;
	let IconComponent = Clock;
	if (slaData.status === "BREACHED") {
		badgeStyle = "bg-rose-500/15 text-rose-600 border-rose-500/30 font-bold animate-pulse";
		labelText = `SLA Breached by: ${formattedTime}`;
		IconComponent = ShieldAlert;
	} else if (slaData.status === "OVERDUE") {
		badgeStyle = "bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold";
		labelText = `Overdue by: ${formattedTime}`;
		IconComponent = TriangleAlert;
	} else if (slaData.status === "DUE_SOON") {
		badgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/20 font-medium";
		labelText = `Due Soon in: ${formattedTime}`;
		IconComponent = Clock;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyle} ${className}`,
		title: `SLA Duration: ${slaHours}h | Consumed: ${slaData.percentageConsumed}%`,
		children: [showIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [priorityLabel ? `${priorityLabel} • ` : "", labelText] })]
	});
}
//#endregion
export { SlaCountdown as t };
