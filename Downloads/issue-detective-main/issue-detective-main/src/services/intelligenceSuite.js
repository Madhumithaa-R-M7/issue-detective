/**
 * Unified Civic Intelligence Suite
 * Combines Classification, Urgency, Severity, Geospatial, Recurrence, SLA, Priority, Routing, and MCDM Staff Assignment.
 * Modular pipeline for CivicConnect Phase 5
 */

import { classifyComplaint } from "./classificationEngine.js";
import { analyzeUrgency } from "./urgencyEngine.js";
import { calculateSeverity } from "./severityEngine.js";
import { getComplaintGeospatialInfo } from "./geospatialEngine.js";
import { analyzeRecurrence } from "./recurrenceEngine.js";
import { computeSlaAging } from "./slaEngine.js";
import { computeCivicPriority } from "./priorityEngine.js";
import { routeComplaint, assignStaff } from "./mcdmRouter.js";

/**
 * COMPLAINT CREATION & RECALCULATION PIPELINE
 */
export function processComplaintIntelligence(complaint, allComplaints = [], staffList = []) {
  if (!complaint) return null;

  // 1. Classification
  const classification = classifyComplaint(complaint.description);
  const finalCategory = complaint.category || classification.category;

  // 2. Urgency
  const urgencyInfo = analyzeUrgency(complaint.description);

  // 3. Severity
  const severityInfo = calculateSeverity(finalCategory, complaint.description);

  // 4. Geospatial & Location Impact
  const geoInfo = getComplaintGeospatialInfo(complaint, allComplaints);

  // 5. Community Impact: C = 10 * min(n / 20, 1)
  const relatedCount = geoInfo.nearbyComplaintCount || 1;
  const communityImpactScore = Math.min(10.0, Math.round((10 * Math.min(relatedCount / 20, 1)) * 10) / 10);

  // 6. Recurrence Analysis
  const recurrenceInfo = analyzeRecurrence(complaint, allComplaints);

  // 7. SLA Aging Calculation
  const slaAgingInfo = computeSlaAging(complaint.submittedAt, "Medium");

  // 8. Weighted Civic Priority Score
  const priorityRes = computeCivicPriority({
    severity: severityInfo.score,
    urgency: urgencyInfo.urgencyScore,
    communityImpact: communityImpactScore,
    locationImpact: geoInfo.locationImpactScore,
    recurrence: recurrenceInfo.recurrenceScore,
    slaAging: slaAgingInfo.agingScore,
  });

  // 9. Department Routing & MCDM Staff Assignment (Phase 5)
  const routingRes = routeComplaint({ ...complaint, category: finalCategory });
  const assignmentRes = assignStaff(
    { ...complaint, category: finalCategory, department: routingRes.department },
    staffList,
    routingRes.department
  );

  const timestamp = complaint.submittedAt || new Date().toISOString();

  const initialRoutingHistory = complaint.routingHistory || [
    {
      department: routingRes.department,
      routedAt: routingRes.routedAt || timestamp,
      routedBy: "Automated Taxonomy Engine",
      method: routingRes.routingMethod,
      reason: routingRes.routingReason,
    },
  ];

  const initialAssignmentHistory =
    complaint.assignmentHistory ||
    (assignmentRes.assignedStaffId
      ? [
          {
            staffId: assignmentRes.assignedStaffId,
            staffName: assignmentRes.assignedStaffName,
            department: routingRes.department,
            assignedAt: assignmentRes.assignedAt || timestamp,
            assignedBy: "Automated MCDM Engine",
            method: assignmentRes.assignmentMethod || "MCDM",
            mcdmScore: assignmentRes.mcdmScore,
            factors: assignmentRes.factors,
            reason: `Assigned via MCDM score (${assignmentRes.mcdmScore}/10)`,
          },
        ]
      : []);

  return {
    classificationInfo: {
      predictedCategory: classification.category,
      predictionConfidence: classification.confidence,
      finalCategory,
      classificationMethod: classification.method,
      modelType: classification.modelType,
    },
    urgencyInfo,
    severityInfo,
    communityImpactInfo: {
      affectedCount: relatedCount,
      score: communityImpactScore,
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
      label: priorityRes.level,
    },
    priorityFactors: priorityRes.factors,
    priorityExplanations: priorityRes.explanations,
    priorityUpdatedAt: new Date().toISOString(),

    // Phase 5 Routing & Assignment Standard Objects
    routing: {
      department: routingRes.department,
      method: routingRes.routingMethod,
      reason: routingRes.routingReason,
      routedAt: routingRes.routedAt || timestamp,
    },
    assignment: {
      staffId: assignmentRes.assignedStaffId,
      staffName: assignmentRes.assignedStaffName,
      department: routingRes.department,
      method: assignmentRes.assignmentMethod || "MCDM",
      mcdmScore: assignmentRes.mcdmScore,
      assignedAt: assignmentRes.assignedAt || timestamp,
    },
    assignmentStatus: assignmentRes.status,
    assignmentFactors: assignmentRes.factors,
    routingInfo: routingRes,
    assignmentInfo: assignmentRes,
    routingHistory: initialRoutingHistory,
    assignmentHistory: initialAssignmentHistory,
  };
}

