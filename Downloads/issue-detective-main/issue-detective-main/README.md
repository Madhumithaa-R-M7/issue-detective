# Campus Connect Hub

Yes. Based on the college-specific CivicConnect flow we defined, the UI prompt should describe both the actual screens and what each algorithm does behind the UI. Your uploaded specification already establishes the college website flow from complaint submission through SHA-256, pHash, EXIF, location comparison, and final verification.

Here is a complete prompt you can give to Lovable, Bolt, v0, Cursor, or another AI website builder.

CIVICCONNECT — COLLEGE CIVIC ISSUE MANAGEMENT WEBSITE

Build a modern, professional, responsive college campus civic issue reporting and management website called CivicConnect.

The website is designed specifically for a college campus. Students can report problems such as water leakage, broken fans, electrical issues, garbage, damaged furniture, washroom problems, Wi-Fi issues, pathway damage, parking problems, and other campus issues.

The system must not feel like a generic complaint-management CRUD website. It should look like a real smart-campus management platform with research-oriented features such as complaint classification, duplicate detection, image verification, geospatial analysis, priority calculation, department routing, staff assignment, and resolution tracking.

1. DESIGN STYLE

Create a clean, modern SaaS-style dashboard.

Visual style

Professional college technology platform

Clean white/light background

Navy/blue primary theme

Blue gradient accents

Green for verified/success states

Orange for warnings

Red for critical/error states

Rounded cards

Soft shadows

Clear typography

Minimal but attractive animations

Responsive on desktop, tablet, and mobile

Use icons consistently

Avoid excessive gradients

Avoid childish illustrations

Avoid an overly corporate banking-style appearance

The website should look suitable for an M.Tech final-year research project demonstration.

2. BRANDING

Application name:

CivicConnect

Subtitle:

Smart College Civic Issue Management System

Suggested tagline:

Smarter Complaints. Faster Resolution. Better Campus.

Use a simple civic/campus-inspired logo.

Navigation should be different according to the logged-in role.

3. USER ROLES

Create three main roles:

Student

Students can:

Submit complaints

Upload complaint images

Select category

Select campus location

Track complaint status

View duplicate warnings

View priority/status

View previous complaints

Receive notifications

Provide feedback after resolution

Admin

Admins can:

View all complaints

Review image verification

Review potential duplicates

View analytics

Manage departments

Assign staff

Monitor SLA

Change complaint status

View campus hotspots

Monitor resolution performance

Staff

Staff can:

View assigned complaints

View complaint details

View location

View evidence image

Update status

Add resolution remarks

Mark complaint as resolved

4. STUDENT DASHBOARD UI

Create a dashboard containing:

Header

Left:

CivicConnect logo

Center/right:

Search

Notifications

Student profile

Profile dropdown

Sidebar

Dashboard

Submit Complaint

My Complaints

Track Complaint

Notifications

Profile

Dashboard cards

Display:

Total Complaints
12

Pending
4

In Progress
3

Resolved
5

Also show:

Recent complaints

Complaint status chart

Category distribution

Recent notifications

5. SUBMIT COMPLAINT PAGE

Create a visually clear complaint form.

Page title

Report a Campus Issue

Form

Field 1:

Complaint Description

Large textarea.

Placeholder:

"Describe the problem clearly..."

Example:

"Water leakage is occurring from the ceiling near CSE Block, 2nd floor."

Field 2

Category

Dropdown:

Electrical Problem

Water Leakage

Fan / AC Problem

Garbage / Cleanliness

Washroom Problem

Damaged Furniture

Road / Pathway Damage

Streetlight Problem

Wi-Fi / Network Problem

Parking Issue

Safety Issue

Other

Field 3

Campus Location

Dropdown:

CSE Block

AIDS Block

ECE Block

Mechanical Block

Library

Laboratory

Classroom

Hostel

Canteen

Parking

Playground

Auditorium

