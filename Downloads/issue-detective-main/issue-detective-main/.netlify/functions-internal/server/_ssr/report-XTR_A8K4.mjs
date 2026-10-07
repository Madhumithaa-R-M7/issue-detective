import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as severityFor, c as classifyComplaint, f as locationCoords$1, h as routeDepartment, l as computePriority, m as rankStaff, n as CATEGORIES, t as CAMPUS_LOCATIONS, v as useCivic } from "./store-B0cKa5ln.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Eye, R as CircleCheck, d as SkipForward, o as Upload, p as ShieldAlert, s as TriangleAlert, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as Section, i as KeyValue, l as cn, o as Mono, s as PageHeader, t as AppShell } from "./ui-bits-D7lvT2PQ.mjs";
import { r as VerificationBadge, t as PriorityBadge } from "./badges-8Fc3983k.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as processImageVerification, n as VERIFICATION_STATES, r as analyzeDuplicates } from "./duplicateEngine-pj392S2i.mjs";
import { t as DuplicateComparisonModal } from "./DuplicateComparisonModal-B0ZNt-w8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-XTR_A8K4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"Details",
	"Photo & Verification",
	"Review & Submit"
];
function ReportPage() {
	const { complaints, addComplaint, nextComplaintId, studentName, staff } = useCivic();
	const navigate = useNavigate();
	const fileRef = (0, import_react.useRef)(null);
	const [step, setStep] = (0, import_react.useState)(0);
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("CSE Block");
	const [detail, setDetail] = (0, import_react.useState)("");
	const [analysing, setAnalysing] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)(null);
	const [duplicateResult, setDuplicateResult] = (0, import_react.useState)(null);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const suggestion = (0, import_react.useMemo)(() => description.trim().length > 6 ? classifyComplaint(description) : null, [description]);
	const effectiveCategory = category || suggestion?.category || "Other";
	const route = routeDepartment(effectiveCategory);
	const coords = locationCoords$1(location);
	const priority = (0, import_react.useMemo)(() => {
		const severity = severityFor(effectiveCategory);
		const verStatus = image?.verification.status;
		const recurrence = verStatus === "potential_duplicate" || verStatus === "POTENTIAL_DUPLICATE" ? 8 : verStatus === "exact_duplicate" || verStatus === "EXACT_DUPLICATE" ? 9 : 4;
		return computePriority({
			severity,
			urgency: Math.min(10, severity - .5),
			community: location === "Hostel" || location === "Canteen" ? 8 : 6,
			location: location === "CSE Block" || location === "Hostel" ? 8 : 6.5,
			recurrence,
			slaAging: 1
		});
	}, [
		effectiveCategory,
		location,
		image
	]);
	const bestStaff = rankStaff(staff, route.department)[0] ?? null;
	async function analyse(file) {
		setAnalysing(true);
		setImage(null);
		setDuplicateResult(null);
		try {
			setStage("Analyzing image authenticity and provenance...");
			const verRes = await processImageVerification(file, complaints);
			setStage("Comparing against existing complaints for duplicates...");
			const candidateDraft = {
				id: "DRAFT",
				description: description.trim(),
				category: effectiveCategory,
				lat: coords.lat,
				lng: coords.lng,
				image: { perceptualHash: verRes.perceptualHash || "" }
			};
			const dupRes = analyzeDuplicates(candidateDraft, complaints);
			setDuplicateResult(dupRes);
			const status = verRes.status;
			const combinedScore = dupRes.duplicateScore;
			const matchedComplaintId = verRes.matchedComplaintId || dupRes.matchedComplaintId;
			const imgVerObj = {
				imageUrl: verRes.dataUrl || URL.createObjectURL(file),
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
				width: verRes.width || 800,
				height: verRes.height || 600,
				sha256Hash: verRes.sha256 || "",
				perceptualHash: verRes.perceptualHash || "",
				exif: verRes.exif,
				verification: {
					exactMatch: status === VERIFICATION_STATES.EXACT_DUPLICATE || status === "exact_duplicate",
					visualSimilarity: verRes.similarityScore,
					similarityScore: verRes.similarityScore,
					hammingDistance: verRes.hammingDistance,
					locationDistance: dupRes.locationDistance,
					locationSimilarity: dupRes.locationDistance !== null ? Math.max(0, 1 - dupRes.locationDistance / 200) : 0,
					combinedScore,
					status,
					matchedComplaintId,
					confidence: verRes.confidence,
					sha256: verRes.sha256 || "",
					perceptualHash: verRes.perceptualHash || "",
					warnings: verRes.warnings,
					analyzedAt: verRes.analyzedAt
				}
			};
			setImage(imgVerObj);
			setStage("");
			if (dupRes.isPotentialDuplicate || status === VERIFICATION_STATES.POTENTIAL_DUPLICATE || status === "potential_duplicate") setShowModal(true);
		} catch {
			toast.error("That file could not be analyzed as an image. Please try another photo.");
		} finally {
			setAnalysing(false);
		}
	}
	function submit() {
		if (image?.verification.status === "EXACT_DUPLICATE" || image?.verification.status === "exact_duplicate") {
			toast.error("Exact duplicate detected. Please submit a fresh photo of the current condition.");
			return;
		}
		setSubmitting(true);
		const id = nextComplaintId();
		const verStatus = image?.verification.status;
		const finalImageVerification = image ? image : {
			imageUrl: "",
			fileName: "No image attached",
			fileType: "none",
			fileSize: 0,
			width: 0,
			height: 0,
			sha256Hash: "",
			perceptualHash: "",
			exif: {
				available: false,
				device: null,
				captureDate: null,
				captureTime: null,
				timestamp: null,
				gpsAvailable: false,
				gps: null,
				software: null,
				warnings: ["Metadata unavailable"]
			},
			verification: {
				exactMatch: false,
				visualSimilarity: 0,
				similarityScore: 0,
				hammingDistance: null,
				locationDistance: null,
				locationSimilarity: 0,
				combinedScore: duplicateResult?.duplicateScore || 0,
				status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
				matchedComplaintId: duplicateResult?.matchedComplaintId || null,
				confidence: 0,
				warnings: ["No photo provided"],
				analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
		const isDupStatus = verStatus === "potential_duplicate" || verStatus === "POTENTIAL_DUPLICATE" || duplicateResult?.isPotentialDuplicate;
		const complaint = {
			id,
			description: description.trim(),
			category: effectiveCategory,
			location,
			detailedLocation: detail.trim() || location,
			lat: coords.lat,
			lng: coords.lng,
			submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
			status: isDupStatus ? "Under Analysis" : "Submitted",
			priority,
			department: route.department,
			subDepartment: route.sub,
			assignedStaffId: null,
			slaHours: priority.label === "Critical" ? 6 : priority.label === "High" ? 24 : 72,
			studentName,
			image: image ? finalImageVerification : null,
			imageVerification: finalImageVerification.verification,
			duplicateAnalysis: duplicateResult || {
				isPotentialDuplicate: false,
				duplicateScore: 0,
				matchedComplaintId: null,
				textSimilarity: 0,
				imageSimilarity: 0,
				locationDistance: null
			},
			classificationInfo: {
				predictedCategory: suggestion?.category || "Other",
				predictionConfidence: suggestion?.confidence || .5,
				finalCategory: effectiveCategory,
				classificationMethod: suggestion?.method || "TF-IDF + Logistic Regression",
				modelType: suggestion?.modelType || "Prototype fallback"
			}
		};
		addComplaint(complaint);
		toast.success(`Complaint ${id} submitted successfully`);
		navigate({
			to: "/complaint/$id",
			params: { id }
		});
	}
	const canContinue = step === 0 ? description.trim().length > 10 && location : true;
	const matched = image?.verification.matchedComplaintId || duplicateResult?.matchedComplaintId ? complaints.find((c) => c.id === (image?.verification.matchedComplaintId || duplicateResult?.matchedComplaintId)) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Report an Issue",
			description: "Describe the problem, optionally attach a photo, and see automatic classification and intelligence in action."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mb-6 flex flex-wrap gap-2",
			children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium", i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: i + 1
					}),
					" ",
					s
				]
			}, s))
		}),
		step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Issue details",
			subtitle: "Tell us what is wrong and exactly where it is on campus.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-medium",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 4,
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "e.g. The washroom tap is leaking continuously near CSE Block.",
							className: "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm"
						}),
						suggestion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-xs text-muted-foreground",
							children: [
								"Suggested category: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: suggestion.category }),
								" (",
								(suggestion.confidence * 100).toFixed(0),
								"% confidence, TF-IDF classification)"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-medium",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: category || (suggestion?.category ?? ""),
							onChange: (e) => setCategory(e.target.value),
							className: "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Auto-detect from description"
							}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-medium",
							children: "Campus location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: location,
							onChange: (e) => setLocation(e.target.value),
							className: "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm",
							children: CAMPUS_LOCATIONS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: l.name }, l.name))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-sm font-medium",
						children: "Detailed location"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: detail,
						onChange: (e) => setDetail(e.target.value),
						placeholder: "Room 302 / near staircase",
						className: "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-info-soft p-4 text-sm",
						children: [
							"Routed to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: route.department }),
							" / ",
							route.sub,
							" · coordinates",
							" ",
							coords.lat.toFixed(4),
							", ",
							coords.lng.toFixed(4)
						]
					})
				]
			})
		}),
		step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Photo evidence & Image Authenticity and Provenance Verification",
					subtitle: "Photos are validated, SHA-256 hashed, and checked for pHash visual similarity and EXIF metadata.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) analyse(f);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => fileRef.current?.click(),
								disabled: analysing,
								className: "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-sm hover:bg-secondary/50 transition-colors",
								children: [
									analysing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: analysing ? "Analyzing image..." : "Upload photo evidence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "JPG, PNG, or WEBP photo"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 py-8 px-4 text-center text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-6 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Optional photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											"You may proceed without a photo. Verification status will be set to",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "INSUFFICIENT_EVIDENCE" }),
											"."
										]
									})
								]
							})]
						}),
						analysing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg bg-secondary p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-primary" }),
									" ",
									stage
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1.5 overflow-hidden rounded bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "brand-gradient scan-line h-full" })
							})]
						})
					]
				}),
				image && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Image Verification & Provenance Analysis",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: image.verification.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted-foreground",
								children: [
									"Duplicate score D = 0.7T + 0.3G =",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(image.verification.combinedScore * 100).toFixed(1), "%"] }),
									" (threshold",
									" ",
									80,
									"%)"
								]
							}),
							matched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowModal(true),
								className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline ml-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " View Duplicate Comparison"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-5 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image.imageUrl,
							alt: "Uploaded evidence",
							className: "w-full rounded-xl border border-border object-cover max-h-64"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "File name",
								value: image.fileName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Size & Dim",
								value: `${(image.fileSize / 1024 / 1024).toFixed(2)} MB · ${image.width}×${image.height}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "SHA-256 Fingerprint",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: image.sha256Hash || "—" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Perceptual Hash",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mono, { children: image.perceptualHash || "—" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Visual similarity",
								value: `${(image.verification.visualSimilarity * 100).toFixed(1)}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Location distance",
								value: image.verification.locationDistance === null ? "—" : `${image.verification.locationDistance} m`
							})
						] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "EXIF Provenance Metadata",
					subtitle: "Read from image EXIF tags.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-x-8 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Device",
								value: image.exif.device || "Metadata unavailable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Capture Date",
								value: image.exif.captureDate || "Metadata unavailable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Capture Time",
								value: image.exif.captureTime || "Metadata unavailable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "GPS Data",
								value: image.exif.gpsAvailable ? "Present" : "Metadata unavailable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
								label: "Software",
								value: image.exif.software || "Metadata unavailable"
							})
						]
					}), !image.exif.device && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), "Metadata unavailable. Screenshots or web downloads strip EXIF tags. This does not mean the photo is fake."]
					})]
				})] }),
				!image && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"No image selected yet. Click ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Continue" }),
						" to submit without photo evidence."
					] })]
				})
			]
		}),
		step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Review before submitting",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Description",
							value: description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Category",
							value: effectiveCategory
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Location",
							value: `${location} · ${detail || "—"}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Department",
							value: `${route.department} / ${route.sub}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Priority",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
								label: priority.label,
								score: priority.overall
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Suggested Staff",
							value: bestStaff ? `${bestStaff.name} (${bestStaff.score.toFixed(2)})` : "Unassigned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyValue, {
							label: "Image Verification",
							value: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: image.verification.status }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerificationBadge, { status: "INSUFFICIENT_EVIDENCE" })
						})
					]
				}),
				(image?.verification.status === "EXACT_DUPLICATE" || image?.verification.status === "exact_duplicate") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-start gap-2 rounded-xl bg-critical-soft p-4 text-sm text-critical",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 size-5 shrink-0" }),
						"Exact duplicate photo detected on complaint ",
						image.verification.matchedComplaintId,
						". Submission with this exact file is blocked — please upload a fresh photo."
					]
				}),
				(image?.verification.status === "POTENTIAL_DUPLICATE" || image?.verification.status === "potential_duplicate" || duplicateResult?.isPotentialDuplicate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-warning-soft p-4 text-sm text-warning-foreground space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0" }), " Potential Duplicate Detected"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"This issue is similar to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: matched?.id || image?.verification.matchedComplaintId }),
						" ( Score: ",
						((image?.verification.combinedScore || duplicateResult?.duplicateScore || 0) * 100).toFixed(0),
						"%). The complaint will be submitted with status ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Under Analysis" }),
						" for admin review."
					] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setStep((s) => Math.max(0, s - 1)),
				disabled: step === 0,
				className: "rounded-xl border border-input px-4 py-2.5 text-sm font-semibold disabled:opacity-40",
				children: "Back"
			}), step < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setStep((s) => s + 1),
				disabled: !canContinue,
				className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40",
				children: "Continue"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: submit,
				disabled: submitting || image?.verification.status === "EXACT_DUPLICATE" || image?.verification.status === "exact_duplicate",
				className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40",
				children: "Submit complaint"
			})]
		}),
		matched && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DuplicateComparisonModal, {
			isOpen: showModal,
			onClose: () => setShowModal(false),
			newComplaint: {
				id: "DRAFT",
				category: effectiveCategory,
				location: `${location} (${detail || "Campus"})`,
				description,
				submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
				image
			},
			matchedComplaint: matched,
			analysis: {
				phashSimilarity: duplicateResult?.phashSimilarity ?? image?.verification?.visualSimilarity ?? 0,
				cnnFeatureSimilarity: duplicateResult?.cnnFeatureSimilarity ?? image?.verification?.visualSimilarity ?? 0,
				locationSimilarity: duplicateResult?.locationSimilarity ?? 0,
				categorySimilarity: duplicateResult?.categorySimilarity ?? 0,
				descriptionSimilarity: duplicateResult?.descriptionSimilarity ?? duplicateResult?.textSimilarity ?? 0,
				textSimilarity: duplicateResult?.textSimilarity || 0,
				imageSimilarity: image?.verification?.visualSimilarity || 0,
				locationDistance: duplicateResult?.locationDistance ?? image?.verification?.locationDistance,
				duplicateScore: duplicateResult?.duplicateScore ?? image?.verification?.combinedScore ?? 0
			},
			readOnly: true
		})
	] });
}
//#endregion
export { ReportPage as component };
