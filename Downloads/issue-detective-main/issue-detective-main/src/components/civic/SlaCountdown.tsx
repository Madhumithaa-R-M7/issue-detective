import { useEffect, useState } from "react";
import { Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { computeSlaAging } from "@/services/slaEngine.js";

interface SlaCountdownProps {
  submittedAt: string;
  slaHours: number;
  priorityLabel?: string;
  className?: string;
  showIcon?: boolean;
}

export function SlaCountdown({
  submittedAt,
  slaHours,
  priorityLabel = "Medium",
  className = "",
  showIcon = true,
}: SlaCountdownProps) {
  const [slaData, setSlaData] = useState(() => computeSlaAging(submittedAt, priorityLabel, slaHours));

  useEffect(() => {
    // Re-calculate SLA metrics immediately and set interval for live update
    const update = () => setSlaData(computeSlaAging(submittedAt, priorityLabel, slaHours));
    update();
    const timer = setInterval(update, 30000); // 30 sec live update
    return () => clearInterval(timer);
  }, [submittedAt, slaHours, priorityLabel]);

  const remHours = Math.abs(slaData.remainingHours);
  const hours = Math.floor(remHours);
  const minutes = Math.round((remHours - hours) * 60);

  const formattedTime = `${hours}h ${minutes}m`;

  let badgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  let labelText = `SLA Due In: ${formattedTime}`;
  let IconComponent = Clock;

  if (slaData.status === "BREACHED") {
    badgeStyle = "bg-rose-500/15 text-rose-600 border-rose-500/30 font-bold animate-pulse";
    labelText = `SLA Breached by: ${formattedTime}`;
    IconComponent = ShieldAlert;
  } else if (slaData.status === "OVERDUE") {
    badgeStyle = "bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold";
    labelText = `Overdue by: ${formattedTime}`;
    IconComponent = AlertTriangle;
  } else if (slaData.status === "DUE_SOON") {
    badgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/20 font-medium";
    labelText = `Due Soon in: ${formattedTime}`;
    IconComponent = Clock;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyle} ${className}`}
      title={`SLA Duration: ${slaHours}h | Consumed: ${slaData.percentageConsumed}%`}
    >
      {showIcon && <IconComponent className="size-3.5 shrink-0" />}
      <span>{priorityLabel ? `${priorityLabel} • ` : ""}{labelText}</span>
    </span>
  );
}
