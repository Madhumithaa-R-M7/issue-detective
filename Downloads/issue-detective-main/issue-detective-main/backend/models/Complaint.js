import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, default: '' },
    location: { type: String, required: true },
    landmark: { type: String, default: '' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    imageUrl: { type: String, default: '' },

    studentId: { type: String, required: true },
    studentName: { type: String, required: true },

    status: {
      type: String,
      enum: ['Submitted', 'Under Analysis', 'Assigned', 'In Progress', 'Pending Escalation', 'Resolved', 'Closed'],
      default: 'Submitted',
    },

    priority: {
      severity: { type: Number, default: 0 },
      urgency: { type: Number, default: 0 },
      community: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      recurrence: { type: Number, default: 0 },
      slaAging: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
      label: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    },
    priorityFactors: { type: mongoose.Schema.Types.Mixed, default: {} },
    priorityExplanations: [{ type: String }],
    priorityUpdatedAt: { type: String, default: '' },

    department: { type: String, default: 'Unassigned' },
    assignedStaffId: { type: String, default: null },
    assignmentStatus: { type: String, enum: ['Assigned', 'Unassigned', 'Pending'], default: 'Unassigned' },

    verificationInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    duplicateInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    classificationInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    urgencyInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    severityInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    communityImpactInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    geospatialInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    recurrenceInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    slaAgingInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    routingInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    assignmentInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    assignmentFactors: { type: mongoose.Schema.Types.Mixed, default: null },

    routingHistory: [{ type: mongoose.Schema.Types.Mixed }],
    assignmentHistory: [{ type: mongoose.Schema.Types.Mixed }],

    override: { type: Boolean, default: false },
    overrideReason: { type: String, default: '' },
    overriddenBy: { type: String, default: '' },
    overriddenAt: { type: String, default: '' },

    createdAt: { type: String, default: () => new Date().toISOString() },
    resolvedAt: { type: String, default: null },
    reopenedAt: { type: String, default: null },

    feedback: {
      rating: { type: Number, default: null },
      comment: { type: String, default: '' },
      createdAt: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

complaintSchema.virtual('complaintId').get(function () {
  return this.id;
});

complaintSchema.virtual('priorityScore').get(function () {
  return this.priority?.overall || 0;
});

complaintSchema.virtual('duplicateScore').get(function () {
  return this.duplicateInfo?.duplicateScore || 0;
});

complaintSchema.virtual('verificationResult').get(function () {
  return this.verificationInfo?.status || (this.imageUrl ? 'NEW_IMAGE' : 'NO_IMAGE');
});

complaintSchema.virtual('sla').get(function () {
  return {
    status: this.slaAgingInfo?.status || 'WITHIN_SLA',
    slaHours: this.slaAgingInfo?.slaHours || 24,
    remainingHours: this.slaAgingInfo?.remainingHours || 24,
  };
});

complaintSchema.virtual('assignedStaff').get(function () {
  return this.assignedStaffId || 'Unassigned';
});

export const Complaint = mongoose.model('Complaint', complaintSchema);

