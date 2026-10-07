import { Complaint } from '../models/Complaint.js';
import { Staff } from '../models/Staff.js';
import { Notification } from '../models/Notification.js';
import { processComplaintIntelligence } from '../../src/services/intelligenceSuite.js';
import { computeStaffMcdmScore } from '../../src/services/mcdmRouter.js';

// Helper to generate sequential ID
const generateNextComplaintId = async () => {
  const allDocs = await Complaint.find({}, 'id').lean();
  let maxNum = 0;
  for (const doc of allDocs) {
    if (doc.id) {
      const match = doc.id.match(/\d+/);
      if (match) {
        const n = parseInt(match[0], 10);
        if (n > maxNum) maxNum = n;
      }
    }
  }
  const nextNum = maxNum > 0 ? maxNum + 1 : 1;
  return `CIV-${String(nextNum).padStart(5, '0')}`;
};


// @desc    Create new complaint (runs Phase 1-6 Intelligence engines)
// @route   POST /api/complaints
// @access  Public / Student
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, subCategory, location, landmark, latitude, longitude, imageUrl, studentId, studentName } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Title, description, and location are required' });
    }

    const complaintId = await generateNextComplaintId();
    const allComplaints = await Complaint.find().lean();
    const staffList = await Staff.find().lean();

    const rawComplaint = {
      id: complaintId,
      title,
      description,
      category: category || 'Other',
      subCategory: subCategory || '',
      location,
      landmark: landmark || '',
      latitude: latitude || 13.0415,
      longitude: longitude || 80.2335,
      imageUrl: imageUrl || '',
      studentId: studentId || (req.user ? req.user._id : 'STU-101'),
      studentName: studentName || (req.user ? req.user.name : 'Aaryav Sharma'),
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    };

    // Run backend AI Intelligence Pipeline (Phases 3 - 5)
    const intel = processComplaintIntelligence(rawComplaint, allComplaints, staffList);

    const enrichedComplaintData = intel
      ? {
          ...rawComplaint,
          classificationInfo: intel.classificationInfo,
          urgencyInfo: intel.urgencyInfo,
          severityInfo: intel.severityInfo,
          communityImpactInfo: intel.communityImpactInfo,
          geospatialInfo: intel.geospatialInfo,
          recurrenceInfo: intel.recurrenceInfo,
          slaAgingInfo: intel.slaAgingInfo,
          priority: {
            severity: intel.priority.severity,
            urgency: intel.priority.urgency,
            community: intel.priority.community,
            location: intel.priority.location,
            recurrence: intel.priority.recurrence,
            slaAging: intel.priority.slaAging,
            overall: intel.priority.overall,
            label: intel.priority.label,
          },
          priorityFactors: intel.priorityFactors,
          priorityExplanations: intel.priorityExplanations,
          priorityUpdatedAt: intel.priorityUpdatedAt,
          department: intel.routingInfo?.department || rawComplaint.category,
          assignedStaffId: intel.assignmentInfo?.assignedStaffId || null,
          assignmentStatus: intel.assignmentInfo?.assignedStaffId ? 'Assigned' : 'Unassigned',
          routingInfo: intel.routingInfo,
          assignmentInfo: intel.assignmentInfo,
          assignmentFactors: intel.assignmentFactors,
          routingHistory: intel.routingHistory,
          assignmentHistory: intel.assignmentHistory,
        }
      : rawComplaint;

    const newComplaint = await Complaint.create(enrichedComplaintData);

    // Save Persistent Notification
    await Notification.create({
      id: `n-${complaintId}`,
      userId: newComplaint.studentId,
      title: `Complaint ${complaintId} Created`,
      body: `${newComplaint.category} issue reported at ${newComplaint.location} — routed to ${newComplaint.department}.`,
      at: new Date().toISOString(),
      read: false,
      complaintId,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint created and intelligently routed successfully',
      complaint: newComplaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all complaints with filters
// @route   GET /api/complaints
// @access  Public / Auth
export const getComplaints = async (req, res, next) => {
  try {
    const { status, category, department, priority, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (priority) filter['priority.label'] = priority;
    if (search) {
      filter.$or = [
        { id: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Public / Auth
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Update complaint details / status
// @route   PUT /api/complaints/:id
// @access  Auth
export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const patch = req.body;
    const nowISO = new Date().toISOString();

    if (patch.status && (patch.status === 'Resolved' || patch.status === 'Closed') && !complaint.resolvedAt) {
      patch.resolvedAt = nowISO;
    }

    Object.assign(complaint, patch);
    await complaint.save();

    // Create Notification if status changed
    if (patch.status) {
      await Notification.create({
        id: `n-status-${complaint.id}-${Date.now()}`,
        userId: complaint.studentId,
        title: `Complaint ${complaint.id} Status Updated`,
        body: `Status updated to "${patch.status}".`,
        at: nowISO,
        read: false,
        complaintId: complaint.id,
      });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin reassign staff
// @route   PUT /api/complaints/:id/reassign
// @access  Admin
export const reassignStaff = async (req, res, next) => {
  try {
    const { staffId, adminName = 'Admin Override', reason = 'Manual Admin Assignment' } = req.body;
    const complaint = await Complaint.findOne({ id: req.params.id });
    const staff = await Staff.findOne({ id: staffId });

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });

    const nowISO = new Date().toISOString();
    const scoreRes = computeStaffMcdmScore(staff.toObject(), complaint.toObject());

    const newHistory = {
      staffId: staff.id,
      staffName: staff.name,
      department: staff.department,
      assignedAt: nowISO,
      assignedBy: adminName,
      method: 'Manual Admin Assignment',
      mcdmScore: scoreRes.score,
      factors: scoreRes.factors,
      reason,
      override: true,
      overriddenBy: adminName,
      overriddenAt: nowISO,
    };

    complaint.assignedStaffId = staff.id;
    complaint.department = staff.department;
    complaint.assignmentStatus = 'Assigned';
    if (complaint.status === 'Submitted' || complaint.status === 'Under Analysis') {
      complaint.status = 'Assigned';
    }
    complaint.override = true;
    complaint.overrideReason = reason;
    complaint.overriddenBy = adminName;
    complaint.overriddenAt = nowISO;
    complaint.assignmentInfo = {
      assignedStaffId: staff.id,
      assignedStaffName: staff.name,
      assignedAt: nowISO,
      status: 'Assigned',
      mcdmScore: scoreRes.score,
    };
    complaint.assignmentHistory.push(newHistory);

    await complaint.save();

    await Notification.create({
      id: `n-reassign-${Date.now()}`,
      userId: staff.email || 'staff',
      title: `New Assignment: ${complaint.id}`,
      body: `Complaint ${complaint.id} reassigned to ${staff.name} (${staff.department}).`,
      at: nowISO,
      read: false,
      complaintId: complaint.id,
    });

    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin reroute department
// @route   PUT /api/complaints/:id/reroute
// @access  Admin
export const rerouteDepartment = async (req, res, next) => {
  try {
    const { newDept, adminName = 'Admin Override', reason = 'Manual Admin Rerouting' } = req.body;
    const complaint = await Complaint.findOne({ id: req.params.id });

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    const nowISO = new Date().toISOString();
    const newRouting = {
      department: newDept,
      routedAt: nowISO,
      routedBy: adminName,
      method: 'Manual Admin Rerouting',
      reason,
      override: true,
    };

    complaint.department = newDept;
    complaint.routing = {
      department: newDept,
      method: 'Manual Admin Rerouting',
      reason,
      routedAt: nowISO,
    };
    complaint.routingHistory.push(newRouting);

    await complaint.save();

    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Recalculate all complaint priorities across DB
// @route   POST /api/complaints/recalculate-priorities
// @access  Admin
export const recalculateAllPriorities = async (req, res, next) => {
  try {
    const complaints = await Complaint.find();
    const staffList = await Staff.find().lean();
    const plainComplaints = complaints.map((c) => c.toObject());

    let updatedCount = 0;
    for (const complaintDoc of complaints) {
      const intel = processComplaintIntelligence(complaintDoc.toObject(), plainComplaints, staffList);
      if (intel) {
        complaintDoc.priority = {
          severity: intel.priority.severity,
          urgency: intel.priority.urgency,
          community: intel.priority.community,
          location: intel.priority.location,
          recurrence: intel.priority.recurrence,
          slaAging: intel.priority.slaAging,
          overall: intel.priority.overall,
          label: intel.priority.label,
        };
        complaintDoc.priorityFactors = intel.priorityFactors;
        complaintDoc.priorityExplanations = intel.priorityExplanations;
        complaintDoc.priorityUpdatedAt = intel.priorityUpdatedAt;
        await complaintDoc.save();
        updatedCount++;
      }
    }

    res.json({ success: true, message: `Recalculated priorities for ${updatedCount} complaints` });
  } catch (err) {
    next(err);
  }
};
