-- ====================================================================
-- Database Schema for Government ITI College, Jewargi
-- Management, Appointment Booking & Public Information System
-- Location: Jewargi, Kalaburagi District, Karnataka, India
--
-- SUPABASE POSTGRESQL SETUP (Project: humbckobaficvgtkohjp)
-- Copy and paste this block into your Supabase SQL Editor:
-- ====================================================================

CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    applicant_type TEXT NOT NULL DEFAULT 'Student',
    purpose TEXT NOT NULL,
    trade_id TEXT,
    trade_name TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies for Supabase
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to appointments"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public select of appointments"
ON appointments FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public update of appointments"
ON appointments FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments (reference_id);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments (phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);

-- ====================================================================
-- Standard MySQL Schema Definition
-- ====================================================================

-- 1. Administrators Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) DEFAULT 'Institutional Administrator',
    email VARCHAR(150),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Vocational Trades / Courses Table
CREATE TABLE IF NOT EXISTS trades (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    eligibility TEXT NOT NULL,
    course_type ENUM('Engineering', 'Non-Engineering') NOT NULL DEFAULT 'Engineering',
    description TEXT,
    key_skills JSON,
    career_opportunities JSON,
    is_active BOOLEAN DEFAULT TRUE,
    status_note VARCHAR(255) DEFAULT 'Standard Vocational Trade',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_trade_code (code),
    INDEX idx_trade_type (course_type)
);

-- 3. Student Appointment & Admission Enquiries Table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    applicant_type ENUM('Student', 'Parent', 'Guardian') NOT NULL DEFAULT 'Student',
    purpose ENUM(
        'Admission Enquiry',
        'Course/Trade Information',
        'Eligibility Enquiry',
        'Document Enquiry',
        'Fee Enquiry',
        'Scholarship Enquiry',
        'General Enquiry',
        'Meet Staff'
    ) NOT NULL,
    trade_id VARCHAR(64),
    trade_name VARCHAR(150),
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    message TEXT,
    status ENUM('Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trade_id) REFERENCES trades(id) ON DELETE SET NULL,
    INDEX idx_reference (reference_id),
    INDEX idx_date_time (appointment_date, appointment_time),
    INDEX idx_phone (phone),
    INDEX idx_status (status)
);

-- 4. Institution Schedule & Office Settings Table
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Institute Holidays & Blocked Dates
CREATE TABLE IF NOT EXISTS holidays (
    id VARCHAR(64) PRIMARY KEY,
    holiday_date DATE NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    is_recurring_yearly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Official Institutional Notices
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('Admissions', 'Examination', 'Training', 'Events', 'Important Notice') NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    file_attachment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_published (is_published)
);

-- 7. Frequently Asked Questions (FAQ)
CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(64) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Institutional Facilities Directory
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_desc VARCHAR(255),
    details TEXT,
    icon VARCHAR(50),
    verified_status VARCHAR(100) DEFAULT 'Core Educational Facility',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Campus Visuals & Media
CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category ENUM('Campus', 'Workshops', 'Classrooms', 'Practical Training', 'Students', 'Facilities') NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption TEXT,
    verified_note VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Configuration
INSERT INTO settings (setting_key, setting_value) VALUES
('schedule', JSON_OBJECT(
    'working_days', JSON_ARRAY('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    'opening_time', '09:30',
    'closing_time', '17:00',
    'slot_duration_minutes', 30,
    'break_start', '13:00',
    'break_end', '14:00',
    'max_per_slot', 2,
    'institute_name', 'Government ITI College, Jewargi',
    'location', 'Jewargi, Kalaburagi District, Karnataka 585310, India',
    'google_maps_url', 'https://maps.app.goo.gl/GqmRmEwoYkHQCdbj9'
))
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