Washroom

Common Area

Allow an optional detailed location:

"Room 302 / Near staircase / First floor"

Field 4

Upload Evidence Image

Create a drag-and-drop upload area.

Display:

"Upload a clear image of the issue"

Support:

JPG

JPEG

PNG

WebP

After upload show:

Image preview

Filename

File size

Resolution

Remove button

Replace button

Do NOT make image upload visually complicated.

6. IMAGE VERIFICATION UI

Immediately after an image is uploaded, show an expandable section:

Image Verification

Display a small processing animation:

Analyzing image...

Then show:

Image Validation

✓ Valid Image

Format: JPEG
Size: 2.1 MB
Resolution: 1920 × 1080

7. IMAGE VERIFICATION ALGORITHM UI

Create a horizontal/vertical processing pipeline:

Uploaded Image
      ↓
Image Validation
      ↓
SHA-256 Hashing
      ↓
Perceptual Hashing
      ↓
EXIF Metadata Analysis
      ↓
Existing Image Comparison
      ↓
Location Comparison
      ↓
Final Verification

Use separate cards for every stage.

8. SHA-256 CARD

Create a card titled:

SHA-256 Hash

Description:

"Generates a cryptographic fingerprint of the uploaded image to detect exact duplicate files."

Display:

Hash Generated
a8f3c91d7e........

Status:

No Exact Match

or

Exact Match Found

If an exact match exists, display:

⚠ Exact Duplicate Detected

Matched Complaint:
CIV-023

Submitted:
15 Sep 2026

Location:
CSE Block

Provide:

View Previous Complaint

button.

9. PERCEPTUAL HASH CARD

Create a card:

Perceptual Hash — pHash

Description:

"Creates a visual fingerprint to identify images that look similar even when resized, compressed, or slightly modified."

Display:

pHash Generated

1010101011001100...

Then:

Visual Similarity

88%

Use a progress bar.

10. HAMMING DISTANCE CARD

Create:

Hamming Distance

Description:

"Measures the difference between two perceptual hashes."

Display:

Current Image
1010101011001100

Previous Image
1010101011001000

Hamming Distance
12 bits

Show interpretation:

Low Distance
      ↓
High Visual Similarity

Do not claim that one universal threshold proves duplication. Make the threshold configurable in the backend.

11. EXIF METADATA CARD

Create:

EXIF Metadata

Display:

Device
Samsung Galaxy

Capture Date
20-09-2026

Capture Time
10:32 AM

GPS
Available

Software
Camera

If metadata is unavailable:

⚠ Metadata unavailable

This does not mean that the image is fake.

This distinction is important.

Never display:

"EXIF missing = fake."

Instead show:

"Metadata unavailable — insufficient provenance evidence."

12. EXISTING IMAGE COMPARISON

Create a section:

Similar Images Found

Display previous complaint cards.

Each card should contain:

Previous image

Complaint ID

Category

Location

Date

Similarity percentage

Example:

CIV-023

Water Leakage

CSE Block

15 Sep 2026

Image Similarity: 88%

Show the current image and previous image side-by-side.

Add:

Compare Images

button.

13. LOCATION VERIFICATION UI

Create a card:

Location Verification

Show:

Current Complaint

CSE Block
2nd Floor

Previous Complaint

CSE Block
2nd Floor

Display a small campus map.

Show two markers:

🔵 Current

🔴 Previous

Draw a line between them.

Display:

Distance: 10 metres

Same Area

The backend should calculate the distance using the Haversine Distance Algorithm.

Do not require the student to calculate anything manually.

14. FINAL IMAGE VERIFICATION RESULT

Create a prominent result card.

Possible results:

NEW IMAGE

Green:

✓ New Image

No matching image was found in previous complaints.

POTENTIAL DUPLICATE

Orange:

⚠ Potential Duplicate

A visually similar image was found in a previous complaint.

