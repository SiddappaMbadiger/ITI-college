import React, { useState } from 'react';
import { FAQItem } from '../types';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

interface FAQProps {
  faqs: FAQItem[];
  onOpenBooking: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ faqs, onOpenBooking }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [search, setSearch] = useState('');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#fcfbf9] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10 pb-4 border-b border-slate-200">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
            Candidate & Parent Queries
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Clear, verified guidance regarding admissions, trade selection, appointments, and institute guidelines.
          </p>

          <div className="mt-4 relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 text-left">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-md overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-slate-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-800' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-5 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Have a specific question not addressed above?
              </div>
              <div className="text-[11px] text-slate-500">
                Schedule a one-on-one consultation with the college admissions desk.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors cursor-pointer shrink-0"
          >
            Book Enquiry Slot
          </button>
        </div>
      </div>
    </section>
  );
};
