# Government ITI College, Jewargi
### Official Appointment Booking & Public Information Portal

An institutional web platform for **Government Industrial Training Institute (ITI) College, Jewargi**, located in Jewargi, Kalaburagi (Gulbarga) District, Karnataka, India.

---

## 🏛️ Institutional Profile
- **Institution**: Government ITI College, Jewargi
- **Category**: Government Industrial Training Institute (Vocational & Technical Education)
- **Governing Department**: Department of Industrial Training & Employment, Government of Karnataka
- **Location**: Jewargi, Kalaburagi District, Karnataka, 585310, India
- **Official Google Maps Location**: [maps.app.goo.gl/GqmRmEwoYkHQCdbj9](https://maps.app.goo.gl/GqmRmEwoYkHQCdbj9)

---

## 🌟 Core System Features

### 1. Appointment & Admission Enquiry Booking Engine
- **Direct Candidate / Parent Booking**: Select purpose (Admission Enquiry, Trade Information, Eligibility, Document Scrutiny, Scholarships, Staff meeting).
- **Double-Booking Prevention**: Dynamically checks configured opening/closing hours, lunch recess, slot durations, holidays, and per-slot capacity limits.
- **Reference ID Generation**: Issues unique tracking identifiers (e.g., `ITI-JWG-2026-XXXX`).
- **Confirmation Slip**: Generates printable institutional appointment pass with visit instructions.

### 2. Student & Parent Booking Management
- **Lookup & Track**: Track status (`Pending`, `Confirmed`, `Rescheduled`, `Completed`, `Cancelled`) using Reference ID and phone number.
- **Reschedule & Cancel**: Change visit date/time or cancel appointment online.

### 3. Vocational Trades & Courses Directory
- Structured trade cards for Electrician, Fitter, Welder, COPA, Wireman, Diesel Mechanic.
- Details training duration, entry eligibility, engineering vs. non-engineering classification, key workshop competencies, and career/apprenticeship pathways.
- Integrated "Enquire Now" triggers trade-specific appointment booking.
- Fully configurable through the Administrative Dashboard.

### 4. Admissions Information & 4-Step Pathway
- Easy 4-step timeline:
  1. *Check Eligibility*
  2. *Select Trade*
  3. *Submit Application & Documents*
  4. *Complete Admission & Verification*
- Mandatory verification documents checklist.
- State Scholarship Portal (SSP) post-matric scholarship information and fee concessions.

### 5. Facilities & Campus Gallery
- High-grade technical workshop bays, electrical test labs, and digital IT centres.
- Responsive image gallery with category filters and interactive modal lightbox.

### 6. Official Bulletin & Notices Board
- Categorized institutional circulars: Admissions, Examination, Training, Events, Important Notice.
- Real-time search filter and detail modal reader.

### 7. Interactive FAQ
- Accordions answering common questions regarding eligibility, documents, timings, location, and fees.

### 8. Contact & Verified Location
- Physical address: Jewargi, Kalaburagi District, Karnataka 585310.
- Direct quick actions: Call Office, WhatsApp, Email, and GPS Navigation.
- Embedded interactive Google Map directly linked to the official verified map pin.

### 9. Secure Staff & Administrator Portal
- **Login Credentials**: Access key `iti@jewargi2026` or `admin123`.
- **Live Metrics**: Today's Appointments, Pending, Confirmed, Completed, Total Bookings.
- **Appointment Management**: Approve, complete, reschedule, cancel, or append staff instructions to candidate records.
- **Schedule Configuration**: Adjust operating hours, lunch break periods, slot duration (15/30/45/60 min), maximum candidates per slot, and declared holiday dates.
- **Content Management**: Add/edit/delete trades, publish official notices, and update contact information.

---

## 🛠️ Technical Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend API**: Node.js, Express.js (`server.ts`).
- **Database Schema**: SQL schema provided in `schema.sql` (MySQL / PostgreSQL compatible).
- **SEO & Structured Data**: Schema.org `EducationalOrganization` JSON-LD metadata and OpenGraph tags in `index.html`.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start local server (Runs Express server with Vite middleware on port 3000)
npm run dev

# Build for production
npm run build
```

---

## 📄 License & Attribution
Operated for Government ITI College, Jewargi, Kalaburagi, Karnataka.
All content follows NCVT / SCVT Craftsmen Training Scheme guidelines.
