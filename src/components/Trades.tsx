import React, { useState } from 'react';
import { Trade } from '../types';
import {
  Wrench,
  Zap,
  Flame,
  Monitor,
  Cpu,
  Clock,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  CalendarCheck,
  Info
} from 'lucide-react';

interface TradesProps {
  trades: Trade[];
  onEnquireTrade: (tradeId: string) => void;
}

export const Trades: React.FC<TradesProps> = ({ trades, onEnquireTrade }) => {
  const [filterType, setFilterType] = useState<'All' | 'Engineering' | 'Non-Engineering'>('All');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const filteredTrades = trades.filter((trade) => {
    if (!trade.is_active) return false;
    if (filterType === 'All') return true;
    return trade.course_type === filterType;
  });

  const getTradeIcon = (code: string) => {
    if (code.includes('ELE') || code.includes('WIR')) return <Zap className="w-5 h-5 text-amber-600" />;
    if (code.includes('FIT') || code.includes('MDS')) return <Wrench className="w-5 h-5 text-sky-700" />;
    if (code.includes('WLD')) return <Flame className="w-5 h-5 text-orange-600" />;
    if (code.includes('COP')) return <Monitor className="w-5 h-5 text-indigo-600" />;
    return <Cpu className="w-5 h-5 text-slate-700" />;
  };

  return (
    <section id="trades" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200 text-left">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
              Vocational Programs
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
              Trades & Vocational Courses
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Explore vocational courses designed to provide practical technical competencies and industry certifications.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="mt-4 md:mt-0 flex items-center gap-1.5 p-1 bg-slate-100 rounded-md border border-slate-200 self-start md:self-auto">
            {(['All', 'Engineering', 'Non-Engineering'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === type
                    ? 'bg-white text-[#0f2b48] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'All' ? 'All Trades' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Configurable Verification Disclaimer Notice */}
        <div className="mb-8 p-3.5 bg-amber-50/80 border border-amber-200 rounded-md flex items-start gap-2.5 text-left text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Institutional Notice: </span>
            The trades listed below reflect standard NCVT/SCVT Craftsmen Training Scheme offerings for Government ITIs. Exact active trade seat allocations for Government ITI Jewargi for the current academic session can be verified or updated through the institute administrator portal.
          </div>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all text-left"
            >
              <div>
                {/* Card Header with Unboxed Metadata */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center">
                      {getTradeIcon(trade.code)}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-medium text-slate-500">{trade.code}</div>
                      <div className="text-[11px] font-semibold text-sky-800">{trade.course_type} Trade</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trade.duration}</span>
                  </div>
                </div>

                {/* Trade Name */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-institutional leading-snug">
                  {trade.name}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {trade.description}
                </p>

                {/* Eligibility Snippet */}
                <div className="bg-slate-50 rounded-sm p-2.5 border border-slate-150 mb-4 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <GraduationCap className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Eligibility: </span>
                      <span>{trade.eligibility}</span>
                    </div>
                  </div>
                </div>

                {/* Key Skills Preview */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                    Key Practical Competencies:
                  </div>
                  <ul className="space-y-1">
                    {trade.key_skills.slice(0, 3).map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-150 flex items-center gap-2">
                <button
                  onClick={() => onEnquireTrade(trade.id)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-sky-300" />
                  <span>Enquire Now</span>
                </button>
                <button
                  onClick={() => setSelectedTrade(trade)}
                  className="py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Detailed Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-left relative animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#0f2b48]/10 flex items-center justify-center">
                  {getTradeIcon(selectedTrade.code)}
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500">{selectedTrade.code} · {selectedTrade.course_type}</div>
                  <h3 className="text-xl font-bold text-[#0b1f33] font-institutional">
                    {selectedTrade.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrade(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Course Description:</h4>
                <p className="leading-relaxed text-slate-600">{selectedTrade.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Course Duration:</span>
                  <span className="text-slate-600">{selectedTrade.duration}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Entry Eligibility:</span>
                  <span className="text-slate-600">{selectedTrade.eligibility}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Practical Skills Acquired:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2">
                  {selectedTrade.key_skills.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-700 font-bold">·</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-sky-800" />
                  Career & Employment Opportunities:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2">
                  {selectedTrade.career_opportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-700 font-bold">·</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 italic">
                {selectedTrade.status_note || 'Aligned with state Craftsmen Training Scheme'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = selectedTrade.id;
                    setSelectedTrade(null);
                    onEnquireTrade(id);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-sky-300" />
                  <span>Book Appointment for {selectedTrade.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
