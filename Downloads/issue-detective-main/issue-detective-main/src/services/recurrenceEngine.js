/**
 * Recurrence Analysis Engine
 * Detects repeated complaints by category and location proximity within a time window.
 * Modular service for CivicConnect Phase 4
 */

import { calculateHaversineDistanceMeters } from "./geospatialEngine.js";

export const DEFAULT_RECURRENCE_WINDOW_DAYS = 30;

export function analyzeRecurrence(targetComplaint, allComplaints = [], timeWindowDays = DEFAULT_RECURRENCE_WINDOW_DAYS) {
  if (!targetComplaint) {
    return {
      recurrenceCount: 0,
      recurrenceScore: 0,
      relatedComplaintIds: [],
    };
  }

  const windowMs = timeWindowDays * 24 * 60 * 60 * 1000;
  const targetTime = targetComplaint.submittedAt ? new Date(targetComplaint.submittedAt).getTime() : Date.now();

  const relatedMatches = allComplaints.filter((c) => {
    if (c.id === targetComplaint.id) return false;

    // Check Category Match
    const categoryMatch = c.category?.toLowerCase() === targetComplaint.category?.toLowerCase();

    // Check Location Match (by name or GPS proximity within 100 meters)
    const sameName = String(c.location).toLowerCase() === String(targetComplaint.location).toLowerCase();
    const isNearby =
      typeof c.lat === "number" &&
      typeof targetComplaint.lat === "number" &&
      calculateHaversineDistanceMeters(targetComplaint, { lat: c.lat, lng: c.lng }) <= 100;

    const locationMatch = sameName || isNearby;

    // Check Time Window
    const cTime = c.submittedAt ? new Date(c.submittedAt).getTime() : 0;
    const withinWindow = Math.abs(targetTime - cTime) <= windowMs;

    return categoryMatch && locationMatch && withinWindow;
  });

  const recurrenceCount = relatedMatches.length;

  // Scale score: 0 related -> 0, 1 related -> 4, 2 related -> 7, 3+ related -> 10
  let recurrenceScore = 0;
  if (recurrenceCount === 1) recurrenceScore = 4.0;
  else if (recurrenceCount === 2) recurrenceScore = 7.0;
  else if (recurrenceCount >= 3) recurrenceScore = 10.0;

  return {
    recurrenceCount,
    recurrenceScore,
    relatedComplaintIds: relatedMatches.map((c) => c.id),
  };
}
