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

import { computeSlaAging } from "./slaEngine.js";

/**
 * Maps SLA status to numeric escalation level and metadata.
 * 
 * @param {"WITHIN_SLA" | "DUE_SOON" | "OVERDUE" | "BREACHED"} slaStatus 
 * @returns {{ level: number, name: string, badgeTone: string }}
 */
export function getEscalationLevel(slaStatus) {
  switch (slaStatus) {
    case "BREACHED":
      return { level: 3, name: "Level 3: SLA Breached", badgeTone: "critical" };
    case "OVERDUE":
      return { level: 2, name: "Level 2: Overdue", badgeTone: "critical" };
    case "DUE_SOON":
      return { level: 1, name: "Level 1: Due Soon", badgeTone: "warning" };
    case "WITHIN_SLA":
    default:
      return { level: 0, name: "Level 0: Within SLA", badgeTone: "success" };
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
export function evaluateEscalation(complaint, previousStatus = "WITHIN_SLA", reasonOverride = null) {
  // Resolved, Closed, or Rejected complaints do not escalate
  if (["Resolved", "Closed", "Rejected", "Duplicate"].includes(complaint.status)) {
    return null;
  }

  const slaInfo = computeSlaAging(complaint.submittedAt, complaint.priority?.label, complaint.slaHours);
  const escalationInfo = getEscalationLevel(slaInfo.status);

  // If Level 0 (Within SLA), no escalation record needed unless requested
  if (escalationInfo.level === 0) {
    return null;
  }

  const triggeredAt = new Date().toISOString();
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
    reason,
  };
}

/**
 * Evaluates all active complaints and returns new escalation records for unrecorded escalations.
 * 
 * @param {Array} complaints 
 * @param {Array} existingEscalations 
 * @returns {Array} List of new escalation records
 */
export function scanComplaintsForEscalations(complaints = [], existingEscalations = []) {
  const newEscalations = [];

  for (const c of complaints) {
    if (["Resolved", "Closed", "Rejected", "Duplicate"].includes(c.status)) continue;

    const slaInfo = computeSlaAging(c.submittedAt, c.priority?.label, c.slaHours);
    if (slaInfo.status === "WITHIN_SLA") continue;

    const existingForComplaint = existingEscalations.filter((e) => e.complaintId === c.id);
    const highestRecordedLevel = existingForComplaint.reduce((max, e) => Math.max(max, e.escalationLevel || 0), 0);
    const currentEscInfo = getEscalationLevel(slaInfo.status);

    if (currentEscInfo.level > highestRecordedLevel) {
      const record = evaluateEscalation(c, highestRecordedLevel === 0 ? "WITHIN_SLA" : `Level ${highestRecordedLevel}`);
      if (record) {
        newEscalations.push(record);
      }
    }
  }

  return newEscalations;
}
