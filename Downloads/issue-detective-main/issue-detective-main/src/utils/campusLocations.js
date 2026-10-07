/**
 * Centralized Campus Location Coordinates & Location Impact Definitions
 * CivicConnect Phase 4 Utility
 */

export const CAMPUS_LOCATIONS = [
  { name: "CSE Block", lat: 12.9721, lng: 79.1601, baseImpact: 8.5, type: "Academic Building" },
  { name: "AIDS Block", lat: 12.9725, lng: 79.1608, baseImpact: 8.0, type: "Academic Building" },
  { name: "ECE Block", lat: 12.9718, lng: 79.1613, baseImpact: 8.0, type: "Academic Building" },
  { name: "Mechanical Block", lat: 12.971, lng: 79.1595, baseImpact: 7.5, type: "Academic Building" },
  { name: "Library", lat: 12.9729, lng: 79.1592, baseImpact: 9.0, type: "High Traffic Shared Facility" },
  { name: "Laboratory", lat: 12.9716, lng: 79.1606, baseImpact: 7.0, type: "Specialized Academic Zone" },
  { name: "Classroom", lat: 12.9722, lng: 79.1598, baseImpact: 7.5, type: "Academic Area" },
  { name: "Hostel", lat: 12.9738, lng: 79.1619, baseImpact: 9.5, type: "Residential Zone" },
  { name: "Canteen", lat: 12.9731, lng: 79.1611, baseImpact: 9.0, type: "High Traffic Dining Zone" },
  { name: "Parking", lat: 12.9705, lng: 79.1586, baseImpact: 5.5, type: "Vehicle Transit Zone" },
  { name: "Playground", lat: 12.9742, lng: 79.1601, baseImpact: 5.0, type: "Recreational Area" },
  { name: "Auditorium", lat: 12.9727, lng: 79.1583, baseImpact: 7.0, type: "Event Facility" },
  { name: "Washroom", lat: 12.972, lng: 79.1604, baseImpact: 8.0, type: "Essential Sanitation Facility" },
  { name: "Common Area", lat: 12.9724, lng: 79.1596, baseImpact: 6.5, type: "Public Walkway" },
];

export function locationCoords(locationName) {
  const found = CAMPUS_LOCATIONS.find(
    (l) => l.name.toLowerCase() === String(locationName || "").toLowerCase()
  );
  return found || CAMPUS_LOCATIONS[0];
}

export function computeLocationImpact(locationName, nearbyComplaintCount = 0) {
  const loc = locationCoords(locationName);
  const baseScore = loc.baseImpact || 6.0;

  // Add bonus for nearby complaint density in location
  const densityBonus = Math.min(2.0, nearbyComplaintCount * 0.4);
  const finalScore = Math.min(10.0, Math.round((baseScore + densityBonus) * 10) / 10);

  return {
    score: finalScore,
    locationType: loc.type,
    nearbyComplaintCount,
    reasons: [
      `Base location criticality rating for ${loc.name} (${loc.type}): ${baseScore}/10`,
      nearbyComplaintCount > 0
        ? `${nearbyComplaintCount} nearby active complaints increased location impact by +${densityBonus.toFixed(1)} points`
        : "Standard traffic area rating",
    ],
  };
}
