import { Complaint } from '../models/Complaint.js';
import { Staff } from '../models/Staff.js';

// @desc    Get my assigned complaints (Staff view)
// @route   GET /api/staff/my-complaints
// @access  Private (Staff)
export const getMyComplaints = async (req, res, next) => {
  try {
    const staffId = req.user?.staffId || req.query.staffId || 'STF-01';

    const complaints = await Complaint.find({
      $or: [{ assignedStaffId: staffId }, { 'assignment.staffId': staffId }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      staffId,
      complaints,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get list of all staff members
// @route   GET /api/staff
// @access  Public / Auth
export const getAllStaff = async (req, res, next) => {
  try {
    const staffMembers = await Staff.find().sort({ name: 1 });
    res.json({ success: true, count: staffMembers.length, staff: staffMembers });
  } catch (err) {
    next(err);
  }
};

// @desc    Update staff status (Available / Busy / On Leave)
// @route   PUT /api/staff/:id/status
// @access  Auth (Staff / Admin)
export const updateStaffStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const staff = await Staff.findOne({ id: req.params.id });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    staff.currentStatus = status;
    staff.available = status === 'Available' || status === 'Busy';
    await staff.save();

    res.json({ success: true, staff });
  } catch (err) {
    next(err);
  }
};
