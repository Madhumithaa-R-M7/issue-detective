/**
 * Geospatial Engine (Haversine Distance & DBSCAN Spatial Hotspot Clustering)
 * Modular service for CivicConnect Phase 4
 */

import { computeLocationImpact } from "../utils/campusLocations.js";

/**
 * 6. HAVERSINE DISTANCE FORMULA
 * Calculates exact great-circle distance between two GPS coordinates in meters.
 */
export function calculateHaversineDistanceMeters(coordA, coordB) {
  if (!coordA || !coordB || typeof coordA.lat !== "number" || typeof coordB.lat !== "number") {
    return Infinity;
  }

  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const phi1 = toRad(coordA.lat);
  const phi2 = toRad(coordB.lat);
  const deltaPhi = toRad(coordB.lat - coordA.lat);
  const deltaLambda = toRad(coordB.lng - coordA.lng);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * 10. DBSCAN HOTSPOT DETECTION
 * Density-Based Spatial Clustering of Applications with Noise operating on Haversine geographic distances in meters.
 */
export function runDbscanClustering(complaints = [], epsMeters = 80, minPts = 2) {
  const points = complaints
    .filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
    .map((c) => ({
      id: c.id,
      lat: c.lat,
      lng: c.lng,
      category: c.category,
      location: c.location,
      priority: c.priority?.overall || 5,
      complaint: c,
    }));

  const visited = new Set();
  const clustered = new Set();
  const clusters = [];

  const getNeighbours = (point) =>
    points.filter(
      (q) => q.id !== point.id && calculateHaversineDistanceMeters(point, q) <= epsMeters
    );

  for (const p of points) {
    if (visited.has(p.id)) continue;
    visited.add(p.id);

    const neighbours = getNeighbours(p);
    if (neighbours.length + 1 < minPts) continue;

    const clusterPoints = [p];
    clustered.add(p.id);
    const queue = [...neighbours];

    while (queue.length > 0) {
      const q = queue.shift();
      if (!visited.has(q.id)) {
        visited.add(q.id);
        const qNeighbours = getNeighbours(q);
        if (qNeighbours.length + 1 >= minPts) {
          queue.push(...qNeighbours.filter((x) => !visited.has(x.id)));
        }
      }

      if (!clustered.has(q.id)) {
        clustered.add(q.id);
        clusterPoints.push(q);
      }
    }

    const totalLat = clusterPoints.reduce((sum, pt) => sum + pt.lat, 0);
    const totalLng = clusterPoints.reduce((sum, pt) => sum + pt.lng, 0);
    const centroid = {
      lat: totalLat / clusterPoints.length,
      lng: totalLng / clusterPoints.length,
    };

    // Category frequency
    const catCounts = {};
    clusterPoints.forEach((pt) => {
      catCounts[pt.category] = (catCounts[pt.category] || 0) + 1;
    });
    const mainCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";
    const avgPriority =
      Math.round(
        (clusterPoints.reduce((sum, pt) => sum + pt.priority, 0) / clusterPoints.length) * 10
      ) / 10;

    clusters.push({
      clusterId: `CLUSTER-${clusters.length + 1}`,
      isHotspot: clusterPoints.length >= minPts,
      nearbyComplaintCount: clusterPoints.length,
      centroid,
      mainCategory,
      avgPriority,
      locationName: clusterPoints[0]?.location || "Campus Zone",
      relatedComplaintIds: clusterPoints.map((pt) => pt.id),
      points: clusterPoints,
    });
  }

  return clusters.sort((a, b) => b.nearbyComplaintCount - a.nearbyComplaintCount);
}

/**
 * Find cluster info for a specific complaint
 */
export function getComplaintGeospatialInfo(complaint, allComplaints = [], epsMeters = 80, minPts = 2) {
  if (!complaint || typeof complaint.lat !== "number") {
    return {
      distanceMeters: null,
      locationImpactScore: 5.0,
      clusterId: null,
      isHotspot: false,
      nearbyComplaintCount: 0,
      centroid: null,
      reasons: ["GPS coordinates unavailable; using fallback location score."],
    };
  }

  const clusters = runDbscanClustering(allComplaints, epsMeters, minPts);
  const activeCluster = clusters.find((cl) => cl.relatedComplaintIds.includes(complaint.id));

  const nearbyComplaints = allComplaints.filter(
    (c) =>
      c.id !== complaint.id &&
      typeof c.lat === "number" &&
      calculateHaversineDistanceMeters(complaint, { lat: c.lat, lng: c.lng }) <= epsMeters
  );

  const locImpact = computeLocationImpact(complaint.location, nearbyComplaints.length);

  return {
    distanceMeters: activeCluster ? calculateHaversineDistanceMeters(complaint, activeCluster.centroid) : 0,
    locationImpactScore: locImpact.score,
    locationType: locImpact.locationType,
    clusterId: activeCluster?.clusterId || null,
    isHotspot: Boolean(activeCluster),
    nearbyComplaintCount: nearbyComplaints.length + 1,
    centroid: activeCluster?.centroid || { lat: complaint.lat, lng: complaint.lng },
    reasons: locImpact.reasons,
  };
}
