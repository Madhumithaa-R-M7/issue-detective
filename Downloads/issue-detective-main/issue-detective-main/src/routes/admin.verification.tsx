import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { VerificationBadge, PriorityBadge } from "@/components/civic/badges";
import { KeyValue, Mono, Section } from "@/components/civic/ui-bits";
import { DuplicateComparisonModal } from "@/components/civic/DuplicateComparisonModal";
import { useCivic } from "@/lib/civic/store";
import type { Complaint } from "@/lib/civic/types";
import {
  ShieldCheck,
  Image as ImageIcon,
  Hash,
  MapPin,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Filter,
  Eye,
  Check,
  X,
  RefreshCw,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/admin/verification")({
  head: () => ({
    meta: [
      { title: "Image Verification Center — CivicConnect" },
      {
        name: "description",
        content: "Inspect SHA-256 fingerprints, perceptual luminance hashes (pHash), EXIF camera metadata, and spatial location matches.",
      },
    ],
  }),
  component: AdminVerificationPage,
});

function AdminVerificationPage() {
  const { complaints, updateComplaint } = useCivic();

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal inspection state
  const [inspectTarget, setInspectTarget] = useState<Complaint | null>(null);

  const totalAnalyzed = complaints.length;
  const newCount = complaints.filter((c) =>
    c.image?.verification.status === "new" || c.image?.verification.status === "NEW_IMAGE"
  ).length;

  const potDupCount = complaints.filter((c) =>
    c.image?.verification.status === "potential_duplicate" ||
    c.image?.verification.status === "POTENTIAL_DUPLICATE" ||
    c.duplicateAnalysis?.isPotentialDuplicate
  ).length;

  const exactDupCount = complaints.filter((c) =>
    c.image?.verification.status === "exact_duplicate" || c.image?.verification.status === "EXACT_DUPLICATE"
  ).length;

  const insufficientCount = complaints.filter((c) =>
    !c.image ||
    c.image?.verification.status === "insufficient_evidence" ||
    c.image?.verification.status === "INSUFFICIENT_EVIDENCE"
  ).length;

  const manipulatedCount = complaints.filter((c) =>
    c.image?.verification.status === "POTENTIALLY_MANIPULATED"
  ).length;

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const vStatus = c.image?.verification.status || "INSUFFICIENT_EVIDENCE";

      // Status filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "NEW_IMAGE" && !(vStatus === "new" || vStatus === "NEW_IMAGE")) return false;
        if (statusFilter === "POTENTIAL_DUPLICATE" && !(vStatus === "potential_duplicate" || vStatus === "POTENTIAL_DUPLICATE")) return false;
        if (statusFilter === "EXACT_DUPLICATE" && !(vStatus === "exact_duplicate" || vStatus === "EXACT_DUPLICATE")) return false;
        if (statusFilter === "INSUFFICIENT_EVIDENCE" && !(vStatus === "insufficient_evidence" || vStatus === "INSUFFICIENT_EVIDENCE" || !c.image)) return false;
        if (statusFilter === "POTENTIALLY_MANIPULATED" && !(vStatus === "POTENTIALLY_MANIPULATED")) return false;
      }

      // Category filter
      if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;

      // Priority filter
      if (priorityFilter !== "ALL" && c.priority.label !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        const matchesLoc = c.location.toLowerCase().includes(q);
        const matchesSha = c.image?.sha256Hash?.toLowerCase().includes(q) ?? false;
        if (!matchesId && !matchesDesc && !matchesLoc && !matchesSha) return false;
      }

      return true;
    });
  }, [complaints, statusFilter, categoryFilter, priorityFilter, searchQuery]);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(complaints.map((c) => c.category))).sort();
  }, [complaints]);

  // Admin Review Decisions
  function handleAdminDecision(
    complaintId: string,
    decision: "confirm_duplicate" | "mark_distinct" | "request_review" | "keep_active"
  ) {
    const patch: Partial<Complaint> = {
      verificationReview: {
        reviewed: true,
        reviewedBy: "Admin",
        reviewedAt: new Date().toISOString(),
        decision,
        remarks: `Admin decision: ${decision}`,
      },
    };

    if (decision === "confirm_duplicate") {
      patch.status = "Duplicate";
      toast.success(`Complaint ${complaintId} confirmed as Duplicate.`);
    } else if (decision === "mark_distinct") {
      patch.status = "Under Analysis";
      toast.info(`Complaint ${complaintId} marked as Distinct Complaint.`);
    } else if (decision === "request_review") {
      patch.status = "Under Analysis";
      toast.warning(`Requested additional verification review for ${complaintId}.`);
    } else {
      toast.success(`Complaint ${complaintId} kept active.`);
    }

    updateComplaint(complaintId, patch);
  }

  const matchedTarget = inspectTarget
    ? complaints.find(
        (c) =>
          c.id ===
          (inspectTarget.image?.verification.matchedComplaintId ||
            inspectTarget.duplicateAnalysis?.matchedComplaintId)
      )
    : null;

  return (
    <AppShell>
      <PageHeader
        title="Admin Image Verification Center"
        description="Comprehensive audit center for Image Authenticity and Provenance Verification: cryptographic SHA-256 fingerprints, 8x8 luminance pHash matrix, EXIF camera metadata, and duplicate reviews."
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <ImageIcon className="size-7 text-primary shrink-0" />
          <div>
            <div className="text-xl font-bold text-foreground">{totalAnalyzed}</div>
            <div className="text-[11px] text-muted-foreground">Total Analyzed</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <CheckCircle2 className="size-7 text-emerald-500 shrink-0" />
          <div>
            <div className="text-xl font-bold text-foreground">{newCount}</div>
            <div className="text-[11px] text-muted-foreground">New Images</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <AlertTriangle className="size-7 text-amber-500 shrink-0" />
          <div>
            <div className="text-xl font-bold text-foreground">{potDupCount}</div>
            <div className="text-[11px] text-muted-foreground">Potential Duplicates</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <ShieldCheck className="size-7 text-rose-500 shrink-0" />
          <div>
            <div className="text-xl font-bold text-foreground">{exactDupCount}</div>
            <div className="text-[11px] text-muted-foreground">Exact Duplicates</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <FileQuestion className="size-7 text-slate-400 shrink-0" />
          <div>
            <div className="text-xl font-bold text-foreground">{insufficientCount}</div>
            <div className="text-[11px] text-muted-foreground">Insufficient Evidence</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <AlertTriangle className="size-7 text-purple-500 shrink-0" />
          <div>
            <div className="text-xl font-bold text-foreground">{manipulatedCount}</div>
            <div className="text-[11px] text-muted-foreground">Potentially Manipulated</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Filter className="size-4 text-primary" /> Filter Verification Records
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Verification Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <option value="ALL">All Statuses ({totalAnalyzed})</option>
              <option value="NEW_IMAGE">New Images ({newCount})</option>
              <option value="POTENTIAL_DUPLICATE">Potential Duplicates ({potDupCount})</option>
              <option value="EXACT_DUPLICATE">Exact Duplicates ({exactDupCount})</option>
              <option value="INSUFFICIENT_EVIDENCE">Insufficient Evidence ({insufficientCount})</option>
              <option value="POTENTIALLY_MANIPULATED">Potentially Manipulated ({manipulatedCount})</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Priority Level</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Search ID / SHA / Desc</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs font-medium text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Registry Cards */}
      <Section title={`Photo Verification Registry (${filteredComplaints.length} records matching filter)`}>
        {filteredComplaints.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
            No image verification records matching the selected filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredComplaints.map((c) => {
              const img = c.image;
              const v = img?.verification;
              const vStatus = v?.status || "INSUFFICIENT_EVIDENCE";

              return (
                <div key={c.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <span className="font-mono text-sm font-bold text-primary">{c.id}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({c.category} — {c.location})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge label={c.priority.label} score={c.priority.overall} />
                      <VerificationBadge status={vStatus} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      {img?.imageUrl ? (
                        <img
                          src={img.imageUrl}
                          alt={`Photo for ${c.id}`}
                          className="h-40 w-full rounded-lg object-cover border border-border bg-muted"
                        />
                      ) : (
                        <div className="h-40 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                          No Image Attached
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{img?.fileName || "No File"}</span>
                        <span>{img ? `${img.width}×${img.height} px` : "—"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Hash className="size-3.5 text-primary" /> SHA-256 Fingerprint
                      </div>
                      <Mono className="block truncate text-[11px] bg-muted/60 p-1.5 rounded">
                        {img?.sha256Hash || "Not computed"}
                      </Mono>

                      <div className="font-semibold text-foreground flex items-center gap-1 mt-2">
                        <Cpu className="size-3.5 text-primary" /> Perceptual Hash (8x8 Grid)
                      </div>
                      <Mono className="block truncate text-[11px] bg-muted/60 p-1.5 rounded">
                        {img?.perceptualHash || "Not computed"}
                      </Mono>

                      <div className="font-semibold text-foreground flex items-center gap-1 mt-2">
                        <MapPin className="size-3.5 text-primary" /> EXIF Provenance
                      </div>
                      <div className="bg-muted/60 p-1.5 rounded space-y-1 text-[11px]">
                        <div>Device: {img?.exif.device || "Metadata unavailable"}</div>
                        <div>GPS: {img?.exif.gpsAvailable ? "Present" : "Metadata unavailable"}</div>
                        <div>Software: {img?.exif.software || "Metadata unavailable"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 grid grid-cols-2 text-xs gap-2 bg-muted/30 p-2.5 rounded-lg">
                    <div>
                      <span className="text-muted-foreground">Visual Similarity: </span>
                      <span className="font-bold text-foreground">
                        {v?.visualSimilarity !== undefined ? `${Math.round(v.visualSimilarity * 100)}%` : "0%"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hamming Distance: </span>
                      <span className="font-bold text-foreground">{v?.hammingDistance ?? "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Geo Distance: </span>
                      <span className="font-bold text-foreground">
                        {v?.locationDistance !== null && v?.locationDistance !== undefined ? `${v.locationDistance} m` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Matched Target: </span>
                      <span className="font-bold text-foreground">{v?.matchedComplaintId || c.duplicateAnalysis?.matchedComplaintId || "None"}</span>
                    </div>
                  </div>

                  {c.verificationReview?.reviewed && (
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-600 border border-emerald-500/20">
                      <strong>Admin Review Record:</strong> {c.verificationReview.remarks} ({new Date(c.verificationReview.reviewedAt).toLocaleDateString()})
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                    {(v?.matchedComplaintId || c.duplicateAnalysis?.matchedComplaintId) ? (
                      <button
                        onClick={() => setInspectTarget(c)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <Eye className="size-3.5" /> Inspect Duplicate Modal
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">No candidate duplicate pair</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdminDecision(c.id, "confirm_duplicate")}
                        className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500/20"
                      >
                        <Check className="size-3.5" /> Confirm Duplicate
                      </button>
                      <button
                        onClick={() => handleAdminDecision(c.id, "mark_distinct")}
                        className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent"
                      >
                        <X className="size-3.5" /> Mark Distinct
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Duplicate Inspection Modal */}
      {inspectTarget && matchedTarget && (
        <DuplicateComparisonModal
          isOpen={Boolean(inspectTarget)}
          onClose={() => setInspectTarget(null)}
          newComplaint={inspectTarget}
          matchedComplaint={matchedTarget}
          analysis={{
            textSimilarity: inspectTarget.duplicateAnalysis?.textSimilarity || 0,
            imageSimilarity: inspectTarget.image?.verification.visualSimilarity || 0,
            locationDistance: inspectTarget.duplicateAnalysis?.locationDistance ?? inspectTarget.image?.verification.locationDistance,
            duplicateScore: inspectTarget.duplicateAnalysis?.duplicateScore || inspectTarget.image?.verification.combinedScore || 0,
          }}
          onConfirmDuplicate={() => {
            handleAdminDecision(inspectTarget.id, "confirm_duplicate");
            setInspectTarget(null);
          }}
          onMarkDistinct={() => {
            handleAdminDecision(inspectTarget.id, "mark_distinct");
            setInspectTarget(null);
          }}
        />
      )}
    </AppShell>
  );
}
