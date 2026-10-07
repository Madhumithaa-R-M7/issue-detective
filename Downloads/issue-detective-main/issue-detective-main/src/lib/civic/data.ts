import { computePriority, routeDepartment } from "./algorithms";
import type { CampusLocation, Complaint, ImageVerification, Staff } from "./types";
import { CAMPUS_LOCATIONS as C_LOCATIONS, locationCoords as locCoords } from "@/utils/campusLocations.js";
import { processComplaintIntelligence } from "@/services/intelligenceSuite.js";

export const CATEGORIES = [
  "Electrical Problem",
  "Water Leakage",
  "Fan / AC Problem",
  "Garbage / Cleanliness",
  "Washroom Problem",
  "Damaged Furniture",
  "Road / Pathway Damage",
  "Streetlight Problem",
  "Wi-Fi / Network Problem",
  "Parking Issue",
  "Safety Issue",
  "Other",
];

export const CAMPUS_LOCATIONS: CampusLocation[] = C_LOCATIONS;

export function locationCoords(name: string) {
  return locCoords(name);
}

export const STAFF: Staff[] = [
  {
    id: "STF-01",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@civicconnect.edu",
    department: "Plumbing / Water Maintenance",
    skills: ["Plumbing", "Pipe Fitting", "Water Leakage", "Sanitation"],
    currentStatus: "Available",
    activeCount: 2,
    maxWorkload: 5,
    latitude: 13.0415,
    longitude: 80.2335,
    avgResponseMinutes: 18,
    resolvedCount: 42,
    rating: 4.8,
    expertise: "Plumbing",
    expertiseScore: 0.95,
    available: true,
    workload: 2,
    distanceKm: 0.8,
  },
  {
    id: "STF-02",
    name: "Suresh Babu",
    email: "suresh.babu@civicconnect.edu",
    department: "Electrical Maintenance",
    skills: ["Electrical", "HVAC", "Wiring", "Lighting"],
    currentStatus: "Available",
    activeCount: 3,
    maxWorkload: 5,
    latitude: 13.0422,
    longitude: 80.2341,
    avgResponseMinutes: 26,
    resolvedCount: 38,
    rating: 4.6,
    expertise: "Electrical",
    expertiseScore: 0.91,
    available: true,
    workload: 3,
    distanceKm: 1.4,
  },
  {
    id: "STF-03",
    name: "Anitha Raj",
    email: "anitha.raj@civicconnect.edu",
    department: "Facilities",
    skills: ["Carpentry", "Furniture Repair", "Locksmith"],
    currentStatus: "Busy",
    activeCount: 5,
    maxWorkload: 5,
    latitude: 13.0405,
    longitude: 80.2322,
    avgResponseMinutes: 41,
    resolvedCount: 29,
    rating: 4.5,
    expertise: "Carpentry",
    expertiseScore: 0.86,
    available: false,
    workload: 5,
    distanceKm: 2.1,
  },
  {
    id: "STF-04",
    name: "Lakshmi Devi",
    email: "lakshmi.devi@civicconnect.edu",
    department: "Housekeeping",
    skills: ["Sanitation", "Waste Management", "Deep Cleaning"],
    currentStatus: "Available",
    activeCount: 2,
    maxWorkload: 6,
    latitude: 13.0418,
    longitude: 80.233,
    avgResponseMinutes: 15,
    resolvedCount: 65,
    rating: 4.9,
    expertise: "Sanitation",
    expertiseScore: 0.93,
    available: true,
    workload: 2,
    distanceKm: 0.5,
  },
  {
    id: "STF-05",
    name: "Karthik S",
    email: "karthik.s@civicconnect.edu",
    department: "IT Support",
    skills: ["Networking", "Wi-Fi", "Hardware", "Router Config"],
    currentStatus: "Available",
    activeCount: 1,
    maxWorkload: 4,
    latitude: 13.0425,
    longitude: 80.235,
    avgResponseMinutes: 22,
    resolvedCount: 51,
    rating: 4.7,
    expertise: "Networking",
    expertiseScore: 0.9,
    available: true,
    workload: 1,
    distanceKm: 1.1,
  },
  {
    id: "STF-06",
    name: "Vijay Prakash",
    email: "vijay.prakash@civicconnect.edu",
    department: "Civil Maintenance",
    skills: ["Civil", "Masonry", "Paving", "Structure"],
    currentStatus: "Available",
    activeCount: 4,
    maxWorkload: 5,
    latitude: 13.0398,
    longitude: 80.2315,
    avgResponseMinutes: 55,
    resolvedCount: 22,
    rating: 4.4,
    expertise: "Civil",
    expertiseScore: 0.88,
    available: true,
    workload: 4,
    distanceKm: 3.2,
  },
  {
    id: "STF-07",
    name: "Mohan Raj",
    email: "mohan.raj@civicconnect.edu",
    department: "Campus Administration",
    skills: ["Campus Security", "Parking Management", "Surveillance"],
    currentStatus: "Available",
    activeCount: 2,
    maxWorkload: 6,
    latitude: 13.043,
    longitude: 80.236,
    avgResponseMinutes: 12,
    resolvedCount: 47,
    rating: 4.8,
    expertise: "Campus Security",
    expertiseScore: 0.84,
    available: true,
    workload: 2,
    distanceKm: 0.3,
  },
  {
    id: "STF-08",
    name: "Priya Dharshini",
    email: "priya.dharshini@civicconnect.edu",
    department: "General Administration",
    skills: ["General Maintenance", "Coordination", "Logistics"],
    currentStatus: "Available",
    activeCount: 1,
    maxWorkload: 5,
    latitude: 13.0412,
    longitude: 80.2328,
    avgResponseMinutes: 25,
    resolvedCount: 30,
    rating: 4.6,
    expertise: "General",
    expertiseScore: 0.85,
    available: true,
    workload: 1,
    distanceKm: 1.0,
  },
];

