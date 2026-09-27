import { Trade, Notice, FAQItem, Facility, GalleryImage, ScheduleSettings, Appointment } from '../types';

export const initialTrades: Trade[] = [
  {
    id: 'trade-electrician',
    code: 'ELE-01',
    name: 'Electrician',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Pass in 10th Standard (SSLC) with Science and Mathematics',
    course_type: 'Engineering',
    description: 'Comprehensive practical training in electrical wiring, power generation, distribution systems, motor winding, transformers, and industrial control panel assembly.',
    key_skills: [
      'Domestic & Industrial Wiring',
      'AC & DC Machines Overhauling',
      'Transformer Maintenance',
      'Panel Board Installation',
      'Electrical Safety & Earthing'
    ],
    career_opportunities: [
      'KPTCL / BESCOM / GESCOM Lineman & Junior Station Attendant',
      'Industrial Maintenance Electrician',
      'Electrical Contractor & Service Technician',
      'Railway Technician & Metro Rail Maintenance'
    ],
    is_active: true,
    status_note: 'Standard Vocational Trade (Configurable in Admin)'
  },
  {
    id: 'trade-fitter',
    code: 'FIT-02',
    name: 'Fitter',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Pass in 10th Standard (SSLC) with Science and Mathematics',
    course_type: 'Engineering',
    description: 'Specialized mechanical engineering trade focused on precision component fabrication, bench work, lathe operations, milling, assembly, and mechanical maintenance.',
    key_skills: [
      'Precision Marking & Filing',
      'Lathe & Drilling Machine Operation',
      'Assembly of Mechanical Gauges & Jigs',
      'Piping & Hydraulic Circuit Basics',
      'Preventive Industrial Maintenance'
    ],
    career_opportunities: [
      'Public Sector Undertakings (BHEL, HAL, DRDO, Railway Workshops)',
      'Automotive & Precision Tooling Industries',
      'Machine Assembly Specialist',
      'Maintenance Technician in Manufacturing Plants'
    ],
    is_active: true,
    status_note: 'Standard Vocational Trade (Configurable in Admin)'
  },
  {
    id: 'trade-welder',
    code: 'WLD-03',
    name: 'Welder (Gas & Electric)',
    duration: '1 Year (2 Semesters)',
    eligibility: 'Pass in 10th Standard (SSLC) or 8th Standard as per state norms',
    course_type: 'Engineering',
    description: 'Intensive workshop training covering shielded metal arc welding (SMAW), gas welding, TIG, MIG/MAG welding processes, pipe welding, and metallurgical safety.',
    key_skills: [
      'SMAW & Oxy-Acetylene Gas Welding',
      'TIG (GTAW) & MIG (GMAW) Process',
      'Structural Pipe & Pressure Vessel Jointing',
      'Weld Inspection & Defect Analysis',
      'Industrial Safety & Gas Cylinder Handling'
    ],
    career_opportunities: [
      'Heavy Fabrication & Shipyard Industries',
      'Petrochemical & Pipeline Maintenance',
      'Construction & Infrastructure Contractors',
      'Overseas Technical Fabrication Roles'
    ],
    is_active: true,
    status_note: 'Standard Vocational Trade (Configurable in Admin)'
  },
  {
    id: 'trade-copa',
    code: 'COP-04',
    name: 'COPA (Computer Operator & Programming Assistant)',
    duration: '1 Year (2 Semesters)',
    eligibility: 'Pass in 10th Standard (SSLC)',
    course_type: 'Non-Engineering',
    description: 'Foundational computer operations course preparing candidates for data handling, office automation, database operations, web design basics, and hardware troubleshooting.',
    key_skills: [
      'MS Office Automation & Cloud Documents',
      'Database Management Systems (MySQL/Access)',
      'Basic Web Programming (HTML, CSS, JavaScript)',
      'Operating System Administration & Networking',
      'Accounting Software (Tally ERP)'
    ],
    career_opportunities: [
      'Data Entry Operator in Government & Private Offices',
      'Computer Lab Assistant & Support Technician',
      'Junior Web Coordinator & Office Administrator',
      'Digital E-Governance Helpdesk Executive'
    ],
    is_active: true,
    status_note: 'Standard Vocational Trade (Configurable in Admin)'
  },
  {
    id: 'trade-wireman',
    code: 'WIR-05',
    name: 'Wireman',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Pass in 8th or 10th Standard (SSLC)',
    course_type: 'Engineering',
    description: 'Vocational trade covering domestic, commercial, and agricultural electrification, cable laying, switchgear installations, and pump set connections.',
    key_skills: [
      'Single & Three-Phase Wiring',
      'Agricultural Motor Starters & Repair',
      'Conduit & Concealed Pipeline Wiring',
      'Energy Meter Connection & Testing',
      'Fault Detection & Circuit Breaker Setup'
    ],
    career_opportunities: [
      'Certified Wireman with State Licensing',
      'Electrical Contractor Assistant',
      'Power Distribution Utility Field Staff',
      'Commercial Building Electrical Maintenance'
    ],
    is_active: true,
    status_note: 'Standard Vocational Trade (Configurable in Admin)'
  },
  {
    id: 'trade-mechanic-diesel',
    code: 'MDS-06',
    name: 'Mechanic Diesel',
    duration: '1 Year (2 Semesters)',
    eligibility: 'Pass in 10th Standard (SSLC) with Science and Mathematics',
    course_type: 'Engineering',
    description: 'Training in internal combustion diesel engines, fuel injection systems, cooling, lubrication, engine dismantling, and overhauling of transport machinery.',
    key_skills: [
      'Diesel Engine Dismantling & Reassembly',
      'Fuel Injection Pump Calibration',
      'Turbocharger & Air Intake Servicing',
      'Diagnostic Trouble Code Reading',
      'Heavy Vehicle Brake & Gearbox Basics'
    ],
    career_opportunities: [
      'KSRTC / NEKRTC / BMTC Fleet Maintenance Depots',
      'Authorized Automobile Service Stations',
      'Earthmoving & Heavy Machinery Operators',
      'Tractor & Agricultural Machinery Service Centres'
    ],
    is_active: true,
    status_note: 'Standard Vocational Trade (Configurable in Admin)'
  }
];

