import React, { useState } from 'react';
import { Menu, X, CalendarCheck, ShieldCheck, Search, Wrench } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (tradeId?: string) => void;
  onOpenTrackBooking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenTrackBooking,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Trades', href: '#trades' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Notices', href: '#notices' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Government Strip */}
      <div className="bg-[#0b1b2b] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">Government of Karnataka</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-300">Department of Industrial Training & Employment</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
            <span className="text-sky-400 font-medium">Jewargi, Kalaburagi</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTrackBooking}
              className="text-xs text-sky-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3 h-3" />
              <span>Track Booking</span>
            </button>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <button
              onClick={onOpenAdmin}
              className={`text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                isAdminLoggedIn ? 'text-emerald-400 font-semibold' : 'text-sky-200 hover:text-white font-medium'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{isAdminLoggedIn ? 'Admin & Developer Controller' : 'Admin & Developer Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark & Emblem */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            {/* Technical Institutional Emblem SVG */}
            <div className="w-12 h-12 rounded-lg bg-[#0f2b48] text-white flex items-center justify-center shadow-xs border border-sky-900 shrink-0 group-hover:bg-[#153e68] transition-colors">
              <div className="relative flex items-center justify-center">
                <Wrench className="w-6 h-6 text-sky-400" />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-amber-500 text-slate-950 px-1 rounded-xs">
                  ITI
                </span>
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold tracking-tight text-[#0f2b48] leading-tight font-institutional">
                Government ITI College
              </div>
              <div className="text-xs font-medium text-slate-700 tracking-wide">
                Jewargi, Kalaburagi District, Karnataka
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="hover:text-[#0f2b48] hover:border-b-2 hover:border-[#0f2b48] py-1 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#0f2b48] bg-slate-100 hover:bg-slate-200/90 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Open Software Developer & Controller Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-800" />
              <span>Admin Controller</span>
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0f2b48] hover:bg-[#173d66] rounded-md shadow-xs transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <CalendarCheck className="w-4 h-4 text-sky-300" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="lg:hidden px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0f2b48] rounded-md flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0f2b48]"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 px-4 text-center font-semibold text-white bg-[#0f2b48] rounded-md flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-sky-300" />
                <span>Book Appointment / Admission Enquiry</span>
              </button>
              <div className="flex items-center justify-between text-xs px-2 pt-2 text-slate-500">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrackBooking();
                  }}
                  className="text-sky-700 font-medium hover:underline flex items-center gap-1"
                >
                  <Search className="w-3 h-3" /> Track My Booking
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="text-slate-600 font-medium hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-sky-600" /> Admin & Developer Portal
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
