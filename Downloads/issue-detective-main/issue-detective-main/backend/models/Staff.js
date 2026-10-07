import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    specialization: [{ type: String }],
    experienceYears: { type: Number, default: 1 },
    currentStatus: { type: String, enum: ['Available', 'Busy', 'On Leave'], default: 'Available' },
    activeWorkload: { type: Number, default: 0 },
    resolvedCount: { type: Number, default: 0 },
    avgResolutionHours: { type: Number, default: 4 },
    rating: { type: Number, default: 4.5 },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Staff = mongoose.model('Staff', staffSchema);
