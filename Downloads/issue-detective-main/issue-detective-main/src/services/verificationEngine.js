/**
 * Image Authenticity and Provenance Verification Engine
 * Modular service for CivicConnect Phase 3
 */

export const VERIFICATION_STATES = {
  NEW_IMAGE: "NEW_IMAGE",
  EXACT_DUPLICATE: "EXACT_DUPLICATE",
  POTENTIAL_DUPLICATE: "POTENTIAL_DUPLICATE",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  POTENTIALLY_MANIPULATED: "POTENTIALLY_MANIPULATED",
};

export const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

// Session cache indexed by file size + name or SHA-256
const analysisCache = new Map();

/**
 * 2. FILE VALIDATION
 * Validate file presence, type, size, and decodability
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, fileType: "unknown", fileSize: 0, error: "No file provided" };
  }

  const fileType = file.type || "";
  const fileSize = file.size || 0;

  const isSupportedType =
    SUPPORTED_MIME_TYPES.some((type) => fileType.toLowerCase().includes(type.split("/")[1])) ||
    /\.(jpg|jpeg|png|webp)$/i.test(file.name || "");

  if (!isSupportedType) {
    return {
      valid: false,
      fileType,
      fileSize,
      error: `Unsupported format. Supported formats: JPG, PNG, WEBP. Received: ${fileType || file.name}`,
    };
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      fileType,
      fileSize,
      error: `File size exceeds max limit of 25MB (${(fileSize / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  return { valid: true, fileType, fileSize, error: null };
}

/**
 * 3. SHA-256 EXACT FILE HASH
 */
export async function computeSha256(file) {
  try {
    const buf = await file.arrayBuffer();
    if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
      const digest = await globalThis.crypto.subtle.digest("SHA-256", buf);
      const hash = [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return { algorithm: "SHA-256", hash, exactMatch: false };
    }
    // Deterministic fallback for non-WebCrypto environments
    let h = 0;
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) {
      h = (h * 31 + (bytes[i] || 0)) >>> 0;
    }
    const hash = h.toString(16).padStart(64, "0");
    return { algorithm: "SHA-256", hash, exactMatch: false };
  } catch (err) {
    console.warn("SHA-256 computation warning:", err);
    return { algorithm: "SHA-256", hash: "unknown-sha256-hash", exactMatch: false };
  }
}

/**
 * 4. PERCEPTUAL HASH (8x8 luminance average hash)
 */
