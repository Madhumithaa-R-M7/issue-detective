import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CURRENT_STUDENT, SEED_COMPLAINTS, STAFF as INITIAL_STAFF } from "./data";
import type { Complaint, EscalationRecord, Role, Staff, StaffStatus } from "./types";
import { processComplaintIntelligence } from "@/services/intelligenceSuite.js";
import { computeStaffMcdmScore } from "@/services/mcdmRouter.js";
import { scanComplaintsForEscalations } from "@/services/escalationEngine.js";
import {
  fetchComplaintsApi,
  createComplaintApi,
  updateComplaintApi,
  reassignStaffApi,
  rerouteDepartmentApi,
  fetchStaffApi,
  updateStaffStatusApi,
  fetchNotificationsApi,
  markNotificationsReadApi,
  recalculatePrioritiesApi,
} from "./api";

const STORAGE_KEY = "civicconnect.state.v1";

interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
}

interface CivicState {
  role: Role | null;
  complaints: Complaint[];
  staff: Staff[];
  notifications: Notification[];
  escalations: EscalationRecord[];
  isBackendConnected: boolean;
}

interface CivicContextValue extends CivicState {
  studentName: string;
  setRole: (role: Role | null) => void;
  addComplaint: (c: Complaint) => void;
  updateComplaint: (id: string, patch: Partial<Complaint>) => void;
  reassignStaff: (complaintId: string, staffId: string, adminName?: string, reason?: string) => void;
  unassignStaff: (complaintId: string, adminName?: string, reason?: string) => void;
  rerouteDepartment: (complaintId: string, newDept: string, adminName?: string, reason?: string) => void;
  updateStaffStatus: (staffId: string, status: StaffStatus) => void;
  recalculateAllPriorities: () => void;
  nextComplaintId: () => string;
  markNotificationsRead: () => void;
  refreshFromBackend: () => Promise<void>;
}

const CivicContext = createContext<CivicContextValue | null>(null);

const initialState: CivicState = {
  role: null,
  complaints: SEED_COMPLAINTS,
  staff: INITIAL_STAFF,
  notifications: [
    {
      id: "n1",
      title: "Complaint CIV-00025 is in progress",
      body: "Ramesh Kumar (Plumbing) has started work on your water leakage report.",
      at: "2026-09-20T11:10:00Z",
      read: false,
    },
  ],
  escalations: [],
  isBackendConnected: false,
};

