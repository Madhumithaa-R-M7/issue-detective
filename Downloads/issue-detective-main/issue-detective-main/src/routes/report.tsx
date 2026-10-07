import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Loader2, Upload, Eye, ShieldAlert, SkipForward } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { PriorityBadge, VerificationBadge } from "@/components/civic/badges";
import { KeyValue, Mono, Section } from "@/components/civic/ui-bits";
import { DuplicateComparisonModal } from "@/components/civic/DuplicateComparisonModal";
import {
  classifyCategory,
  computePriority,
  rankStaff,
  routeDepartment,
} from "@/lib/civic/algorithms";
import { CATEGORIES, severityFor } from "@/lib/civic/data";
import { CAMPUS_LOCATIONS, locationCoords } from "@/utils/campusLocations.js";
import { useCivic } from "@/lib/civic/store";
import type { Complaint, ImageVerification, DuplicateAnalysis } from "@/lib/civic/types";
import { processImageVerification, VERIFICATION_STATES } from "@/services/verificationEngine.js";
import { analyzeDuplicates, DUPLICATE_THRESHOLD } from "@/services/duplicateEngine.js";
import { classifyComplaint } from "@/services/classificationEngine.js";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — CivicConnect" },
      {
        name: "description",
        content:
          "Report a campus issue with photo evidence. The image is verified for authenticity and provenance, location match, and duplicate detection before submission.",
      },
      { property: "og:title", content: "Report an Issue — CivicConnect" },
      {
        property: "og:description",
        content: "Submit a verified campus complaint with automatic duplicate detection.",
      },
    ],
  }),
  component: ReportPage,
});

const STEPS = ["Details", "Photo & Verification", "Review & Submit"];

