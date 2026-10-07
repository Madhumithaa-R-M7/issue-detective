import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    headName: { type: String, default: '' },
    headEmail: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Department = mongoose.model('Department', departmentSchema);
