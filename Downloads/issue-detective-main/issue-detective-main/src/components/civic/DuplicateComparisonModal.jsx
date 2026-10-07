import React from "react";
import { AlertTriangle, Check, X, Copy, MapPin, FileText, Image as ImageIcon, Calendar } from "lucide-react";
import { VerificationBadge } from "./badges";
import { Mono } from "./ui-bits";

/**
 * 10. DUPLICATE COMPARISON MODAL
 * Side-by-side comparison UI for potential duplicate complaints
 */
export function DuplicateComparisonModal({
  isOpen,
  onClose,
  newComplaint,
  matchedComplaint,
  analysis,
  onConfirmDuplicate,
  onMarkDistinct,
  readOnly = false,
}) {
  if (!isOpen || !newComplaint || !matchedComplaint) return null;

  const phashSim = analysis?.phashSimilarity !== undefined
    ? Math.round(analysis.phashSimilarity * 100)
    : Math.round((analysis?.imageSimilarity || 0) * 100);
  const cnnSim = analysis?.cnnFeatureSimilarity !== undefined
    ? Math.round(analysis.cnnFeatureSimilarity * 100)
    : Math.round((analysis?.imageSimilarity || 0) * 100);
  const locSim = analysis?.locationSimilarity !== undefined
    ? Math.round(analysis.locationSimilarity * 100)
    : 0;
  const catSim = analysis?.categorySimilarity !== undefined
    ? Math.round(analysis.categorySimilarity * 100)
    : 0;
  const descSim = analysis?.descriptionSimilarity !== undefined
    ? Math.round(analysis.descriptionSimilarity * 100)
    : Math.round((analysis?.textSimilarity || 0) * 100);

  const distMeters =
    analysis?.locationDistance !== null && analysis?.locationDistance !== undefined
      ? `${analysis.locationDistance} m`
      : "N/A";

  const duplicateScore =
    analysis?.duplicateScore !== undefined
      ? Math.round(analysis.duplicateScore * 100)
      : 0;

  const isDuplicate = duplicateScore >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
              <Copy className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">5-Factor Duplicate Analysis</h2>
              <p className="text-xs text-muted-foreground">
                pHash + CNN Features + Haversine Location + Category Match + TF-IDF Description
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 5-Factor Comparative Score Banner */}
        <div className="grid gap-2 sm:grid-cols-6 bg-muted/60 p-4 rounded-xl border border-border text-center">
          <div className="p-2 bg-background rounded-lg border border-border">
            <div className="text-[11px] text-muted-foreground font-medium">pHash Sim</div>
            <div className="text-base font-bold text-foreground">{phashSim}%</div>
          </div>
          <div className="p-2 bg-background rounded-lg border border-border">
            <div className="text-[11px] text-muted-foreground font-medium">CNN Features</div>
            <div className="text-base font-bold text-foreground">{cnnSim}%</div>
          </div>
          <div className="p-2 bg-background rounded-lg border border-border">
            <div className="text-[11px] text-muted-foreground font-medium">Haversine ({distMeters})</div>
            <div className="text-base font-bold text-foreground">{locSim}%</div>
          </div>
          <div className="p-2 bg-background rounded-lg border border-border">
            <div className="text-[11px] text-muted-foreground font-medium">Category Match</div>
            <div className="text-base font-bold text-foreground">{catSim}%</div>
          </div>
          <div className="p-2 bg-background rounded-lg border border-border">
            <div className="text-[11px] text-muted-foreground font-medium">TF-IDF Desc</div>
            <div className="text-base font-bold text-foreground">{descSim}%</div>
          </div>
          <div className={`p-2 rounded-lg border ${isDuplicate ? "bg-rose-500/10 border-rose-500/30" : "bg-emerald-500/10 border-emerald-500/30"}`}>
            <div className="text-[11px] font-semibold text-muted-foreground">Overall Score</div>
            <div className={`text-base font-extrabold ${isDuplicate ? "text-rose-500" : "text-emerald-500"}`}>
              {duplicateScore}%
            </div>
          </div>
        </div>

        {/* Side-by-Side Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* NEW COMPLAINT */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">New Complaint</span>
              <Mono className="text-xs font-bold text-foreground">{newComplaint.id || "Draft"}</Mono>
            </div>

            <div className="space-y-2 text-sm">
              <div className="font-semibold text-foreground">{newComplaint.category}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-primary" /> {newComplaint.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5 text-primary" /> {newComplaint.submittedAt ? new Date(newComplaint.submittedAt).toLocaleString() : "Just now"}
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border min-h-[60px]">
                "{newComplaint.description}"
              </div>

              {newComplaint.image?.imageUrl ? (
                <div className="space-y-1">
                  <img
                    src={newComplaint.image.imageUrl}
                    alt="New submission evidence"
                    className="h-44 w-full rounded-lg object-cover border border-border"
                  />
                  {newComplaint.image.verification && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Status:</span>
                      <VerificationBadge status={newComplaint.image.verification.status} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-44 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                  No image attached
                </div>
              )}
            </div>
          </div>

          {/* POSSIBLE MATCH */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Possible Match</span>
              <Mono className="text-xs font-bold text-foreground">{matchedComplaint.id}</Mono>
            </div>

            <div className="space-y-2 text-sm">
              <div className="font-semibold text-foreground">{matchedComplaint.category}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-amber-500" /> {matchedComplaint.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5 text-amber-500" /> {new Date(matchedComplaint.submittedAt).toLocaleString()}
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border min-h-[60px]">
                "{matchedComplaint.description}"
              </div>

              {matchedComplaint.image?.imageUrl ? (
                <div className="space-y-1">
                  <img
                    src={matchedComplaint.image.imageUrl}
                    alt="Matching complaint evidence"
                    className="h-44 w-full rounded-lg object-cover border border-border"
                  />
                  {matchedComplaint.image.verification && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Status:</span>
                      <VerificationBadge status={matchedComplaint.image.verification.status} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-44 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                  No image attached on archived complaint
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Decision Banner */}
        <div className={`rounded-xl p-3 text-xs flex items-start gap-2 border ${isDuplicate ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "bg-blue-500/10 border-blue-500/30 text-blue-600"}`}>
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <div>
            <strong>Algorithm Decision Rule (Threshold 0.80):</strong>{" "}
            {isDuplicate ? (
              <span>
                Overall Score <strong>{duplicateScore}% ≥ 80%</strong> → Flagged as potential duplicate of existing record <strong>{matchedComplaint.id}</strong>. Confirming will show existing record and mark state as <strong>IN_PROGRESS</strong>.
              </span>
            ) : (
              <span>
                Overall Score <strong>{duplicateScore}% &lt; 80%</strong> → Below duplicate threshold. Verified as distinct submission; proceed to create new report.
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Close
          </button>
          {!readOnly && onMarkDistinct && (
            <button
              onClick={onMarkDistinct}
              className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
            >
              <X className="size-4" /> Keep as Distinct Complaint
            </button>
          )}
          {!readOnly && onConfirmDuplicate && (
            <button
              onClick={onConfirmDuplicate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
            >
              <Check className="size-4" /> Confirm as Duplicate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