function ReportPage() {
  const { complaints, addComplaint, nextComplaintId, studentName, staff } = useCivic();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("CSE Block");
  const [detail, setDetail] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [stage, setStage] = useState("");
  const [image, setImage] = useState<ImageVerification | null>(null);
  const [duplicateResult, setDuplicateResult] = useState<DuplicateAnalysis | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const suggestion = useMemo(
    () => (description.trim().length > 6 ? classifyComplaint(description) : null),
    [description],
  );
  const effectiveCategory = category || suggestion?.category || "Other";
  const route = routeDepartment(effectiveCategory);
  const coords = locationCoords(location);

  const priority = useMemo(() => {
    const severity = severityFor(effectiveCategory);
    const verStatus = image?.verification.status;
    const recurrence =
      verStatus === "potential_duplicate" || verStatus === "POTENTIAL_DUPLICATE"
        ? 8
        : verStatus === "exact_duplicate" || verStatus === "EXACT_DUPLICATE"
          ? 9
          : 4;
    return computePriority({
      severity,
      urgency: Math.min(10, severity - 0.5),
      community: location === "Hostel" || location === "Canteen" ? 8 : 6,
      location: location === "CSE Block" || location === "Hostel" ? 8 : 6.5,
      recurrence,
      slaAging: 1,
    });
  }, [effectiveCategory, location, image]);

  const bestStaff = rankStaff(staff, route.department)[0] ?? null;

  async function analyse(file: File) {
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
        image: {
          perceptualHash: verRes.perceptualHash || "",
        },
      };

      const dupRes = analyzeDuplicates(candidateDraft, complaints);
      setDuplicateResult(dupRes);

      const status = verRes.status;
      const combinedScore = dupRes.duplicateScore;
      const matchedComplaintId = verRes.matchedComplaintId || dupRes.matchedComplaintId;

      const imgVerObj: ImageVerification = {
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
          status: status as any,
          matchedComplaintId,
          confidence: verRes.confidence,
          sha256: verRes.sha256 || "",
          perceptualHash: verRes.perceptualHash || "",
          warnings: verRes.warnings,
          analyzedAt: verRes.analyzedAt,
        },
      };

      setImage(imgVerObj);
      setStage("");

      if (dupRes.isPotentialDuplicate || status === VERIFICATION_STATES.POTENTIAL_DUPLICATE || status === "potential_duplicate") {
        setShowModal(true);
      }
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

    // If no image, set verification status to INSUFFICIENT_EVIDENCE
    const finalImageVerification = image
      ? image
      : {
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
            warnings: ["Metadata unavailable"],
          },
          verification: {
            exactMatch: false,
            visualSimilarity: 0,
            similarityScore: 0,
            hammingDistance: null,
            locationDistance: null,
            locationSimilarity: 0,
            combinedScore: duplicateResult?.duplicateScore || 0,
            status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE as any,
            matchedComplaintId: duplicateResult?.matchedComplaintId || null,
            confidence: 0,
            warnings: ["No photo provided"],
            analyzedAt: new Date().toISOString(),
          },
        };

    const isDupStatus =
      verStatus === "potential_duplicate" ||
      verStatus === "POTENTIAL_DUPLICATE" ||
      duplicateResult?.isPotentialDuplicate;

    const complaint: Complaint = {
      id,
      description: description.trim(),
      category: effectiveCategory,
      location,
      detailedLocation: detail.trim() || location,
      lat: coords.lat,
      lng: coords.lng,
      submittedAt: new Date().toISOString(),
      status: isDupStatus ? "Under Analysis" : "Submitted",
      priority,
      department: route.department,
      subDepartment: route.sub,
      assignedStaffId: null,
      slaHours: priority.label === "Critical" ? 6 : priority.label === "High" ? 24 : 72,
      studentName,
      image: image ? finalImageVerification : null,
      imageVerification: finalImageVerification.verification as any,
      duplicateAnalysis: duplicateResult || {
        isPotentialDuplicate: false,
        duplicateScore: 0,
        matchedComplaintId: null,
        textSimilarity: 0,
        imageSimilarity: 0,
        locationDistance: null,
      },
      classificationInfo: {
        predictedCategory: suggestion?.category || "Other",
        predictionConfidence: suggestion?.confidence || 0.5,
        finalCategory: effectiveCategory,
        classificationMethod: suggestion?.method || "TF-IDF + Logistic Regression",
        modelType: suggestion?.modelType || "Prototype fallback",
      },
    };

    addComplaint(complaint);
    toast.success(`Complaint ${id} submitted successfully`);
    navigate({ to: "/complaint/$id", params: { id } });
  }

  const canContinue = step === 0 ? description.trim().length > 10 && location : true; // Photo is optional
  const matched = (image?.verification.matchedComplaintId || duplicateResult?.matchedComplaintId)
    ? complaints.find((c) => c.id === (image?.verification.matchedComplaintId || duplicateResult?.matchedComplaintId))
    : null;

  return (
    <AppShell>
      <PageHeader
        title="Report an Issue"
        description="Describe the problem, optionally attach a photo, and see automatic classification and intelligence in action."
      />

      <ol className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium",
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                  ? "bg-success-soft text-success"
                  : "bg-muted text-muted-foreground",
            )}
          >
            <span className="font-bold">{i + 1}</span> {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Section title="Issue details" subtitle="Tell us what is wrong and exactly where it is on campus.">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. The washroom tap is leaking continuously near CSE Block."
                className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm"
              />
              {suggestion && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Suggested category: <strong>{suggestion.category}</strong> (
                  {(suggestion.confidence * 100).toFixed(0)}% confidence, TF-IDF classification)
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  value={category || (suggestion?.category ?? "")}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm"
                >
                  <option value="">Auto-detect from description</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Campus location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm"
                >
                  {CAMPUS_LOCATIONS.map((l) => (
                    <option key={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Detailed location</label>
              <input
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Room 302 / near staircase"
                className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-xl bg-info-soft p-4 text-sm">
              Routed to <strong>{route.department}</strong> / {route.sub} · coordinates{" "}
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </div>
          </div>
        </Section>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <Section
            title="Photo evidence & Image Authenticity and Provenance Verification"
            subtitle="Photos are validated, SHA-256 hashed, and checked for pHash visual similarity and EXIF metadata."
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void analyse(f);
              }}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={analysing}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-sm hover:bg-secondary/50 transition-colors"
              >
                {analysing ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : (
                  <Upload className="size-6 text-primary" />
                )}
                <span className="font-medium">
                  {analysing ? "Analyzing image..." : "Upload photo evidence"}
                </span>
                <span className="text-xs text-muted-foreground">JPG, PNG, or WEBP photo</span>
              </button>

              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 py-8 px-4 text-center text-sm">
                <SkipForward className="size-6 text-muted-foreground" />
                <span className="font-medium text-foreground">Optional photo</span>
                <span className="text-xs text-muted-foreground">
                  You may proceed without a photo. Verification status will be set to{" "}
                  <strong>INSUFFICIENT_EVIDENCE</strong>.
                </span>
              </div>
            </div>

            {analysing && (
              <div className="mt-4 rounded-lg bg-secondary p-4 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  <Loader2 className="size-4 animate-spin text-primary" /> {stage}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded bg-muted">
                  <div className="brand-gradient scan-line h-full" />
                </div>
              </div>
            )}
          </Section>

          {image && (
            <>
              <Section title="Image Verification & Provenance Analysis">
                <div className="flex flex-wrap items-center gap-3">
                  <VerificationBadge status={image.verification.status} />
                  <span className="text-sm text-muted-foreground">
                    Duplicate score D = 0.7T + 0.3G ={" "}
                    <strong>{(image.verification.combinedScore * 100).toFixed(1)}%</strong> (threshold{" "}
                    {DUPLICATE_THRESHOLD * 100}%)
                  </span>
                  {matched && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline ml-auto"
                    >
                      <Eye className="size-3.5" /> View Duplicate Comparison
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <img
                    src={image.imageUrl}
                    alt="Uploaded evidence"
                    className="w-full rounded-xl border border-border object-cover max-h-64"
                  />
                  <div>
                    <KeyValue label="File name" value={image.fileName} />
                    <KeyValue
                      label="Size & Dim"
                      value={`${(image.fileSize / 1024 / 1024).toFixed(2)} MB · ${image.width}×${image.height}`}
                    />
                    <KeyValue label="SHA-256 Fingerprint" value={<Mono>{image.sha256Hash || "—"}</Mono>} />
                    <KeyValue label="Perceptual Hash" value={<Mono>{image.perceptualHash || "—"}</Mono>} />
                    <KeyValue
                      label="Visual similarity"
                      value={`${(image.verification.visualSimilarity * 100).toFixed(1)}%`}
                    />
                    <KeyValue
                      label="Location distance"
                      value={
                        image.verification.locationDistance === null
                          ? "—"
                          : `${image.verification.locationDistance} m`
                      }
                    />
                  </div>
                </div>
              </Section>

              <Section title="EXIF Provenance Metadata" subtitle="Read from image EXIF tags.">
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <KeyValue label="Device" value={image.exif.device || "Metadata unavailable"} />
                  <KeyValue label="Capture Date" value={image.exif.captureDate || "Metadata unavailable"} />
                  <KeyValue label="Capture Time" value={image.exif.captureTime || "Metadata unavailable"} />
                  <KeyValue label="GPS Data" value={image.exif.gpsAvailable ? "Present" : "Metadata unavailable"} />
                  <KeyValue label="Software" value={image.exif.software || "Metadata unavailable"} />
                </div>
                {!image.exif.device && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning-foreground">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    Metadata unavailable. Screenshots or web downloads strip EXIF tags. This does not mean the photo is fake.
                  </p>
                )}
              </Section>
            </>
          )}

          {!image && (
            <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              <span>No image selected yet. Click <strong>Continue</strong> to submit without photo evidence.</span>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Section title="Review before submitting">
            <KeyValue label="Description" value={description} />
            <KeyValue label="Category" value={effectiveCategory} />
            <KeyValue label="Location" value={`${location} · ${detail || "—"}`} />
            <KeyValue label="Department" value={`${route.department} / ${route.sub}`} />
            <KeyValue
              label="Priority"
              value={<PriorityBadge label={priority.label} score={priority.overall} />}
            />
            <KeyValue
              label="Suggested Staff"
              value={bestStaff ? `${bestStaff.name} (${bestStaff.score.toFixed(2)})` : "Unassigned"}
            />
            <KeyValue
              label="Image Verification"
              value={image ? <VerificationBadge status={image.verification.status} /> : <VerificationBadge status="INSUFFICIENT_EVIDENCE" />}
            />
          </Section>

          {(image?.verification.status === "EXACT_DUPLICATE" || image?.verification.status === "exact_duplicate") && (
            <p className="flex items-start gap-2 rounded-xl bg-critical-soft p-4 text-sm text-critical">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" />
              Exact duplicate photo detected on complaint {image.verification.matchedComplaintId}.
              Submission with this exact file is blocked — please upload a fresh photo.
            </p>
          )}

          {(image?.verification.status === "POTENTIAL_DUPLICATE" || image?.verification.status === "potential_duplicate" || duplicateResult?.isPotentialDuplicate) && (
            <div className="rounded-xl bg-warning-soft p-4 text-sm text-warning-foreground space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="size-4 shrink-0" /> Potential Duplicate Detected
              </div>
              <p>
                This issue is similar to <strong>{matched?.id || image?.verification.matchedComplaintId}</strong> (
                Score: {((image?.verification.combinedScore || duplicateResult?.duplicateScore || 0) * 100).toFixed(0)}%).
                The complaint will be submitted with status <strong>Under Analysis</strong> for admin review.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-xl border border-input px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          Back
        </button>
        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting || image?.verification.status === "EXACT_DUPLICATE" || image?.verification.status === "exact_duplicate"}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Submit complaint
          </button>
        )}
      </div>

      {/* Duplicate Comparison Modal */}
      {matched && (
        <DuplicateComparisonModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          newComplaint={{
            id: "DRAFT",
            category: effectiveCategory,
            location: `${location} (${detail || "Campus"})`,
            description,
            submittedAt: new Date().toISOString(),
            image,
          }}
          matchedComplaint={matched}
          analysis={{
            phashSimilarity: duplicateResult?.phashSimilarity ?? image?.verification?.visualSimilarity ?? 0,
            cnnFeatureSimilarity: duplicateResult?.cnnFeatureSimilarity ?? image?.verification?.visualSimilarity ?? 0,
            locationSimilarity: duplicateResult?.locationSimilarity ?? 0,
            categorySimilarity: duplicateResult?.categorySimilarity ?? 0,
            descriptionSimilarity: duplicateResult?.descriptionSimilarity ?? duplicateResult?.textSimilarity ?? 0,
            textSimilarity: duplicateResult?.textSimilarity || 0,
            imageSimilarity: image?.verification?.visualSimilarity || 0,
            locationDistance: duplicateResult?.locationDistance ?? image?.verification?.locationDistance,
            duplicateScore: duplicateResult?.duplicateScore ?? image?.verification?.combinedScore ?? 0,
          }}
          readOnly={true}
        />
      )}
    </AppShell>
  );
}
