import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-B0cKa5ln.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Weighted Civic Priority Intelligence Engine
* Formula: P = 0.25S + 0.20U + 0.15C + 0.15G + 0.10R + 0.15A
* Modular service for CivicConnect Phase 4
*/
var PRIORITY_WEIGHTS$1 = {
	severity: .25,
	urgency: .2,
	communityImpact: .15,
	locationImpact: .15,
	recurrence: .1,
	slaAging: .15
};
function getPriorityLevel(score) {
	if (score >= 8) return "Critical";
	if (score >= 6) return "High";
	if (score >= 4) return "Medium";
	return "Low";
}
/**
* Compute full Weighted Civic Priority Score and explainable factor breakdown
*/
function computeCivicPriority(factors = {}) {
	const S = Math.min(10, Math.max(0, factors.severity ?? 5));
	const U = Math.min(10, Math.max(0, factors.urgency ?? 5));
	const C = Math.min(10, Math.max(0, factors.communityImpact ?? 0));
	const G = Math.min(10, Math.max(0, factors.locationImpact ?? 5));
	const R = Math.min(10, Math.max(0, factors.recurrence ?? 0));
	const A = Math.min(10, Math.max(0, factors.slaAging ?? 0));
	const weightedSum = PRIORITY_WEIGHTS$1.severity * S + PRIORITY_WEIGHTS$1.urgency * U + PRIORITY_WEIGHTS$1.communityImpact * C + PRIORITY_WEIGHTS$1.locationImpact * G + PRIORITY_WEIGHTS$1.recurrence * R + PRIORITY_WEIGHTS$1.slaAging * A;
	const score = Math.round(weightedSum * 10) / 10;
	const level = getPriorityLevel(score);
	const explanations = [
		`Severity (${S.toFixed(1)}/10, wt 25%): ${S >= 8 ? "Safety/Infrastructure critical hazard" : S >= 6 ? "Major operational disruption" : "Standard issue"}`,
		`Urgency (${U.toFixed(1)}/10, wt 20%): ${U >= 8 ? "Immediate danger/emergency indicators detected" : "Normal resolution timeframe"}`,
		`Community Impact (${C.toFixed(1)}/10, wt 15%): Affecting multiple campus members`,
		`Location Impact (${G.toFixed(1)}/10, wt 15%): High traffic campus zone rating`,
		`Recurrence (${R.toFixed(1)}/10, wt 10%): ${R > 0 ? "Repeated issue detected at location" : "First report"}`,
		`SLA Aging (${A.toFixed(1)}/10, wt 15%): ${A >= 8 ? "Approaching SLA breach / overdue" : "Within SLA window"}`
	];
	return {
		score,
		level,
		factors: {
			severity: S,
			urgency: U,
			communityImpact: C,
			locationImpact: G,
			recurrence: R,
			slaAging: A
		},
		explanations,
		calculatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function computePriorityScore(input) {
	const S = input.severity || 5;
	const U = input.urgency || 5;
	const C = input.community || 5;
	const G = input.location || 5;
	const R = input.recurrence || 0;
	const A = input.slaAging || 0;
	const res = computeCivicPriority({
		severity: S,
		urgency: U,
		communityImpact: C,
		locationImpact: G,
		recurrence: R,
		slaAging: A
	});
	return {
		severity: S,
		urgency: U,
		community: C,
		location: G,
		recurrence: R,
		slaAging: A,
		overall: res.score,
		label: res.level
	};
}
/**
* Centralized Department Configuration
* CivicConnect Phase 5 Utility
*/
var DEPARTMENTS = [
	{
		id: "DEP-PLUMBING",
		name: "Plumbing / Water Maintenance",
		categories: ["Water Leakage", "Washroom Problem"],
		location: "Main Facilities Building, Block 1",
		active: true,
		slaHours: 24
	},
	{
		id: "DEP-ELECTRICAL",
		name: "Electrical Maintenance",
		categories: [
			"Electrical Problem",
			"Fan / AC Problem",
			"Fan/AC Problem",
			"Streetlight Problem"
		],
		location: "Power Substation Building",
		active: true,
		slaHours: 12
	},
	{
		id: "DEP-IT",
		name: "IT Support",
		categories: ["Wi-Fi / Network Problem", "Wi-Fi/Network Issue"],
		location: "IT Center, Room 101",
		active: true,
		slaHours: 24
	},
	{
		id: "DEP-HOUSEKEEPING",
		name: "Housekeeping",
		categories: ["Garbage / Cleanliness"],
		location: "Central Store & Sanitation Office",
		active: true,
		slaHours: 24
	},
	{
		id: "DEP-FACILITIES",
		name: "Facilities",
		categories: ["Damaged Furniture"],
		location: "Carpentry & Workshop Yard",
		active: true,
		slaHours: 48
	},
	{
		id: "DEP-CIVIL",
		name: "Civil Maintenance",
		categories: ["Road / Pathway Damage"],
		location: "Civil Works Office",
		active: true,
		slaHours: 48
	},
	{
		id: "DEP-SECURITY",
		name: "Campus Administration",
		categories: ["Parking Issue", "Safety Issue"],
		location: "Main Security Gate House",
		active: true,
		slaHours: 12
	},
	{
		id: "DEP-GENERAL",
		name: "General Administration",
		categories: ["Other"],
		location: "Administrative Block",
		active: true,
		slaHours: 72
	}
];
function getDepartmentByCategory(category = "") {
	const norm = String(category).toLowerCase();
	return DEPARTMENTS.find((dept) => dept.categories.some((cat) => cat.toLowerCase() === norm)) || DEPARTMENTS[DEPARTMENTS.length - 1];
}
DEPARTMENTS.reduce((acc, d) => {
	d.categories.forEach((cat) => {
		acc[cat] = d.name;
	});
	return acc;
}, {});
/**
* 2 & 3. DEPARTMENT ROUTING ENGINE
* Route complaint to appropriate department based on category taxonomy
*/
function routeComplaint(complaint) {
	const category = complaint?.category || "Other";
	const dept = getDepartmentByCategory(category);
	const routingMethod = "Rule-Based Category Routing";
	const routingReason = `Complaint category = ${category}`;
	const routedAt = (/* @__PURE__ */ new Date()).toISOString();
	return {
		department: dept.name,
		departmentId: dept.id,
		routingMethod,
		routingReason,
		routedAt,
		slaHours: dept.slaHours || 24,
		subDepartment: dept.categories?.[0] || "General"
	};
}
/**
* Haversine formula to compute distance in meters between two lat/lng points
*/
function calculateHaversineDistanceMeters$1(lat1, lon1, lat2, lon2) {
	if (typeof lat1 !== "number" || typeof lon1 !== "number" || typeof lat2 !== "number" || typeof lon2 !== "number") return null;
	const R = 6371e3;
	const toRad = (deg) => deg * Math.PI / 180;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c);
}
/**
* 6. WORKLOAD SCORE (W)
* W = 10 * max(0, 1 - activeComplaints / maxWorkload)
*/
function calculateWorkloadScore(staff) {
	const activeComplaints = staff.activeComplaints ?? staff.activeCount ?? staff.workload ?? 0;
	const maxWorkload = staff.maxWorkload ?? 5;
	const workloadRatio = activeComplaints / Math.max(1, maxWorkload);
	const workloadScore = Math.min(10, Math.max(0, Math.round(10 * Math.max(0, 1 - workloadRatio) * 10) / 10));
	return {
		activeComplaints,
		maxWorkload,
		workloadRatio: Math.round(workloadRatio * 100) / 100,
		workloadScore
	};
}
/**
* 7. EXPERTISE MATCHING SCORE (E)
* Exact category match = 10
* Related skill = 7
* Same department but no direct expertise = 4
* No relevant expertise = 0
*/
function calculateExpertiseScore(staff, complaint) {
	const category = complaint?.category || "";
	const normCategory = category.toLowerCase().trim();
	if (!normCategory) return {
		score: 4,
		matchedSkills: []
	};
	const staffExpertise = Array.isArray(staff.expertise) ? staff.expertise : typeof staff.expertise === "string" ? [staff.expertise] : [];
	const staffSkills = Array.isArray(staff.skills) ? staff.skills : [];
	const exactExpertiseMatch = staffExpertise.some((exp) => exp.toLowerCase().trim() === normCategory);
	const exactSkillMatch = staffSkills.some((skill) => skill.toLowerCase().trim() === normCategory);
	if (exactExpertiseMatch || exactSkillMatch) return {
		score: 10,
		matchedSkills: [category]
	};
	const matchedSkills = staffSkills.filter((skill) => {
		const normSkill = skill.toLowerCase().trim();
		return normCategory.includes(normSkill) || normSkill.includes(normCategory);
	});
	if (matchedSkills.length > 0) return {
		score: 7,
		matchedSkills
	};
	const deptName = complaint?.department || "";
	if (deptName && staff.department && staff.department.toLowerCase().includes(deptName.toLowerCase())) return {
		score: 4,
		matchedSkills: []
	};
	return {
		score: 0,
		matchedSkills: []
	};
}
/**
* 9. PROXIMITY SCORE (D)
* Compares complaint lat/lng against staff latitude/longitude
*/
function calculateProximityScore(staff, complaint) {
	const complaintLat = complaint?.lat;
	const complaintLng = complaint?.lng;
	const distanceMeters = calculateHaversineDistanceMeters$1(complaintLat, complaintLng, staff?.latitude ?? staff?.lat, staff?.longitude ?? staff?.lng);
	if (distanceMeters === null) return {
		distanceMeters: null,
		proximityScore: null
	};
	return {
		distanceMeters,
		proximityScore: Math.min(10, Math.max(0, Math.round(10 * Math.max(0, 1 - distanceMeters / 5e3) * 10) / 10))
	};
}
/**
* 10. RESPONSE TIME SCORE (T)
* Normalize averageResponseTime to 0-10 score
*/
function calculateResponseTimeScore(staff) {
	const avgMins = staff.avgResponseMinutes ?? (staff.averageResponseTime ? staff.averageResponseTime * 60 : 30);
	const score = Math.min(10, Math.max(0, Math.round(10 * Math.max(0, 1 - avgMins / 120) * 10) / 10));
	return {
		averageResponseTime: staff.averageResponseTime ?? Math.round(avgMins / 60 * 10) / 10,
		avgResponseMinutes: avgMins,
		responseTimeScore: score
	};
}
/**
* 11. MCDM ASSIGNMENT FORMULA
* Ao = 0.35E + 0.30W + 0.20D + 0.15T
*/
function computeStaffMcdmScore(staff, complaint) {
	const expRes = calculateExpertiseScore(staff, complaint);
	const workRes = calculateWorkloadScore(staff);
	const proxRes = calculateProximityScore(staff, complaint);
	const respRes = calculateResponseTimeScore(staff);
	const E = expRes.score;
	const W = workRes.workloadScore;
	const D = proxRes.proximityScore;
	const T = respRes.responseTimeScore;
	let finalScore = 0;
	if (D !== null) finalScore = .35 * E + .3 * W + .2 * D + .15 * T;
	else finalScore = (.35 * E + .3 * W + .15 * T) / .8;
	const roundedFinalScore = Math.round(finalScore * 10) / 10;
	return {
		score: roundedFinalScore,
		finalScore: roundedFinalScore,
		expertiseScore: E,
		workloadScore: W,
		proximityScore: D,
		responseTimeScore: T,
		factors: {
			expertise: E,
			workload: W,
			proximity: D ?? 5,
			responseTime: T,
			distanceMeters: proxRes.distanceMeters,
			matchedSkills: expRes.matchedSkills,
			activeComplaints: workRes.activeComplaints,
			maxWorkload: workRes.maxWorkload,
			averageResponseTime: respRes.averageResponseTime
		}
	};
}
/**
* 12 & 13. AUTOMATIC STAFF ASSIGNMENT
* Workflow:
* 1. Route complaint to department
* 2. Find staff in that department
* 3. Filter out unavailable staff (Offline, On Leave)
* 4. Filter out staff at maximum workload (activeComplaints >= maxWorkload)
* 5-9. Score candidates with MCDM formula
* 10. Sort eligible staff by score
* 11. Assign highest-scoring candidate (or set Unassigned if no eligible staff)
*/
function assignStaff(complaint, staffList = [], targetDepartmentName = "") {
	const routing = routeComplaint(complaint);
	const deptName = targetDepartmentName || routing.department;
	const eligibleStaff = staffList.filter((s) => {
		const isDeptMatch = !deptName || s.department.toLowerCase() === deptName.toLowerCase() || deptName.toLowerCase().includes(s.department.toLowerCase()) || s.department.toLowerCase().includes(deptName.toLowerCase());
		const isAvailableStatus = s.currentStatus !== "Offline" && s.currentStatus !== "On Leave" && s.availability !== "Offline" && s.availability !== "On Leave" && s.available !== false;
		const hasCapacity = (s.activeComplaints ?? s.activeCount ?? s.workload ?? 0) < (s.maxWorkload ?? 5);
		return isDeptMatch && isAvailableStatus && hasCapacity;
	});
	if (eligibleStaff.length === 0) return {
		status: "Unassigned",
		assignedStaffId: null,
		assignedStaffName: null,
		department: deptName,
		assignmentMethod: "MCDM",
		mcdmScore: null,
		factors: null,
		assignedAt: (/* @__PURE__ */ new Date()).toISOString(),
		unassignedReason: `No eligible staff currently available in ${deptName}.`,
		reason: `No eligible staff currently available in ${deptName}.`,
		eligibleCount: 0,
		candidates: []
	};
	const scoredCandidates = eligibleStaff.map((s) => {
		const mcdmRes = computeStaffMcdmScore(s, complaint);
		return {
			staff: s,
			mcdmScore: mcdmRes.score,
			factors: mcdmRes.factors
		};
	});
	scoredCandidates.sort((a, b) => b.mcdmScore - a.mcdmScore);
	const bestCandidate = scoredCandidates[0];
	return {
		status: "Assigned",
		assignedStaffId: bestCandidate.staff.id,
		assignedStaffName: bestCandidate.staff.name,
		department: deptName,
		assignmentMethod: "MCDM",
		mcdmScore: bestCandidate.mcdmScore,
		factors: bestCandidate.factors,
		assignedAt: (/* @__PURE__ */ new Date()).toISOString(),
		unassignedReason: void 0,
		eligibleCount: scoredCandidates.length,
		candidates: scoredCandidates
	};
}
/**
* Backward compatibility helpers
*/
function rankStaffByMcdm(staffList = [], targetDepartment = "") {
	return staffList.filter((s) => !targetDepartment || s.department === targetDepartment).map((s) => {
		const scoreRes = computeStaffMcdmScore(s, null);
		return {
			...s,
			score: scoreRes.score,
			mcdmFactors: scoreRes.factors
		};
	}).sort((a, b) => b.score - a.score);
}
function getDepartmentRoute(category) {
	const dept = getDepartmentByCategory(category);
	return {
		department: dept.name,
		subDepartment: dept.categories[0] || "General"
	};
}
var PRIORITY_WEIGHTS = PRIORITY_WEIGHTS$1;
function computePriority(input) {
	return computePriorityScore(input);
}
function rankStaff(staff, department) {
	return rankStaffByMcdm(staff, department);
}
function routeDepartment(category) {
	const route = getDepartmentRoute(category);
	return {
		department: route.department,
		sub: route.subDepartment
	};
}
function calculateSlaInfo(submittedAt, slaHours) {
	const submitted = new Date(submittedAt).getTime();
	const elapsedHours = Math.max(0, Date.now() - submitted) / 36e5;
	const hoursLeft = Math.round((slaHours - elapsedHours) * 10) / 10;
	const progressPercent = Math.min(100, Math.max(0, Math.round(elapsedHours / slaHours * 100)));
	let status = "On Track";
	if (hoursLeft < 0) status = hoursLeft < -24 ? "Escalated" : "SLA Breached";
	else if (hoursLeft <= Math.max(2, slaHours * .25)) status = "Due Soon";
	return {
		elapsedHours: Math.round(elapsedHours * 10) / 10,
		hoursLeft,
		progressPercent,
		status
	};
}
/**
* Centralized Campus Location Coordinates & Location Impact Definitions
* CivicConnect Phase 4 Utility
*/
var CAMPUS_LOCATIONS = [
	{
		name: "CSE Block",
		lat: 12.9721,
		lng: 79.1601,
		baseImpact: 8.5,
		type: "Academic Building"
	},
	{
		name: "AIDS Block",
		lat: 12.9725,
		lng: 79.1608,
		baseImpact: 8,
		type: "Academic Building"
	},
	{
		name: "ECE Block",
		lat: 12.9718,
		lng: 79.1613,
		baseImpact: 8,
		type: "Academic Building"
	},
	{
		name: "Mechanical Block",
		lat: 12.971,
		lng: 79.1595,
		baseImpact: 7.5,
		type: "Academic Building"
	},
	{
		name: "Library",
		lat: 12.9729,
		lng: 79.1592,
		baseImpact: 9,
		type: "High Traffic Shared Facility"
	},
	{
		name: "Laboratory",
		lat: 12.9716,
		lng: 79.1606,
		baseImpact: 7,
		type: "Specialized Academic Zone"
	},
	{
		name: "Classroom",
		lat: 12.9722,
		lng: 79.1598,
		baseImpact: 7.5,
		type: "Academic Area"
	},
	{
		name: "Hostel",
		lat: 12.9738,
		lng: 79.1619,
		baseImpact: 9.5,
		type: "Residential Zone"
	},
	{
		name: "Canteen",
		lat: 12.9731,
		lng: 79.1611,
		baseImpact: 9,
		type: "High Traffic Dining Zone"
	},
	{
		name: "Parking",
		lat: 12.9705,
		lng: 79.1586,
		baseImpact: 5.5,
		type: "Vehicle Transit Zone"
	},
	{
		name: "Playground",
		lat: 12.9742,
		lng: 79.1601,
		baseImpact: 5,
		type: "Recreational Area"
	},
	{
		name: "Auditorium",
		lat: 12.9727,
		lng: 79.1583,
		baseImpact: 7,
		type: "Event Facility"
	},
	{
		name: "Washroom",
		lat: 12.972,
		lng: 79.1604,
		baseImpact: 8,
		type: "Essential Sanitation Facility"
	},
	{
		name: "Common Area",
		lat: 12.9724,
		lng: 79.1596,
		baseImpact: 6.5,
		type: "Public Walkway"
	}
];
function locationCoords$1(locationName) {
	return CAMPUS_LOCATIONS.find((l) => l.name.toLowerCase() === String(locationName || "").toLowerCase()) || CAMPUS_LOCATIONS[0];
}
function computeLocationImpact(locationName, nearbyComplaintCount = 0) {
	const loc = locationCoords$1(locationName);
	const baseScore = loc.baseImpact || 6;
	const densityBonus = Math.min(2, nearbyComplaintCount * .4);
	return {
		score: Math.min(10, Math.round((baseScore + densityBonus) * 10) / 10),
		locationType: loc.type,
		nearbyComplaintCount,
		reasons: [`Base location criticality rating for ${loc.name} (${loc.type}): ${baseScore}/10`, nearbyComplaintCount > 0 ? `${nearbyComplaintCount} nearby active complaints increased location impact by +${densityBonus.toFixed(1)} points` : "Standard traffic area rating"]
	};
}
/**
* Complaint Classification Engine
* TF-IDF + Logistic Regression Interface with Prototype Rule-based Fallback
* Modular service for CivicConnect Phase 4
*/
var CATEGORY_DICTIONARY = {
	"Electrical Problem": [
		"light",
		"socket",
		"switch",
		"power",
		"electric",
		"shock",
		"wiring",
		"spark",
		"voltage",
		"short-circuit"
	],
	"Water Leakage": [
		"water",
		"leak",
		"leakage",
		"pipe",
		"tap",
		"drip",
		"ceiling",
		"seepage",
		"overflow",
		"plumbing"
	],
	"Damaged Furniture": [
		"chair",
		"bench",
		"desk",
		"table",
		"broken",
		"furniture",
		"podium",
		"door",
		"lock",
		"handle"
	],
	"Fan/AC Problem": [
		"fan",
		"ac",
		"air",
		"cooling",
		"noise",
		"blade",
		"wobble",
		"conditioner",
		"hvac",
		"ventilation"
	],
	"Streetlight Problem": [
		"streetlight",
		"lamp",
		"pole",
		"dark",
		"street",
		"light pole",
		"pathway light"
	],
	"Garbage/Cleanliness": [
		"garbage",
		"trash",
		"waste",
		"dirty",
		"clean",
		"smell",
		"dustbin",
		"litter",
		"overflowing"
	],
	"Washroom Problem": [
		"washroom",
		"toilet",
		"restroom",
		"flush",
		"basin",
		"urinal",
		"hygiene",
		"soap"
	],
	"Road/Pathway Damage": [
		"road",
		"pathway",
		"pothole",
		"tile",
		"walkway",
		"pavement",
		"crack",
		"asphalt"
	],
	"Parking Issue": [
		"parking",
		"vehicle",
		"bike",
		"car",
		"slot",
		"illegal parking",
		"scooter"
	],
	"Wi-Fi/Network Issue": [
		"wifi",
		"wi-fi",
		"network",
		"internet",
		"router",
		"signal",
		"disconnection",
		"bandwidth"
	],
	"Other": []
};
function classifyComplaint(descriptionText) {
	if (!descriptionText || typeof descriptionText !== "string" || descriptionText.trim().length === 0) return {
		category: "Other",
		confidence: .5,
		method: "TF-IDF + Logistic Regression",
		modelType: "Prototype fallback"
	};
	const tokens = descriptionText.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2);
	let bestCategory = "Other";
	let maxScore = 0;
	for (const [category, keywords] of Object.entries(CATEGORY_DICTIONARY)) {
		if (keywords.length === 0) continue;
		let categoryHits = 0;
		for (const keyword of keywords) if (tokens.includes(keyword)) categoryHits += 1;
		const score = categoryHits / keywords.length;
		if (score > maxScore) {
			maxScore = score;
			bestCategory = category;
		}
	}
	const confidence = Math.min(.99, Math.max(.5, .55 + maxScore * 2.5));
	return {
		category: bestCategory,
		confidence: Math.round(confidence * 100) / 100,
		method: "TF-IDF + Logistic Regression",
		modelType: "Prototype fallback"
	};
}
/**
* NLP-based Urgency Detection Engine
* Modular service for CivicConnect Phase 4
*/
var HIGH_URGENCY_KEYWORDS = [
	"dangerous",
	"emergency",
	"sparking",
	"flooding",
	"broken wire",
	"accident",
	"unsafe",
	"fire",
	"immediate",
	"hazard",
	"risk",
	"shock",
	"collapse"
];
var MEDIUM_URGENCY_KEYWORDS = [
	"leaking",
	"not working",
	"damaged",
	"repeated",
	"severe",
	"broken",
	"fault",
	"issue",
	"wobble",
	"overflowing",
	"noise"
];
var LOW_URGENCY_KEYWORDS = [
	"minor",
	"inconvenience",
	"cosmetic",
	"small issue",
	"slow",
	"aesthetic",
	"dust",
	"paint",
	"scratch"
];
function analyzeUrgency(text = "") {
	const lower = String(text).toLowerCase();
	const detectedIndicators = [];
	let highCount = 0;
	let mediumCount = 0;
	let lowCount = 0;
	for (const word of HIGH_URGENCY_KEYWORDS) if (lower.includes(word)) {
		highCount++;
		detectedIndicators.push(word);
	}
	for (const word of MEDIUM_URGENCY_KEYWORDS) if (lower.includes(word)) {
		mediumCount++;
		detectedIndicators.push(word);
	}
	for (const word of LOW_URGENCY_KEYWORDS) if (lower.includes(word)) {
		lowCount++;
		detectedIndicators.push(word);
	}
	let urgencyScore = 5;
	if (highCount > 0) urgencyScore = Math.min(10, 8 + (highCount - 1) * .8);
	else if (mediumCount > 0) urgencyScore = Math.min(7.5, 5.5 + (mediumCount - 1) * .5);
	else if (lowCount > 0) urgencyScore = Math.max(1, 3.5 - lowCount * .5);
	urgencyScore = Math.round(urgencyScore * 10) / 10;
	let urgencyLevel = "Medium";
	if (urgencyScore >= 8) urgencyLevel = "High";
	else if (urgencyScore <= 4) urgencyLevel = "Low";
	return {
		urgencyScore,
		urgencyLevel,
		detectedIndicators,
		modelType: "Prototype rule-based keyword analyzer"
	};
}
/**
* Severity Scoring Engine
* Modular service for CivicConnect Phase 4
*/
var CATEGORY_BASE_SEVERITY = {
	"Safety Issue": 9.5,
	"Electrical Problem": 8.6,
	"Water Leakage": 8,
	"Road / Pathway Damage": 7.5,
	"Washroom Problem": 7,
	"Streetlight Problem": 6.8,
	"Garbage / Cleanliness": 6.4,
	"Fan / AC Problem": 6,
	"Wi-Fi / Network Problem": 5.4,
	"Damaged Furniture": 5,
	"Parking Issue": 4.4,
	"Other": 5
};
function calculateSeverity(category = "", description = "") {
	const normCategory = Object.keys(CATEGORY_BASE_SEVERITY).find((k) => k.toLowerCase() === category.toLowerCase()) || "Other";
	const baseScore = CATEGORY_BASE_SEVERITY[normCategory] || 5;
	const lowerDesc = String(description).toLowerCase();
	let modifier = 0;
	const reasons = [`Category base severity rating for ${normCategory}: ${baseScore}/10`];
	if (/spark|shock|live wire|fire|collapse|hazard/i.test(lowerDesc)) {
		modifier += 1;
		reasons.push("Critical hazard terms in description (+1.0 severity modifier)");
	}
	if (/flooding|burst|unusable|entire block|blackout/i.test(lowerDesc)) {
		modifier += .8;
		reasons.push("Widespread operational disruption (+0.8 severity modifier)");
	}
	const finalScore = Math.min(10, Math.max(1, Math.round((baseScore + modifier) * 10) / 10));
	let level = "Moderate";
	if (finalScore >= 8.5) level = "Critical Safety Hazard";
	else if (finalScore >= 7) level = "Major Operational Disruption";
	else if (finalScore >= 5) level = "Significant Inconvenience";
	else level = "Minor Issue";
	return {
		score: finalScore,
		level,
		reasons
	};
}
/**
* Geospatial Engine (Haversine Distance & DBSCAN Spatial Hotspot Clustering)
* Modular service for CivicConnect Phase 4
*/
/**
* 6. HAVERSINE DISTANCE FORMULA
* Calculates exact great-circle distance between two GPS coordinates in meters.
*/
function calculateHaversineDistanceMeters(coordA, coordB) {
	if (!coordA || !coordB || typeof coordA.lat !== "number" || typeof coordB.lat !== "number") return Infinity;
	const R = 6371e3;
	const toRad = (deg) => deg * Math.PI / 180;
	const phi1 = toRad(coordA.lat);
	const phi2 = toRad(coordB.lat);
	const deltaPhi = toRad(coordB.lat - coordA.lat);
	const deltaLambda = toRad(coordB.lng - coordA.lng);
	const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c);
}
/**
* 10. DBSCAN HOTSPOT DETECTION
* Density-Based Spatial Clustering of Applications with Noise operating on Haversine geographic distances in meters.
*/
function runDbscanClustering(complaints = [], epsMeters = 80, minPts = 2) {
	const points = complaints.filter((c) => typeof c.lat === "number" && typeof c.lng === "number").map((c) => ({
		id: c.id,
		lat: c.lat,
		lng: c.lng,
		category: c.category,
		location: c.location,
		priority: c.priority?.overall || 5,
		complaint: c
	}));
	const visited = /* @__PURE__ */ new Set();
	const clustered = /* @__PURE__ */ new Set();
	const clusters = [];
	const getNeighbours = (point) => points.filter((q) => q.id !== point.id && calculateHaversineDistanceMeters(point, q) <= epsMeters);
	for (const p of points) {
		if (visited.has(p.id)) continue;
		visited.add(p.id);
		const neighbours = getNeighbours(p);
		if (neighbours.length + 1 < minPts) continue;
		const clusterPoints = [p];
		clustered.add(p.id);
		const queue = [...neighbours];
		while (queue.length > 0) {
			const q = queue.shift();
			if (!visited.has(q.id)) {
				visited.add(q.id);
				const qNeighbours = getNeighbours(q);
				if (qNeighbours.length + 1 >= minPts) queue.push(...qNeighbours.filter((x) => !visited.has(x.id)));
			}
			if (!clustered.has(q.id)) {
				clustered.add(q.id);
				clusterPoints.push(q);
			}
		}
		const totalLat = clusterPoints.reduce((sum, pt) => sum + pt.lat, 0);
		const totalLng = clusterPoints.reduce((sum, pt) => sum + pt.lng, 0);
		const centroid = {
			lat: totalLat / clusterPoints.length,
			lng: totalLng / clusterPoints.length
		};
		const catCounts = {};
		clusterPoints.forEach((pt) => {
			catCounts[pt.category] = (catCounts[pt.category] || 0) + 1;
		});
		const mainCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";
		const avgPriority = Math.round(clusterPoints.reduce((sum, pt) => sum + pt.priority, 0) / clusterPoints.length * 10) / 10;
		clusters.push({
			clusterId: `CLUSTER-${clusters.length + 1}`,
			isHotspot: clusterPoints.length >= minPts,
			nearbyComplaintCount: clusterPoints.length,
			centroid,
			mainCategory,
			avgPriority,
			locationName: clusterPoints[0]?.location || "Campus Zone",
			relatedComplaintIds: clusterPoints.map((pt) => pt.id),
			points: clusterPoints
		});
	}
	return clusters.sort((a, b) => b.nearbyComplaintCount - a.nearbyComplaintCount);
}
/**
* Find cluster info for a specific complaint
*/
function getComplaintGeospatialInfo(complaint, allComplaints = [], epsMeters = 80, minPts = 2) {
	if (!complaint || typeof complaint.lat !== "number") return {
		distanceMeters: null,
		locationImpactScore: 5,
		clusterId: null,
		isHotspot: false,
		nearbyComplaintCount: 0,
		centroid: null,
		reasons: ["GPS coordinates unavailable; using fallback location score."]
	};
	const activeCluster = runDbscanClustering(allComplaints, epsMeters, minPts).find((cl) => cl.relatedComplaintIds.includes(complaint.id));
	const nearbyComplaints = allComplaints.filter((c) => c.id !== complaint.id && typeof c.lat === "number" && calculateHaversineDistanceMeters(complaint, {
		lat: c.lat,
		lng: c.lng
	}) <= epsMeters);
	const locImpact = computeLocationImpact(complaint.location, nearbyComplaints.length);
	return {
		distanceMeters: activeCluster ? calculateHaversineDistanceMeters(complaint, activeCluster.centroid) : 0,
		locationImpactScore: locImpact.score,
		locationType: locImpact.locationType,
		clusterId: activeCluster?.clusterId || null,
		isHotspot: Boolean(activeCluster),
		nearbyComplaintCount: nearbyComplaints.length + 1,
		centroid: activeCluster?.centroid || {
			lat: complaint.lat,
			lng: complaint.lng
		},
		reasons: locImpact.reasons
	};
}
function analyzeRecurrence(targetComplaint, allComplaints = [], timeWindowDays = 30) {
	if (!targetComplaint) return {
		recurrenceCount: 0,
		recurrenceScore: 0,
		relatedComplaintIds: []
	};
	const windowMs = timeWindowDays * 24 * 60 * 60 * 1e3;
	const targetTime = targetComplaint.submittedAt ? new Date(targetComplaint.submittedAt).getTime() : Date.now();
	const relatedMatches = allComplaints.filter((c) => {
		if (c.id === targetComplaint.id) return false;
		const categoryMatch = c.category?.toLowerCase() === targetComplaint.category?.toLowerCase();
		const sameName = String(c.location).toLowerCase() === String(targetComplaint.location).toLowerCase();
		const isNearby = typeof c.lat === "number" && typeof targetComplaint.lat === "number" && calculateHaversineDistanceMeters(targetComplaint, {
			lat: c.lat,
			lng: c.lng
		}) <= 100;
		const locationMatch = sameName || isNearby;
		const cTime = c.submittedAt ? new Date(c.submittedAt).getTime() : 0;
		const withinWindow = Math.abs(targetTime - cTime) <= windowMs;
		return categoryMatch && locationMatch && withinWindow;
	});
	const recurrenceCount = relatedMatches.length;
	let recurrenceScore = 0;
	if (recurrenceCount === 1) recurrenceScore = 4;
	else if (recurrenceCount === 2) recurrenceScore = 7;
	else if (recurrenceCount >= 3) recurrenceScore = 10;
	return {
		recurrenceCount,
		recurrenceScore,
		relatedComplaintIds: relatedMatches.map((c) => c.id)
	};
}
/**
* SLA Configuration File (Centrally Managed)
* 
* IMPORTANT: These are prototype configuration values used for testing
* platform SLA monitoring and escalation logic.
* They are NOT official college policies.
*/
var SLA_CONFIG = {
	durations: {
		Critical: 4,
		High: 12,
		Medium: 24,
		Low: 72
	},
	thresholds: {
		withinSlaMaxPercent: 70,
		dueSoonMaxPercent: 100
	},
	escalationLevels: {
		LEVEL_0_WITHIN_SLA: {
			level: 0,
			label: "Level 0: Within SLA",
			status: "WITHIN_SLA"
		},
		LEVEL_1_DUE_SOON: {
			level: 1,
			label: "Level 1: Due Soon",
			status: "DUE_SOON"
		},
		LEVEL_2_OVERDUE: {
			level: 2,
			label: "Level 2: Overdue",
			status: "OVERDUE"
		},
		LEVEL_3_BREACHED: {
			level: 3,
			label: "Level 3: SLA Breached",
			status: "BREACHED"
		}
	},
	disclaimer: "Prototype / Demo SLA Configuration Values"
};
/**
* Gets SLA duration in hours for a priority label.
* @param {string} priority 
* @returns {number}
*/
function getSlaDurationHours(priority = "Medium") {
	return SLA_CONFIG.durations[priority] || SLA_CONFIG.durations.Medium;
}
/**
* SLA Aging & Monitoring Calculation Engine
* Uses central configuration from slaConfig.js
* Modular service for CivicConnect Phase 6
*/
/**
* Calculates complete SLA timing, percentage consumed, aging score, and status.
* 
* @param {string|number} submittedAtIso 
* @param {string} priorityLabel 
* @param {number|null} customSlaHours 
* @returns {{
*   slaHours: number,
*   createdAt: string,
*   dueAt: string,
*   hoursOpen: number,
*   remainingHours: number,
*   percentageConsumed: number,
*   agingScore: number,
*   status: "WITHIN_SLA" | "DUE_SOON" | "OVERDUE" | "BREACHED"
* }}
*/
function computeSlaAging(submittedAtIso, priorityLabel = "Medium", customSlaHours = null) {
	const slaHours = customSlaHours || getSlaDurationHours(priorityLabel);
	const submittedDate = submittedAtIso ? new Date(submittedAtIso) : /* @__PURE__ */ new Date();
	const submittedMs = submittedDate.getTime();
	const createdAt = submittedDate.toISOString();
	const elapsedMs = Math.max(0, Date.now() - submittedMs);
	const hoursOpen = Math.round(elapsedMs / 36e5 * 10) / 10;
	const dueMs = submittedMs + slaHours * 60 * 60 * 1e3;
	const dueAt = new Date(dueMs).toISOString();
	const remainingHours = Math.round((slaHours - hoursOpen) * 10) / 10;
	const rawPercentage = hoursOpen / slaHours * 100;
	const percentageConsumed = Math.round(rawPercentage * 10) / 10;
	const agingScore = Math.min(10, Math.max(0, Math.round(hoursOpen / slaHours * 100) / 10));
	let status = "WITHIN_SLA";
	if (percentageConsumed >= 150 || remainingHours <= -12) status = "BREACHED";
	else if (percentageConsumed >= 100 || remainingHours <= 0) status = "OVERDUE";
	else if (percentageConsumed >= SLA_CONFIG.thresholds.withinSlaMaxPercent) status = "DUE_SOON";
	return {
		slaHours,
		createdAt,
		dueAt,
		hoursOpen,
		remainingHours,
		percentageConsumed,
		agingScore,
		status
	};
}
/**
* Unified Civic Intelligence Suite
* Combines Classification, Urgency, Severity, Geospatial, Recurrence, SLA, Priority, Routing, and MCDM Staff Assignment.
* Modular pipeline for CivicConnect Phase 5
*/
/**
* COMPLAINT CREATION & RECALCULATION PIPELINE
*/
function processComplaintIntelligence(complaint, allComplaints = [], staffList = []) {
	if (!complaint) return null;
	const classification = classifyComplaint(complaint.description);
	const finalCategory = complaint.category || classification.category;
	const urgencyInfo = analyzeUrgency(complaint.description);
	const severityInfo = calculateSeverity(finalCategory, complaint.description);
	const geoInfo = getComplaintGeospatialInfo(complaint, allComplaints);
	const relatedCount = geoInfo.nearbyComplaintCount || 1;
	const communityImpactScore = Math.min(10, Math.round(10 * Math.min(relatedCount / 20, 1) * 10) / 10);
	const recurrenceInfo = analyzeRecurrence(complaint, allComplaints);
	const slaAgingInfo = computeSlaAging(complaint.submittedAt, "Medium");
	const priorityRes = computeCivicPriority({
		severity: severityInfo.score,
		urgency: urgencyInfo.urgencyScore,
		communityImpact: communityImpactScore,
		locationImpact: geoInfo.locationImpactScore,
		recurrence: recurrenceInfo.recurrenceScore,
		slaAging: slaAgingInfo.agingScore
	});
	const routingRes = routeComplaint({
		...complaint,
		category: finalCategory
	});
	const assignmentRes = assignStaff({
		...complaint,
		category: finalCategory,
		department: routingRes.department
	}, staffList, routingRes.department);
	const timestamp = complaint.submittedAt || (/* @__PURE__ */ new Date()).toISOString();
	const initialRoutingHistory = complaint.routingHistory || [{
		department: routingRes.department,
		routedAt: routingRes.routedAt || timestamp,
		routedBy: "Automated Taxonomy Engine",
		method: routingRes.routingMethod,
		reason: routingRes.routingReason
	}];
	const initialAssignmentHistory = complaint.assignmentHistory || (assignmentRes.assignedStaffId ? [{
		staffId: assignmentRes.assignedStaffId,
		staffName: assignmentRes.assignedStaffName,
		department: routingRes.department,
		assignedAt: assignmentRes.assignedAt || timestamp,
		assignedBy: "Automated MCDM Engine",
		method: assignmentRes.assignmentMethod || "MCDM",
		mcdmScore: assignmentRes.mcdmScore,
		factors: assignmentRes.factors,
		reason: `Assigned via MCDM score (${assignmentRes.mcdmScore}/10)`
	}] : []);
	return {
		classificationInfo: {
			predictedCategory: classification.category,
			predictionConfidence: classification.confidence,
			finalCategory,
			classificationMethod: classification.method,
			modelType: classification.modelType
		},
		urgencyInfo,
		severityInfo,
		communityImpactInfo: {
			affectedCount: relatedCount,
			score: communityImpactScore
		},
		geospatialInfo: geoInfo,
		recurrenceInfo,
		slaAgingInfo,
		priority: {
			severity: severityInfo.score,
			urgency: urgencyInfo.urgencyScore,
			community: communityImpactScore,
			location: geoInfo.locationImpactScore,
			recurrence: recurrenceInfo.recurrenceScore,
			slaAging: slaAgingInfo.agingScore,
			overall: priorityRes.score,
			label: priorityRes.level
		},
		priorityFactors: priorityRes.factors,
		priorityExplanations: priorityRes.explanations,
		priorityUpdatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		routing: {
			department: routingRes.department,
			method: routingRes.routingMethod,
			reason: routingRes.routingReason,
			routedAt: routingRes.routedAt || timestamp
		},
		assignment: {
			staffId: assignmentRes.assignedStaffId,
			staffName: assignmentRes.assignedStaffName,
			department: routingRes.department,
			method: assignmentRes.assignmentMethod || "MCDM",
			mcdmScore: assignmentRes.mcdmScore,
			assignedAt: assignmentRes.assignedAt || timestamp
		},
		assignmentStatus: assignmentRes.status,
		assignmentFactors: assignmentRes.factors,
		routingInfo: routingRes,
		assignmentInfo: assignmentRes,
		routingHistory: initialRoutingHistory,
		assignmentHistory: initialAssignmentHistory
	};
}
var CATEGORIES = [
	"Electrical Problem",
	"Water Leakage",
	"Fan / AC Problem",
	"Garbage / Cleanliness",
	"Washroom Problem",
	"Damaged Furniture",
	"Road / Pathway Damage",
	"Streetlight Problem",
	"Wi-Fi / Network Problem",
	"Parking Issue",
	"Safety Issue",
	"Other"
];
function locationCoords(name) {
	return locationCoords$1(name);
}
var STAFF = [
	{
		id: "STF-01",
		name: "Ramesh Kumar",
		email: "ramesh.kumar@civicconnect.edu",
		department: "Plumbing / Water Maintenance",
		skills: [
			"Plumbing",
			"Pipe Fitting",
			"Water Leakage",
			"Sanitation"
		],
		currentStatus: "Available",
		activeCount: 2,
		maxWorkload: 5,
		latitude: 13.0415,
		longitude: 80.2335,
		avgResponseMinutes: 18,
		resolvedCount: 42,
		rating: 4.8,
		expertise: "Plumbing",
		expertiseScore: .95,
		available: true,
		workload: 2,
		distanceKm: .8
	},
	{
		id: "STF-02",
		name: "Suresh Babu",
		email: "suresh.babu@civicconnect.edu",
		department: "Electrical Maintenance",
		skills: [
			"Electrical",
			"HVAC",
			"Wiring",
			"Lighting"
		],
		currentStatus: "Available",
		activeCount: 3,
		maxWorkload: 5,
		latitude: 13.0422,
		longitude: 80.2341,
		avgResponseMinutes: 26,
		resolvedCount: 38,
		rating: 4.6,
		expertise: "Electrical",
		expertiseScore: .91,
		available: true,
		workload: 3,
		distanceKm: 1.4
	},
	{
		id: "STF-03",
		name: "Anitha Raj",
		email: "anitha.raj@civicconnect.edu",
		department: "Facilities",
		skills: [
			"Carpentry",
			"Furniture Repair",
			"Locksmith"
		],
		currentStatus: "Busy",
		activeCount: 5,
		maxWorkload: 5,
		latitude: 13.0405,
		longitude: 80.2322,
		avgResponseMinutes: 41,
		resolvedCount: 29,
		rating: 4.5,
		expertise: "Carpentry",
		expertiseScore: .86,
		available: false,
		workload: 5,
		distanceKm: 2.1
	},
	{
		id: "STF-04",
		name: "Lakshmi Devi",
		email: "lakshmi.devi@civicconnect.edu",
		department: "Housekeeping",
		skills: [
			"Sanitation",
			"Waste Management",
			"Deep Cleaning"
		],
		currentStatus: "Available",
		activeCount: 2,
		maxWorkload: 6,
		latitude: 13.0418,
		longitude: 80.233,
		avgResponseMinutes: 15,
		resolvedCount: 65,
		rating: 4.9,
		expertise: "Sanitation",
		expertiseScore: .93,
		available: true,
		workload: 2,
		distanceKm: .5
	},
	{
		id: "STF-05",
		name: "Karthik S",
		email: "karthik.s@civicconnect.edu",
		department: "IT Support",
		skills: [
			"Networking",
			"Wi-Fi",
			"Hardware",
			"Router Config"
		],
		currentStatus: "Available",
		activeCount: 1,
		maxWorkload: 4,
		latitude: 13.0425,
		longitude: 80.235,
		avgResponseMinutes: 22,
		resolvedCount: 51,
		rating: 4.7,
		expertise: "Networking",
		expertiseScore: .9,
		available: true,
		workload: 1,
		distanceKm: 1.1
	},
	{
		id: "STF-06",
		name: "Vijay Prakash",
		email: "vijay.prakash@civicconnect.edu",
		department: "Civil Maintenance",
		skills: [
			"Civil",
			"Masonry",
			"Paving",
			"Structure"
		],
		currentStatus: "Available",
		activeCount: 4,
		maxWorkload: 5,
		latitude: 13.0398,
		longitude: 80.2315,
		avgResponseMinutes: 55,
		resolvedCount: 22,
		rating: 4.4,
		expertise: "Civil",
		expertiseScore: .88,
		available: true,
		workload: 4,
		distanceKm: 3.2
	},
	{
		id: "STF-07",
		name: "Mohan Raj",
		email: "mohan.raj@civicconnect.edu",
		department: "Campus Administration",
		skills: [
			"Campus Security",
			"Parking Management",
			"Surveillance"
		],
		currentStatus: "Available",
		activeCount: 2,
		maxWorkload: 6,
		latitude: 13.043,
		longitude: 80.236,
		avgResponseMinutes: 12,
		resolvedCount: 47,
		rating: 4.8,
		expertise: "Campus Security",
		expertiseScore: .84,
		available: true,
		workload: 2,
		distanceKm: .3
	},
	{
		id: "STF-08",
		name: "Priya Dharshini",
		email: "priya.dharshini@civicconnect.edu",
		department: "General Administration",
		skills: [
			"General Maintenance",
			"Coordination",
			"Logistics"
		],
		currentStatus: "Available",
		activeCount: 1,
		maxWorkload: 5,
		latitude: 13.0412,
		longitude: 80.2328,
		avgResponseMinutes: 25,
		resolvedCount: 30,
		rating: 4.6,
		expertise: "General",
		expertiseScore: .85,
		available: true,
		workload: 1,
		distanceKm: 1
	}
];
var SEED = [
	{
		id: "CIV-00023",
		desc: "Water leakage is occurring from the ceiling near CSE Block, 2nd floor.",
		category: "Water Leakage",
		location: "CSE Block",
		detail: "Room 302 / near staircase",
		day: 15,
		status: "Resolved",
		student: "Madhumithaa R M",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00024",
		desc: "Broken chair in the library reading hall, the backrest is cracked.",
		category: "Damaged Furniture",
		location: "Library",
		detail: "Reading hall, seat 14",
		day: 17,
		status: "Assigned",
		student: "Arjun Nair",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00025",
		desc: "Water dripping from the same ceiling patch near CSE Block second floor.",
		category: "Water Leakage",
		location: "CSE Block",
		detail: "Room 302 / near staircase",
		day: 20,
		status: "In Progress",
		student: "Madhumithaa R M",
		ver: "potential_duplicate",
		sim: .88,
		match: "CIV-00023",
		exif: true
	},
	{
		id: "CIV-00026",
		desc: "Ceiling fan in AIDS Block classroom makes loud noise and wobbles.",
		category: "Fan / AC Problem",
		location: "AIDS Block",
		detail: "Room 105",
		day: 18,
		status: "In Progress",
		student: "Priya Sharma",
		ver: "new",
		exif: false
	},
	{
		id: "CIV-00027",
		desc: "Garbage bins near the canteen are overflowing and smell badly.",
		category: "Garbage / Cleanliness",
		location: "Canteen",
		detail: "Behind serving counter",
		day: 19,
		status: "Resolved",
		student: "Rahul Verma",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00028",
		desc: "Hostel washroom flush is not working on the third floor.",
		category: "Washroom Problem",
		location: "Hostel",
		detail: "Block B, 3rd floor",
		day: 19,
		status: "Assigned",
		student: "Sneha Iyer",
		ver: "insufficient_evidence",
		exif: false
	},
	{
		id: "CIV-00029",
		desc: "Wi-Fi signal is very weak in the laboratory, unable to connect.",
		category: "Wi-Fi / Network Problem",
		location: "Laboratory",
		detail: "Lab 2",
		day: 20,
		status: "Submitted",
		student: "Vikram Das",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00030",
		desc: "Same overflowing garbage bin near canteen reported again with same photo.",
		category: "Garbage / Cleanliness",
		location: "Canteen",
		detail: "Behind serving counter",
		day: 20,
		status: "Duplicate",
		student: "Divya M",
		ver: "exact_duplicate",
		sim: 1,
		match: "CIV-00027",
		exif: true
	},
	{
		id: "CIV-00031",
		desc: "Pathway tiles broken near the mechanical block entrance, risk of tripping.",
		category: "Road / Pathway Damage",
		location: "Mechanical Block",
		detail: "Main entrance",
		day: 16,
		status: "In Progress",
		student: "Ajay Kumar",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00032",
		desc: "Streetlight near the playground is not switching on at night.",
		category: "Streetlight Problem",
		location: "Playground",
		detail: "North gate path",
		day: 14,
		status: "Resolved",
		student: "Meena R",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00033",
		desc: "Two-wheeler parking slots are blocked by construction material.",
		category: "Parking Issue",
		location: "Parking",
		detail: "Slot rows 3-5",
		day: 18,
		status: "Submitted",
		student: "Nikhil P",
		ver: "insufficient_evidence",
		exif: false
	},
	{
		id: "CIV-00034",
		desc: "Exposed electrical wiring sparking near the ECE Block corridor switchboard.",
		category: "Electrical Problem",
		location: "ECE Block",
		detail: "Ground floor corridor",
		day: 20,
		status: "Under Analysis",
		student: "Harini S",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00035",
		desc: "Hostel corridor light flickering continuously for three days.",
		category: "Electrical Problem",
		location: "Hostel",
		detail: "Block A, 2nd floor",
		day: 17,
		status: "Resolved",
		student: "Sanjay T",
		ver: "new",
		exif: true
	},
	{
		id: "CIV-00036",
		desc: "Water tap running continuously in hostel washroom, wasting water.",
		category: "Water Leakage",
		location: "Hostel",
		detail: "Block B, ground floor",
		day: 19,
		status: "Assigned",
		student: "Farhan A",
		ver: "potential_duplicate",
		sim: .81,
		match: "CIV-00028",
		exif: true
	},
	{
		id: "CIV-00037",
		desc: "Auditorium AC not cooling during the seminar session.",
		category: "Fan / AC Problem",
		location: "Auditorium",
		detail: "Main hall",
		day: 13,
		status: "Closed",
		student: "Keerthi V",
		ver: "new",
		exif: true
	}
];
function severityFor(category) {
	return {
		"Safety Issue": 9.5,
		"Electrical Problem": 8.6,
		"Water Leakage": 8,
		"Washroom Problem": 7,
		"Road / Pathway Damage": 7.2,
		"Garbage / Cleanliness": 6.4,
		"Fan / AC Problem": 6,
		"Wi-Fi / Network Problem": 5.4,
		"Damaged Furniture": 5,
		"Streetlight Problem": 6.8,
		"Parking Issue": 4.4,
		Other: 5
	}[category] ?? 5;
}
function randHash(seed, len, alphabet = "0123456789abcdef") {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 33 + seed.charCodeAt(i) >>> 0;
	let out = "";
	for (let i = 0; i < len; i++) {
		h = h * 1103515245 + 12345 >>> 0;
		out += alphabet[h % alphabet.length];
	}
	return out;
}
function buildBaseComplaint(s) {
	const coords = locationCoords(s.location);
	const jitter = (n) => randHash(s.id + n, 1, "0123456789").charCodeAt(0) % 9 * 15e-6;
	const route = routeDepartment(s.category);
	const severity = severityFor(s.category);
	const priority = computePriority({
		severity,
		urgency: Math.min(10, severity - .5),
		community: s.location === "Hostel" || s.location === "Canteen" ? 8 : 6,
		location: s.location === "CSE Block" || s.location === "Hostel" ? 8 : 6.5,
		recurrence: s.ver === "new" ? 4 : 7,
		slaAging: Math.min(10, (21 - s.day) * .9)
	});
	const submitted = new Date(Date.UTC(2026, 8, s.day, 10, 32));
	const assignable = [
		"Assigned",
		"In Progress",
		"Resolved",
		"Closed"
	].includes(s.status);
	const staff = STAFF.find((st) => st.department === route.department && st.expertise === route.sub);
	const sha256Hash = randHash(s.id + "sha", 64);
	const perceptualHash = randHash(s.id + "ph", 64, "01");
	const warnings = s.exif ? ["Provenance metadata present"] : ["Metadata unavailable"];
	const image = {
		imageUrl: "",
		fileName: `${s.category.split(" ")[0].toLowerCase()}_${s.id.slice(-3)}.jpg`,
		fileType: "image/jpeg",
		fileSize: 16e5 + s.day % 7 * 18e4,
		width: 1920,
		height: 1080,
		sha256Hash,
		perceptualHash,
		exif: s.exif ? {
			available: true,
			device: "Samsung Galaxy",
			captureDate: `${String(s.day).padStart(2, "0")}-09-2026`,
			captureTime: "10:32 AM",
			timestamp: `2026-09-${String(s.day).padStart(2, "0")} 10:32:00`,
			gpsAvailable: true,
			gps: {
				latitude: coords.lat,
				longitude: coords.lng
			},
			software: "Camera",
			warnings: ["Provenance metadata present"]
		} : {
			available: false,
			device: null,
			captureDate: null,
			captureTime: null,
			timestamp: null,
			gpsAvailable: false,
			gps: null,
			software: null,
			warnings: ["Metadata unavailable"]
		},
		verification: {
			exactMatch: s.ver === "exact_duplicate",
			visualSimilarity: s.sim ?? .12,
			similarityScore: s.sim ?? .12,
			hammingDistance: s.sim ? Math.round((1 - s.sim) * 64) : 41,
			locationDistance: s.match ? 10 : null,
			locationSimilarity: s.match ? .95 : 0,
			combinedScore: s.sim ? .7 * s.sim + .285 : 0,
			status: s.ver,
			matchedComplaintId: s.match ?? null,
			confidence: s.ver === "exact_duplicate" ? 1 : s.sim ?? .9,
			sha256: sha256Hash,
			perceptualHash,
			warnings,
			analyzedAt: submitted.toISOString()
		}
	};
	const duplicateAnalysis = {
		isPotentialDuplicate: s.ver === "potential_duplicate" || s.ver === "exact_duplicate",
		duplicateScore: s.sim ? Math.round((.7 * s.sim + .285) * 100) / 100 : .15,
		matchedComplaintId: s.match ?? null,
		textSimilarity: s.sim ? Math.round(s.sim * .9 * 100) / 100 : .2,
		imageSimilarity: s.sim ?? .12,
		locationDistance: s.match ? 10 : 150
	};
	return {
		id: s.id,
		description: s.desc,
		category: s.category,
		location: s.location,
		detailedLocation: s.detail,
		lat: coords.lat + jitter(1),
		lng: coords.lng + jitter(2),
		submittedAt: submitted.toISOString(),
		status: s.status,
		priority,
		department: route.department,
		subDepartment: route.sub,
		assignedStaffId: assignable && staff ? staff.id : null,
		slaHours: priority.label === "Critical" ? 6 : priority.label === "High" ? 24 : 72,
		resolutionRemarks: s.status === "Resolved" || s.status === "Closed" ? "Issue inspected on site and rectified. Area cleaned and verified." : void 0,
		feedbackRating: s.status === "Closed" ? 5 : void 0,
		studentName: s.student,
		image,
		imageVerification: image.verification,
		duplicateAnalysis
	};
}
var SEED_COMPLAINTS = SEED.map(buildBaseComplaint).map((c, _, arr) => {
	const intel = processComplaintIntelligence(c, arr, STAFF);
	if (!intel) return c;
	return {
		...c,
		classificationInfo: intel.classificationInfo,
		urgencyInfo: intel.urgencyInfo,
		severityInfo: intel.severityInfo,
		communityImpactInfo: intel.communityImpactInfo,
		geospatialInfo: intel.geospatialInfo,
		recurrenceInfo: intel.recurrenceInfo,
		slaAgingInfo: intel.slaAgingInfo,
		priority: {
			...c.priority,
			severity: intel.priority.severity,
			urgency: intel.priority.urgency,
			community: intel.priority.community,
			location: intel.priority.location,
			recurrence: intel.priority.recurrence,
			slaAging: intel.priority.slaAging,
			overall: intel.priority.overall,
			label: intel.priority.label
		},
		priorityFactors: intel.priorityFactors,
		priorityExplanations: intel.priorityExplanations,
		priorityUpdatedAt: intel.priorityUpdatedAt
	};
});
var CURRENT_STUDENT = "Madhumithaa R M";
/**
* SLA Escalation Engine
* 
* Manages multi-level escalations when complaints become overdue or breached.
* Levels:
* Level 0: Within SLA
* Level 1: Due Soon
* Level 2: Overdue
* Level 3: SLA Breached
* 
* Creates escalation records and preserves escalation history.
* Does NOT automatically change complaint status to Resolved or Rejected.
*/
/**
* Maps SLA status to numeric escalation level and metadata.
* 
* @param {"WITHIN_SLA" | "DUE_SOON" | "OVERDUE" | "BREACHED"} slaStatus 
* @returns {{ level: number, name: string, badgeTone: string }}
*/
function getEscalationLevel(slaStatus) {
	switch (slaStatus) {
		case "BREACHED": return {
			level: 3,
			name: "Level 3: SLA Breached",
			badgeTone: "critical"
		};
		case "OVERDUE": return {
			level: 2,
			name: "Level 2: Overdue",
			badgeTone: "critical"
		};
		case "DUE_SOON": return {
			level: 1,
			name: "Level 1: Due Soon",
			badgeTone: "warning"
		};
		default: return {
			level: 0,
			name: "Level 0: Within SLA",
			badgeTone: "success"
		};
	}
}
/**
* Creates an escalation record for a complaint if a breach/overdue condition is detected.
* 
* @param {Object} complaint 
* @param {string} [previousStatus] 
* @param {string} [reasonOverride] 
* @returns {Object|null}
*/
function evaluateEscalation(complaint, previousStatus = "WITHIN_SLA", reasonOverride = null) {
	if ([
		"Resolved",
		"Closed",
		"Rejected",
		"Duplicate"
	].includes(complaint.status)) return null;
	const slaInfo = computeSlaAging(complaint.submittedAt, complaint.priority?.label, complaint.slaHours);
	const escalationInfo = getEscalationLevel(slaInfo.status);
	if (escalationInfo.level === 0) return null;
	const triggeredAt = (/* @__PURE__ */ new Date()).toISOString();
	const reason = reasonOverride || `SLA time limit exceeded (${slaInfo.hoursOpen}h open, ${slaInfo.slaHours}h SLA allocated).`;
	return {
		id: `esc-${complaint.id}-${Date.now()}`,
		complaintId: complaint.id,
		type: slaInfo.status === "BREACHED" ? "SLA_BREACH" : "SLA_WARNING",
		triggeredAt,
		previousStatus,
		escalationLevel: escalationInfo.level,
		escalationName: escalationInfo.name,
		status: slaInfo.status,
		hoursOpen: slaInfo.hoursOpen,
		slaHours: slaInfo.slaHours,
		reason
	};
}
/**
* Evaluates all active complaints and returns new escalation records for unrecorded escalations.
* 
* @param {Array} complaints 
* @param {Array} existingEscalations 
* @returns {Array} List of new escalation records
*/
function scanComplaintsForEscalations(complaints = [], existingEscalations = []) {
	const newEscalations = [];
	for (const c of complaints) {
		if ([
			"Resolved",
			"Closed",
			"Rejected",
			"Duplicate"
		].includes(c.status)) continue;
		const slaInfo = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
		if (slaInfo.status === "WITHIN_SLA") continue;
		const highestRecordedLevel = existingEscalations.filter((e) => e.complaintId === c.id).reduce((max, e) => Math.max(max, e.escalationLevel || 0), 0);
		if (getEscalationLevel(slaInfo.status).level > highestRecordedLevel) {
			const record = evaluateEscalation(c, highestRecordedLevel === 0 ? "WITHIN_SLA" : `Level ${highestRecordedLevel}`);
			if (record) newEscalations.push(record);
		}
	}
	return newEscalations;
}
var STORAGE_KEY = "civicconnect.state.v1";
var CivicContext = (0, import_react.createContext)(null);
var initialState = {
	role: null,
	complaints: SEED_COMPLAINTS,
	staff: STAFF,
	notifications: [
		{
			id: "n1",
			title: "Complaint CIV-00025 is in progress",
			body: "Ramesh Kumar (Plumbing) has started work on your water leakage report.",
			at: "2026-09-20T11:10:00Z",
			read: false
		},
		{
			id: "n2",
			title: "Potential duplicate detected",
			body: "CIV-00025 looks visually similar to CIV-00023 (88% similarity).",
			at: "2026-09-20T10:35:00Z",
			read: false
		},
		{
			id: "n3",
			title: "Complaint CIV-00023 resolved",
			body: "Please share your feedback on the resolution.",
			at: "2026-09-18T09:00:00Z",
			read: true
		}
	],
	escalations: []
};
function CivicProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(initialState);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				setState((s) => ({
					...s,
					...parsed,
					staff: parsed.staff && parsed.staff.length > 0 ? parsed.staff : STAFF,
					escalations: parsed.escalations || []
				}));
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {}
	}, [state, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const newEscs = scanComplaintsForEscalations(state.complaints, state.escalations);
		if (newEscs.length > 0) setState((s) => {
			const newNotifs = newEscs.map((esc) => ({
				id: `n-esc-${esc.complaintId}-${Date.now()}`,
				title: `SLA Alert: ${esc.complaintId} ${esc.status}`,
				body: `Complaint ${esc.complaintId} (${esc.escalationName}) — ${esc.reason}`,
				at: esc.triggeredAt,
				read: false
			}));
			return {
				...s,
				escalations: [...newEscs, ...s.escalations],
				notifications: [...newNotifs, ...s.notifications]
			};
		});
	}, [
		hydrated,
		state.complaints,
		state.escalations
	]);
	const setRole = (0, import_react.useCallback)((role) => setState((s) => ({
		...s,
		role
	})), []);
	const recalculateAllPriorities = (0, import_react.useCallback)(() => {
		setState((s) => {
			const updatedComplaints = s.complaints.map((c, _, list) => {
				const intel = processComplaintIntelligence(c, list, s.staff);
				if (!intel) return c;
				return {
					...c,
					classificationInfo: intel.classificationInfo,
					urgencyInfo: intel.urgencyInfo,
					severityInfo: intel.severityInfo,
					communityImpactInfo: intel.communityImpactInfo,
					geospatialInfo: intel.geospatialInfo,
					recurrenceInfo: intel.recurrenceInfo,
					slaAgingInfo: intel.slaAgingInfo,
					priority: {
						...c.priority,
						severity: intel.priority.severity,
						urgency: intel.priority.urgency,
						community: intel.priority.community,
						location: intel.priority.location,
						recurrence: intel.priority.recurrence,
						slaAging: intel.priority.slaAging,
						overall: intel.priority.overall,
						label: intel.priority.label
					},
					priorityFactors: intel.priorityFactors,
					priorityExplanations: intel.priorityExplanations,
					priorityUpdatedAt: intel.priorityUpdatedAt,
					routingInfo: intel.routingInfo,
					assignmentInfo: intel.assignmentInfo,
					assignmentFactors: intel.assignmentFactors,
					routingHistory: c.routingHistory || intel.routingHistory,
					assignmentHistory: c.assignmentHistory || intel.assignmentHistory
				};
			});
			return {
				...s,
				complaints: updatedComplaints
			};
		});
	}, []);
	const addComplaint = (0, import_react.useCallback)((c) => {
		setState((s) => {
			const intel = processComplaintIntelligence(c, [c, ...s.complaints], s.staff);
			const enrichedComplaint = intel ? {
				...c,
				classificationInfo: intel.classificationInfo,
				urgencyInfo: intel.urgencyInfo,
				severityInfo: intel.severityInfo,
				communityImpactInfo: intel.communityImpactInfo,
				geospatialInfo: intel.geospatialInfo,
				recurrenceInfo: intel.recurrenceInfo,
				slaAgingInfo: intel.slaAgingInfo,
				priority: {
					...c.priority,
					severity: intel.priority.severity,
					urgency: intel.priority.urgency,
					community: intel.priority.community,
					location: intel.priority.location,
					recurrence: intel.priority.recurrence,
					slaAging: intel.priority.slaAging,
					overall: intel.priority.overall,
					label: intel.priority.label
				},
				priorityFactors: intel.priorityFactors,
				priorityExplanations: intel.priorityExplanations,
				priorityUpdatedAt: intel.priorityUpdatedAt,
				department: intel.routingInfo?.department || c.department,
				assignedStaffId: intel.assignmentInfo?.assignedStaffId || c.assignedStaffId,
				routingInfo: intel.routingInfo,
				assignmentInfo: intel.assignmentInfo,
				assignmentFactors: intel.assignmentFactors,
				routingHistory: intel.routingHistory,
				assignmentHistory: intel.assignmentHistory
			} : c;
			return {
				...s,
				complaints: [enrichedComplaint, ...s.complaints],
				notifications: [{
					id: `n-${c.id}`,
					title: `Complaint ${c.id} submitted`,
					body: `${c.category} at ${c.location} — routed to ${enrichedComplaint.department}.`,
					at: (/* @__PURE__ */ new Date()).toISOString(),
					read: false
				}, ...s.notifications]
			};
		});
	}, []);
	const updateComplaint = (0, import_react.useCallback)((id, patch) => {
		setState((s) => ({
			...s,
			complaints: s.complaints.map((c) => {
				if (c.id !== id) return c;
				const nowISO = (/* @__PURE__ */ new Date()).toISOString();
				const isResolving = (patch.status === "Resolved" || patch.status === "Closed") && !c.resolvedAt;
				const isReopening = patch.status === "In Progress" && c.status === "Resolved";
				return {
					...c,
					...patch,
					resolvedAt: isResolving ? patch.resolvedAt || nowISO : c.resolvedAt,
					reopenedAt: isReopening ? nowISO : c.reopenedAt
				};
			})
		}));
	}, []);
	const reassignStaff = (0, import_react.useCallback)((complaintId, staffId, adminName = "Admin Override", reason = "Manual Admin Assignment") => {
		setState((s) => {
			const targetStaff = s.staff.find((st) => st.id === staffId);
			if (!targetStaff) return s;
			const nowISO = (/* @__PURE__ */ new Date()).toISOString();
			const updatedComplaints = s.complaints.map((c) => {
				if (c.id !== complaintId) return c;
				const scoreRes = computeStaffMcdmScore(targetStaff, c);
				const newAssignmentHistoryEntry = {
					staffId: targetStaff.id,
					staffName: targetStaff.name,
					department: targetStaff.department,
					assignedAt: nowISO,
					assignedBy: adminName,
					method: "Manual Admin Assignment",
					mcdmScore: scoreRes.score,
					factors: scoreRes.factors,
					reason,
					override: true,
					overrideReason: reason,
					overriddenBy: adminName,
					overriddenAt: nowISO
				};
				return {
					...c,
					assignedStaffId: targetStaff.id,
					department: targetStaff.department,
					status: c.status === "Submitted" || c.status === "Under Analysis" ? "Assigned" : c.status,
					override: true,
					overrideReason: reason,
					overriddenBy: adminName,
					overriddenAt: nowISO,
					assignment: {
						staffId: targetStaff.id,
						staffName: targetStaff.name,
						department: targetStaff.department,
						method: "Manual Admin Assignment",
						mcdmScore: scoreRes.score,
						assignedAt: nowISO
					},
					assignmentStatus: "Assigned",
					assignmentInfo: {
						assignedStaffId: targetStaff.id,
						assignedStaffName: targetStaff.name,
						assignedAt: nowISO,
						status: "Assigned",
						mcdmScore: scoreRes.score,
						unassignedReason: void 0
					},
					assignmentFactors: scoreRes.factors,
					assignmentHistory: [...c.assignmentHistory || [], newAssignmentHistoryEntry]
				};
			});
			return {
				...s,
				complaints: updatedComplaints,
				notifications: [{
					id: `n-reassign-${Date.now()}`,
					title: `Complaint ${complaintId} Reassigned`,
					body: `Reassigned to ${targetStaff.name} (${targetStaff.department}) by ${adminName}.`,
					at: nowISO,
					read: false
				}, ...s.notifications]
			};
		});
	}, []);
	const unassignStaff = (0, import_react.useCallback)((complaintId, adminName = "Admin Override", reason = "Manual Unassignment") => {
		setState((s) => {
			const nowISO = (/* @__PURE__ */ new Date()).toISOString();
			const updatedComplaints = s.complaints.map((c) => {
				if (c.id !== complaintId) return c;
				const newHistoryEntry = {
					staffId: null,
					staffName: null,
					department: c.department,
					assignedAt: nowISO,
					assignedBy: adminName,
					method: "Manual Admin Unassignment",
					mcdmScore: null,
					factors: null,
					reason,
					override: true,
					overrideReason: reason,
					overriddenBy: adminName,
					overriddenAt: nowISO
				};
				return {
					...c,
					assignedStaffId: null,
					assignmentStatus: "Unassigned",
					override: true,
					overrideReason: reason,
					overriddenBy: adminName,
					overriddenAt: nowISO,
					assignment: {
						staffId: null,
						staffName: null,
						department: c.department,
						method: "Manual Admin Unassignment",
						mcdmScore: null,
						assignedAt: nowISO
					},
					assignmentInfo: {
						assignedStaffId: null,
						assignedStaffName: null,
						assignedAt: nowISO,
						status: "Unassigned",
						mcdmScore: null,
						unassignedReason: reason
					},
					assignmentHistory: [...c.assignmentHistory || [], newHistoryEntry]
				};
			});
			return {
				...s,
				complaints: updatedComplaints
			};
		});
	}, []);
	const rerouteDepartment = (0, import_react.useCallback)((complaintId, newDept, adminName = "Admin Override", reason = "Manual Admin Rerouting") => {
		setState((s) => {
			const nowISO = (/* @__PURE__ */ new Date()).toISOString();
			const updatedComplaints = s.complaints.map((c) => {
				if (c.id !== complaintId) return c;
				const newRoutingEntry = {
					department: newDept,
					routedAt: nowISO,
					routedBy: adminName,
					method: "Manual Admin Rerouting",
					reason,
					override: true
				};
				return {
					...c,
					department: newDept,
					routing: {
						department: newDept,
						method: "Manual Admin Rerouting",
						reason,
						routedAt: nowISO
					},
					routingHistory: [...c.routingHistory || [], newRoutingEntry]
				};
			});
			return {
				...s,
				complaints: updatedComplaints
			};
		});
	}, []);
	const updateStaffStatus = (0, import_react.useCallback)((staffId, status) => {
		setState((s) => ({
			...s,
			staff: s.staff.map((st) => st.id === staffId ? {
				...st,
				currentStatus: status,
				available: status === "Available" || status === "Busy"
			} : st)
		}));
	}, []);
	const nextComplaintId = (0, import_react.useCallback)(() => {
		const max = state.complaints.reduce((m, c) => {
			const n = Number(c.id.replace("CIV-", ""));
			return Number.isFinite(n) ? Math.max(m, n) : m;
		}, 124);
		return `CIV-${String(max + 1).padStart(5, "0")}`;
	}, [state.complaints]);
	const markNotificationsRead = (0, import_react.useCallback)(() => setState((s) => ({
		...s,
		notifications: s.notifications.map((n) => ({
			...n,
			read: true
		}))
	})), []);
	const value = (0, import_react.useMemo)(() => ({
		...state,
		studentName: CURRENT_STUDENT,
		setRole,
		addComplaint,
		updateComplaint,
		reassignStaff,
		unassignStaff,
		rerouteDepartment,
		updateStaffStatus,
		recalculateAllPriorities,
		nextComplaintId,
		markNotificationsRead
	}), [
		state,
		setRole,
		addComplaint,
		updateComplaint,
		reassignStaff,
		unassignStaff,
		rerouteDepartment,
		updateStaffStatus,
		recalculateAllPriorities,
		nextComplaintId,
		markNotificationsRead
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CivicContext.Provider, {
		value,
		children
	});
}
function useCivic() {
	const ctx = (0, import_react.useContext)(CivicContext);
	if (!ctx) throw new Error("useCivic must be used inside CivicProvider");
	return ctx;
}
//#endregion
export { severityFor as _, PRIORITY_WEIGHTS as a, classifyComplaint as c, getEscalationLevel as d, locationCoords$1 as f, runDbscanClustering as g, routeDepartment as h, DEPARTMENTS as i, computePriority as l, rankStaff as m, CATEGORIES as n, SLA_CONFIG as o, processComplaintIntelligence as p, CivicProvider as r, calculateSlaInfo as s, CAMPUS_LOCATIONS as t, computeSlaAging as u, useCivic as v };
