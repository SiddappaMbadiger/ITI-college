import React, { useState } from 'react';
import { Notice } from '../types';
import { Bell, Calendar, Tag, ChevronRight, X, Search } from 'lucide-react';

interface NoticesProps {
  notices: Notice[];
}

export const Notices: React.FC<NoticesProps> = ({ notices }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const categories = ['All', 'Admissions', 'Examination', 'Training', 'Important Notice'];

  const publishedNotices = notices.filter(n => n.is_published);

  const filteredNotices = publishedNotices.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="notices" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 text-left">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
              Official Bulletin
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
              Institutional Notices & Announcements
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Stay updated with academic circulars, admission timelines, examination schedules, and apprenticeship notifications.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-4 md:mt-0 relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0f2b48] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div className="divide-y divide-slate-200 border-y border-slate-200 text-left">
          {filteredNotices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No circulars match the selected filter.
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="py-4 hover:bg-slate-50/80 px-3 rounded-md transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-sky-800">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {notice.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-institutional">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 max-w-3xl">
                    {notice.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => setActiveNotice(notice)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 hover:text-sky-950 transition-colors cursor-pointer py-1 px-2.5 rounded-sm hover:bg-sky-50"
                  >
                    <span>Read Circular</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl border border-slate-200 text-left relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="font-semibold text-sky-800">{activeNotice.category}</span>
                  <span>·</span>
                  <span>{activeNotice.date}</span>
                </div>
                <h3 className="text-base font-bold text-[#0b1f33] font-institutional">
                  {activeNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveNotice(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {activeNotice.description}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Department of Industrial Training & Employment, Karnataka
              </span>
              <button
                onClick={() => setActiveNotice(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
