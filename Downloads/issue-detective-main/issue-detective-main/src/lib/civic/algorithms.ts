import {
  computeSha256,
  computePerceptualHash,
  calculateHammingDistance,
  calculateVisualSimilarity,
  analyzeExifMetadata,
} from "../../services/verificationEngine.js";
import {
  haversineDistanceMeters,
  computeLocationSimilarity,
  computeDuplicateScore as calcDuplicateScore,
  computeTextSimilarity,
  computeCnnFeatureSimilarity,
  computeCategorySimilarity,
  tokenizeText,
  DUPLICATE_THRESHOLD,
  DEFAULT_WEIGHTS,
} from "../../services/duplicateEngine.js";
import {
  computePriorityScore,
  getPriorityLabel,
  PRIORITY_WEIGHTS as P_WEIGHTS,
} from "../../services/priorityEngine.js";
import {
  getDepartmentRoute,
  computeStaffMcdmScore,
  rankStaffByMcdm,
  DEPARTMENT_ROUTING_MAP,
} from "../../services/mcdmRouter.js";
import type { ExifData, PriorityBreakdown, PriorityLabel, SlaStatus, Staff } from "./types";

/* Re-export Constants */
export const PHASH_SIMILARITY_THRESHOLD = 0.8;
export const HAMMING_THRESHOLD = 14;
export const DUPLICATE_SCORE_THRESHOLD = DUPLICATE_THRESHOLD; // 0.80
export const FIVE_FACTOR_WEIGHTS = DEFAULT_WEIGHTS;

/* SHA-256 File Hash */
export async function sha256OfFile(file: File): Promise<string> {
  const result = await computeSha256(file);
  return result.hash;
}

/* Perceptual Hash (8x8 Luminance) */
export interface DecodedImage {
  width: number;
  height: number;
  phash: string;
  dataUrl: string;
}

export async function decodeAndHashImage(file: File): Promise<DecodedImage> {
  const res = await computePerceptualHash(file);
  return {
    width: res.width,
    height: res.height,
    phash: res.perceptualHash,
    dataUrl: res.dataUrl,
  };
}

/* Hamming distance and Visual Similarity */
export function hammingDistance(a: string, b: string): number {
  return calculateHammingDistance(a, b);
}

export function visualSimilarity(a: string, b: string): number {
  return calculateVisualSimilarity(a, b);
}

/* EXIF Extraction */
export async function extractExif(file: File): Promise<ExifData> {
  const res = await analyzeExifMetadata(file);
  return {
    device: res.device,
    captureDate: res.timestamp ? res.timestamp.split(" ")[0] || null : null,
    captureTime: res.timestamp ? res.timestamp.split(" ")[1] || null : null,
    gpsAvailable: Boolean(res.gps),
    software: res.software,
    warnings: res.warnings,
  };
}

/* Haversine Distance (metres) & Location Similarity */
export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  return haversineDistanceMeters(a, b);
}

export function locationSimilarity(meters: number): number {
  return computeLocationSimilarity(meters);
}

/* 5-Factor Duplicate Assessment */
export const W_IMAGE = 0.7;
export const W_GEO = 0.3;

export function cnnSimilarity(imgA: any, imgB: any): number {
  return computeCnnFeatureSimilarity(imgA, imgB);
}

export function categorySimilarity(catA: string, catB: string): number {
  return computeCategorySimilarity(catA, catB);
}

export function duplicateScore(factorsOrImgSim: any, geoSimOrWeights?: any): number {
  return calcDuplicateScore(factorsOrImgSim, geoSimOrWeights);
}

/* Priority Scoring */
export const PRIORITY_WEIGHTS = P_WEIGHTS;

export function priorityLabel(score: number): PriorityLabel {
  return getPriorityLabel(score) as PriorityLabel;
}

export function computePriority(
  input: Omit<PriorityBreakdown, "overall" | "label">
): PriorityBreakdown {
  return computePriorityScore(input) as PriorityBreakdown;
}

/* MCDM Staff Scoring */
export function staffScore(s: Staff): number {
  return computeStaffMcdmScore(s);
}