export const initialNotices: Notice[] = [
  {
    id: 'notice-1',
    title: 'Admissions Open for Academic Year 2026-27: Counselling Registrations',
    category: 'Admissions',
    date: '2026-09-20',
    description: 'Applications are invited from eligible candidates for admission into various NCVT/SCVT vocational trades for the 2026-27 session. Students can book an in-person counselling appointment to verify documents and complete trade selection.',
    is_published: true
  },
  {
    id: 'notice-2',
    title: 'State Government Post-Matric Scholarship (SSP) Notification',
    category: 'Important Notice',
    date: '2026-09-15',
    description: 'All admitted ITI students belonging to SC, ST, OBC and minority categories are advised to prepare their Aadhaar-linked bank accounts and Caste/Income certificates for submission on the Karnataka State Scholarship Portal (SSP).',
    is_published: true
  },
  {
    id: 'notice-3',
    title: 'Practical All India Trade Test (AITT) Workshop Preparation Schedule',
    category: 'Examination',
    date: '2026-09-08',
    description: 'Final semester trainees in Electrician, Fitter and Welder trades must complete their practical log books and job sheets before the upcoming institutional assessment.',
    is_published: true
  },
  {
    id: 'notice-4',
    title: 'Industrial Apprenticeship & Campus Orientation Drive',
    category: 'Training',
    date: '2026-08-28',
    description: 'Representatives from regional manufacturing and electrical distribution utilities will visit the campus to conduct National Apprenticeship Promotion Scheme (NAPS) registration for outgoing trainees.',
    is_published: true
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is an ITI course and what qualification does it provide?',
    answer: 'An ITI (Industrial Training Institute) course provides hands-on, job-oriented technical education. Upon successful completion of the training and passing the All India Trade Test (AITT), trainees are awarded the National Trade Certificate (NTC) recognized nationwide by government departments, public sector units (PSUs), and private industries.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'Who is eligible to apply for admission at Government ITI College, Jewargi?',
    answer: 'Candidates who have passed 10th standard (SSLC) or 8th standard (for select vocational trades) are eligible. Preference and age relaxations are provided as per Government of Karnataka reservation guidelines. Minimum age is typically 14 years with no upper limit for several trades.',
    category: 'Admissions'
  },
  {
    id: 'faq-3',
    question: 'What documents are required during counselling and admission?',
    answer: 'Required documents include: (1) 10th Standard (SSLC) original marks card and 3 photocopies, (2) Transfer Certificate (TC) from the last attended school, (3) Caste and Income certificate (issued by Tahsildar / Nadakacheri) if claiming reservation or fee concession, (4) Aadhaar card photocopy, (5) Bank account passbook copy linked with Aadhaar, and (6) 4 recent passport-size photographs.',
    category: 'Documents'
  },
  {
    id: 'faq-4',
    question: 'How do I book an appointment or admission enquiry with the institute?',
    answer: 'You can book an appointment directly through this website by clicking "Book Appointment". Select your purpose (such as Admission Enquiry or Trade Information), choose your preferred date and an available time slot, enter your details, and submit. You will immediately receive a verified Reference ID to present at the college administrative office.',
    category: 'Appointments'
  },
  {
    id: 'faq-5',
    question: 'What are the institute working hours and visitor timings?',
    answer: 'The administrative office and training workshops generally operate Monday through Saturday from 09:30 AM to 05:00 PM, with lunch break between 01:00 PM and 02:00 PM. The institute remains closed on Sundays and designated Karnataka state government public holidays.',
    category: 'Timings'
  },
  {
    id: 'faq-6',
    question: 'Where is Government ITI College, Jewargi located and how can I reach it?',
    answer: 'Government ITI College is located in Jewargi town, Kalaburagi (Gulbarga) district, Karnataka. It is accessible by local buses and public transit from Jewargi bus stand and the surrounding taluk areas. You can use the Google Maps link on our contact section for precise driving directions.',
    category: 'Location'
  },
  {
    id: 'faq-7',
    question: 'Are government scholarships and fee concessions available?',
    answer: 'Yes. Being a government institution, students are entitled to fee concessions and scholarships under Government of Karnataka schemes, including the State Scholarship Portal (SSP), Social Welfare Department stipends for SC/ST students, Backward Classes Welfare scholarships, and tool kit subsidies under eligible state programs.',
    category: 'Fees & Scholarships'
  },
  {
    id: 'faq-8',
    question: 'Can I modify or cancel my booked appointment?',
    answer: 'Yes. Visit the "Track / Check Appointment" section from the top bar or footer, enter your Reference ID (e.g. ITI-JWG-2026-XXXX) and registered phone number, and you can view your confirmation status, reschedule to another slot, or cancel.',
    category: 'Appointments'
  }
];

