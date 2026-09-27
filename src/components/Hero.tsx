import React from 'react';
import { CalendarCheck, ArrowRight, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreTrades: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreTrades }) => {
  return (
    <section id="home" className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100/60 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Line */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0f2b48] bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-sm">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Government Industrial Training Institute</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-600">Jewargi, Kalaburagi, Karnataka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1f33] tracking-tight leading-[1.15] font-institutional">
              Build Your Skills. <br className="hidden sm:inline" />
              <span className="text-sky-700">Shape Your Future.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Government ITI College, Jewargi provides practical industrial training and career-focused technical education for students seeking skilled employment and further opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-7 py-3.5 text-base font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md shadow-sm transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <CalendarCheck className="w-5 h-5 text-sky-300" />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={onExploreTrades}
                className="px-6 py-3.5 text-base font-semibold text-[#0f2b48] bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Explore Trades</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Institutional Assurance Points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Direct Admission Counselling & Inquiry Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Hands-on Workshop Technical Training</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>State & Central Government Scholarships (SSP)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Campus located at Jewargi Taluk Headquarters</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-slate-300/80 shadow-md bg-white">
              <div className="relative aspect-4/3 w-full bg-slate-100">
                <img
                  src="/src/assets/images/iti_workshop_training_1790509648527.jpg"
                  alt="Students engaged in practical technical training at the Government ITI workshop"
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
                  <div className="text-xs uppercase tracking-wider text-sky-300 font-semibold mb-0.5">
                    Practical Technical Training
                  </div>
                  <div className="text-sm font-medium leading-snug">
                    Industrial lathe, fitting & machine workshop learning under certified instructors
                  </div>
                </div>
              </div>

              {/* Status Ribbon below image */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                  <span className="font-medium text-slate-800">Counselling & Enquiry Portal Active</span>
                </div>
                <span className="text-slate-600 font-mono text-[11px]">Academic Year 2026-27</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
