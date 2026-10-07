/**
 * SLA Configuration File (Centrally Managed)
 * 
 * IMPORTANT: These are prototype configuration values used for testing
 * platform SLA monitoring and escalation logic.
 * They are NOT official college policies.
 */

export const SLA_CONFIG = {
  // Prototype SLA durations by Priority Level (in hours)
  durations: {
    Critical: 4,
    High: 12,
    Medium: 24,
    Low: 72,
  },

  // SLA Thresholds (% of SLA duration consumed)
  thresholds: {
    withinSlaMaxPercent: 70, // 0 - 70% consumed -> WITHIN_SLA
    dueSoonMaxPercent: 100,  // 70 - 100% consumed -> DUE_SOON
                             // 100%+ consumed -> OVERDUE
  },

  // Escalation Levels
  escalationLevels: {
    LEVEL_0_WITHIN_SLA: { level: 0, label: "Level 0: Within SLA", status: "WITHIN_SLA" },
    LEVEL_1_DUE_SOON:   { level: 1, label: "Level 1: Due Soon", status: "DUE_SOON" },
    LEVEL_2_OVERDUE:    { level: 2, label: "Level 2: Overdue", status: "OVERDUE" },
    LEVEL_3_BREACHED:   { level: 3, label: "Level 3: SLA Breached", status: "BREACHED" },
  },

  // Prototype Disclaimer Label
  disclaimer: "Prototype / Demo SLA Configuration Values",
};

/**
 * Gets SLA duration in hours for a priority label.
 * @param {string} priority 
 * @returns {number}
 */
export function getSlaDurationHours(priority = "Medium") {
  return SLA_CONFIG.durations[priority] || SLA_CONFIG.durations.Medium;
}