export function rankStaff(staff: Staff[], department: string): Array<Staff & { score: number }> {
  return rankStaffByMcdm(staff, department) as Array<Staff & { score: number }>;
}

/* DBSCAN Hotspot Clustering */
export interface GeoPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

export function dbscan(points: GeoPoint[], epsMeters = 60, minPts = 3): GeoPoint[][] {
  const visited = new Set<string>();
  const clustered = new Set<string>();
  const clusters: GeoPoint[][] = [];
  const neighbours = (p: GeoPoint) =>
    points.filter((q) => haversineMeters(p, q) <= epsMeters && q.id !== p.id);

  for (const p of points) {
    if (visited.has(p.id)) continue;
    visited.add(p.id);
    const n = neighbours(p);
    if (n.length + 1 < minPts) continue;
    const cluster: GeoPoint[] = [p];
    clustered.add(p.id);
    const queue = [...n];
    while (queue.length) {
      const q = queue.shift()!;
      if (!visited.has(q.id)) {
        visited.add(q.id);
        const qn = neighbours(q);
        if (qn.length + 1 >= minPts) queue.push(...qn.filter((x) => !visited.has(x.id)));
      }
      if (!clustered.has(q.id)) {
        clustered.add(q.id);
        cluster.push(q);
      }
    }
    clusters.push(cluster);
  }
  return clusters.sort((a, b) => b.length - a.length);
}

/* Category Classification & Text Similarity */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Water Leakage": ["water", "leak", "leakage", "pipe", "tap", "drip", "ceiling", "seepage"],
  "Electrical Problem": ["light", "socket", "switch", "power", "electric", "shock", "wiring"],
  "Fan / AC Problem": ["fan", "ac", "air", "cooling", "noise", "blade"],
  "Garbage / Cleanliness": ["garbage", "trash", "waste", "dirty", "clean", "smell", "dustbin"],
  "Washroom Problem": ["washroom", "toilet", "restroom", "flush", "basin", "urinal"],
  "Damaged Furniture": ["chair", "bench", "desk", "table", "broken", "furniture"],
  "Road / Pathway Damage": ["road", "pathway", "pothole", "tile", "walkway", "pavement"],
  "Streetlight Problem": ["streetlight", "lamp", "pole", "dark", "street"],
  "Wi-Fi / Network Problem": ["wifi", "wi-fi", "network", "internet", "router", "signal"],
  "Parking Issue": ["parking", "vehicle", "bike", "car", "slot"],
  "Safety Issue": ["safety", "fire", "hazard", "danger", "unsafe", "cctv"],
};

export function tokenize(text: string): string[] {
  return tokenizeText(text);
}

export function classifyCategory(text: string): { category: string; confidence: number } {
  const tokens = tokenize(text);
  let best = "Other";
  let bestScore = 0;
  for (const [cat, keys] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = tokens.reduce((acc, t) => acc + (keys.includes(t) ? 1 : 0), 0) / keys.length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return { category: best, confidence: Math.min(0.99, 0.55 + bestScore * 2.5) };
}

export function cosineSimilarity(a: string, b: string): number {
  return computeTextSimilarity(a, b).similarity;
}

/* Department Routing */
export const DEPARTMENT_ROUTING = DEPARTMENT_ROUTING_MAP;

export function routeDepartment(category: string) {
  const route = getDepartmentRoute(category);
  return { department: route.department, sub: route.subDepartment };
}

/* SLA Info */
export function calculateSlaInfo(submittedAt: string, slaHours: number) {
  const submitted = new Date(submittedAt).getTime();
  const now = Date.now();
  const elapsedMs = Math.max(0, now - submitted);
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const hoursLeft = Math.round((slaHours - elapsedHours) * 10) / 10;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedHours / slaHours) * 100)));

  let status: SlaStatus = "On Track";
  if (hoursLeft < 0) {
    status = hoursLeft < -24 ? "Escalated" : "SLA Breached";
  } else if (hoursLeft <= Math.max(2, slaHours * 0.25)) {
    status = "Due Soon";
  }

  return {
    elapsedHours: Math.round(elapsedHours * 10) / 10,
    hoursLeft,
    progressPercent,
    status,
  };
}
