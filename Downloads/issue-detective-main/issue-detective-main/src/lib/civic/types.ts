export type Role = "student" | "admin" | "staff";

export type ComplaintStatus =
  | "Submitted"
  | "Under Analysis"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Duplicate";

export type VerificationStatus =
  | "new"
  | "potential_duplicate"
  | "exact_duplicate"
  | "insufficient_evidence"
  | "NEW_IMAGE"
  | "EXACT_DUPLICATE"
  | "POTENTIAL_DUPLICATE"
  | "INSUFFICIENT_EVIDENCE"
  | "POTENTIALLY_MANIPULATED";

export type PriorityLabel = "Low" | "Medium" | "High" | "Critical";

export type SlaStatus = "On Track" | "Due Soon" | "Overdue" | "SLA Breached" | "Escalated";

export interface ExifData {
  available?: boolean;
  device: string | null;
  captureDate?: string | null;
  captureTime?: string | null;
  timestamp?: string | null;
  gpsAvailable?: boolean;
  gps?: { latitude: number | null; longitude: number | null } | null;
  software: string | null;
  warnings?: string[];
}

export interface VerificationResult {
  exactMatch?: boolean;
  visualSimilarity?: number; // 0..1
  similarityScore?: number; // 0..1
  hammingDistance: number | null;
  locationDistance: number | null; // metres
  locationSimilarity?: number; // 0..1
  combinedScore?: number; // 0..1
  confidence?: number;
  status: VerificationStatus;
  matchedComplaintId: string | null;
  sha256?: string;
  perceptualHash?: string;
  warnings?: string[];
  analyzedAt?: string;
}

export interface ImageVerification {
  imageUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  width: number;
  height: number;
  sha256Hash: string;
  perceptualHash: string;
  exif: ExifData;
  verification: VerificationResult;
}

export interface PriorityBreakdown {
  severity: number;
  urgency: number;
  community: number;
  location: number;
  recurrence: number;
  slaAging: number;
  overall: number;
  label: PriorityLabel;
}

export interface DuplicateAnalysis {
  isPotentialDuplicate: boolean;
  duplicateScore: number;
  matchedComplaintId: string | null;
  textSimilarity: number;
  imageSimilarity: number;
  locationDistance: number | null;
  phashSimilarity?: number;
  cnnFeatureSimilarity?: number;
  locationSimilarity?: number;
  categorySimilarity?: number;
  descriptionSimilarity?: number;
  matchedComplaint?: Complaint | null;
  workflowAction?: string;
}

export interface VerificationReview {
  reviewed: boolean;
  reviewedBy: string;
  reviewedAt: string;
  decision: "confirm_duplicate" | "mark_distinct" | "request_review" | "keep_active" | string;
  remarks?: string;
}

export interface ClassificationInfo {
  predictedCategory: string;
  predictionConfidence: number;
  finalCategory: string;
  classificationMethod: string;
  modelType: string;
}

export interface UrgencyInfo {
  urgencyScore: number;
  urgencyLevel: string;
  detectedIndicators: string[];
}

export interface SeverityInfo {
  score: number;
  level: string;
  reasons: string[];
}

export interface CommunityImpactInfo {
  affectedCount: number;
  score: number;
}

export interface GeospatialInfo {
  distanceMeters: number | null;
  locationImpactScore: number;
  locationType?: string;
  clusterId: string | null;
  isHotspot: boolean;
  nearbyComplaintCount: number;
  centroid: { lat: number; lng: number } | null;
  reasons?: string[];
}

export interface RecurrenceInfo {
  recurrenceCount: number;
  recurrenceScore: number;
  relatedComplaintIds: string[];
}

export interface SlaAgingInfo {
  hoursOpen: number;
  slaHours: number;
  agingScore: number;
  dueAt: string;
  remainingHours: number;
  status: string;
}

export interface Complaint {
  id: string;
  description: string;
  category: string;
  location: string;
  detailedLocation: string;
  lat: number;
  lng: number;
  submittedAt: string; // ISO
  status: ComplaintStatus;
  priority: PriorityBreakdown;
  department: string;
  subDepartment: string;
  assignedStaffId: string | null;
  slaHours: number;
  resolutionRemarks?: string | undefined;
  feedbackRating?: number | undefined;
  studentName: string;
  image: ImageVerification | null;
  imageVerification?: {
    status: VerificationStatus;
    confidence: number;
    sha256: string | null;
    perceptualHash: string | null;
    exif: ExifData;
    matchedComplaintId: string | null;
    similarityScore: number;
    hammingDistance: number | null;
    warnings: string[];
    analyzedAt: string;
  };
  duplicateAnalysis?: DuplicateAnalysis;
  verificationReview?: VerificationReview;
  classificationInfo?: ClassificationInfo;
  urgencyInfo?: UrgencyInfo;
  severityInfo?: SeverityInfo;
  communityImpactInfo?: CommunityImpactInfo;
  geospatialInfo?: GeospatialInfo;
  recurrenceInfo?: RecurrenceInfo;
  slaAgingInfo?: SlaAgingInfo;
  priorityFactors?: Record<string, number>;
  priorityExplanations?: string[];
  priorityUpdatedAt?: string;
}