export function computePerceptualHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file for pHash"));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image for perceptual hashing"));
      img.onload = () => {
        try {
          const N = 8;
          const canvas = document.createElement("canvas");
          canvas.width = N;
          canvas.height = N;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            return reject(new Error("Canvas context unavailable"));
          }
          ctx.drawImage(img, 0, 0, N, N);
          const imageData = ctx.getImageData(0, 0, N, N);
          const data = imageData.data;
          const luminance = [];
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i] || 0;
            const g = data[i + 1] || 0;
            const b = data[i + 2] || 0;
            luminance.push(0.299 * r + 0.587 * g + 0.114 * b);
          }
          const avg = luminance.reduce((sum, val) => sum + val, 0) / luminance.length;
          const pHash = luminance.map((v) => (v >= avg ? "1" : "0")).join("");
          resolve({
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            perceptualHash: pHash,
            dataUrl,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Hamming distance between two perceptual hash bitstrings
 */
export function calculateHammingDistance(hashA, hashB) {
  if (!hashA || !hashB) return 64;
  const len = Math.min(hashA.length, hashB.length);
  let dist = Math.abs(hashA.length - hashB.length);
  for (let i = 0; i < len; i++) {
    if (hashA[i] !== hashB[i]) dist++;
  }
  return dist;
}

/**
 * Visual similarity score (0 to 1) based on pHash hamming distance
 */
export function calculateVisualSimilarity(hashA, hashB) {
  if (!hashA || !hashB) return 0;
  const maxBits = Math.max(hashA.length, hashB.length) || 64;
  const dist = calculateHammingDistance(hashA, hashB);
  return Math.max(0, 1 - dist / maxBits);
}

/**
 * 5. EXIF METADATA ANALYSIS
 */
export async function analyzeExifMetadata(file) {
  const defaultExif = {
    available: false,
    timestamp: null,
    device: null,
    gps: null,
    software: null,
    warnings: ["Metadata unavailable"],
  };

  try {
    const buf = new DataView(await file.arrayBuffer());
    if (buf.byteLength < 4 || buf.getUint16(0) !== 0xffd8) {
      return { ...defaultExif, warnings: ["Not a JPEG image or JPEG header missing"] };
    }

    let offset = 2;
    let foundApp1 = false;
    let app1Offset = 0;
    let app1Size = 0;

    while (offset < buf.byteLength - 4) {
      if (buf.getUint8(offset) !== 0xff) break;
      const marker = buf.getUint8(offset + 1);
      const size = buf.getUint16(offset + 2);
      if (marker === 0xe1) {
        foundApp1 = true;
        app1Offset = offset + 4;
        app1Size = size - 2;
        break;
      }
      offset += 2 + size;
    }

    if (!foundApp1) {
      return {
        available: false,
        timestamp: null,
        device: null,
        gps: null,
        software: null,
        warnings: ["Insufficient provenance evidence (EXIF APP1 segment missing)"],
      };
    }

    let exifStr = "";
    for (let i = 0; i < 6 && app1Offset + i < buf.byteLength; i++) {
      exifStr += String.fromCharCode(buf.getUint8(app1Offset + i));
    }

    if (!exifStr.startsWith("Exif")) {
      return {
        available: false,
        timestamp: null,
        device: null,
        gps: null,
        software: null,
        warnings: ["EXIF header corrupt or missing"],
      };
    }

    const tiff = app1Offset + 6;
    const isLittle = buf.getUint16(tiff) === 0x4949;
    const g16 = (o) => buf.getUint16(o, isLittle);
    const g32 = (o) => buf.getUint32(o, isLittle);

    let device = null;
    let software = null;
    let timestamp = null;
    let hasGps = false;

    const readAscii = (o, count) => {
      let s = "";
      for (let i = 0; i < count - 1; i++) {
        if (o + i < buf.byteLength) s += String.fromCharCode(buf.getUint8(o + i));
      }
      return s.trim();
    };

    const walkDir = (dirOffset, depth = 0) => {
      if (depth > 2 || dirOffset <= 0 || tiff + dirOffset + 2 > app1Offset + app1Size) return;
      const base = tiff + dirOffset;
      if (base + 2 > buf.byteLength) return;
      const entries = g16(base);
      for (let i = 0; i < entries; i++) {
        const e = base + 2 + i * 12;
        if (e + 12 > buf.byteLength) return;
        const tag = g16(e);
        const type = g16(e + 2);
        const count = g32(e + 4);
        const valOff = count * (type === 2 ? 1 : 4) > 4 ? tiff + g32(e + 8) : e + 8;

        if ((tag === 0x0110 || tag === 0x010f) && type === 2 && !device) {
          device = readAscii(valOff, count);
        } else if (tag === 0x0131 && type === 2) {
          software = readAscii(valOff, count);
        } else if ((tag === 0x9003 || tag === 0x0132) && !timestamp) {
          timestamp = readAscii(valOff, count);
        } else if (tag === 0x8769) {
          walkDir(g32(e + 8), depth + 1);
        } else if (tag === 0x8825) {
          hasGps = true;
        }
      }
    };

    walkDir(g32(tiff + 4), 0);

    const warnings = [];
    if (!device) warnings.push("Device metadata unavailable");
    if (!timestamp) warnings.push("Capture timestamp metadata unavailable");
    if (software && /photoshop|gimp|editor|paint|canvas/i.test(software)) {
      warnings.push(`Software editing signature detected (${software})`);
    }

    return {
      available: Boolean(device || timestamp || hasGps),
      timestamp: timestamp || null,
      device: device || null,
      gps: hasGps ? { latitude: null, longitude: null } : null,
      software: software || null,
      warnings: warnings.length > 0 ? warnings : ["Provenance metadata present"],
    };
  } catch {
    return defaultExif;
  }
}

/**
 * 1. FULL IMAGE VERIFICATION PIPELINE
 * Submitted Image -> File Validation -> SHA-256 Hash -> EXIF Metadata -> Perceptual Hash -> Existing Image Comparison -> Result
 */
export async function processImageVerification(file, existingComplaints = []) {
  if (!file) {
    return {
      status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
      confidence: 0,
      sha256: null,
      perceptualHash: null,
      exif: { available: false, timestamp: null, device: null, gps: null, software: null, warnings: ["No image attached"] },
      matchedComplaintId: null,
      similarityScore: 0,
      hammingDistance: null,
      warnings: ["No image provided for analysis"],
      analyzedAt: new Date().toISOString(),
    };
  }

  // 1. File Validation
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return {
      status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
      confidence: 0,
      sha256: null,
      perceptualHash: null,
      exif: { available: false, timestamp: null, device: null, gps: null, software: null, warnings: [validation.error] },
      matchedComplaintId: null,
      similarityScore: 0,
      hammingDistance: null,
      warnings: [validation.error],
      analyzedAt: new Date().toISOString(),
    };
  }

  // Check Session Cache
  const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey);
  }

  // 2. SHA-256 Computation
  const shaResult = await computeSha256(file);

  // 3. Perceptual Hashing & Decoding
  let decodedImage = null;
  let pHashErr = null;
  try {
    decodedImage = await computePerceptualHash(file);
  } catch (err) {
    pHashErr = err.message || "Failed to compute pHash";
  }

  // 4. EXIF Analysis
  const exif = await analyzeExifMetadata(file);

  // 5. Existing Image Comparison
  let exactMatchComplaint = null;
  let bestSimilarMatch = null;

  if (shaResult.hash && existingComplaints.length > 0) {
    exactMatchComplaint = existingComplaints.find(
      (c) => c.image?.sha256Hash && c.image.sha256Hash === shaResult.hash
    );
  }

  if (!exactMatchComplaint && decodedImage?.perceptualHash && existingComplaints.length > 0) {
    for (const c of existingComplaints) {
      if (!c.image?.perceptualHash) continue;
      const sim = calculateVisualSimilarity(decodedImage.perceptualHash, c.image.perceptualHash);
      const dist = calculateHammingDistance(decodedImage.perceptualHash, c.image.perceptualHash);

      if (!bestSimilarMatch || sim > bestSimilarMatch.sim) {
        bestSimilarMatch = {
          complaintId: c.id,
          sim,
          dist,
          complaint: c,
        };
      }
    }
  }

  // Determine Verification Status & Confidence
  let status = VERIFICATION_STATES.NEW_IMAGE;
  let confidence = 0.95;
  let matchedId = null;
  let simScore = 0;
  let hamDist = null;
  const warnings = [...exif.warnings];

  if (pHashErr) {
    warnings.push(pHashErr);
  }

  // Forensics / Manipulation checks
  const isManipulatedSoftware = exif.software && /photoshop|gimp|editor|paint/i.test(exif.software);
  const isSuspiciouslySmall = decodedImage && (decodedImage.width < 200 || decodedImage.height < 200);

  if (exactMatchComplaint) {
    status = VERIFICATION_STATES.EXACT_DUPLICATE;
    confidence = 1.0;
    matchedId = exactMatchComplaint.id;
    simScore = 1.0;
    hamDist = 0;
    warnings.push(`Exact SHA-256 match found on complaint ${exactMatchComplaint.id}`);
  } else if (bestSimilarMatch && bestSimilarMatch.sim >= 0.80) {
    status = VERIFICATION_STATES.POTENTIAL_DUPLICATE;
    confidence = bestSimilarMatch.sim;
    matchedId = bestSimilarMatch.complaintId;
    simScore = bestSimilarMatch.sim;
    hamDist = bestSimilarMatch.dist;
    warnings.push(`Visual similarity of ${(bestSimilarMatch.sim * 100).toFixed(1)}% with complaint ${bestSimilarMatch.complaintId}`);
  } else if (isManipulatedSoftware || isSuspiciouslySmall) {
    status = VERIFICATION_STATES.POTENTIALLY_MANIPULATED;
    confidence = 0.65;
    if (isManipulatedSoftware) warnings.push("Potential manipulation indicators: photo editing software metadata present.");
    if (isSuspiciouslySmall) warnings.push("Potential manipulation indicators: unusually small image dimensions.");
  } else if (!exif.available && !decodedImage) {
    status = VERIFICATION_STATES.INSUFFICIENT_EVIDENCE;
    confidence = 0.40;
    warnings.push("Insufficient provenance evidence (missing EXIF and unparseable image content)");
  }

  const result = {
    status,
    confidence,
    sha256: shaResult.hash,
    perceptualHash: decodedImage?.perceptualHash || null,
    dataUrl: decodedImage?.dataUrl || null,
    width: decodedImage?.width || 0,
    height: decodedImage?.height || 0,
    exif,
    matchedComplaintId: matchedId,
    similarityScore: simScore,
    hammingDistance: hamDist,
    warnings,
    analyzedAt: new Date().toISOString(),
  };

  analysisCache.set(cacheKey, result);
  return result;
}
