export type ApplicantType = 'Student' | 'Parent' | 'Guardian';

export type AppointmentPurpose =
  | 'Admission Enquiry'
  | 'Course/Trade Information'
  | 'Eligibility Enquiry'
  | 'Document Enquiry'
  | 'Fee Enquiry'
  | 'Scholarship Enquiry'
  | 'General Enquiry'
  | 'Meet Staff';

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Rescheduled'
  | 'Completed'
  | 'Cancelled';

export interface Appointment {
  id: string;
  reference_id: string;
  student_name: string;
  phone: string;
  email?: string;
  applicant_type: ApplicantType;
  purpose: AppointmentPurpose;
  trade_id?: string;
  trade_name?: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // e.g. "10:30 AM"
  message?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  code: string;
  name: string;
  duration: string;
  eligibility: string;
  course_type: 'Engineering' | 'Non-Engineering';
  description: string;
  key_skills: string[];
  career_opportunities: string[];
  is_active: boolean;
  status_note?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Admissions' | 'Examination' | 'Training' | 'Events' | 'Important Notice';
  date: string;
  description: string;
  is_published: boolean;
  file_attachment?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Facility {
  id: string;
  name: string;
  short_desc: string;
  details: string;
  icon: string;
  verified_status: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Campus' | 'Workshops' | 'Classrooms' | 'Practical Training' | 'Students' | 'Facilities';
  image_url: string;
  caption: string;
  verified_note?: string;
}

export interface ScheduleSettings {
  working_days: string[];
  opening_time: string; // "09:30"
  closing_time: string; // "17:00"
  slot_duration_minutes: number; // 30
  break_start: string; // "13:00"
  break_end: string; // "14:00"
  max_per_slot: number; // e.g. 2 or 3
  holidays: string[]; // ["2026-10-02", ...]
  institute_name: string;
  location_name: string;
  phone: string;
  email: string;
  address: string;
  office_hours_display: string;
  google_maps_url: string;
}
