import React from 'react';
import {
  FileCheck,
  CalendarCheck,
  HelpCircle,
  Award,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

interface AdmissionsProps {
  onOpenBooking: () => void;
}

export const Admissions: React.FC<AdmissionsProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      step: '01',
      title: 'Check Eligibility',
      desc: 'Verify minimum educational criteria (pass in 10th standard SSLC or 8th standard depending on trade). Candidates must meet age prerequisites as defined by the Karnataka State Vocational Training Council.',
    },
    {
      step: '02',
      title: 'Select Trade',
      desc: 'Review available technical courses (such as Electrician, Fitter, Welder, COPA). Visit our counselling desk or consult our instructors to match your career interests with the ideal trade.',
    },
    {
      step: '03',
      title: 'Submit Application & Documents',
      desc: 'Complete the government admission form online via state portal or directly in-person at Government ITI Jewargi. Submit educational certificates, caste/income proof, and identity documents.',
    },
    {
      step: '04',
      title: 'Complete Admission & Verification',
      desc: 'Attend the in-person document scrutiny at the college administrative office, verify originals, pay nominal government tuition/caution deposit, and receive trainee enrolment number.',
    },
  ];

  const requiredDocuments = [
    'Original 10th Standard (SSLC) Marks Card + 3 attested photocopies',
    'School Leaving Certificate / Transfer Certificate (TC)',
    'Aadhaar Card of candidate and parent/guardian',
    'Caste & Income Certificate issued by Tahsildar (for SC/ST/OBC fee benefits)',
    'Bank Account Passbook copy (must be Aadhaar-seeded for direct SSP transfer)',
    '4 recent passport-size colour photographs with light background',
    'Rural Study / Kannada Medium Certificate (if claiming reservation quota)',
  ];

  const scholarshipHighlights = [
    {
      title: 'State Scholarship Portal (SSP)',
      desc: 'Post-matric financial assistance for eligible SC, ST, Category-1, 2A, 2B, 3A, 3B trainees disbursed directly into bank accounts.',
    },
    {
      title: 'Free Tool Kit & Uniform Allowance',
      desc: 'Eligible candidates under select government welfare schemes receive complimentary training tool kits and uniform subsidies.',
    },
    {
      title: 'Zero/Subsidized Government Fee',
      desc: 'Nominal government institutional fee structure designed to make vocational technical education accessible to every student.',
    },
  ];

  return (
    <section id="admissions" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
            Admission & Enrolment
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
            Admission Guidelines & Process
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Admissions to Government ITI College, Jewargi follow the transparent merit and reservation guidelines laid down by the Department of Industrial Training & Employment, Karnataka.
          </p>
        </div>

        {/* 4-Step Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-left">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl font-extrabold text-[#0f2b48]/30 font-mono mb-2">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-institutional">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-sky-800 font-medium">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Stage {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>

        {/* Documents and Scholarships 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left mb-12">
          {/* Required Documents Checklist */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <FileCheck className="w-5 h-5 text-sky-800" />
              <h3 className="text-lg font-bold text-slate-900 font-institutional">
                Mandatory Verification Documents
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Please bring original certificates along with 2 sets of attested photocopies when attending your in-person counselling slot:
            </p>
            <ul className="space-y-2.5">
              {requiredDocuments.map((doc, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                Original certificates are returned immediately after verification, except Transfer Certificate (TC).
              </span>
            </div>
          </div>

          {/* Scholarships & Fees */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <Award className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold text-slate-900 font-institutional">
                  Government Scholarships & Schemes
                </h3>
              </div>
              <div className="space-y-4">
                {scholarshipHighlights.map((sc, sIdx) => (
                  <div key={sIdx} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="text-sm font-bold text-slate-900 mb-1">{sc.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{sc.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Counselling Banner */}
            <div className="bg-[#0f2b48] text-white rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold font-institutional text-white">
                  Need Personalized Admission Guidance?
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Book a slot with our college admission counsellors to discuss trade selection, eligibility, and document submission in person.
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 text-xs font-semibold text-[#0f2b48] bg-white hover:bg-slate-100 rounded-md shadow-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-sky-700" />
                <span>Book Admission Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
