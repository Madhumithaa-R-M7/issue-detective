/**
 * Weighted Civic Priority Intelligence Engine
 * Formula: P = 0.25S + 0.20U + 0.15C + 0.15G + 0.10R + 0.15A
 * Modular service for CivicConnect Phase 4
 */

export const PRIORITY_WEIGHTS = {
  severity: 0.25,
  urgency: 0.20,
  communityImpact: 0.15,
  locationImpact: 0.15,
  recurrence: 0.10,
  slaAging: 0.15,
};

export function getPriorityLevel(score) {
  if (score >= 8.0) return "Critical";
  if (score >= 6.0) return "High";
  if (score >= 4.0) return "Medium";
  return "Low";
}

/**
 * Compute full Weighted Civic Priority Score and explainable factor breakdown
 */
export function computeCivicPriority(factors = {}) {
  const S = Math.min(10, Math.max(0, factors.severity ?? 5));
  const U = Math.min(10, Math.max(0, factors.urgency ?? 5));
  const C = Math.min(10, Math.max(0, factors.communityImpact ?? 0));
  const G = Math.min(10, Math.max(0, factors.locationImpact ?? 5));
  const R = Math.min(10, Math.max(0, factors.recurrence ?? 0));
  const A = Math.min(10, Math.max(0, factors.slaAging ?? 0));

  const weightedSum =
    PRIORITY_WEIGHTS.severity * S +
    PRIORITY_WEIGHTS.urgency * U +
    PRIORITY_WEIGHTS.communityImpact * C +
    PRIORITY_WEIGHTS.locationImpact * G +
    PRIORITY_WEIGHTS.recurrence * R +
    PRIORITY_WEIGHTS.slaAging * A;

  const score = Math.round(weightedSum * 10) / 10;
  const level = getPriorityLevel(score);

  const explanations = [
    `Severity (${S.toFixed(1)}/10, wt 25%): ${S >= 8 ? "Safety/Infrastructure critical hazard" : S >= 6 ? "Major operational disruption" : "Standard issue"}`,
    `Urgency (${U.toFixed(1)}/10, wt 20%): ${U >= 8 ? "Immediate danger/emergency indicators detected" : "Normal resolution timeframe"}`,
    `Community Impact (${C.toFixed(1)}/10, wt 15%): Affecting multiple campus members`,
    `Location Impact (${G.toFixed(1)}/10, wt 15%): High traffic campus zone rating`,
    `Recurrence (${R.toFixed(1)}/10, wt 10%): ${R > 0 ? "Repeated issue detected at location" : "First report"}`,
    `SLA Aging (${A.toFixed(1)}/10, wt 15%): ${A >= 8 ? "Approaching SLA breach / overdue" : "Within SLA window"}`,
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
      slaAging: A,
    },
    explanations,
    calculatedAt: new Date().toISOString(),
  };
}

// Backward-compatibility wrapper for Phase 2/3
export function computePriorityScore(input) {
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
    slaAging: A,
  });

  return {
    severity: S,
    urgency: U,
    community: C,
    location: G,
    recurrence: R,
    slaAging: A,
    overall: res.score,
    label: res.level,
  };
}

export function getPriorityLabel(score) {
  return getPriorityLevel(score);
}