export const initialFacilities: Facility[] = [
  {
    id: 'fac-workshops',
    name: 'Industrial Technical Workshops',
    short_desc: 'Hands-on mechanical and fabrication bays',
    details: 'Spacious workshop floor equipped with bench vices, lathe machines, drilling units, cutting tools, welding equipment, and personal protective safety gear for real-world mechanical training.',
    icon: 'Wrench',
    verified_status: 'Core Educational Facility'
  },
  {
    id: 'fac-electrical-lab',
    name: 'Electrical & Electronics Practical Lab',
    short_desc: 'Wiring booths, testing panels, and motor test beds',
    details: 'Specialized testing benches with AC/DC motor generators, transformer testing units, domestic conduit wiring simulation booths, multimeters, and earth-resistance testing apparatus.',
    icon: 'Zap',
    verified_status: 'Core Educational Facility'
  },
  {
    id: 'fac-computer-lab',
    name: 'Computer & IT Training Centre',
    short_desc: 'Modern workstations with broadband connectivity',
    details: 'Dedicated IT lab for COPA trainees and digital literacy education, featuring desktop computers, office productivity software, accounting tools, and network diagnostics.',
    icon: 'Monitor',
    verified_status: 'Core Educational Facility'
  },
  {
    id: 'fac-classrooms',
    name: 'Theory Classrooms',
    short_desc: 'Well-ventilated academic lecture halls',
    details: 'Equipped with blackboards, audio-visual display provisions, ergonomic student seating, and engineering drawing tables for Trade Theory and Workshop Calculation & Science instruction.',
    icon: 'BookOpen',
    verified_status: 'Core Educational Facility'
  },
  {
    id: 'fac-library',
    name: 'Technical Reference & Reading Room',
    short_desc: 'Curated technical handbooks and trade manuals',
    details: 'Repository of NIMI (National Instructional Media Institute) instructional trade books, engineering drawing charts, government notification gazettes, and vocational periodicals in Kannada and English.',
    icon: 'Library',
    verified_status: 'Core Educational Facility'
  },
  {
    id: 'fac-safety',
    name: 'Campus Infrastructure & Student Amenities',
    short_desc: 'Safe and supportive environment',
    details: 'Clean drinking water facilities, separate student sanitation blocks, fire safety extinguishers across workshops, first-aid station, and an administrative helpdesk counter.',
    icon: 'ShieldCheck',
    verified_status: 'Core Institutional Amenity'
  }
];