export const DEPARTMENTS = [
  { name: "Maintenance", subs: ["Plumbing", "Electrical", "Carpentry", "General"], staff: 3 },
  { name: "Housekeeping", subs: ["Sanitation"], staff: 1 },
  { name: "IT Services", subs: ["Networking"], staff: 1 },
  { name: "Civil Works", subs: ["Civil"], staff: 1 },
  { name: "Security", subs: ["Campus Security"], staff: 1 },
];

const SEED: Array<{
  id: string;
  desc: string;
  category: string;
  location: string;
  detail: string;
  day: number;
  status: Complaint["status"];
  student: string;
  ver: ImageVerification["verification"]["status"];
  sim?: number;
  match?: string;
  exif?: boolean;
}> = [
  {
    id: "CIV-00023",
    desc: "Water leakage is occurring from the ceiling near CSE Block, 2nd floor.",
    category: "Water Leakage",
    location: "CSE Block",
    detail: "Room 302 / near staircase",
    day: 15,
    status: "Resolved",
    student: "Madhumithaa R M",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00024",
    desc: "Broken chair in the library reading hall, the backrest is cracked.",
    category: "Damaged Furniture",
    location: "Library",
    detail: "Reading hall, seat 14",
    day: 17,
    status: "Assigned",
    student: "Arjun Nair",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00025",
    desc: "Water dripping from the same ceiling patch near CSE Block second floor.",
    category: "Water Leakage",
    location: "CSE Block",
    detail: "Room 302 / near staircase",
    day: 20,
    status: "In Progress",
    student: "Madhumithaa R M",
    ver: "potential_duplicate",
    sim: 0.88,
    match: "CIV-00023",
    exif: true,
  },
  {
    id: "CIV-00026",
    desc: "Ceiling fan in AIDS Block classroom makes loud noise and wobbles.",
    category: "Fan / AC Problem",
    location: "AIDS Block",
    detail: "Room 105",
    day: 18,
    status: "In Progress",
    student: "Priya Sharma",
    ver: "new",
    exif: false,
  },
  {
    id: "CIV-00027",
    desc: "Garbage bins near the canteen are overflowing and smell badly.",
    category: "Garbage / Cleanliness",
    location: "Canteen",
    detail: "Behind serving counter",
    day: 19,
    status: "Resolved",
    student: "Rahul Verma",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00028",
    desc: "Hostel washroom flush is not working on the third floor.",
    category: "Washroom Problem",
    location: "Hostel",
    detail: "Block B, 3rd floor",
    day: 19,
    status: "Assigned",
    student: "Sneha Iyer",
    ver: "insufficient_evidence",
    exif: false,
  },
  {
    id: "CIV-00029",
    desc: "Wi-Fi signal is very weak in the laboratory, unable to connect.",
    category: "Wi-Fi / Network Problem",
    location: "Laboratory",
    detail: "Lab 2",
    day: 20,
    status: "Submitted",
    student: "Vikram Das",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00030",
    desc: "Same overflowing garbage bin near canteen reported again with same photo.",
    category: "Garbage / Cleanliness",
    location: "Canteen",
    detail: "Behind serving counter",
    day: 20,
    status: "Duplicate",
    student: "Divya M",
    ver: "exact_duplicate",
    sim: 1,
    match: "CIV-00027",
    exif: true,
  },
  {
    id: "CIV-00031",
    desc: "Pathway tiles broken near the mechanical block entrance, risk of tripping.",
    category: "Road / Pathway Damage",
    location: "Mechanical Block",
    detail: "Main entrance",
    day: 16,
    status: "In Progress",
    student: "Ajay Kumar",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00032",
    desc: "Streetlight near the playground is not switching on at night.",
    category: "Streetlight Problem",
    location: "Playground",
    detail: "North gate path",
    day: 14,
    status: "Resolved",
    student: "Meena R",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00033",
    desc: "Two-wheeler parking slots are blocked by construction material.",
    category: "Parking Issue",
    location: "Parking",
    detail: "Slot rows 3-5",
    day: 18,
    status: "Submitted",
    student: "Nikhil P",
    ver: "insufficient_evidence",
    exif: false,
  },
  {
    id: "CIV-00034",
    desc: "Exposed electrical wiring sparking near the ECE Block corridor switchboard.",
    category: "Electrical Problem",
    location: "ECE Block",
    detail: "Ground floor corridor",
    day: 20,
    status: "Under Analysis",
    student: "Harini S",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00035",
    desc: "Hostel corridor light flickering continuously for three days.",
    category: "Electrical Problem",
    location: "Hostel",
    detail: "Block A, 2nd floor",
    day: 17,
    status: "Resolved",
    student: "Sanjay T",
    ver: "new",
    exif: true,
  },
  {
    id: "CIV-00036",
    desc: "Water tap running continuously in hostel washroom, wasting water.",
    category: "Water Leakage",
    location: "Hostel",
    detail: "Block B, ground floor",
    day: 19,
    status: "Assigned",
    student: "Farhan A",
    ver: "potential_duplicate",
    sim: 0.81,
    match: "CIV-00028",
    exif: true,
  },
  {
    id: "CIV-00037",
    desc: "Auditorium AC not cooling during the seminar session.",
    category: "Fan / AC Problem",
    location: "Auditorium",
    detail: "Main hall",
    day: 13,
    status: "Closed",
    student: "Keerthi V",
    ver: "new",
    exif: true,
  },
];

