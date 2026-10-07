/**
 * CSV Export Utility for CivicConnect Analytics & Reports
 */

/**
 * Downloads data as a CSV file in the browser.
 * 
 * @param {Array<Object>} data 
 * @param {string} filename 
 */
export function exportToCsv(data, filename = "civicconnect_report.csv") {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  const csvRows = [];
  // Add header row
  csvRows.push(headers.map((h) => `"${h}"`).join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Prepares complaint analytics report rows for export.
 */
export function formatComplaintsForExport(complaints = []) {
  return complaints.map((c) => ({
    "Complaint ID": c.id,
    "Category": c.category,
    "Status": c.status,
    "Priority Label": c.priority?.label || "Medium",
    "Priority Score": c.priority?.overall || 5.0,
    "Department": c.department || "Unassigned",
    "Assigned Staff ID": c.assignedStaffId || "Unassigned",
    "Location": c.location || "N/A",
    "Latitude": c.lat || "",
    "Longitude": c.lng || "",
    "Submitted At": c.submittedAt || "",
    "Resolved At": c.resolvedAt || "",
    "SLA Hours": c.slaHours || 24,
  }));
}

/**
 * Prepares SLA monitoring report rows for export.
 */
export function formatSlaReportForExport(complaints = [], slaEngineFn) {
  return complaints.map((c) => {
    const sla = slaEngineFn(c.submittedAt, c.priority?.label, c.slaHours);
    return {
      "Complaint ID": c.id,
      "Category": c.category,
      "Priority": c.priority?.label || "Medium",
      "Department": c.department || "Unassigned",
      "Assigned Staff": c.assignment?.staffName || c.assignedStaffId || "Unassigned",
      "Created At": sla.createdAt,
      "Due At": sla.dueAt,
      "Hours Open": sla.hoursOpen,
      "Time Remaining (h)": sla.remainingHours,
      "Percentage Consumed (%)": sla.percentageConsumed,
      "SLA Status": sla.status,
      "Aging Score": sla.agingScore,
    };
  });
}
