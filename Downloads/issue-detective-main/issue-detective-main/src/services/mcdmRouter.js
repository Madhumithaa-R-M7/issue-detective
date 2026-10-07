/**
 * Intelligent Department Routing + MCDM Staff Assignment Engine
 * Modular service for CivicConnect Phase 5
 */

import { getDepartmentByCategory, DEPARTMENTS } from "../utils/departments.js";

export const DEPARTMENT_ROUTING_MAP = DEPARTMENTS.reduce((acc, d) => {
  d.categories.forEach((cat) => {
    acc[cat] = d.name;
  });
  return acc;
}, {});

/**
 * 2 & 3. DEPARTMENT ROUTING ENGINE
 * Route complaint to appropriate department based on category taxonomy
 */
export function routeComplaint(complaint) {
  const category = complaint?.category || "Other";
  const dept = getDepartmentByCategory(category);

  const routingMethod = "Rule-Based Category Routing";
  const routingReason = `Complaint category = ${category}`;
  const routedAt = new Date().toISOString();

  return {
    department: dept.name,
    departmentId: dept.id,
    routingMethod,
    routingReason,
    routedAt,
    slaHours: dept.slaHours || 24,
    subDepartment: dept.categories?.[0] || "General",
  };
}

/**
 * Haversine formula to compute distance in meters between two lat/lng points
 */
