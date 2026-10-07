import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { PriorityBadge } from "@/components/civic/badges";
import { KeyValue, Mono, Section } from "@/components/civic/ui-bits";
import { CAMPUS_LOCATIONS } from "@/utils/campusLocations.js";
import { runDbscanClustering } from "@/services/geospatialEngine.js";
import { useCivic } from "@/lib/civic/store";
import { MapPin, Flame, X } from "lucide-react";

export const Route = createFileRoute("/admin/map")({
  head: () => ({
    meta: [
      { title: "Campus Map & Hotspots — CivicConnect" },
      {
        name: "description",
        content: "Interactive campus spatial view displaying complaint locations and DBSCAN density-based issue clusters.",
      },
    ],
  }),
  component: AdminMapPage,
});

function AdminMapPage() {
  const { complaints } = useCivic();
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);

  // Compute DBSCAN spatial clusters
  const clusters = runDbscanClustering(complaints, 80, 2);

  const hasLocationData = complaints.some((c) => c.lat && c.lng);

  return (
    <AppShell>
      <PageHeader
        title="Campus Map & Spatial Hotspot Detection"
        description="Spatial distribution of campus complaints with live DBSCAN density-based hotspot clustering operating on Haversine distance."
      />

      {!hasLocationData ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Location data unavailable.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <span>Campus Spatial View (VIT Campus Bounds)</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{complaints.length} active complaint markers</span>
            </div>

            {/* Visual Campus Map Container */}
            <div className="relative min-h-[380px] w-full rounded-lg border border-border bg-slate-950 p-4 text-slate-100 overflow-hidden flex flex-col justify-between">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-slate-200">Campus Center Coordinates</div>
                  <div className="font-mono text-slate-400">12.9721° N, 79.1601° E</div>
                </div>
                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  <Flame className="size-3.5" /> {clusters.length} DBSCAN Hotspots Active
                </div>
              </div>

              {/* Pins Grid Representation */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
                {CAMPUS_LOCATIONS.slice(0, 9).map((loc) => {
                  const locComplaints = complaints.filter((c) => c.location === loc.name);
                  const matchingCluster = clusters.find((cl) => cl.locationName === loc.name);
                  const isHotspot = Boolean(matchingCluster);

                  return (
                    <button
                      key={loc.name}
                      onClick={() => matchingCluster && setSelectedHotspot(matchingCluster)}
                      className={`p-3 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                        isHotspot
                          ? "bg-rose-950/50 border-rose-500/60 text-rose-200 hover:bg-rose-900/60 ring-1 ring-rose-500/30"
                          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{loc.name}</span>
                        {isHotspot && <Flame className="size-3.5 text-rose-400 animate-pulse" />}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{locComplaints.length} issues</span>
                        <span className="font-mono">{loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 text-[11px] text-slate-400 flex justify-between items-center bg-slate-900/80 p-2 rounded border border-slate-800">
                <span>DBSCAN parameters: eps = 80m, minPts = 2</span>
                <span>Distance Metric: Haversine Formula</span>
              </div>
            </div>
          </div>

          {/* Hotspots Sidebar */}
          <div className="space-y-4">
            <Section title="DBSCAN Hotspot Clusters">
              {clusters.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground text-center">
                  No spatial hotspot clusters detected.
                </div>
              ) : (
                <div className="space-y-3">
                  {clusters.map((cl) => (
                    <div
                      key={cl.clusterId}
                      onClick={() => setSelectedHotspot(cl)}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2 hover:bg-rose-500/10 cursor-pointer transition-colors shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-600 text-sm flex items-center gap-1.5">
                          <Flame className="size-4" /> {cl.clusterId}: {cl.locationName}
                        </span>
                        <span className="text-xs bg-rose-500/20 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                          {cl.nearbyComplaintCount} Issues
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Main: <strong>{cl.mainCategory}</strong></span>
                        <span>Avg Priority: <strong>{cl.avgPriority}/10</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      )}

      {/* Full Location Complaints Table */}
      <Section title="Location Complaint Registry">
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Location Name</th>
                <th className="px-4 py-3">Coordinates</th>
                <th className="px-4 py-3">Total Issues</th>
                <th className="px-4 py-3">Status Breakdown</th>
                <th className="px-4 py-3">Hotspot Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CAMPUS_LOCATIONS.map((loc) => {
                const locComplaints = complaints.filter((c) => c.location === loc.name);
                const matchingCluster = clusters.find((cl) => cl.locationName === loc.name);
                const isHotspot = Boolean(matchingCluster);

                return (
                  <tr key={loc.name} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{loc.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{loc.lat}, {loc.lng}</td>
                    <td className="px-4 py-3 font-semibold">{locComplaints.length}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {locComplaints.length > 0 ? (
                        locComplaints.map((c) => c.category).join(", ")
                      ) : (
                        "No reported issues"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isHotspot ? (
                        <button
                          onClick={() => setSelectedHotspot(matchingCluster)}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
                        >
                          <Flame className="size-3" /> 🔥 Hotspot ({matchingCluster.nearbyComplaintCount})
                        </button>
                      ) : (
                        <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Hotspot Detail Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
                <Flame className="size-5" /> Hotspot Detail — {selectedHotspot.clusterId}
              </div>
              <button onClick={() => setSelectedHotspot(null)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <KeyValue label="Location Zone" value={selectedHotspot.locationName} />
              <KeyValue label="Nearby Complaint Count" value={`${selectedHotspot.nearbyComplaintCount} complaints within 80m`} />
              <KeyValue label="Main Category" value={selectedHotspot.mainCategory} />
              <KeyValue label="Average Priority Rating" value={`${selectedHotspot.avgPriority} / 10`} />
              <KeyValue
                label="Centroid Coordinates"
                value={<Mono>{selectedHotspot.centroid.lat.toFixed(4)}, {selectedHotspot.centroid.lng.toFixed(4)}</Mono>}
              />
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-xs font-semibold mb-2">Related Complaint IDs:</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {selectedHotspot.points.map((pt: any) => (
                  <div key={pt.id} className="flex items-center justify-between bg-muted/40 p-2 rounded text-xs">
                    <Link to="/complaint/$id" params={{ id: pt.id }} className="font-mono font-bold text-primary hover:underline">
                      {pt.id}
                    </Link>
                    <span>{pt.category}</span>
                    <span className="font-semibold text-foreground">{pt.priority}/10</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-end">
              <button
                onClick={() => setSelectedHotspot(null)}
                className="rounded-xl border border-input px-4 py-2 text-xs font-semibold hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
