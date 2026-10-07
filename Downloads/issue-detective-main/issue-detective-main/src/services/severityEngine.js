/**
 * Severity Scoring Engine
 * Modular service for CivicConnect Phase 4
 */

export const CATEGORY_BASE_SEVERITY = {
  "Safety Issue": 9.5,
  "Electrical Problem": 8.6,
  "Water Leakage": 8.0,
  "Road / Pathway Damage": 7.5,
  "Washroom Problem": 7.0,
  "Streetlight Problem": 6.8,
  "Garbage / Cleanliness": 6.4,
  "Fan / AC Problem": 6.0,
  "Wi-Fi / Network Problem": 5.4,
  "Damaged Furniture": 5.0,
  "Parking Issue": 4.4,
  "Other": 5.0,
};

export function calculateSeverity(category = "", description = "") {
  const normCategory = Object.keys(CATEGORY_BASE_SEVERITY).find(
    (k) => k.toLowerCase() === category.toLowerCase()
  ) || "Other";

  const baseScore = CATEGORY_BASE_SEVERITY[normCategory] || 5.0;
  const lowerDesc = String(description).toLowerCase();

  let modifier = 0;
  const reasons = [`Category base severity rating for ${normCategory}: ${baseScore}/10`];

  if (/spark|shock|live wire|fire|collapse|hazard/i.test(lowerDesc)) {
    modifier += 1.0;
    reasons.push("Critical hazard terms in description (+1.0 severity modifier)");
  }

  if (/flooding|burst|unusable|entire block|blackout/i.test(lowerDesc)) {
    modifier += 0.8;
    reasons.push("Widespread operational disruption (+0.8 severity modifier)");
  }

  const finalScore = Math.min(10.0, Math.max(1.0, Math.round((baseScore + modifier) * 10) / 10));

  let level = "Moderate";
  if (finalScore >= 8.5) level = "Critical Safety Hazard";
  else if (finalScore >= 7.0) level = "Major Operational Disruption";
  else if (finalScore >= 5.0) level = "Significant Inconvenience";
  else level = "Minor Issue";

  return {
    score: finalScore,
    level,
    reasons,
  };
}