export function CivicProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CivicState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Fetch real data from MongoDB backend on mount
  const refreshFromBackend = useCallback(async () => {
    try {
      const [compRes, staffRes, notifRes] = await Promise.all([
        fetchComplaintsApi().catch(() => null),
        fetchStaffApi().catch(() => null),
        fetchNotificationsApi().catch(() => null),
      ]);

      if (compRes?.success && Array.isArray(compRes.complaints)) {
        setState((s) => ({
          ...s,
          isBackendConnected: true,
          complaints: compRes.complaints.length > 0 ? compRes.complaints : s.complaints,
          staff: staffRes?.success && Array.isArray(staffRes.staff) && staffRes.staff.length > 0 ? staffRes.staff : s.staff,
          notifications:
            notifRes?.success && Array.isArray(notifRes.notifications) && notifRes.notifications.length > 0
              ? notifRes.notifications
              : s.notifications,
        }));
      }
    } catch {
      /* fallback to local state */
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CivicState>;
        setState((s) => ({
          ...s,
          ...parsed,
          staff: parsed.staff && parsed.staff.length > 0 ? parsed.staff : INITIAL_STAFF,
          escalations: parsed.escalations || [],
        }));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);

    // Initial backend fetch
    refreshFromBackend();
  }, [refreshFromBackend]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode */
    }
  }, [state, hydrated]);

  // Periodic SLA scan
  useEffect(() => {
    if (!hydrated) return;
    const newEscs = scanComplaintsForEscalations(state.complaints, state.escalations);
    if (newEscs.length > 0) {
      setState((s) => {
        const newNotifs: Notification[] = newEscs.map((esc) => ({
          id: `n-esc-${esc.complaintId}-${Date.now()}`,
          title: `SLA Alert: ${esc.complaintId} ${esc.status}`,
          body: `Complaint ${esc.complaintId} (${esc.escalationName}) — ${esc.reason}`,
          at: esc.triggeredAt,
          read: false,
        }));
        return {
          ...s,
          escalations: [...newEscs, ...s.escalations],
          notifications: [...newNotifs, ...s.notifications],
        };
      });
    }
  }, [hydrated, state.complaints, state.escalations]);

  const setRole = useCallback((role: Role | null) => setState((s) => ({ ...s, role })), []);

  const recalculateAllPriorities = useCallback(() => {
    // Call backend API
    recalculatePrioritiesApi().catch(() => null);

    setState((s) => {
      const updatedComplaints = s.complaints.map((c, _, list) => {
        const intel = processComplaintIntelligence(c, list, s.staff);
        if (!intel) return c;
        return {
          ...c,
          classificationInfo: intel.classificationInfo,
          urgencyInfo: intel.urgencyInfo,
          severityInfo: intel.severityInfo,
          communityImpactInfo: intel.communityImpactInfo,
          geospatialInfo: intel.geospatialInfo as any,
          recurrenceInfo: intel.recurrenceInfo,
          slaAgingInfo: intel.slaAgingInfo,
          priority: {
            ...c.priority,
            severity: intel.priority.severity,
            urgency: intel.priority.urgency,
            community: intel.priority.community,
            location: intel.priority.location,
            recurrence: intel.priority.recurrence,
            slaAging: intel.priority.slaAging,
            overall: intel.priority.overall,
            label: intel.priority.label as any,
          },
          priorityFactors: intel.priorityFactors,
          priorityExplanations: intel.priorityExplanations,
          priorityUpdatedAt: intel.priorityUpdatedAt,
        };
      });
      return { ...s, complaints: updatedComplaints };
    });
  }, []);

  const addComplaint = useCallback(async (c: Complaint) => {
    // 1. Optimistic Local State Update
    const intel = processComplaintIntelligence(c, state.complaints, state.staff);
    const enriched: Complaint = intel
      ? {
          ...c,
          classificationInfo: intel.classificationInfo,
          urgencyInfo: intel.urgencyInfo,
          severityInfo: intel.severityInfo,
          communityImpactInfo: intel.communityImpactInfo,
          geospatialInfo: intel.geospatialInfo as any,
          recurrenceInfo: intel.recurrenceInfo,
          slaAgingInfo: intel.slaAgingInfo,
          priority: {
            ...c.priority,
            severity: intel.priority.severity,
            urgency: intel.priority.urgency,
            community: intel.priority.community,
            location: intel.priority.location,
            recurrence: intel.priority.recurrence,
            slaAging: intel.priority.slaAging,
            overall: intel.priority.overall,
            label: intel.priority.label as any,
          },
          priorityFactors: intel.priorityFactors,
          priorityExplanations: intel.priorityExplanations,
          priorityUpdatedAt: intel.priorityUpdatedAt,
          department: intel.routingInfo?.department || c.department,
          assignedStaffId: intel.assignmentInfo?.assignedStaffId || c.assignedStaffId,
          routingInfo: intel.routingInfo,
          assignmentInfo: intel.assignmentInfo,
          assignmentFactors: intel.assignmentFactors,
          routingHistory: intel.routingHistory,
          assignmentHistory: intel.assignmentHistory,
        }
      : c;

    setState((s) => ({
      ...s,
      complaints: [enriched, ...s.complaints],
      notifications: [
        {
          id: `n-${c.id}`,
          title: `Complaint ${c.id} submitted`,
          body: `${c.category} at ${c.location} — routed to ${enriched.department}.`,
          at: new Date().toISOString(),
          read: false,
        },
        ...s.notifications,
      ],
    }));

    // 2. Persist to Express + MongoDB Backend
    try {
      const apiRes = await createComplaintApi(enriched);
      if (apiRes?.success && apiRes.complaint) {
        setState((s) => ({
          ...s,
          complaints: s.complaints.map((comp) => (comp.id === c.id ? apiRes.complaint : comp)),
        }));
      }
    } catch (err) {
      console.warn("Backend API sync fallback:", err);
    }
  }, [state.complaints, state.staff]);

  const updateComplaint = useCallback((id: string, patch: Partial<Complaint>) => {
    updateComplaintApi(id, patch).catch(() => null);

    setState((s) => ({
      ...s,
      complaints: s.complaints.map((c) => {
        if (c.id !== id) return c;
        const nowISO = new Date().toISOString();
        const isResolving = (patch.status === "Resolved" || patch.status === "Closed") && !c.resolvedAt;
        const isReopening = patch.status === "In Progress" && c.status === "Resolved";

        return {
          ...c,
          ...patch,
          resolvedAt: isResolving ? patch.resolvedAt || nowISO : c.resolvedAt,
          reopenedAt: isReopening ? nowISO : c.reopenedAt,
        };
      }),
    }));
  }, []);

  const reassignStaff = useCallback(
    (complaintId: string, staffId: string, adminName = "Admin Override", reason = "Manual Admin Assignment") => {
      reassignStaffApi(complaintId, staffId, adminName, reason).catch(() => null);

      setState((s) => {
        const targetStaff = s.staff.find((st) => st.id === staffId);
        if (!targetStaff) return s;

        const nowISO = new Date().toISOString();
        const updatedComplaints = s.complaints.map((c) => {
          if (c.id !== complaintId) return c;

          const scoreRes = computeStaffMcdmScore(targetStaff, c);
          const newAssignmentHistoryEntry = {
            staffId: targetStaff.id,
            staffName: targetStaff.name,
            department: targetStaff.department,
            assignedAt: nowISO,
            assignedBy: adminName,
            method: "Manual Admin Assignment",
            mcdmScore: scoreRes.score,
            factors: scoreRes.factors,
            reason,
            override: true,
            overrideReason: reason,
            overriddenBy: adminName,
            overriddenAt: nowISO,
          };

          return {
            ...c,
            assignedStaffId: targetStaff.id,
            department: targetStaff.department,
            status: c.status === "Submitted" || c.status === "Under Analysis" ? ("Assigned" as const) : c.status,
            override: true,
            overrideReason: reason,
            overriddenBy: adminName,
            overriddenAt: nowISO,
            assignment: {
              staffId: targetStaff.id,
              staffName: targetStaff.name,
              department: targetStaff.department,
              method: "Manual Admin Assignment",
              mcdmScore: scoreRes.score,
              assignedAt: nowISO,
            },
            assignmentStatus: "Assigned",
            assignmentInfo: {
              assignedStaffId: targetStaff.id,
              assignedStaffName: targetStaff.name,
              assignedAt: nowISO,
              status: "Assigned" as const,
              mcdmScore: scoreRes.score,
            },
            assignmentFactors: scoreRes.factors,
            assignmentHistory: [...(c.assignmentHistory || []), newAssignmentHistoryEntry],
          };
        });

        return {
          ...s,
          complaints: updatedComplaints,
        };
      });
    },
    []
  );

  const unassignStaff = useCallback(
    (complaintId: string, adminName = "Admin Override", reason = "Manual Unassignment") => {
      setState((s) => {
        const nowISO = new Date().toISOString();
        const updatedComplaints = s.complaints.map((c) => {
          if (c.id !== complaintId) return c;

          return {
            ...c,
            assignedStaffId: null,
            assignmentStatus: "Unassigned",
            override: true,
            overrideReason: reason,
          };
        });

        return { ...s, complaints: updatedComplaints };
      });
    },
    []
  );

  const rerouteDepartment = useCallback(
    (complaintId: string, newDept: string, adminName = "Admin Override", reason = "Manual Admin Rerouting") => {
      rerouteDepartmentApi(complaintId, newDept, adminName, reason).catch(() => null);

      setState((s) => {
        const nowISO = new Date().toISOString();
        const updatedComplaints = s.complaints.map((c) => {
          if (c.id !== complaintId) return c;

          const newRoutingEntry = {
            department: newDept,
            routedAt: nowISO,
            routedBy: adminName,
            method: "Manual Admin Rerouting",
            reason,
            override: true,
          };

          return {
            ...c,
            department: newDept,
            routing: {
              department: newDept,
              method: "Manual Admin Rerouting",
              reason,
              routedAt: nowISO,
            },
            routingHistory: [...(c.routingHistory || []), newRoutingEntry],
          };
        });

        return { ...s, complaints: updatedComplaints };
      });
    },
    []
  );

  const updateStaffStatus = useCallback((staffId: string, status: StaffStatus) => {
    updateStaffStatusApi(staffId, status).catch(() => null);

    setState((s) => ({
      ...s,
      staff: s.staff.map((st) =>
        st.id === staffId
          ? {
              ...st,
              currentStatus: status,
              available: status === "Available" || status === "Busy",
            }
          : st
      ),
    }));
  }, []);

  const nextComplaintId = useCallback(() => {
    const max = state.complaints.reduce((m, c) => {
      const n = Number(c.id.replace("CIV-", ""));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 25);
    return `CIV-${String(max + 1).padStart(5, "0")}`;
  }, [state.complaints]);

  const markNotificationsRead = useCallback(() => {
    markNotificationsReadApi().catch(() => null);
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const value = useMemo<CivicContextValue>(
    () => ({
      ...state,
      studentName: CURRENT_STUDENT,
      setRole,
      addComplaint,
      updateComplaint,
      reassignStaff,
      unassignStaff,
      rerouteDepartment,
      updateStaffStatus,
      recalculateAllPriorities,
      nextComplaintId,
      markNotificationsRead,
      refreshFromBackend,
    }),
    [
      state,
      setRole,
      addComplaint,
      updateComplaint,
      reassignStaff,
      unassignStaff,
      rerouteDepartment,
      updateStaffStatus,
      recalculateAllPriorities,
      nextComplaintId,
      markNotificationsRead,
      refreshFromBackend,
    ]
  );

  return <CivicContext.Provider value={value}>{children}</CivicContext.Provider>;
}

export function useCivic() {
  const ctx = useContext(CivicContext);
  if (!ctx) throw new Error("useCivic must be used inside CivicProvider");
  return ctx;
}

export type { Notification };
