import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Cpu,
  FileStack,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Map,
  PlusCircle,
  ScanSearch,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCivic } from "@/lib/civic/store";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Bell;
}

const STUDENT_NAV: NavItem[] = [
  { to: "/report", label: "Report an Issue", icon: PlusCircle },
  { to: "/my-complaints", label: "My Complaints", icon: ListChecks },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/complaints", label: "Complaint Analysis", icon: FileStack },
  { to: "/admin/staff", label: "Staff Roster", icon: Users },
  { to: "/admin/verification", label: "Image Verification", icon: ScanSearch },
  { to: "/admin/duplicates", label: "Duplicate Review", icon: ShieldCheck },
  { to: "/admin/sla", label: "SLA Monitoring", icon: BarChart3 },
  { to: "/admin/map", label: "Campus Map", icon: Map },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/algorithms", label: "Algorithm Panel", icon: Cpu },
];

const STAFF_NAV: NavItem[] = [{ to: "/staff", label: "My Assigned Jobs", icon: Wrench }];

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, notifications, studentName } = useCivic();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => !n.read).length;

  const nav =
    pathname.startsWith("/admin") || role === "admin"
      ? ADMIN_NAV
      : pathname.startsWith("/staff") || role === "staff"
        ? STAFF_NAV
        : STUDENT_NAV;

  const who =
    role === "admin"
      ? { name: "Admin Office", sub: "Campus Administration" }
      : role === "staff"
        ? { name: "Ramesh Kumar", sub: "Maintenance / Plumbing" }
        : { name: studentName, sub: "Student — AI & DS, 2023-2027" };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/" className="flex items-center gap-3 px-5 py-6">
          <span className="brand-gradient grid size-10 place-items-center rounded-xl">
            <ShieldCheck className="size-5 text-primary-foreground" />
          </span>
          <span>
            <span className="block font-display text-lg leading-tight font-semibold">
              CivicConnect
            </span>
            <span className="block text-xs text-sidebar-foreground/60">Smart Campus Platform</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
                {item.to === "/notifications" && unread > 0 && (
                  <span className="ml-auto rounded-full bg-critical px-1.5 py-0.5 text-[10px] font-bold text-critical-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <p className="text-sm font-semibold">{who.name}</p>
          <p className="text-xs text-sidebar-foreground/60">{who.sub}</p>
          <Link
            to="/"
            onClick={() => setRole(null)}
            className="mt-3 inline-flex items-center gap-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            <LogOut className="size-3.5" /> Switch role
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 overflow-x-auto border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                pathname === item.to ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
