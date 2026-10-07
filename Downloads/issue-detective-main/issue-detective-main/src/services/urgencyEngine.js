/**
 * NLP-based Urgency Detection Engine
 * Modular service for CivicConnect Phase 4
 */

export const HIGH_URGENCY_KEYWORDS = [
  "dangerous", "emergency", "sparking", "flooding", "broken wire",
  "accident", "unsafe", "fire", "immediate", "hazard", "risk", "shock", "collapse"
];

export const MEDIUM_URGENCY_KEYWORDS = [
  "leaking", "not working", "damaged", "repeated", "severe",
  "broken", "fault", "issue", "wobble", "overflowing", "noise"
];

export const LOW_URGENCY_KEYWORDS = [
  "minor", "inconvenience", "cosmetic", "small issue", "slow",
  "aesthetic", "dust", "paint", "scratch"
];

export function analyzeUrgency(text = "") {
  const lower = String(text).toLowerCase();
  const detectedIndicators = [];

  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  for (const word of HIGH_URGENCY_KEYWORDS) {
    if (lower.includes(word)) {
      highCount++;
      detectedIndicators.push(word);
    }
  }

  for (const word of MEDIUM_URGENCY_KEYWORDS) {
    if (lower.includes(word)) {
      mediumCount++;
      detectedIndicators.push(word);
    }
  }

  for (const word of LOW_URGENCY_KEYWORDS) {
    if (lower.includes(word)) {
      lowCount++;
      detectedIndicators.push(word);
    }
  }

  let urgencyScore = 5.0; // default baseline

  if (highCount > 0) {
    urgencyScore = Math.min(10.0, 8.0 + (highCount - 1) * 0.8);
  } else if (mediumCount > 0) {
    urgencyScore = Math.min(7.5, 5.5 + (mediumCount - 1) * 0.5);
  } else if (lowCount > 0) {
    urgencyScore = Math.max(1.0, 3.5 - lowCount * 0.5);
  }

  urgencyScore = Math.round(urgencyScore * 10) / 10;

  let urgencyLevel = "Medium";
  if (urgencyScore >= 8.0) urgencyLevel = "High";
  else if (urgencyScore <= 4.0) urgencyLevel = "Low";

  return {
    urgencyScore,
    urgencyLevel,
    detectedIndicators,
    modelType: "Prototype rule-based keyword analyzer",
  };
}
