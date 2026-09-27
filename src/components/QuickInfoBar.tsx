import React from 'react';
import { Landmark, Cpu, Hammer, Briefcase, MapPin } from 'lucide-react';

export const QuickInfoBar: React.FC = () => {
  const cards = [
    {
      icon: Landmark,
      title: 'Government Institution',
      description: 'Department of Industrial Training & Employment, Karnataka',
    },
    {
      icon: Cpu,
      title: 'Technical & Vocational Training',
      description: 'Standardized curriculum aligned with NCVT / SCVT vocational norms',
    },
    {
      icon: Hammer,
      title: 'Practical Learning',
      description: 'Substantial hands-on workshop training on industrial machines & tools',
    },
    {
      icon: Briefcase,
      title: 'Career-Focused Education',
      description: 'Direct eligibility for technician roles, PSUs & apprenticeship programs',
    },
    {
      icon: MapPin,
      title: 'Jewargi, Kalaburagi',
      description: 'Accessible campus serving students across Kalaburagi rural & taluk areas',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-md p-4 transition-colors text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-md bg-[#0f2b48]/10 text-[#0f2b48] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
