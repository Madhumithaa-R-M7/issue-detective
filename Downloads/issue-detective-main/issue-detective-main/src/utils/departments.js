/**
 * Centralized Department Configuration
 * CivicConnect Phase 5 Utility
 */

export const DEPARTMENTS = [
  {
    id: "DEP-PLUMBING",
    name: "Plumbing / Water Maintenance",
    categories: ["Water Leakage", "Washroom Problem"],
    location: "Main Facilities Building, Block 1",
    active: true,
    slaHours: 24,
  },
  {
    id: "DEP-ELECTRICAL",
    name: "Electrical Maintenance",
    categories: ["Electrical Problem", "Fan / AC Problem", "Fan/AC Problem", "Streetlight Problem"],
    location: "Power Substation Building",
    active: true,
    slaHours: 12,
  },
  {
    id: "DEP-IT",
    name: "IT Support",
    categories: ["Wi-Fi / Network Problem", "Wi-Fi/Network Issue"],
    location: "IT Center, Room 101",
    active: true,
    slaHours: 24,
  },
  {
    id: "DEP-HOUSEKEEPING",
    name: "Housekeeping",
    categories: ["Garbage / Cleanliness"],
    location: "Central Store & Sanitation Office",
    active: true,
    slaHours: 24,
  },
  {
    id: "DEP-FACILITIES",
    name: "Facilities",
    categories: ["Damaged Furniture"],
    location: "Carpentry & Workshop Yard",
    active: true,
    slaHours: 48,
  },
  {
    id: "DEP-CIVIL",
    name: "Civil Maintenance",
    categories: ["Road / Pathway Damage"],
    location: "Civil Works Office",
    active: true,
    slaHours: 48,
  },
  {
    id: "DEP-SECURITY",
    name: "Campus Administration",
    categories: ["Parking Issue", "Safety Issue"],
    location: "Main Security Gate House",
    active: true,
    slaHours: 12,
  },
  {
    id: "DEP-GENERAL",
    name: "General Administration",
    categories: ["Other"],
    location: "Administrative Block",
    active: true,
    slaHours: 72,
  },
];

export function getDepartmentByCategory(category = "") {
  const norm = String(category).toLowerCase();
  const found = DEPARTMENTS.find((dept) =>
    dept.categories.some((cat) => cat.toLowerCase() === norm)
  );
  return found || DEPARTMENTS[DEPARTMENTS.length - 1]; // Fallback to General Administration
}

export function getDepartmentById(id = "") {
  return DEPARTMENTS.find((d) => d.id === id) || null;
}
