import React from 'react';
import { Facility } from '../types';
import { Wrench, Zap, Monitor, BookOpen, Library, ShieldCheck } from 'lucide-react';

interface FacilitiesProps {
  facilities: Facility[];
}

export const Facilities: React.FC<FacilitiesProps> = ({ facilities }) => {
  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-sky-700" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-600" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-indigo-700" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-700" />;
      case 'Library':
        return <Library className="w-5 h-5 text-purple-700" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <section id="facilities" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 text-left">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
            Campus Infrastructure
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
            Facilities & Training Workshops
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Equipped to deliver practical, workshop-based vocational training in compliance with National Council for Vocational Training (NCVT) safety and equipment norms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-slate-50/70 border border-slate-200 rounded-lg p-5 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {getFacilityIcon(fac.icon)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {fac.verified_status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 font-institutional">
                  {fac.name}
                </h3>
                <div className="text-xs font-medium text-sky-800 mb-3">
                  {fac.short_desc}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fac.details}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Standardized Safety Protocols</span>
                <span>Active Bay</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
