import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { PageHeader } from "@/components/civic/PageHeader";
import { formatDate } from "@/components/civic/ComplaintRow";
import { EmptyState } from "@/components/civic/ui-bits";
import { useCivic } from "@/lib/civic/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CivicConnect" },
      {
        name: "description",
        content: "Status updates, duplicate alerts and resolution notices for your campus reports.",
      },
      { property: "og:title", content: "Notifications — CivicConnect" },
      {
        property: "og:description",
        content: "Status updates and duplicate alerts for your campus reports.",
      },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const { notifications, markNotificationsRead } = useCivic();

  useEffect(() => {
    const t = setTimeout(markNotificationsRead, 1200);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <AppShell>
      <PageHeader title="Notifications" description="Every update on the issues you reported." />
      {notifications.length === 0 ? (
        <EmptyState title="No notifications yet" />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn("card-surface flex gap-3 p-4", !n.read && "border-l-4 border-l-primary")}
            >
              <span className="mt-0.5 rounded-lg bg-info-soft p-2 text-primary">
                <Bell className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(n.at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