export type StaffStatus = "Available" | "Busy" | "Offline" | "On Leave";

export interface McdmFactors {
  expertise: number;    // 0..10
  workload: number;     // 0..10
  proximity: number;    // 0..10
  responseTime: number; // 0..10
}

export interface RoutingInfo {
  department: string;
  departmentId: string;
  routingReason: string;
  confidence: number; // 0..1
  routingMethod: string;
  slaHours: number;
  subDepartment?: string;
}

export interface AssignmentInfo {
  assignedStaffId: string | null;
  assignedStaffName: string | null;
  assignedAt: string | null;
  status: "Assigned" | "Unassigned" | string;
  mcdmScore: number | null; // 0..10
  unassignedReason?: string | undefined;
}

export interface RoutingHistoryEntry {
  department: string;
  routedAt: string;
  timestamp?: string;
  routedBy?: string;
  method: string;
  reason: string;
  routingReason?: string;
  override?: boolean;
}

export interface AssignmentHistoryEntry {
  staffId: string | null;
  staffName: string | null;
  department?: string;
  assignedAt: string;
  timestamp?: string;
  assignedBy: string;
  method: string;
  mcdmScore?: number | null;
  factors?: McdmFactors | null;
  reason?: string;
  override?: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
}

export interface Complaint {
  id: string;
  description: string;
  category: string;
  location: string;
  detailedLocation: string;
  lat: number;
  lng: number;
  submittedAt: string; // ISO
  status: ComplaintStatus;
  priority: PriorityBreakdown;
  department: string;
  subDepartment: string;
  assignedStaffId: string | null;
  slaHours: number;
  resolutionRemarks?: string | undefined;
  feedbackRating?: number | undefined;
  studentName: string;
  image: ImageVerification | null;
  imageVerification?: {
    status: VerificationStatus;
    confidence: number;
    sha256: string | null;
    perceptualHash: string | null;
    exif: ExifData;
    matchedComplaintId: string | null;
    similarityScore: number;
    hammingDistance: number | null;
    warnings: string[];
    analyzedAt: string;
  };
  duplicateAnalysis?: DuplicateAnalysis;
  verificationReview?: VerificationReview;
  classificationInfo?: ClassificationInfo;
  urgencyInfo?: UrgencyInfo;
  severityInfo?: SeverityInfo;
  communityImpactInfo?: CommunityImpactInfo;
  geospatialInfo?: GeospatialInfo;
  recurrenceInfo?: RecurrenceInfo;
  slaAgingInfo?: SlaAgingInfo;
  priorityFactors?: Record<string, number>;
  priorityExplanations?: string[];
  priorityUpdatedAt?: string;
  // Phase 5 additions
  routing?: {
    department: string;
    method: string;
    reason: string;
    routedAt: string;
  };
  assignment?: {
    staffId: string | null;
    staffName: string | null;
    department: string;
    method: string;
    mcdmScore: number | null;
    assignedAt: string;
  };
  assignmentStatus?: "Assigned" | "Unassigned" | string;
  routingInfo?: RoutingInfo;
  assignmentInfo?: AssignmentInfo;
  assignmentFactors?: McdmFactors | any;
  routingHistory?: RoutingHistoryEntry[];
  assignmentHistory?: AssignmentHistoryEntry[];
  override?: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  // Phase 6 additions
  resolvedAt?: string;
  reopenedAt?: string;
  escalationHistory?: EscalationRecord[];
}

export interface EscalationRecord {
  id: string;
  complaintId: string;
  type: "SLA_BREACH" | "SLA_WARNING" | string;
  triggeredAt: string;
  previousStatus: string;
  escalationLevel: number;
  escalationName: string;
  status: string;
  hoursOpen: number;
  slaHours: number;
  reason: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  departmentId?: string;
  skills: string[];
  currentStatus: StaffStatus;
  activeCount: number;
  maxWorkload: number;
  latitude: number;
  longitude: number;
  avgResponseMinutes: number;
  resolvedCount: number;
  rating: number;
  // Legacy fields for compatibility
  expertise: string;
  expertiseScore: number; // 0..1
  available: boolean;
  workload: number;
  distanceKm?: number;
}

export interface CampusLocation {
  name: string;
  lat: number;
  lng: number;
}
