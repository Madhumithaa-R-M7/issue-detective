import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'all' },
    role: { type: String, enum: ['student', 'staff', 'admin', 'all'], default: 'all' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    at: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
    complaintId: { type: String, default: '' },
    type: { type: String, default: 'system' },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