export function severityFor(category: string) {
  const SEVERITY: Record<string, number> = {
    "Safety Issue": 9.5,
    "Electrical Problem": 8.6,
    "Water Leakage": 8,
    "Washroom Problem": 7,
    "Road / Pathway Damage": 7.2,
    "Garbage / Cleanliness": 6.4,
    "Fan / AC Problem": 6,
    "Wi-Fi / Network Problem": 5.4,
    "Damaged Furniture": 5,
    "Streetlight Problem": 6.8,
    "Parking Issue": 4.4,
    Other: 5,
  };
  return SEVERITY[category] ?? 5;
}

function randHash(seed: string, len: number, alphabet = "0123456789abcdef") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  let out = "";
  for (let i = 0; i < len; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    out += alphabet[h % alphabet.length];
  }
  return out;
}

function buildBaseComplaint(s: (typeof SEED)[number]): Complaint {
  const coords = locationCoords(s.location);
  const jitter = (n: number) => (randHash(s.id + n, 1, "0123456789").charCodeAt(0) % 9) * 0.000015;
  const route = routeDepartment(s.category);
  const severity = severityFor(s.category);
  const priority = computePriority({
    severity,
    urgency: Math.min(10, severity - 0.5),
    community: s.location === "Hostel" || s.location === "Canteen" ? 8 : 6,
    location: s.location === "CSE Block" || s.location === "Hostel" ? 8 : 6.5,
    recurrence: s.ver === "new" ? 4 : 7,
    slaAging: Math.min(10, (21 - s.day) * 0.9),
  });
  const submitted = new Date(Date.UTC(2026, 8, s.day, 10, 32));
  const assignable = ["Assigned", "In Progress", "Resolved", "Closed"].includes(s.status);
  const staff = STAFF.find((st) => st.department === route.department && st.expertise === route.sub);

  const sha256Hash = randHash(s.id + "sha", 64);
  const perceptualHash = randHash(s.id + "ph", 64, "01");
  const warnings = s.exif ? ["Provenance metadata present"] : ["Metadata unavailable"];

  const image: ImageVerification = {
    imageUrl: "",
    fileName: `${s.category.split(" ")[0]!.toLowerCase()}_${s.id.slice(-3)}.jpg`,
    fileType: "image/jpeg",
    fileSize: 1_600_000 + (s.day % 7) * 180_000,
    width: 1920,
    height: 1080,
    sha256Hash,
    perceptualHash,
    exif: s.exif
      ? {
          available: true,
          device: "Samsung Galaxy",
          captureDate: `${String(s.day).padStart(2, "0")}-09-2026`,
          captureTime: "10:32 AM",
          timestamp: `2026-09-${String(s.day).padStart(2, "0")} 10:32:00`,
          gpsAvailable: true,
          gps: { latitude: coords.lat, longitude: coords.lng },
          software: "Camera",
          warnings: ["Provenance metadata present"],
        }
      : {
          available: false,
          device: null,
          captureDate: null,
          captureTime: null,
          timestamp: null,
          gpsAvailable: false,
          gps: null,
          software: null,
          warnings: ["Metadata unavailable"],
        },
    verification: {
      exactMatch: s.ver === "exact_duplicate",
      visualSimilarity: s.sim ?? 0.12,
      similarityScore: s.sim ?? 0.12,
      hammingDistance: s.sim ? Math.round((1 - s.sim) * 64) : 41,
      locationDistance: s.match ? 10 : null,
      locationSimilarity: s.match ? 0.95 : 0,
      combinedScore: s.sim ? 0.7 * s.sim + 0.3 * 0.95 : 0,
      status: s.ver,
      matchedComplaintId: s.match ?? null,
      confidence: s.ver === "exact_duplicate" ? 1.0 : s.sim ?? 0.9,
      sha256: sha256Hash,
      perceptualHash,
      warnings,
      analyzedAt: submitted.toISOString(),
    },
  };

  const isPotentialDup = s.ver === "potential_duplicate" || s.ver === "exact_duplicate";
  const duplicateAnalysis = {
    isPotentialDuplicate: isPotentialDup,
    duplicateScore: s.sim ? Math.round((0.7 * s.sim + 0.3 * 0.95) * 100) / 100 : 0.15,
    matchedComplaintId: s.match ?? null,
    textSimilarity: s.sim ? Math.round(s.sim * 0.9 * 100) / 100 : 0.2,
    imageSimilarity: s.sim ?? 0.12,
    locationDistance: s.match ? 10 : 150,
  };

  return {
    id: s.id,
    description: s.desc,
    category: s.category,
    location: s.location,
    detailedLocation: s.detail,
    lat: coords.lat + jitter(1),
    lng: coords.lng + jitter(2),
    submittedAt: submitted.toISOString(),
    status: s.status,
    priority,
    department: route.department,
    subDepartment: route.sub,
    assignedStaffId: assignable && staff ? staff.id : null,
    slaHours: priority.label === "Critical" ? 6 : priority.label === "High" ? 24 : 72,
    resolutionRemarks:
      s.status === "Resolved" || s.status === "Closed"
        ? "Issue inspected on site and rectified. Area cleaned and verified."
        : undefined,
    feedbackRating: s.status === "Closed" ? 5 : undefined,
    studentName: s.student,
    image,
    imageVerification: image.verification as any,
    duplicateAnalysis,
  };
}

