import React from 'react';
import { MapPin, Navigation, ShieldCheck, Wrench, Search } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTrackBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenTrackBooking,
  onOpenAdmin,
}) => {
  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About College', href: '#about' },
    { label: 'Trades & Courses', href: '#trades' },
    { label: 'Admissions & Eligibility', href: '#admissions' },
    { label: 'Campus Facilities', href: '#facilities' },
    { label: 'Photo Gallery', href: '#gallery' },
    { label: 'Circulars & Notices', href: '#notices' },
    { label: 'Frequently Asked Questions', href: '#faq' },
    { label: 'Contact & Location', href: '#contact' },
  ];

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0b1b2b] text-slate-300 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Institutional Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-white/10 text-white flex items-center justify-center border border-white/20">
                <Wrench className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="text-base font-bold text-white font-institutional">
                  Government ITI College
                </div>
                <div className="text-slate-400 text-xs">Jewargi, Kalaburagi, Karnataka</div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              A public technical and vocational training institute operating under the Department of Industrial Training & Employment, Government of Karnataka. Dedicated to skilled human resource development through Craftsmen Training Schemes.
            </p>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Official Institutional Portal · Academic Year 2026-27</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Quick Navigation
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleScroll(link.href)}
                    className="hover:text-white transition-colors text-left text-slate-400 cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Institutional Services */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Student & Parent Services
            </div>
            <div className="space-y-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-3 bg-sky-700 hover:bg-sky-600 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Admission Enquiry / Slot</span>
              </button>

              <button
                onClick={onOpenTrackBooking}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>Track / Modify Existing Booking</span>
              </button>
            </div>

            <div className="pt-2 text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Jewargi Taluk, Kalaburagi District, Karnataka 585310</span>
              </div>
              <div>
                <a
                  href="https://maps.app.goo.gl/GqmRmEwoYkHQCdbj9"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1 mt-1 text-[11px]"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Google Maps: maps.app.goo.gl/GqmRmEwoYkHQCdbj9</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © Government ITI College, Jewargi. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Affiliated to NCVT / SCVT Craftsmen Training Scheme</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>Administration Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