Image Similarity: 88%
Location Distance: 10 m

Previous Complaint:
CIV-023

Buttons:

View Previous Complaint

Continue Anyway

EXACT DUPLICATE

Red:

⚠ Exact Duplicate

The SHA-256 hash matches an existing complaint image.

Previous Complaint:
CIV-023

INSUFFICIENT EVIDENCE

Gray/orange:

ⓘ Insufficient Evidence

Image metadata is unavailable and no conclusive image match was found.

Do not automatically call the image fake.

15. DUPLICATE SCORE

If both image and location information are available, display:

Duplicate Assessment

Image Similarity       88%
Location Similarity    92%

Combined Score         89.2%

Use a formula in the backend such as:

D = 0.7I + 0.3G

where:

I = image similarity

G = location similarity

The exact threshold must be configurable and should be evaluated using the college dataset.

16. SUBMISSION CONFIRMATION

After the student submits the complaint, show a confirmation screen.

Complaint Submitted Successfully

✓ Complaint Submitted

Complaint ID

CIV-00125

Display:

Category:
Water Leakage

Location:
CSE Block

Priority:
Pending Analysis

Image Verification:
Potential Duplicate

Button:

Track Complaint

17. MY COMPLAINTS PAGE

Create a table/card layout.

Columns:

Complaint ID

Category

Location

Date

Image Verification

Priority

Status

Action

Example:

CIV-00125
Water Leakage
CSE Block
20 Sep
Potential Duplicate
High
In Progress
View

Status badges:

Submitted

Under Analysis

Assigned

In Progress

Resolved

Closed

Duplicate

18. COMPLAINT DETAIL PAGE

Create a detailed complaint page.

Layout:

Left side

Complaint information:

Complaint ID
CIV-00125

Category
Water Leakage

Location
CSE Block – 2nd Floor

Submitted
20 Sep 2026

Status
In Progress

Right side

Evidence image.

Under image:

Image Verification
Potential Duplicate

Similarity: 88%

Previous Complaint:
CIV-023

19. ADMIN DASHBOARD

Create a professional admin dashboard.

Sidebar:

Dashboard

Complaints

Image Verification

Duplicate Review

Map / Hotspots

Departments

Staff

Analytics

SLA Monitoring

Reports

Settings

Dashboard cards:

Total Complaints
248

Pending
42

In Progress
61

Resolved
145

Additional cards:

Potential Duplicates
18

Exact Duplicates
7

High Priority
26

SLA Breached
9

20. ADMIN COMPLAINT TABLE

Create a searchable and filterable table.

Filters:

Category

Location

Priority

Status

Image Verification

Department

Date

Example:

IDIssueLocationPriorityImageStatusCIV-025Water LeakageCSEHighPotential DuplicateIn ProgressCIV-024Broken ChairLibraryMediumNewAssignedCIV-023Water LeakageCSEHighExistingResolved

Use badges instead of plain text.

21. ADMIN IMAGE VERIFICATION PAGE

This should be a dedicated research-oriented page.

Title:

Image Verification Center

Top statistics:

Total Images
248

New Images
181

Potential Duplicates
42

Exact Duplicates
15

Insufficient Evidence
10

Below this, show a list of flagged complaints.

Each card:

Current Image       Previous Image

CIV-025             CIV-023

Similarity
88%

Distance
10 m

SHA-256
No Match

EXIF
Available

Status
Potential Duplicate

Buttons:

View Details

Mark as Duplicate

Not a Duplicate

22. ADMIN DUPLICATE REVIEW SCREEN

When the admin clicks "View Details":

Create a split-screen comparison.

Left

Current submission.

Right

Previous submission.

Under both images:

Visual Similarity: 88%
Hamming Distance: 12 bits

Location Distance: 10 m

Category:
Water Leakage

Current Date:
20 Sep 2026

Previous Date:
15 Sep 2026

At the bottom:

Admin Decision

