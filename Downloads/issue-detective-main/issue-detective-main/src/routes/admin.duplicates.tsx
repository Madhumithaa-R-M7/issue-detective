import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { StatusBadge, VerificationBadge } from "@/components/civic/badges";
import { KeyValue, Mono, Section } from "@/components/civic/ui-bits";
import { DuplicateComparisonModal } from "@/components/civic/DuplicateComparisonModal";
import { useCivic } from "@/lib/civic/store";
import type { Complaint } from "@/lib/civic/types";
import {
  analyzeDuplicates,
  computeTextSimilarity,
  haversineDistanceMeters,
  computeLocationSimilarity,
  computeDuplicateScore,
  DUPLICATE_THRESHOLD,
  DEFAULT_WEIGHTS,
} from "@/services/duplicateEngine.js";
import { calculateVisualSimilarity } from "@/services/verificationEngine.js";
import { Copy, Check, X, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/duplicates")({
  head: () => ({
    meta: [
      { title: "Duplicate Review Center — CivicConnect" },
      {
        name: "description",
        content: "Review potential duplicate complaints, inspect text cosine similarity, perceptual image similarity, and location proximity.",
      },
    ],
  }),
  component: AdminDuplicatesPage,
});

function AdminDuplicatesPage() {
  const { complaints, updateComplaint } = useCivic();
  const [modalPair, setModalPair] = useState<{ source: Complaint; target: Complaint; analysis: any } | null>(null);

  // Find all candidate duplicate pairs using 5-factor model
  const duplicatePairs: Array<{
    source: Complaint;
    target: Complaint;
    phashSim: number;
    cnnSim: number;
    textSim: number;
    imgSim: number;
    locSim: number;
    catSim: number;
    distMeters: number;
    dScore: number;
    analysis: any;
  }> = [];

  for (let i = 0; i < complaints.length; i++) {
    for (let j = i + 1; j < complaints.length; j++) {
      const c1 = complaints[i]!;
      const c2 = complaints[j]!;

      const analysis = analyzeDuplicates(c2, [c1]);
      const dScore = Math.round(analysis.duplicateScore * 100);

      if (
        dScore >= 40 ||
        c1.status === "Duplicate" ||
        c2.status === "Duplicate" ||
        c1.image?.verification?.status === "exact_duplicate" ||
        c2.image?.verification?.status === "exact_duplicate"
      ) {
        duplicatePairs.push({
          source: c1,
          target: c2,
          phashSim: Math.round((analysis.phashSimilarity || 0) * 100),
          cnnSim: Math.round((analysis.cnnFeatureSimilarity || 0) * 100),
          textSim: Math.round((analysis.descriptionSimilarity || analysis.textSimilarity || 0) * 100),
          imgSim: Math.round((analysis.imageSimilarity || 0) * 100),
          locSim: Math.round((analysis.locationSimilarity || 0) * 100),
          catSim: Math.round((analysis.categorySimilarity || 0) * 100),
          distMeters: analysis.locationDistance || 0,
          dScore,
          analysis,
        });
      }
    }
  }

  duplicatePairs.sort((a, b) => b.dScore - a.dScore);

  function handleConfirmDuplicate(targetId: string, sourceId: string) {
    updateComplaint(targetId, {
      status: "Duplicate",
      verificationReview: {
        reviewed: true,
        reviewedBy: "Admin",
        reviewedAt: new Date().toISOString(),
        decision: "confirm_duplicate",
        remarks: `Confirmed as duplicate of ${sourceId}`,
      },
    });
    toast.success(`Marked ${targetId} as Duplicate of ${sourceId}`);
  }

  function handleMarkDistinct(targetId: string) {
    updateComplaint(targetId, {
      status: "Under Analysis",
      verificationReview: {
        reviewed: true,
        reviewedBy: "Admin",
        reviewedAt: new Date().toISOString(),
        decision: "mark_distinct",
        remarks: "Marked as distinct complaint after admin review",
      },
    });
    toast.info(`Marked ${targetId} as distinct complaint`);
  }

  return (
    <AppShell>
      <PageHeader
        title="Duplicate Review Center"
        description="Side-by-side comparative inspection of candidate duplicate complaints matching on text cosine similarity, perceptual image hashing, and campus GPS proximity."
      />

      <div className="mb-4 rounded-xl border border-border bg-card p-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          5-Factor Duplicate Algorithm Threshold:
        </span>
        <span className="font-mono text-sm font-bold text-primary">
          {(DUPLICATE_THRESHOLD * 100).toFixed(0)}% (pHash + CNN + Haversine + Category + TF-IDF)
        </span>
      </div>

      <Section title="Candidate Duplicate Pairs">
        {duplicatePairs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            No duplicate complaints detected in the system.
          </div>
        ) : (
          <div className="space-y-6">
            {duplicatePairs.map(({ source, target, textSim, imgSim, locSim, distMeters, dScore }) => (
              <div key={`${source.id}-${target.id}`} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
                {/* Header score banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Copy className="size-5 text-amber-500" />
                    <span className="font-semibold text-foreground">Duplicate Match Score:</span>
                    <span className={`text-base font-bold ${dScore >= 80 ? "text-rose-500" : "text-amber-500"}`}>
                      {dScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span>Text Sim: <strong>{textSim}%</strong></span>
                    <span>Image Sim: <strong>{imgSim}%</strong></span>
                    <span>Proximity: <strong>{locSim}% ({distMeters}m)</strong></span>
                    <button
                      onClick={() =>
                        setModalPair({
                          source,
                          target,
                          analysis: {
                            textSimilarity: textSim / 100,
                            imageSimilarity: imgSim / 100,
                            locationDistance: distMeters,
                            duplicateScore: dScore / 100,
                          },
                        })
                      }
                      className="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 ml-2"
                    >
                      <Eye className="size-3.5" /> Compare Modal
                    </button>
                  </div>
                </div>

                {/* Side by side comparison */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Source */}
                  <div className="rounded-lg border border-border p-4 space-y-3 bg-background">
                    <div className="flex items-center justify-between">
                      <Link to="/complaint/$id" params={{ id: source.id }} className="font-mono font-bold text-primary hover:underline">
                        {source.id} (Existing)
                      </Link>
                      <StatusBadge status={source.status} />
                    </div>
                    <div className="text-sm font-semibold">{source.category} — {source.location}</div>
                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded border border-border">
                      "{source.description}"
                    </p>
                    {source.image && (
                      <img src={source.image.imageUrl} alt="" className="h-28 w-full rounded object-cover border border-border" />
                    )}
                  </div>

                  {/* Target */}
                  <div className="rounded-lg border border-border p-4 space-y-3 bg-background">
                    <div className="flex items-center justify-between">
                      <Link to="/complaint/$id" params={{ id: target.id }} className="font-mono font-bold text-primary hover:underline">
                        {target.id} (Candidate)
                      </Link>
                      <StatusBadge status={target.status} />
                    </div>
                    <div className="text-sm font-semibold">{target.category} — {target.location}</div>
                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded border border-border">
                      "{target.description}"
                    </p>
                    {target.image && (
                      <img src={target.image.imageUrl} alt="" className="h-28 w-full rounded object-cover border border-border" />
                    )}
                  </div>
                </div>

                {/* Resolution Action buttons */}
                <div className="flex justify-end gap-3 border-t border-border pt-3">
                  <button
                    onClick={() => handleConfirmDuplicate(target.id, source.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20"
                  >
                    <Check className="size-4" /> Confirm as Duplicate
                  </button>
                  <button
                    onClick={() => handleMarkDistinct(target.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent"
                  >
                    <X className="size-4" /> Mark as Distinct
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {modalPair && (
        <DuplicateComparisonModal
          isOpen={Boolean(modalPair)}
          onClose={() => setModalPair(null)}
          newComplaint={modalPair.target}
          matchedComplaint={modalPair.source}
          analysis={modalPair.analysis}
          onConfirmDuplicate={() => {
            handleConfirmDuplicate(modalPair.target.id, modalPair.source.id);
            setModalPair(null);
          }}
          onMarkDistinct={() => {
            handleMarkDistinct(modalPair.target.id);
            setModalPair(null);
          }}
        />
      )}
    </AppShell>
  );
}