export const initialGallery: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Practical Workshop & Lathe Machine Training',
    category: 'Workshops',
    image_url: '/src/assets/images/iti_workshop_training_1790509648527.jpg',
    caption: 'Students receiving hands-on instruction in machine operations, fitting, and precision tools in the industrial workshop bay.',
    verified_note: 'Vocational Training Representation'
  },
  {
    id: 'gal-2',
    title: 'Electrical Lab & Circuit Testing Stations',
    category: 'Practical Training',
    image_url: '/src/assets/images/iti_electronics_lab_1790509661560.jpg',
    caption: 'Trainees conducting circuit wiring, safety testing, and measurement experiments on laboratory workbenches.',
    verified_note: 'Practical Lab Environment'
  },
  {
    id: 'gal-3',
    title: 'Computer & Digital Skills Laboratory',
    category: 'Classrooms',
    image_url: '/src/assets/images/iti_copa_computer_lab_1790509673531.jpg',
    caption: 'Computer Operator and Programming Assistant (COPA) laboratory session focusing on software applications and data processing.',
    verified_note: 'IT Training Facility'
  },
  {
    id: 'gal-4',
    title: 'Institute Campus Building & Grounds',
    category: 'Campus',
    image_url: '/src/assets/images/iti_campus_exterior_1790509686598.jpg',
    caption: 'Exterior frontage and administrative block of the technical training institute in Jewargi, Kalaburagi.',
    verified_note: 'Institutional Architecture'
  }
];

export const initialSettings: ScheduleSettings = {
  working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  opening_time: '09:30',
  closing_time: '17:00',
  slot_duration_minutes: 30,
  break_start: '13:00',
  break_end: '14:00',
  max_per_slot: 2,
  holidays: ['2026-10-02', '2026-11-01', '2026-12-25'],
  institute_name: 'Government ITI College, Jewargi',
  location_name: 'Jewargi, Kalaburagi (Gulbarga), Karnataka, India',
  phone: '[To be verified]',
  email: '[To be verified]',
  address: 'Government ITI College, Jewargi, Kalaburagi District, Karnataka 585310, India',
  office_hours_display: 'Mon - Sat: 09:30 AM - 05:00 PM (Closed on Sundays & Govt Holidays)',
  google_maps_url: 'https://maps.app.goo.gl/GqmRmEwoYkHQCdbj9'
};

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-demo-1',
    reference_id: 'ITI-JWG-2026-1011',
    student_name: 'Basavaraj Patil',
    phone: '9845012345',
    email: 'basavaraj.p@example.com',
    applicant_type: 'Student',
    purpose: 'Admission Enquiry',
    trade_id: 'trade-electrician',
    trade_name: 'Electrician',
    appointment_date: '2026-09-28',
    appointment_time: '10:00 AM',
    message: 'Seeking guidance regarding 10th marks cut-off and hostel availability for the Electrician trade.',
    status: 'Confirmed',
    admin_notes: 'Document verification desk allocated. Bring SSLC marks card.',
    created_at: '2026-09-26T10:15:00.000Z',
    updated_at: '2026-09-26T14:30:00.000Z'
  },
  {
    id: 'apt-demo-2',
    reference_id: 'ITI-JWG-2026-1012',
    student_name: 'Priyanka Rathod',
    phone: '9731298765',
    email: 'priyanka.r@example.com',
    applicant_type: 'Student',
    purpose: 'Course/Trade Information',
    trade_id: 'trade-copa',
    trade_name: 'COPA (Computer Operator & Programming Assistant)',
    appointment_date: '2026-09-28',
    appointment_time: '11:30 AM',
    message: 'Interested in COPA trade computer training curriculum and placement assistance.',
    status: 'Pending',
    created_at: '2026-09-27T08:00:00.000Z',
    updated_at: '2026-09-27T08:00:00.000Z'
  },
  {
    id: 'apt-demo-3',
    reference_id: 'ITI-JWG-2026-1013',
    student_name: 'Mallikarjun Biradar',
    phone: '9900112233',
    email: 'mallikarjun.b@example.com',
    applicant_type: 'Parent',
    purpose: 'Scholarship Enquiry',
    trade_id: 'trade-fitter',
    trade_name: 'Fitter',
    appointment_date: '2026-09-29',
    appointment_time: '02:30 PM',
    message: 'Enquiring about SSP post-matric scholarship application guidelines and fee waiver eligibility.',
    status: 'Confirmed',
    admin_notes: 'Advised to bring Tahsildar income certificate.',
    created_at: '2026-09-25T11:20:00.000Z',
    updated_at: '2026-09-25T16:00:00.000Z'
  }
];