Buttons:

Confirm Duplicate

Not a Duplicate

Merge Complaints

Keep Separate

Do not automatically delete complaints.

23. CAMPUS MAP / HOTSPOT PAGE

Create an interactive campus map.

Display complaint markers.

Different colors:

Low

Medium

High

Critical

Example:

CSE Block       18 complaints
Canteen          12 complaints
Hostel           24 complaints
Library           5 complaints

Use Haversine Distance for point-to-point distance and DBSCAN clustering to identify complaint hotspots.

Show:

Hotspot 1
Hostel Area

23 complaints

Hotspot 2
CSE Block

18 complaints

24. ANALYTICS PAGE

Create charts for:

Complaint Category

Water

Electrical

Cleanliness

Furniture

Wi-Fi

Washroom

Complaint Status

Submitted

Assigned

In Progress

Resolved

Image Verification

New

Potential Duplicate

Exact Duplicate

Insufficient Evidence

Location Hotspots

Display campus heatmap.

25. COMPLAINT PRIORITY UI

After image and complaint analysis, display:

Complaint Priority Analysis

Cards:

Severity       8.0 / 10
Urgency        7.5 / 10
Community      6.0 / 10
Location       8.0 / 10
Recurrence     5.0 / 10
SLA Aging      3.0 / 10

Then:

Overall Priority

7.2 / 10

HIGH

Use the existing Weighted Civic Priority Scoring Algorithm in the backend.

26. DEPARTMENT ROUTING UI

After classification and priority calculation:

Complaint
    ↓
Category Classification
    ↓
Department Recommendation

Example:

Issue:
Water Leakage

Recommended Department:
Maintenance

Sub-department:
Plumbing

Show:

Automatically Routed

27. STAFF ASSIGNMENT UI

Show:

Recommended Staff

Ramesh Kumar

Expertise:
Plumbing — 95%

Availability:
Available

Distance:
0.8 km

Average Response:
18 minutes

Use your MCDM-based Staff Assignment Algorithm to calculate the staff suitability score.

Display:

Assignment Score
91%

Button:

Assign Complaint

28. RESEARCH / ALGORITHM PANEL

For your M.Tech demonstration, create an optional "Technical Analysis" panel visible only to Admin.

Display:

Algorithms Used

✓ TF-IDF + Logistic Regression
  Complaint Classification

✓ Cosine Similarity
  Text Duplicate Detection

✓ SHA-256
  Exact Image Duplicate Detection

✓ Perceptual Hashing
  Visual Image Similarity

✓ Hamming Distance
  pHash Comparison

✓ EXIF Analysis
  Supporting Image Metadata

✓ Haversine Distance
  Geographic Comparison

✓ DBSCAN
  Complaint Hotspot Detection

✓ Weighted Priority Scoring
  Complaint Prioritization

✓ MCDM
  Staff Assignment

This makes the research contribution clearly visible during project evaluation.

29. IMPORTANT IMAGE AUTHENTICITY RULE

Do NOT display:

"Original = TRUE"

simply because EXIF exists.

Do NOT display:

"Fake = TRUE"

simply because EXIF is missing.

Instead use:

New Image
Potential Duplicate
Exact Duplicate
Insufficient Evidence
Potentially Manipulated

The system should describe evidence, not claim impossible certainty.

30. BACKEND IMAGE VERIFICATION FLOW

Implement the backend workflow as:

Upload Image
      ↓
Validate File
      ↓
Generate SHA-256
      ↓
Generate pHash
      ↓
Extract EXIF
      ↓
Search Existing Images
      ↓
Compare SHA-256
      ↓
Compare pHash
      ↓
Calculate Hamming Distance
      ↓
Compare Complaint Locations
      ↓
Calculate Haversine Distance
      ↓
Generate Duplicate Assessment
      ↓
Store Verification Result
      ↓
Display Result on Website

31. DATABASE STRUCTURE

