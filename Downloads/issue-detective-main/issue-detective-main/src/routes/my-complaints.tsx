import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { ComplaintRow } from "@/components/civic/ComplaintRow";
import { PageHeader } from "@/components/civic/PageHeader";
import { EmptyState } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-complaints")({
  head: () => ({
    meta: [
      { title: "My Complaints — CivicConnect" },
      {
        name: "description",
        content: "Track every campus issue you reported, its verification result and current status.",
      },
      { property: "og:title", content: "My Complaints — CivicConnect" },
      {
        property: "og:description",
        content: "Track your reported campus issues and their verification results.",
      },
    ],
  }),
  component: MyComplaints,
});

const FILTERS = ["All", "Open", "Resolved", "Duplicate"] as const;

function MyComplaints() {
  const { complaints, studentName } = useCivic();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const mine = useMemo(
    () => complaints.filter((c) => c.studentName === studentName),
    [complaints, studentName],
  );

  const shown = mine.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Resolved") return c.status === "Resolved" || c.status === "Closed";
    if (filter === "Duplicate") return c.status === "Duplicate";
    return !["Resolved", "Closed", "Duplicate"].includes(c.status);
  });

  return (
    <AppShell>
      <PageHeader
        title="My Complaints"
        description="Everything you have reported, with its verification outcome and live status."
        actions={
          <Link
            to="/report"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Report new issue
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium",
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          hint="Report an issue with a photo and it will appear in this list."
        />
      ) : (
        <div className="space-y-3">
          {shown.map((c) => (
            <ComplaintRow key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
