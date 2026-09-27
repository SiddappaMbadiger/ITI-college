import React, { useState } from 'react';
import { ScheduleSettings } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageSquare,
  Send,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface ContactProps {
  settings: ScheduleSettings;
  onOpenBooking: () => void;
}

export const Contact: React.FC<ContactProps> = ({ settings, onOpenBooking }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMsg('');
    }, 4000);
  };

  const isPhoneConfigured = settings.phone && !settings.phone.includes('To be verified');
  const isEmailConfigured = settings.email && !settings.email.includes('To be verified');

  return (
    <section id="contact" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 text-left">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
            Direct Assistance & Location
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
            Contact Government ITI College, Jewargi
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Visit our administrative premises in Jewargi or get in touch regarding admissions, academic verification, or trade details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
          {/* Left Column: Official Contact Card & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 shadow-2xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 font-institutional pb-3 border-b border-slate-200">
                Administrative Office Address
              </h3>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 text-sky-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{settings.institute_name}</div>
                  <div className="text-slate-600 leading-relaxed mt-0.5">{settings.address}</div>
                  <div className="text-slate-400 font-mono text-[11px] mt-1">
                    District: Kalaburagi · State: Karnataka · PIN: 585310
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 text-sky-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Telephone / Helpdesk</div>
                  <div className="text-slate-600 font-mono mt-0.5">
                    {isPhoneConfigured ? settings.phone : '[To be verified by College Admin]'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 text-sky-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Email Enquiries</div>
                  <div className="text-slate-600 font-mono mt-0.5">
                    {isEmailConfigured ? settings.email : '[To be verified by College Admin]'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 text-sky-800">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Institute Timings</div>
                  <div className="text-slate-600 mt-0.5">{settings.office_hours_display}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Lunch Recess: {settings.break_start} - {settings.break_end}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Call Now, WhatsApp, Email, Get Directions */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                {isPhoneConfigured ? (
                  <a
                    href={`tel:${settings.phone}`}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Office</span>
                  </a>
                ) : (
                  <button
                    onClick={onOpenBooking}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Call Request</span>
                  </button>
                )}

                {isPhoneConfigured ? (
                  <a
                    href={`https://wa.me/91${settings.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button
                    onClick={onOpenBooking}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>WhatsApp Help</span>
                  </button>
                )}

                {isEmailConfigured ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-700" />
                    <span>Send Email</span>
                  </a>
                ) : (
                  <button
                    onClick={onOpenBooking}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Desk</span>
                  </button>
                )}

                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-300" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Quick Web Message Form */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-mono">
                Leave a Quick Message
              </h4>
              {submitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your message has been recorded. Our office staff will respond.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number (10 digits) *"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48]"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Your Query or Question..."
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-slate-300" />
                    <span>Submit Quick Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Location & Directions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-slate-100 flex-1 min-h-[380px] relative">
              {/* Responsive Google Maps Iframe centering on Jewargi, Kalaburagi */}
              <iframe
                title="Government ITI College Jewargi Location Map"
                src="https://maps.google.com/maps?q=Government+ITI+College+Jewargi+Kalaburagi+Karnataka&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Float Map Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-3 rounded-md border border-slate-200 shadow-md text-xs text-left max-w-xs">
                <div className="font-bold text-[#0f2b48] font-institutional">
                  Government ITI College, Jewargi
                </div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  Jewargi, Kalaburagi, Karnataka
                </div>
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Map Action Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Official Google Maps verified pin: <span className="font-mono text-slate-900">maps.app.goo.gl/GqmRmEwoYkHQCdbj9</span>
                </span>
              </div>
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-300" />
                <span>Navigate via GPS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
