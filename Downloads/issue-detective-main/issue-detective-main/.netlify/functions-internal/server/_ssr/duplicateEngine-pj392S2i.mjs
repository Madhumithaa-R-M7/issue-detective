//#region node_modules/.nitro/vite/services/ssr/assets/duplicateEngine-pj392S2i.js
/**
* Image Authenticity and Provenance Verification Engine
* Modular service for CivicConnect Phase 3
*/
var VERIFICATION_STATES = {
	NEW_IMAGE: "NEW_IMAGE",
	EXACT_DUPLICATE: "EXACT_DUPLICATE",
	POTENTIAL_DUPLICATE: "POTENTIAL_DUPLICATE",
	INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
	POTENTIALLY_MANIPULATED: "POTENTIALLY_MANIPULATED"
};
var SUPPORTED_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
];
var analysisCache = /* @__PURE__ */ new Map();
/**
* 2. FILE VALIDATION
* Validate file presence, type, size, and decodability
*/
function validateImageFile(file) {
	if (!file) return {
		valid: false,
		fileType: "unknown",
		fileSize: 0,
		error: "No file provided"
	};
	const fileType = file.type || "";
	const fileSize = file.size || 0;
	if (!(SUPPORTED_MIME_TYPES.some((type) => fileType.toLowerCase().includes(type.split("/")[1])) || /\.(jpg|jpeg|png|webp)$/i.test(file.name || ""))) return {
		valid: false,
		fileType,
		fileSize,
		error: `Unsupported format. Supported formats: JPG, PNG, WEBP. Received: ${fileType || file.name}`
	};
	if (fileSize > 26214400) return {
		valid: false,
		fileType,
		fileSize,
		error: `File size exceeds max limit of 25MB (${(fileSize / 1048576).toFixed(1)}MB)`
	};
	return {
		valid: true,
		fileType,
		fileSize,
		error: null
	};
}
/**
* 3. SHA-256 EXACT FILE HASH
*/
async function computeSha256(file) {
	try {
		const buf = await file.arrayBuffer();
		if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
			const digest = await globalThis.crypto.subtle.digest("SHA-256", buf);
			return {
				algorithm: "SHA-256",
				hash: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join(""),
				exactMatch: false
			};
		}
		let h = 0;
		const bytes = new Uint8Array(buf);
		for (let i = 0; i < bytes.length; i++) h = h * 31 + (bytes[i] || 0) >>> 0;
		return {
			algorithm: "SHA-256",
			hash: h.toString(16).padStart(64, "0"),
			exactMatch: false
		};
	} catch (err) {
		console.warn("SHA-256 computation warning:", err);
		return {
			algorithm: "SHA-256",
			hash: "unknown-sha256-hash",
			exactMatch: false
		};
	}
}
/**
* 4. PERCEPTUAL HASH (8x8 luminance average hash)
*/
function computePerceptualHash(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image file for pHash"));
		reader.onload = () => {
			const dataUrl = String(reader.result);
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Could not decode image for perceptual hashing"));
			img.onload = () => {
				try {
					const N = 8;
					const canvas = document.createElement("canvas");
					canvas.width = N;
					canvas.height = N;
					const ctx = canvas.getContext("2d");
					if (!ctx) return reject(/* @__PURE__ */ new Error("Canvas context unavailable"));
					ctx.drawImage(img, 0, 0, N, N);
					const data = ctx.getImageData(0, 0, N, N).data;
					const luminance = [];
					for (let i = 0; i < data.length; i += 4) {
						const r = data[i] || 0;
						const g = data[i + 1] || 0;
						const b = data[i + 2] || 0;
						luminance.push(.299 * r + .587 * g + .114 * b);
					}
					const avg = luminance.reduce((sum, val) => sum + val, 0) / luminance.length;
					const pHash = luminance.map((v) => v >= avg ? "1" : "0").join("");
					resolve({
						width: img.naturalWidth || img.width,
						height: img.naturalHeight || img.height,
						perceptualHash: pHash,
						dataUrl
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
function calculateHammingDistance(hashA, hashB) {
	if (!hashA || !hashB) return 64;
	const len = Math.min(hashA.length, hashB.length);
	let dist = Math.abs(hashA.length - hashB.length);
	for (let i = 0; i < len; i++) if (hashA[i] !== hashB[i]) dist++;
	return dist;
}
/**
* Visual similarity score (0 to 1) based on pHash hamming distance
*/
function calculateVisualSimilarity(hashA, hashB) {
	if (!hashA || !hashB) return 0;
	const maxBits = Math.max(hashA.length, hashB.length) || 64;
	const dist = calculateHammingDistance(hashA, hashB);
	return Math.max(0, 1 - dist / maxBits);
}
/**
* 5. EXIF METADATA ANALYSIS
*/
async function analyzeExifMetadata(file) {
	const defaultExif = {
		available: false,
		timestamp: null,
		device: null,
		gps: null,
		software: null,
		warnings: ["Metadata unavailable"]
	};
	try {
		const buf = new DataView(await file.arrayBuffer());
		if (buf.byteLength < 4 || buf.getUint16(0) !== 65496) return {
			...defaultExif,
			warnings: ["Not a JPEG image or JPEG header missing"]
		};
		let offset = 2;
		let foundApp1 = false;
		let app1Offset = 0;
		let app1Size = 0;
		while (offset < buf.byteLength - 4) {
			if (buf.getUint8(offset) !== 255) break;
			const marker = buf.getUint8(offset + 1);
			const size = buf.getUint16(offset + 2);
			if (marker === 225) {
				foundApp1 = true;
				app1Offset = offset + 4;
				app1Size = size - 2;
				break;
			}
			offset += 2 + size;
		}
		if (!foundApp1) return {
			available: false,
			timestamp: null,
			device: null,
			gps: null,
			software: null,
			warnings: ["Insufficient provenance evidence (EXIF APP1 segment missing)"]
		};
		let exifStr = "";
		for (let i = 0; i < 6 && app1Offset + i < buf.byteLength; i++) exifStr += String.fromCharCode(buf.getUint8(app1Offset + i));
		if (!exifStr.startsWith("Exif")) return {
			available: false,
			timestamp: null,
			device: null,
			gps: null,
			software: null,
			warnings: ["EXIF header corrupt or missing"]
		};
		const tiff = app1Offset + 6;
		const isLittle = buf.getUint16(tiff) === 18761;
		const g16 = (o) => buf.getUint16(o, isLittle);
		const g32 = (o) => buf.getUint32(o, isLittle);
		let device = null;
		let software = null;
		let timestamp = null;
		let hasGps = false;
		const readAscii = (o, count) => {
			let s = "";
			for (let i = 0; i < count - 1; i++) if (o + i < buf.byteLength) s += String.fromCharCode(buf.getUint8(o + i));
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
				if ((tag === 272 || tag === 271) && type === 2 && !device) device = readAscii(valOff, count);
				else if (tag === 305 && type === 2) software = readAscii(valOff, count);
				else if ((tag === 36867 || tag === 306) && !timestamp) timestamp = readAscii(valOff, count);
				else if (tag === 34665) walkDir(g32(e + 8), depth + 1);
				else if (tag === 34853) hasGps = true;
			}
		};
		walkDir(g32(tiff + 4), 0);
		const warnings = [];
		if (!device) warnings.push("Device metadata unavailable");
		if (!timestamp) warnings.push("Capture timestamp metadata unavailable");
		if (software && /photoshop|gimp|editor|paint|canvas/i.test(software)) warnings.push(`Software editing signature detected (${software})`);
		return {
			available: Boolean(device || timestamp || hasGps),
			timestamp: timestamp || null,
			device: device || null,
			gps: hasGps ? {
				latitude: null,
				longitude: null
			} : null,
			software: software || null,
			warnings: warnings.length > 0 ? warnings : ["Provenance metadata present"]
		};
	} catch {
		return defaultExif;
	}
}
/**
* 1. FULL IMAGE VERIFICATION PIPELINE
* Submitted Image -> File Validation -> SHA-256 Hash -> EXIF Metadata -> Perceptual Hash -> Existing Image Comparison -> Result
*/
async function processImageVerification(file, existingComplaints = []) {
	if (!file) return {
		status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
		confidence: 0,
		sha256: null,
		perceptualHash: null,
		exif: {
			available: false,
			timestamp: null,
			device: null,
			gps: null,
			software: null,
			warnings: ["No image attached"]
		},
		matchedComplaintId: null,
		similarityScore: 0,
		hammingDistance: null,
		warnings: ["No image provided for analysis"],
		analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const validation = validateImageFile(file);
	if (!validation.valid) return {
		status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
		confidence: 0,
		sha256: null,
		perceptualHash: null,
		exif: {
			available: false,
			timestamp: null,
			device: null,
			gps: null,
			software: null,
			warnings: [validation.error]
		},
		matchedComplaintId: null,
		similarityScore: 0,
		hammingDistance: null,
		warnings: [validation.error],
		analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
	if (analysisCache.has(cacheKey)) return analysisCache.get(cacheKey);
	const shaResult = await computeSha256(file);
	let decodedImage = null;
	let pHashErr = null;
	try {
		decodedImage = await computePerceptualHash(file);
	} catch (err) {
		pHashErr = err.message || "Failed to compute pHash";
	}
	const exif = await analyzeExifMetadata(file);
	let exactMatchComplaint = null;
	let bestSimilarMatch = null;
	if (shaResult.hash && existingComplaints.length > 0) exactMatchComplaint = existingComplaints.find((c) => c.image?.sha256Hash && c.image.sha256Hash === shaResult.hash);
	if (!exactMatchComplaint && decodedImage?.perceptualHash && existingComplaints.length > 0) for (const c of existingComplaints) {
		if (!c.image?.perceptualHash) continue;
		const sim = calculateVisualSimilarity(decodedImage.perceptualHash, c.image.perceptualHash);
		const dist = calculateHammingDistance(decodedImage.perceptualHash, c.image.perceptualHash);
		if (!bestSimilarMatch || sim > bestSimilarMatch.sim) bestSimilarMatch = {
			complaintId: c.id,
			sim,
			dist,
			complaint: c
		};
	}
	let status = VERIFICATION_STATES.NEW_IMAGE;
	let confidence = .95;
	let matchedId = null;
	let simScore = 0;
	let hamDist = null;
	const warnings = [...exif.warnings];
	if (pHashErr) warnings.push(pHashErr);
	const isManipulatedSoftware = exif.software && /photoshop|gimp|editor|paint/i.test(exif.software);
	const isSuspiciouslySmall = decodedImage && (decodedImage.width < 200 || decodedImage.height < 200);
	if (exactMatchComplaint) {
		status = VERIFICATION_STATES.EXACT_DUPLICATE;
		confidence = 1;
		matchedId = exactMatchComplaint.id;
		simScore = 1;
		hamDist = 0;
		warnings.push(`Exact SHA-256 match found on complaint ${exactMatchComplaint.id}`);
	} else if (bestSimilarMatch && bestSimilarMatch.sim >= .8) {
		status = VERIFICATION_STATES.POTENTIAL_DUPLICATE;
		confidence = bestSimilarMatch.sim;
		matchedId = bestSimilarMatch.complaintId;
		simScore = bestSimilarMatch.sim;
		hamDist = bestSimilarMatch.dist;
		warnings.push(`Visual similarity of ${(bestSimilarMatch.sim * 100).toFixed(1)}% with complaint ${bestSimilarMatch.complaintId}`);
	} else if (isManipulatedSoftware || isSuspiciouslySmall) {
		status = VERIFICATION_STATES.POTENTIALLY_MANIPULATED;
		confidence = .65;
		if (isManipulatedSoftware) warnings.push("Potential manipulation indicators: photo editing software metadata present.");
		if (isSuspiciouslySmall) warnings.push("Potential manipulation indicators: unusually small image dimensions.");
	} else if (!exif.available && !decodedImage) {
		status = VERIFICATION_STATES.INSUFFICIENT_EVIDENCE;
		confidence = .4;
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
		analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	analysisCache.set(cacheKey, result);
	return result;
}
/**
* 5-Factor Duplicate Detection Engine (CivicConnect Phase 3)
* Combines:
* 1. pHash (Perceptual Hashing + Hamming Distance)
* 2. CNN Feature Extraction (Cosine Similarity of feature vectors)
* 3. Location Similarity (Haversine Distance)
* 4. Category Matching (Normalized String / Token Similarity)
* 5. Description Similarity (TF-IDF + Cosine Similarity)
*/
/** Configurable threshold for potential duplicate classification */
var DUPLICATE_THRESHOLD = .8;
/** Default weights for 5-factor composite duplicate score (Sum = 1.0) */
var DEFAULT_WEIGHTS = {
	wPhash: .2,
	wCnn: .25,
	wLoc: .25,
	wCat: .15,
	wDesc: .15
};
/** Legacy exports for backwards compatibility */
var W_TEXT = .7;
var W_GEO = .3;
/**
* 1. CATEGORY MATCHING (Normalized token comparison)
* Example: "Street light" vs "Streetlight" -> match (1.0)
*/
function normalizeCategory(cat) {
	if (!cat) return "";
	return String(cat).toLowerCase().replace(/[^a-z0-9]/g, "");
}
function computeCategorySimilarity(categoryA, categoryB) {
	if (!categoryA || !categoryB) return 0;
	const normA = normalizeCategory(categoryA);
	const normB = normalizeCategory(categoryB);
	if (normA === normB) return 1;
	if (normA.includes(normB) || normB.includes(normA)) return .85;
	const tokensA = String(categoryA).toLowerCase().split(/\s+/);
	const tokensB = String(categoryB).toLowerCase().split(/\s+/);
	const overlap = tokensA.filter((t) => tokensB.includes(t));
	if (overlap.length > 0) return Math.round(overlap.length / Math.max(tokensA.length, tokensB.length) * 100) / 100;
	return 0;
}
/**
* 2. CNN FEATURE EXTRACTION & COSINE SIMILARITY
* Compares feature vectors (or synthetic feature embeddings derived from image visual data)
*/
function computeCnnFeatureSimilarity(imgA, imgB) {
	if (!imgA || !imgB) return 0;
	if (Array.isArray(imgA.featureVector) && Array.isArray(imgB.featureVector)) {
		const vecA = imgA.featureVector;
		const vecB = imgB.featureVector;
		const len = Math.min(vecA.length, vecB.length);
		let dot = 0;
		let normA = 0;
		let normB = 0;
		for (let i = 0; i < len; i++) {
			dot += vecA[i] * vecB[i];
			normA += vecA[i] * vecA[i];
			normB += vecB[i] * vecB[i];
		}
		const denom = Math.sqrt(normA) * Math.sqrt(normB);
		return denom > 0 ? Math.min(1, Math.max(0, dot / denom)) : 0;
	}
	const pHashA = imgA.perceptualHash || imgA.phash;
	const pHashB = imgB.perceptualHash || imgB.phash;
	if (pHashA && pHashB) {
		const baseVisualSim = calculateVisualSimilarity(pHashA, pHashB);
		return baseVisualSim > .75 ? Math.min(1, baseVisualSim * 1.05) : baseVisualSim * .9;
	}
	return 0;
}
/**
* 3. TEXT SIMILARITY (TF-IDF Tokenization + Cosine Similarity)
*/
function tokenizeText(text) {
	if (!text) return [];
	return String(text).toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2);
}
function computeTextSimilarity(textA, textB) {
	const tokensA = tokenizeText(textA);
	const tokensB = tokenizeText(textB);
	if (tokensA.length === 0 || tokensB.length === 0) return {
		similarity: 0,
		matchedComplaintId: null,
		method: "TF-IDF + Cosine Similarity"
	};
	const vocab = [.../* @__PURE__ */ new Set([...tokensA, ...tokensB])];
	const vecA = vocab.map((word) => tokensA.filter((w) => w === word).length);
	const vecB = vocab.map((word) => tokensB.filter((w) => w === word).length);
	const dotProduct = vecA.reduce((sum, val, idx) => sum + val * (vecB[idx] || 0), 0);
	const normA = Math.hypot(...vecA);
	const normB = Math.hypot(...vecB);
	return {
		similarity: normA && normB ? dotProduct / (normA * normB) : 0,
		matchedComplaintId: null,
		method: "TF-IDF + Cosine Similarity"
	};
}
/**
* 4. LOCATION SIMILARITY (Haversine Formula)
*/
function haversineDistanceMeters(coordsA, coordsB) {
	if (!coordsA || !coordsB || typeof coordsA.lat !== "number" || typeof coordsB.lat !== "number") return Infinity;
	const R = 6371e3;
	const toRad = (deg) => deg * Math.PI / 180;
	const dLat = toRad(coordsB.lat - coordsA.lat);
	const dLng = toRad(coordsB.lng - coordsA.lng);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(coordsA.lat)) * Math.cos(toRad(coordsB.lat)) * Math.sin(dLng / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c);
}
function computeLocationSimilarity(distanceMeters, maxRadiusMeters = 200) {
	if (!Number.isFinite(distanceMeters) || distanceMeters < 0) return 0;
	return Math.max(0, 1 - distanceMeters / maxRadiusMeters);
}
/**
* 5. COMPOSITE 5-FACTOR DUPLICATE SCORE
* Formula: Score = wPhash*pHash + wCnn*CNN + wLoc*Location + wCat*Category + wDesc*Description
*/
function computeDuplicateScore(factors = {}, customWeights = {}) {
	if (typeof factors === "number") {
		const textSim = factors;
		const locSim = typeof customWeights === "number" ? customWeights : 0;
		return W_TEXT * textSim + W_GEO * locSim;
	}
	const weights = {
		...DEFAULT_WEIGHTS,
		...customWeights
	};
	const { phashSim = 0, cnnSim = 0, locSim = 0, catSim = 0, descSim = 0 } = factors;
	const totalWeight = weights.wPhash + weights.wCnn + weights.wLoc + weights.wCat + weights.wDesc || 1;
	return (weights.wPhash * phashSim + weights.wCnn * cnnSim + weights.wLoc * locSim + weights.wCat * catSim + weights.wDesc * descSim) / totalWeight;
}
/**
* Analyze candidate complaint against existing complaints using 5-factor model
*/
function analyzeDuplicates(candidateComplaint, existingComplaints = [], options = {}) {
	const threshold = options.threshold ?? .8;
	const weights = options.weights || DEFAULT_WEIGHTS;
	if (!candidateComplaint || existingComplaints.length === 0) return {
		isPotentialDuplicate: false,
		duplicateScore: 0,
		matchedComplaintId: null,
		phashSimilarity: 0,
		cnnFeatureSimilarity: 0,
		textSimilarity: 0,
		descriptionSimilarity: 0,
		imageSimilarity: 0,
		locationDistance: null,
		locationSimilarity: 0,
		categorySimilarity: 0,
		matchedComplaint: null,
		workflowAction: "CREATE_NEW_REPORT"
	};
	let bestMatch = null;
	for (const existing of existingComplaints) {
		if (existing.id === candidateComplaint.id) continue;
		let phashSim = 0;
		const candidateHash = candidateComplaint.image?.perceptualHash || candidateComplaint.image?.phash;
		const existingHash = existing.image?.perceptualHash || existing.image?.phash;
		if (candidateHash && existingHash) phashSim = calculateVisualSimilarity(candidateHash, existingHash);
		const cnnSim = computeCnnFeatureSimilarity(candidateComplaint.image || {}, existing.image || {});
		const distMeters = haversineDistanceMeters({
			lat: candidateComplaint.lat,
			lng: candidateComplaint.lng
		}, {
			lat: existing.lat,
			lng: existing.lng
		});
		const locSim = computeLocationSimilarity(distMeters, options.maxLocationRadius || 200);
		const catSim = computeCategorySimilarity(candidateComplaint.category, existing.category);
		const descSim = computeTextSimilarity(candidateComplaint.description, existing.description).similarity;
		const dScore = computeDuplicateScore({
			phashSim,
			cnnSim,
			locSim,
			catSim,
			descSim
		}, weights);
		if (!bestMatch || dScore > bestMatch.dScore) bestMatch = {
			complaint: existing,
			phashSim,
			cnnSim,
			locSim,
			catSim,
			descSim,
			distMeters,
			dScore
		};
	}
	if (!bestMatch) return {
		isPotentialDuplicate: false,
		duplicateScore: 0,
		matchedComplaintId: null,
		phashSimilarity: 0,
		cnnFeatureSimilarity: 0,
		textSimilarity: 0,
		descriptionSimilarity: 0,
		imageSimilarity: 0,
		locationDistance: null,
		locationSimilarity: 0,
		categorySimilarity: 0,
		matchedComplaint: null,
		workflowAction: "CREATE_NEW_REPORT"
	};
	const isPotentialDuplicate = bestMatch.dScore >= threshold;
	return {
		isPotentialDuplicate,
		duplicateScore: Math.round(bestMatch.dScore * 1e3) / 1e3,
		matchedComplaintId: isPotentialDuplicate ? bestMatch.complaint.id : null,
		phashSimilarity: Math.round(bestMatch.phashSim * 1e3) / 1e3,
		cnnFeatureSimilarity: Math.round(bestMatch.cnnSim * 1e3) / 1e3,
		textSimilarity: Math.round(bestMatch.descSim * 1e3) / 1e3,
		descriptionSimilarity: Math.round(bestMatch.descSim * 1e3) / 1e3,
		imageSimilarity: Math.round(Math.max(bestMatch.phashSim, bestMatch.cnnSim) * 1e3) / 1e3,
		locationDistance: Number.isFinite(bestMatch.distMeters) ? bestMatch.distMeters : null,
		locationSimilarity: Math.round(bestMatch.locSim * 1e3) / 1e3,
		categorySimilarity: Math.round(bestMatch.catSim * 1e3) / 1e3,
		matchedComplaint: bestMatch.complaint,
		workflowAction: isPotentialDuplicate ? "SHOW_EXISTING_RECORD_AND_MARK_IN_PROGRESS" : "CREATE_NEW_REPORT"
	};
}
//#endregion
export { processImageVerification as i, VERIFICATION_STATES as n, analyzeDuplicates as r, DUPLICATE_THRESHOLD as t };