Create an image verification object associated with every complaint.

Example:

{
  "complaintId": "CIV-00125",
  "imageUrl": "...",
  "fileName": "water_leak.jpg",
  "fileType": "image/jpeg",
  "fileSize": 2100000,
  "width": 1920,
  "height": 1080,

  "sha256Hash": "...",

  "perceptualHash": "...",

  "exif": {
    "device": "...",
    "captureDate": "...",
    "captureTime": "...",
    "gpsAvailable": true
  },

  "verification": {
    "exactMatch": false,
    "visualSimilarity": 0.88,
    "hammingDistance": 12,
    "locationDistance": 10,
    "status": "potential_duplicate",
    "matchedComplaintId": "CIV-00023"
  }
}

32. IMPORTANT UX RULES

The student should NOT see technical information like:

SHA-256:
a8f3c91d...

by default.

Instead show:

✓ Image analyzed

No exact duplicate found.

Technical information should be inside:

View Verification Details

for advanced users/admins.

This keeps the student interface simple while preserving the research functionality.

33. RESPONSIVE DESIGN

Desktop:

Use:

Sidebar | Main Content | Optional Right Panel

Tablet:

Collapse sidebar.

Mobile:

Use bottom navigation or hamburger menu.

The complaint submission form must work comfortably on mobile screens.

34. MAIN STUDENT USER JOURNEY

The final user journey should be:

Login
 ↓
Student Dashboard
 ↓
Report Issue
 ↓
Enter Description
 ↓
Select Category
 ↓
Select Campus Location
 ↓
Upload Image
 ↓
Image Validation
 ↓
Image Verification
 ↓
Potential Duplicate Warning (if applicable)
 ↓
Submit Complaint
 ↓
Complaint ID Generated
 ↓
Track Status
 ↓
Staff Resolution
 ↓
Student Feedback

35. MAIN ADMIN USER JOURNEY

Admin Login
 ↓
Admin Dashboard
 ↓
View New Complaints
 ↓
AI/NLP Classification
 ↓
Image Verification
 ↓
Duplicate Detection
 ↓
Location Analysis
 ↓
Priority Calculation
 ↓
Department Routing
 ↓
Staff Assignment
 ↓
SLA Monitoring
 ↓
Resolution
 ↓
Analytics

36. FINAL DESIGN GOAL

The website should visually communicate that CivicConnect is not merely:

"Student submits complaint → Admin sees complaint."

Instead, it should demonstrate:

                 CIVICCONNECT
                      │
                      ▼
              Complaint Submitted
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
     TEXT           IMAGE         LOCATION
       │              │              │
    NLP / ML      SHA-256/pHash   Haversine
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              Duplicate Analysis
                      │
                      ▼
              Severity / Urgency
                      │
                      ▼
                Priority Score
                      │
                      ▼
             Department Routing
                      │
                      ▼
               Staff Assignment
                      │
                      ▼
             Resolution Tracking
                      │
                      ▼
                 Analytics

Build the website as a working full-stack prototype, not just static UI screens. Use reusable components, proper loading states, empty states, validation messages, confirmation dialogs, toast notifications, responsive layouts, realistic sample college data, and role-based dashboards.

The image verification system should be modular so that advanced image-forensics or machine-learning methods can be added later without redesigning the entire website.

The most important UI screens

For your project demo, I would especially show these 6 screens:

Student → Report an Issue — description + category + location + image.

Image Verification — SHA-256 + pHash + EXIF processing.

Potential Duplicate — current image vs previous image side-by-side.

Admin Image Verification Center — all flagged images.

Campus Map — complaint locations and hotspots.

Admin Complaint Analysis — priority → department → staff assignment.

That gives you a very clear story during your project review: the student reports → the system analyzes → detects duplicates → checks location → prioritizes → routes → resolves.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aec1e46b-1470-5d3e-9686-db3c3ba9e54b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
