/**
 * SLA Aging & Monitoring Calculation Engine
 * Uses central configuration from slaConfig.js
 * Modular service for CivicConnect Phase 6
 */

import { getSlaDurationHours, SLA_CONFIG } from "../utils/slaConfig.js";

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
export function computeSlaAging(submittedAtIso, priorityLabel = "Medium", customSlaHours = null) {
  const slaHours = customSlaHours || getSlaDurationHours(priorityLabel);

  const submittedDate = submittedAtIso ? new Date(submittedAtIso) : new Date();
  const submittedMs = submittedDate.getTime();
  const createdAt = submittedDate.toISOString();

  const nowMs = Date.now();
  const elapsedMs = Math.max(0, nowMs - submittedMs);
  const hoursOpen = Math.round((elapsedMs / (1000 * 60 * 60)) * 10) / 10;

  const dueMs = submittedMs + slaHours * 60 * 60 * 1000;
  const dueAt = new Date(dueMs).toISOString();

  const remainingHours = Math.round((slaHours - hoursOpen) * 10) / 10;
  const rawPercentage = (hoursOpen / slaHours) * 100;
  const percentageConsumed = Math.round(rawPercentage * 10) / 10;

  // Aging score (0 - 10 scale): A = 10 * min(HoursOpen / SLAHours, 1)
  const agingScore = Math.min(10.0, Math.max(0.0, Math.round((hoursOpen / slaHours) * 100) / 10));

  let status = "WITHIN_SLA";

  if (percentageConsumed >= 150 || remainingHours <= -12) {
    status = "BREACHED";
  } else if (percentageConsumed >= 100 || remainingHours <= 0) {
    status = "OVERDUE";
  } else if (percentageConsumed >= SLA_CONFIG.thresholds.withinSlaMaxPercent) {
    status = "DUE_SOON";
  }

  return {
    slaHours,
    createdAt,
    dueAt,
    hoursOpen,
    remainingHours,
    percentageConsumed,
    agingScore,
    status,
  };
}

/**
 * Legacy compatibility alias for existing components
 */
export function calculateSlaInfo(submittedAtIso, customSlaHours = null, priorityLabel = "Medium") {
  const res = computeSlaAging(submittedAtIso, priorityLabel, customSlaHours);
  
  // Format legacy status string for backwards compatibility
  let legacyStatus = "Within SLA";
  if (res.status === "BREACHED") legacyStatus = "SLA Breached";
  else if (res.status === "OVERDUE") legacyStatus = "Overdue";
  else if (res.status === "DUE_SOON") legacyStatus = "Due Soon";

  return {
    ...res,
    hoursLeft: res.remainingHours,
    status: legacyStatus,
    codeStatus: res.status,
  };
}
