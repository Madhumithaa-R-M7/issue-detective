import { User } from '../models/User.js';
import { Staff } from '../models/Staff.js';
import { Complaint } from '../models/Complaint.js';
import { Notification } from '../models/Notification.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Default Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding initial Users...');
      await User.create([
        {
          name: 'RescueNet Admin',
          email: 'rescuenet.in@gmail.com',
          password: 'admin123',
          role: 'admin',
          department: 'Administration',
        },
        {
          name: 'Admin User',
          email: 'admin@civicconnect.edu',
          password: 'admin123', // Pre-save hook will hash this!
          role: 'admin',
          department: 'Administration',
        },
        {
          name: 'Ramesh Kumar',
          email: 'ramesh.kumar@civicconnect.edu',
          password: 'staff123',
          role: 'staff',
          staffId: 'STF-01',
          department: 'Plumbing / Water Maintenance',
        },
        {
          name: 'Suresh Babu',
          email: 'suresh.babu@civicconnect.edu',
          password: 'staff123',
          role: 'staff',
          staffId: 'STF-02',
          department: 'Electrical Maintenance',
        },
        {
          name: 'Aaryav Sharma',
          email: 'aaryav@civicconnect.edu',
          password: 'student123',
          role: 'student',
        },
      ]);
      console.log('[Seed] Users seeded successfully.');
    }

    // 2. Seed Default Staff
    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      console.log('[Seed] Seeding initial Staff...');
      await Staff.create([
        {
          id: 'STF-01',
          name: 'Ramesh Kumar',
          department: 'Plumbing / Water Maintenance',
          specialization: ['Plumbing', 'Pipe Fitting', 'Water Leakage', 'Sanitation'],
          currentStatus: 'Available',
          activeWorkload: 2,
          resolvedCount: 42,
          phone: '+91 98765 43210',
          email: 'ramesh.kumar@civicconnect.edu',
          available: true,
        },
        {
          id: 'STF-02',
          name: 'Suresh Babu',
          department: 'Electrical Maintenance',
          specialization: ['Electrical', 'HVAC', 'Wiring', 'Lighting'],
          currentStatus: 'Available',
          activeWorkload: 3,
          resolvedCount: 38,
          phone: '+91 98765 43211',
          email: 'suresh.babu@civicconnect.edu',
          available: true,
        },
        {
          id: 'STF-03',
          name: 'Anitha Raj',
          department: 'Facilities',
          specialization: ['Carpentry', 'Furniture Repair', 'Locksmith'],
          currentStatus: 'Busy',
          activeWorkload: 5,
          resolvedCount: 29,
          phone: '+91 98765 43212',
          email: 'anitha.raj@civicconnect.edu',
          available: false,
        },
        {
          id: 'STF-04',
          name: 'Lakshmi Devi',
          department: 'Housekeeping',
          specialization: ['Sanitation', 'Waste Management', 'Deep Cleaning'],
          currentStatus: 'Available',
          activeWorkload: 1,
          resolvedCount: 65,
          phone: '+91 98765 43213',
          email: 'lakshmi.devi@civicconnect.edu',
          available: true,
        },
        {
          id: 'STF-05',
          name: 'Karthik Raja',
          department: 'IT & Infrastructure',
          specialization: ['Wi-Fi Routing', 'Fiber Optic', 'CCTV', 'LAN Wiring'],
          currentStatus: 'Available',
          activeWorkload: 1,
          resolvedCount: 31,
          phone: '+91 98765 43214',
          email: 'karthik.raja@civicconnect.edu',
          available: true,
        },
      ]);
      console.log('[Seed] Staff seeded successfully.');
    }

    // 3. Seed Default Complaints
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      console.log('[Seed] Seeding initial 10 Realistic Campus Complaints...');
      await Complaint.create([
        {
          id: 'CIV-00001',
          title: 'Water leakage near CSE Block',
          description: 'Water is leaking near the CSE block washroom entrance creating a slip hazard.',
          category: 'Water Leakage',
          location: 'CSE Block 1st Floor',
          latitude: 13.0418,
          longitude: 80.2330,
          studentId: 'STU-101',
          studentName: 'Aaryav Sharma',
          status: 'In Progress',
          department: 'Plumbing / Water Maintenance',
          assignedStaffId: 'STF-01',
          assignmentStatus: 'Assigned',
          priority: { severity: 8, urgency: 8, community: 7, location: 8, recurrence: 6, slaAging: 5, overall: 7.4, label: 'High' },
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'CIV-00002',
          title: 'Broken fan in AIDS classroom',
          description: 'Ceiling fan in AIDS department Class 204 is wobbling violently and making loud squeaking noise.',
          category: 'Fan / AC Problem',
          location: 'AIDS Block 2nd Floor',
          latitude: 13.0425,
          longitude: 80.2345,
          studentId: 'STU-102',
          studentName: 'Priya Sundaram',
          status: 'Assigned',
          department: 'Electrical Maintenance',
          assignedStaffId: 'STF-02',
          assignmentStatus: 'Assigned',
          priority: { severity: 6, urgency: 5, community: 6, location: 6, recurrence: 3, slaAging: 2, overall: 5.1, label: 'Medium' },
          createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
        {
          id: 'CIV-00003',
          title: 'Garbage near canteen',
          description: 'Overflowing trash bins near the main student canteen attracting flies and foul odor.',
          category: 'Garbage / Cleanliness',
          location: 'Main Canteen Area',
          latitude: 13.0410,
          longitude: 80.2320,
          studentId: 'STU-103',
          studentName: 'Rahul Verma',
          status: 'Submitted',
          department: 'Housekeeping',
          assignedStaffId: 'STF-04',
          assignmentStatus: 'Assigned',
          priority: { severity: 5, urgency: 6, community: 7, location: 7, recurrence: 4, slaAging: 1, overall: 5.6, label: 'Medium' },
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'CIV-00004',
          title: 'Wi-Fi problem in library',
          description: 'Wi-Fi access point in Central Library reading hall disconnected with weak signal and slow speeds.',
          category: 'Wi-Fi / Network Issue',
          location: 'Central Library 2nd Floor',
          latitude: 13.0419,
          longitude: 80.2332,
          studentId: 'STU-104',
          studentName: 'Sneha Reddy',
          status: 'In Progress',
          department: 'IT & Infrastructure',
          assignedStaffId: 'STF-05',
          assignmentStatus: 'Assigned',
          priority: { severity: 7, urgency: 7, community: 8, location: 8, recurrence: 5, slaAging: 3, overall: 6.8, label: 'High' },
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        },
        {
          id: 'CIV-00005',
          title: 'Damaged bench in classroom',
          description: 'Wooden bench in ECE Block Class 101 has broken leg support.',
          category: 'Damaged Furniture',
          location: 'ECE Block 1st Floor',
          latitude: 13.0430,
          longitude: 80.2350,
          studentId: 'STU-101',
          studentName: 'Aaryav Sharma',
          status: 'Submitted',
          department: 'Facilities',
          assignedStaffId: 'STF-03',
          assignmentStatus: 'Assigned',
          priority: { severity: 4, urgency: 4, community: 3, location: 5, recurrence: 2, slaAging: 1, overall: 3.4, label: 'Low' },
          createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
        },
        {
          id: 'CIV-00006',
          title: 'Streetlight not working near hostel',
          description: 'Pathway streetlight near Boys Hostel Block B is completely dark at night.',
          category: 'Streetlight Problem',
          location: 'Boys Hostel Pathway',
          latitude: 13.0405,
          longitude: 80.2315,
          studentId: 'STU-105',
          studentName: 'Vikram Singh',
          status: 'In Progress',
          department: 'Electrical Maintenance',
          assignedStaffId: 'STF-02',
          assignmentStatus: 'Assigned',
          priority: { severity: 8, urgency: 7, community: 8, location: 7, recurrence: 6, slaAging: 4, overall: 6.9, label: 'High' },
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
        {
          id: 'CIV-00007',
          title: 'Washroom water problem',
          description: 'No running tap water in Mechanical Block 2nd floor washrooms.',
          category: 'Washroom Problem',
          location: 'Mechanical Block 2nd Floor',
          latitude: 13.0422,
          longitude: 80.2340,
          studentId: 'STU-102',
          studentName: 'Priya Sundaram',
          status: 'Assigned',
          department: 'Plumbing / Water Maintenance',
          assignedStaffId: 'STF-01',
          assignmentStatus: 'Assigned',
          priority: { severity: 8, urgency: 8, community: 7, location: 7, recurrence: 5, slaAging: 3, overall: 6.7, label: 'High' },
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
        {
          id: 'CIV-00008',
          title: 'Parking congestion',
          description: 'Unorganized scooter parking blocking fire exit pathway near Admin Block.',
          category: 'Parking Issue',
          location: 'Admin Block Parking Zone',
          latitude: 13.0412,
          longitude: 80.2325,
          studentId: 'STU-103',
          studentName: 'Rahul Verma',
          status: 'Submitted',
          department: 'Facilities',
          assignedStaffId: 'STF-03',
          assignmentStatus: 'Assigned',
          priority: { severity: 6, urgency: 6, community: 6, location: 7, recurrence: 4, slaAging: 2, overall: 5.4, label: 'Medium' },
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'CIV-00009',
          title: 'Road damage near playground',
          description: 'Deep asphalt pothole on main road near Sports Ground causing vehicle damage.',
          category: 'Road / Pathway Damage',
          location: 'Main Campus Road / Sports Ground',
          latitude: 13.0400,
          longitude: 80.2310,
          studentId: 'STU-105',
          studentName: 'Vikram Singh',
          status: 'Submitted',
          department: 'Facilities',
          assignedStaffId: 'STF-03',
          assignmentStatus: 'Assigned',
          priority: { severity: 5, urgency: 5, community: 6, location: 6, recurrence: 3, slaAging: 1, overall: 4.6, label: 'Medium' },
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
        {
          id: 'CIV-00010',
          title: 'Electrical problem in laboratory',
          description: 'Short circuit and sparking in main junction box of Electrical Circuits Lab creating urgent electrical hazard.',
          category: 'Electrical Problem',
          location: 'Electrical Lab 105',
          latitude: 13.0428,
          longitude: 80.2348,
          studentId: 'STU-101',
          studentName: 'Aaryav Sharma',
          status: 'Pending Escalation',
          department: 'Electrical Maintenance',
          assignedStaffId: 'STF-02',
          assignmentStatus: 'Assigned',
          priority: { severity: 10, urgency: 10, community: 9, location: 9, recurrence: 7, slaAging: 8, overall: 9.1, label: 'Critical' },
          createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        },
      ]);
      console.log('[Seed] 10 Realistic Campus Complaints seeded successfully.');
    }


    // 4. Seed Default Notifications
    const notificationCount = await Notification.countDocuments();
    if (notificationCount === 0) {
      console.log('[Seed] Seeding initial Notifications...');
      await Notification.create([
        {
          id: 'n1',
          title: 'Complaint CIV-00025 is in progress',
          body: 'Ramesh Kumar (Plumbing) has started work on your water leakage report.',
          at: new Date(Date.now() - 3600000 * 2).toISOString(),
          read: false,
          complaintId: 'CIV-00025',
        },
        {
          id: 'n2',
          title: 'Potential duplicate detected',
          body: 'CIV-00025 looks visually similar to CIV-00023 (88% similarity).',
          at: new Date(Date.now() - 3600000 * 3).toISOString(),
          read: false,
          complaintId: 'CIV-00025',
        },
        {
          id: 'n3',
          title: 'Welcome to CivicConnect Phase 7',
          body: 'Full-stack Express + MongoDB database backend is live.',
          at: new Date().toISOString(),
          read: true,
        },
      ]);
      console.log('[Seed] Notifications seeded successfully.');
    }
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
};
