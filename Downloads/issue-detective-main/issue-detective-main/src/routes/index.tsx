import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, Wrench, Lock, ArrowRight, CheckCircle2, FileCheck2, Cpu } from "lucide-react";
import type { Role } from "@/lib/civic/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicConnect — Smart Campus Complaint & Image Verification" },
      {
        name: "description",
        content:
          "Report campus issues with photo evidence. CivicConnect verifies images with SHA-256 and perceptual hashing, detects duplicates, scores priority and routes work to the right staff.",
      },
      { property: "og:title", content: "CivicConnect — Smart Campus Complaint Platform" },
      {
        property: "og:description",
        content:
          "Photo-verified campus complaints with duplicate detection, priority scoring and automatic staff assignment.",
      },
    ],
  }),
  component: Landing,
});

const PORTAL_CARDS: Array<{
  role: Role;
  title: string;
  desc: string;
  badge: string;
  icon: typeof ShieldCheck;
  loginPath: string;
  demoUsername: string;
}> = [
  {
    role: "admin",
    title: "Administrator Portal",
    desc: "Manage campus complaints, review SHA-256 / pHash duplicates, SLA metrics and staff rosters.",
    badge: "Admin Access",
    icon: ShieldCheck,
    loginPath: "/login?role=admin",
    demoUsername: "rescuenet.in@gmail.com",
  },
  {
    role: "student",
    title: "Student Portal",
    desc: "Submit photo-verified civic complaints, track repair progress and provide resolution feedback.",
    badge: "Student Access",
    icon: Users,
    loginPath: "/login?role=student",
    demoUsername: "aaryav@civicconnect.edu",
  },
  {
    role: "staff",
    title: "Maintenance Staff Portal",
    desc: "View assigned repair tasks, update job progress and upload before/after work resolution proof.",
    badge: "Staff Access",
    icon: Wrench,
    loginPath: "/login?role=staff",
    demoUsername: "ramesh.kumar@civicconnect.edu",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <header className="brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <ShieldCheck className="size-3.5" /> Image-Verified Campus Management Platform
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight font-bold sm:text-5xl">
            CivicConnect — campus issues reported once, verified properly, fixed faster.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/85">
            Students report problems with a photo. The platform checks the image for duplicates,
            confirms the location, scores urgency, and routes work to the right department automatically.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login?role=student"
              className="rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-float)]"
            >
              Sign In to Report Issue
            </Link>
            <Link
              to="/login?role=admin"
              className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-white/10 transition-colors"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Dedicated Portal Selection */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="size-4 text-primary" />
          <h2 className="font-display text-2xl font-bold">Select Your Portal Sign-In</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose your role below to open the dedicated Sign In page for your account.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {PORTAL_CARDS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.role}
                className="card-surface p-6 rounded-2xl border border-border flex flex-col justify-between transition-all hover:shadow-lg hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="brand-gradient inline-grid size-11 place-items-center rounded-xl text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {portal.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{portal.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{portal.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[11px] text-muted-foreground mb-3">
                    Authorized Username: <span className="font-mono text-foreground font-medium">{portal.demoUsername}</span>
                  </p>
                  <Link
                    to={portal.loginPath}
                    className="w-full rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/15 px-4 py-2.5 text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
                  >
                    Open {portal.badge} Sign In
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        CivicConnect · Smart Campus Civic Issue Reporting & Image Verification Platform
      </footer>
    </div>
  );
}
