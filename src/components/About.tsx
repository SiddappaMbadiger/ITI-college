import React from 'react';
import { Compass, BookCheck, Shield, ExternalLink } from 'lucide-react';

interface AboutProps {
  onLearnMore: () => void;
  onViewLocation: () => void;
}

export const About: React.FC<AboutProps> = ({ onLearnMore, onViewLocation }) => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-[#fcfbf9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
            Institutional Background
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
            About Government ITI College, Jewargi
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Government ITI College, Jewargi is a government industrial training institute established to provide accessible, high-caliber vocational and technical education to youth in Jewargi taluk and the broader Kalaburagi region.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
              <div className="aspect-16/10 relative bg-slate-100">
                <img
                  src="/src/assets/images/iti_campus_exterior_1790509686598.jpg"
                  alt="Government ITI College Jewargi Campus Building"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-white text-left">
                  <div className="text-xs font-semibold text-sky-300">Campus & Administrative Office</div>
                  <div className="text-xs text-slate-200">Jewargi, Kalaburagi District, Karnataka</div>
                </div>
              </div>

              {/* Institution Metadata */}
              <div className="p-4 bg-white space-y-2 text-xs text-slate-600 text-left">
                <div className="flex items-start justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Institution Type</span>
                  <span className="font-semibold text-slate-800">Government ITI (Industrial Training Institute)</span>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Administrative Department</span>
                  <span className="font-semibold text-slate-800 text-right">Dept. of Industrial Training & Employment, Karnataka</span>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Curricular Framework</span>
                  <span className="font-semibold text-slate-800">Craftsmen Training Scheme (CTS) / NCVT / SCVT</span>
                </div>
                <div className="flex items-start justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-semibold text-slate-800">Jewargi Taluk HQ, Kalaburagi, 585310</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Pillars Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
            <div className="prose text-slate-700 leading-relaxed space-y-4">
              <p>
                The primary mission of the institute is to impart structured technical craftsmanship, instilling both theoretical foundations and extensive machine-floor dexterity. Our curriculum bridges the transition between foundational schooling (SSLC / 10th Standard) and productive employment in manufacturing, maintenance, electrification, and public utilities.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-md bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-8 h-8 rounded-sm bg-sky-50 text-sky-800 flex items-center justify-center mb-2.5">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Practical Workshop Education</h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Over 70% of instruction takes place on workshop machines, tools, and testing apparatus to build real-world confidence.
                </p>
              </div>

              <div className="p-4 rounded-md bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-8 h-8 rounded-sm bg-sky-50 text-sky-800 flex items-center justify-center mb-2.5">
                  <BookCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Industry-Oriented Skills</h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Syllabi tailored to standard engineering conventions, electrical codes, machine tolerances, and safety protocols.
                </p>
              </div>

              <div className="p-4 rounded-md bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-8 h-8 rounded-sm bg-sky-50 text-sky-800 flex items-center justify-center mb-2.5">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Professional Discipline</h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Emphasis on workplace safety gear, workshop cleanliness, punctuality, and professional technical documentation.
                </p>
              </div>

              <div className="p-4 rounded-md bg-white border border-slate-200/90 shadow-2xs">
                <div className="w-8 h-8 rounded-sm bg-sky-50 text-sky-800 flex items-center justify-center mb-2.5">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Career & Apprenticeship Pathways</h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Direct progression into National Apprenticeship Promotion Scheme (NAPS), state DISCOMs, and industrial employment.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onLearnMore}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors cursor-pointer"
              >
                Learn More (Admission & Process)
              </button>
              <button
                onClick={onViewLocation}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors cursor-pointer"
              >
                Locate Campus in Jewargi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