export function calculateHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
  let l1 = lat1, o1 = lon1, l2 = lat2, o2 = lon2;
  if (typeof lat1 === 'object' && lat1 !== null && typeof lon1 === 'object' && lon1 !== null) {
    l1 = lat1.lat;
    o1 = lat1.lng ?? lat1.lon;
    l2 = lon1.lat;
    o2 = lon1.lng ?? lon1.lon;
  }

  if (
    typeof l1 !== "number" ||
    typeof o1 !== "number" ||
    typeof l2 !== "number" ||
    typeof o2 !== "number"
  ) {
    return null;
  }

  const R = 6371000; // Radius of Earth in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(l2 - l1);
  const dLon = toRad(o2 - o1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(l1)) * Math.cos(toRad(l2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}


/**
 * 6. WORKLOAD SCORE (W)
 * W = 10 * max(0, 1 - activeComplaints / maxWorkload)
 */
export function calculateWorkloadScore(staff) {
  const activeComplaints = staff.activeComplaints ?? staff.activeCount ?? staff.workload ?? 0;
  const maxWorkload = staff.maxWorkload ?? 5;
  const workloadRatio = activeComplaints / Math.max(1, maxWorkload);
  const workloadScore = Math.min(
    10,
    Math.max(0, Math.round(10 * Math.max(0, 1 - workloadRatio) * 10) / 10)
  );

  return {
    activeComplaints,
    maxWorkload,
    workloadRatio: Math.round(workloadRatio * 100) / 100,
    workloadScore,
  };
}

/**
 * 7. EXPERTISE MATCHING SCORE (E)
 * Exact category match = 10
 * Related skill = 7
 * Same department but no direct expertise = 4
 * No relevant expertise = 0
 */
export function calculateExpertiseScore(staff, complaint) {
  const category = complaint?.category || "";
  const normCategory = category.toLowerCase().trim();

  if (!normCategory) {
    return { score: 4, matchedSkills: [] };
  }

  const staffExpertise = Array.isArray(staff.expertise)
    ? staff.expertise
    : typeof staff.expertise === "string"
    ? [staff.expertise]
    : [];

  const staffSkills = Array.isArray(staff.skills) ? staff.skills : [];

  // Check 1: Exact category match in expertise or skills
  const exactExpertiseMatch = staffExpertise.some(
    (exp) => exp.toLowerCase().trim() === normCategory
  );
  const exactSkillMatch = staffSkills.some(
    (skill) => skill.toLowerCase().trim() === normCategory
  );

  if (exactExpertiseMatch || exactSkillMatch) {
    return {
      score: 10,
      matchedSkills: [category],
    };
  }

  // Check 2: Related skill (partial substring / token overlap match)
  const matchedSkills = staffSkills.filter((skill) => {
    const normSkill = skill.toLowerCase().trim();
    return normCategory.includes(normSkill) || normSkill.includes(normCategory);
  });

  if (matchedSkills.length > 0) {
    return {
      score: 7,
      matchedSkills,
    };
  }

  // Check 3: Same department but no direct expertise
  const deptName = complaint?.department || "";
  if (
    deptName &&
    staff.department &&
    staff.department.toLowerCase().includes(deptName.toLowerCase())
  ) {
    return {
      score: 4,
      matchedSkills: [],
    };
  }

  return {
    score: 0,
    matchedSkills: [],
  };
}

/**
 * 9. PROXIMITY SCORE (D)
 * Compares complaint lat/lng against staff latitude/longitude
 */
export function calculateProximityScore(staff, complaint) {
  const complaintLat = complaint?.lat;
  const complaintLng = complaint?.lng;
  const staffLat = staff?.latitude ?? staff?.lat;
  const staffLng = staff?.longitude ?? staff?.lng;

  const distanceMeters = calculateHaversineDistanceMeters(
    complaintLat,
    complaintLng,
    staffLat,
    staffLng
  );

  if (distanceMeters === null) {
    return {
      distanceMeters: null,
      proximityScore: null,
    };
  }

  // Decay up to 5000m (5km campus radius)
  const score = Math.min(
    10,
    Math.max(0, Math.round(10 * Math.max(0, 1 - distanceMeters / 5000) * 10) / 10)
  );

  return {
    distanceMeters,
    proximityScore: score,
  };
}

/**
 * 10. RESPONSE TIME SCORE (T)
 * Normalize averageResponseTime to 0-10 score
 */
export function calculateResponseTimeScore(staff) {
  const avgMins =
    staff.avgResponseMinutes ??
    (staff.averageResponseTime ? staff.averageResponseTime * 60 : 30);

  // Score decay: 0 mins = 10, 120 mins = 0
  const score = Math.min(
    10,
    Math.max(0, Math.round(10 * Math.max(0, 1 - avgMins / 120) * 10) / 10)
  );

  return {
    averageResponseTime: staff.averageResponseTime ?? Math.round((avgMins / 60) * 10) / 10,
    avgResponseMinutes: avgMins,
    responseTimeScore: score,
  };
}

/**
 * 11. MCDM ASSIGNMENT FORMULA
 * Ao = 0.35E + 0.30W + 0.20D + 0.15T
 */
export function computeStaffMcdmScore(staff, complaint) {
  const expRes = calculateExpertiseScore(staff, complaint);
  const workRes = calculateWorkloadScore(staff);
  const proxRes = calculateProximityScore(staff, complaint);
  const respRes = calculateResponseTimeScore(staff);

  const E = expRes.score;
  const W = workRes.workloadScore;
  const D = proxRes.proximityScore;
  const T = respRes.responseTimeScore;

  let finalScore = 0;

  if (D !== null) {
    finalScore = 0.35 * E + 0.30 * W + 0.20 * D + 0.15 * T;
  } else {
    // If distance is unavailable, re-weight over available criteria (sum of weights = 0.80)
    finalScore = (0.35 * E + 0.30 * W + 0.15 * T) / 0.80;
  }

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
      proximity: D ?? 5, // fallback display
      responseTime: T,
      distanceMeters: proxRes.distanceMeters,
      matchedSkills: expRes.matchedSkills,
      activeComplaints: workRes.activeComplaints,
      maxWorkload: workRes.maxWorkload,
      averageResponseTime: respRes.averageResponseTime,
    },
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
export function assignStaff(complaint, staffList = [], targetDepartmentName = "") {
  const routing = routeComplaint(complaint);
  const deptName = targetDepartmentName || routing.department;

  // Filter eligible staff
  const eligibleStaff = staffList.filter((s) => {
    const isDeptMatch =
      !deptName ||
      s.department.toLowerCase() === deptName.toLowerCase() ||
      deptName.toLowerCase().includes(s.department.toLowerCase()) ||
      s.department.toLowerCase().includes(deptName.toLowerCase());

    const isAvailableStatus =
      s.currentStatus !== "Offline" &&
      s.currentStatus !== "On Leave" &&
      s.availability !== "Offline" &&
      s.availability !== "On Leave" &&
      s.available !== false;

    const active = s.activeComplaints ?? s.activeCount ?? s.workload ?? 0;
    const max = s.maxWorkload ?? 5;
    const hasCapacity = active < max;

    return isDeptMatch && isAvailableStatus && hasCapacity;
  });

  if (eligibleStaff.length === 0) {
    return {
      status: "Unassigned",
      assignedStaffId: null,
      assignedStaffName: null,
      department: deptName,
      assignmentMethod: "MCDM",
      mcdmScore: null,
      factors: null,
      assignedAt: new Date().toISOString(),
      unassignedReason: `No eligible staff currently available in ${deptName}.`,
      reason: `No eligible staff currently available in ${deptName}.`,
      eligibleCount: 0,
      candidates: [],
    };
  }

  // Score eligible candidates
  const scoredCandidates = eligibleStaff.map((s) => {
    const mcdmRes = computeStaffMcdmScore(s, complaint);
    return {
      staff: s,
      mcdmScore: mcdmRes.score,
      factors: mcdmRes.factors,
    };
  });

  // Sort descending by MCDM score
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
    assignedAt: new Date().toISOString(),
    unassignedReason: undefined,
    eligibleCount: scoredCandidates.length,
    candidates: scoredCandidates,
  };
}

/**
 * Backward compatibility helpers
 */
export function rankStaffByMcdm(staffList = [], targetDepartment = "") {
  return staffList
    .filter((s) => !targetDepartment || s.department === targetDepartment)
    .map((s) => {
      const scoreRes = computeStaffMcdmScore(s, null);
      return {
        ...s,
        score: scoreRes.score,
        mcdmFactors: scoreRes.factors,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getDepartmentRoute(category) {
  const dept = getDepartmentByCategory(category);
  return {
    department: dept.name,
    subDepartment: dept.categories[0] || "General",
  };
}

