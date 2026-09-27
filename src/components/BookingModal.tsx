import React, { useState, useEffect } from 'react';
import {
  ApplicantType,
  AppointmentPurpose,
  Trade,
  Appointment,
  ScheduleSettings,
} from '../types';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  ShieldCheck,
  CalendarCheck,
  Database,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
  settings: ScheduleSettings;
  preselectedTradeId?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  trades,
  settings,
  preselectedTradeId,
  onBookingSuccess,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [applicantType, setApplicantType] = useState<ApplicantType>('Student');
  const [purpose, setPurpose] = useState<AppointmentPurpose>('Admission Enquiry');
  const [tradeId, setTradeId] = useState(preselectedTradeId || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');

  // Slot checking state
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<{
    time24: string;
    displayTime: string;
    bookedCount: number;
    maxSlots: number;
    available: boolean;
  }[]>([]);
  const [slotErrorMessage, setSlotErrorMessage] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<Appointment | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Sync preselected trade when modal opens
  useEffect(() => {
    if (preselectedTradeId) {
      setTradeId(preselectedTradeId);
    }
  }, [preselectedTradeId]);

  // Set default preferred date to tomorrow or next working day
  useEffect(() => {
    if (isOpen && !preferredDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // If tomorrow is Sunday, advance to Monday
      if (tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
      }
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setPreferredDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [isOpen, preferredDate]);

  // Load slots when preferredDate changes
  useEffect(() => {
    if (!preferredDate) {
      setAvailableSlots([]);
      return;
    }

    let isMounted = true;
    setSlotsLoading(true);
    setSlotErrorMessage(null);
    setPreferredTime('');

    api.getAvailableSlots(preferredDate)
      .then((res) => {
        if (!isMounted) return;
        if (!res.isWorkingDay || res.isHoliday) {
          setAvailableSlots([]);
          setSlotErrorMessage(res.holidayReason || 'Institute is closed on this date.');
        } else {
          setAvailableSlots(res.slots);
          // Auto select first available slot
          const firstAvail = res.slots.find(s => s.available);
          if (firstAvail) {
            setPreferredTime(firstAvail.displayTime);
          } else {
            setSlotErrorMessage('All appointment slots for this date are fully booked. Please select another date.');
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setSlotErrorMessage('Unable to check slot availability. Please try again.');
      })
      .finally(() => {
        if (isMounted) setSlotsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [preferredDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim() || !phone.trim() || !preferredDate || !preferredTime) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Phone validation (10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedTrade = trades.find(t => t.id === tradeId);
      const appointment = await api.createAppointment({
        student_name: fullName.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        applicant_type: applicantType,
        purpose,
        trade_id: tradeId || undefined,
        trade_name: selectedTrade?.name || undefined,
        appointment_date: preferredDate,
        appointment_time: preferredTime,
        message: message.trim() || undefined,
      });

      setBookingConfirmed(appointment);
      if (onBookingSuccess) {
        onBookingSuccess(appointment);
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || 'Failed to register appointment. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (bookingConfirmed) {
      navigator.clipboard.writeText(bookingConfirmed.reference_id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetAndClose = () => {
    setBookingConfirmed(null);
    setFormError(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  // Min date = today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl border border-slate-200 text-left relative my-8 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-[#0f2b48] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <h3 className="text-base font-bold font-institutional leading-tight">
                {bookingConfirmed ? 'Appointment Confirmed' : 'Book Institutional Appointment'}
              </h3>
              <p className="text-[11px] text-sky-200">
                Government ITI College, Jewargi · Administrative Office
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-300 hover:text-white p-1 rounded-sm cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {bookingConfirmed ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-institutional">
                Your Appointment Request Has Been Received
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Please save your unique Reference ID. Present this reference at the college administrative counter upon arrival.
              </p>
            </div>

            {/* Reference ID Callout Box */}
            <div className="bg-slate-50 border-2 border-dashed border-[#0f2b48]/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono block">
                  Official Reference ID
                </span>
                <span className="text-2xl font-mono font-bold text-[#0f2b48] tracking-wider">
                  {bookingConfirmed.reference_id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copiedRef ? 'Copied!' : 'Copy ID'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#0f2b48] text-white hover:bg-[#153e68] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-300" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-lg p-4">
              <div>
                <span className="text-slate-400 block">Candidate / Visitor Name:</span>
                <span className="font-semibold text-slate-900">{bookingConfirmed.student_name}</span>
                <span className="text-[11px] text-slate-500 ml-1">({bookingConfirmed.applicant_type})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mobile Contact:</span>
                <span className="font-semibold text-slate-900 font-mono">{bookingConfirmed.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Appointment Date:</span>
                <span className="font-semibold text-slate-900 font-mono">{bookingConfirmed.appointment_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Scheduled Time Slot:</span>
                <span className="font-semibold text-slate-900 font-mono">{bookingConfirmed.appointment_time}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Purpose:</span>
                <span className="font-semibold text-slate-900">{bookingConfirmed.purpose}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Trade / Program:</span>
                <span className="font-semibold text-slate-900">{bookingConfirmed.trade_name || 'General / Not specified'}</span>
              </div>
            </div>

            {/* Visitor Instructions */}
            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-md text-xs text-sky-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-800" />
                <span>What to bring for your visit:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-700 text-[11px]">
                <li>Original and 2 photocopies of 10th (SSLC) marks card (for admission inquiries).</li>
                <li>Valid government photo identity (Aadhaar card).</li>
                <li>Arrive 10 minutes prior to your designated slot at Government ITI College, Jewargi.</li>
              </ul>
            </div>

            {/* Supabase Database Sync Status Callout */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium text-slate-600">
                  Data stored securely in <span className="font-semibold text-slate-900">Supabase Database</span> (Project: <code className="text-[#0f2b48] font-mono">humbckobaficvgtkohjp</code>)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" /> Live Synced
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0f2b48] hover:bg-[#153e68] text-white font-semibold text-xs rounded-md transition-colors cursor-pointer"
              >
                Close & Return to Portal
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Purpose & Applicant Category */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 font-mono">
                1. Purpose of Appointment *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as AppointmentPurpose)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-medium text-slate-800"
                    required
                  >
                    <option value="Admission Enquiry">Admission Enquiry</option>
                    <option value="Course/Trade Information">Course / Trade Information</option>
                    <option value="Eligibility Enquiry">Eligibility Enquiry</option>
                    <option value="Document Enquiry">Document Verification Enquiry</option>
                    <option value="Fee Enquiry">Fee & Concession Enquiry</option>
                    <option value="Scholarship Enquiry">Scholarship (SSP) Enquiry</option>
                    <option value="General Enquiry">General Information</option>
                    <option value="Meet Staff">Meet Administrative Staff</option>
                  </select>
                </div>

                <div>
                  <select
                    value={applicantType}
                    onChange={(e) => setApplicantType(e.target.value as ApplicantType)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-medium text-slate-800"
                    required
                  >
                    <option value="Student">I am a Student / Candidate</option>
                    <option value="Parent">I am a Parent</option>
                    <option value="Guardian">I am a Guardian / Relative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Trade Selection (Optional / Configurable) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-mono">
                2. Select Trade (Optional)
              </label>
              <select
                value={tradeId}
                onChange={(e) => setTradeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white text-slate-800"
              >
                <option value="">-- General / Trade Not Decided Yet --</option>
                {trades.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duration} · {t.course_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Date & Live Slot Picker with Double-Booking Prevention */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  3. Select Date & Available Time Slot *
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Operating Mon - Sat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                {/* Date Input */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Preferred Visit Date:
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      min={todayStr}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-mono text-slate-800"
                    />
                  </div>
                </div>

                {/* Slot Status Notice */}
                <div className="text-xs">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Slot Availability:
                  </label>
                  {slotsLoading ? (
                    <div className="p-2 text-slate-500 text-[11px] animate-pulse">
                      Checking available slots for {preferredDate}...
                    </div>
                  ) : slotErrorMessage ? (
                    <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{slotErrorMessage}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Slots available. Click to select your time.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slots Button Grid */}
              {availableSlots.length > 0 && !slotErrorMessage && (
                <div className="pt-2">
                  <div className="text-[11px] font-medium text-slate-600 mb-2">
                    Available Time Slots (Maximum {settings.max_per_slot} appointments per slot to prevent waiting):
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                    {availableSlots.map((slot) => {
                      const isSelected = preferredTime === slot.displayTime;
                      return (
                        <button
                          key={slot.time24}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setPreferredTime(slot.displayTime)}
                          className={`py-1.5 px-2 rounded-md text-xs font-mono transition-colors text-center border cursor-pointer ${
                            !slot.available
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#0f2b48] text-white border-[#0f2b48] font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <div>{slot.displayTime}</div>
                          <div className="text-[9px] opacity-80">
                            {slot.available ? `${slot.maxSlots - slot.bookedCount} left` : 'Full'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Contact Details */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                4. Applicant Details & Message
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name of Student / Parent *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Mobile Number (10 Digits) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Specific questions or queries (Optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
                  />
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Double-booking prevention active · Instant Reference ID
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-1/2 sm:w-auto px-4 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !preferredTime}
                  className="w-1/2 sm:w-auto px-6 py-2 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CalendarCheck className="w-4 h-4 text-sky-300" />
                  <span>{submitting ? 'Confirming...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
