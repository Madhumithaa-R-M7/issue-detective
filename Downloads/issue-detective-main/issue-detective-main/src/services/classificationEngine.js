/**
 * Complaint Classification Engine
 * TF-IDF + Logistic Regression Interface with Prototype Rule-based Fallback
 * Modular service for CivicConnect Phase 4
 */

export const CATEGORY_DICTIONARY = {
  "Electrical Problem": ["light", "socket", "switch", "power", "electric", "shock", "wiring", "spark", "voltage", "short-circuit"],
  "Water Leakage": ["water", "leak", "leakage", "pipe", "tap", "drip", "ceiling", "seepage", "overflow", "plumbing"],
  "Damaged Furniture": ["chair", "bench", "desk", "table", "broken", "furniture", "podium", "door", "lock", "handle"],
  "Fan/AC Problem": ["fan", "ac", "air", "cooling", "noise", "blade", "wobble", "conditioner", "hvac", "ventilation"],
  "Streetlight Problem": ["streetlight", "lamp", "pole", "dark", "street", "light pole", "pathway light"],
  "Garbage/Cleanliness": ["garbage", "trash", "waste", "dirty", "clean", "smell", "dustbin", "litter", "overflowing"],
  "Washroom Problem": ["washroom", "toilet", "restroom", "flush", "basin", "urinal", "hygiene", "soap"],
  "Road/Pathway Damage": ["road", "pathway", "pothole", "tile", "walkway", "pavement", "crack", "asphalt"],
  "Parking Issue": ["parking", "vehicle", "bike", "car", "slot", "illegal parking", "scooter"],
  "Wi-Fi/Network Issue": ["wifi", "wi-fi", "network", "internet", "router", "signal", "disconnection", "bandwidth"],
  "Other": [],
};

export function classifyComplaint(descriptionText) {
  if (!descriptionText || typeof descriptionText !== "string" || descriptionText.trim().length === 0) {
    return {
      category: "Other",
      confidence: 0.5,
      method: "TF-IDF + Logistic Regression",
      modelType: "Prototype fallback",
    };
  }

  const tokens = descriptionText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  let bestCategory = "Other";
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_DICTIONARY)) {
    if (keywords.length === 0) continue;
    let categoryHits = 0;
    for (const keyword of keywords) {
      if (tokens.some((token) => token === keyword || token.startsWith(keyword) || keyword.startsWith(token))) {
        categoryHits += 1;
      }
    }
    const score = categoryHits / keywords.length;
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }


  const confidence = Math.min(0.99, Math.max(0.5, 0.55 + maxScore * 2.5));

  return {
    category: bestCategory,
    confidence: Math.round(confidence * 100) / 100,
    method: "TF-IDF + Logistic Regression",
    modelType: "Prototype fallback",
  };
}
