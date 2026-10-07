import mongoose from 'mongoose';

const escalationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    complaintId: { type: String, required: true, index: true },
    escalationLevel: { type: Number, required: true },
    escalationName: { type: String, required: true },
    triggeredAt: { type: String, default: () => new Date().toISOString() },
    status: { type: String, enum: ['Active', 'Resolved', 'Dismissed'], default: 'Active' },
    reason: { type: String, default: '' },
    notifiedRoles: [{ type: String }],
  },
  { timestamps: true }
);

export const Escalation = mongoose.model('Escalation', escalationSchema);