const BASE_SEED_COMPLAINTS: Complaint[] = SEED.map(buildBaseComplaint);

// Run Phase 4 Intelligence Suite over seed complaints
export const SEED_COMPLAINTS: Complaint[] = BASE_SEED_COMPLAINTS.map((c, _, arr) => {
  const intel = processComplaintIntelligence(c, arr, STAFF);
  if (!intel) return c;

  return {
    ...c,
    classificationInfo: intel.classificationInfo,
    urgencyInfo: intel.urgencyInfo,
    severityInfo: intel.severityInfo,
    communityImpactInfo: intel.communityImpactInfo,
    geospatialInfo: intel.geospatialInfo as any,
    recurrenceInfo: intel.recurrenceInfo,
    slaAgingInfo: intel.slaAgingInfo,
    priority: {
      ...c.priority,
      severity: intel.priority.severity,
      urgency: intel.priority.urgency,
      community: intel.priority.community,
      location: intel.priority.location,
      recurrence: intel.priority.recurrence,
      slaAging: intel.priority.slaAging,
      overall: intel.priority.overall,
      label: intel.priority.label as any,
    },
    priorityFactors: intel.priorityFactors,
    priorityExplanations: intel.priorityExplanations,
    priorityUpdatedAt: intel.priorityUpdatedAt,
  };
});

export const CURRENT_STUDENT = "Madhumithaa R M";

/* Admin dashboard headline figures include historical records beyond the
   detailed sample set above. */
export const HISTORICAL_TOTALS = {
  total: 248,
  resolved: 145,
  images: 248,
  newImages: 181,
  potentialDuplicates: 42,
  exactDuplicates: 15,
  insufficient: 10,
  slaBreached: 9,
};

export const LOCATION_COMPLAINT_COUNTS: Array<{ location: string; count: number }> = [
  { location: "Hostel", count: 24 },
  { location: "CSE Block", count: 18 },
  { location: "Canteen", count: 12 },
  { location: "ECE Block", count: 9 },
  { location: "Library", count: 5 },
  { location: "Parking", count: 7 },
  { location: "Playground", count: 4 },
  { location: "AIDS Block", count: 11 },
  { location: "Mechanical Block", count: 8 },
  { location: "Auditorium", count: 3 },
];
