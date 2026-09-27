import React, { useState } from 'react';
import { Appointment } from '../types';
import { api } from '../services/api';
import {
  Search,
  X,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Ban,
  Printer,
  Copy
} from 'lucide-react';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated?: () => void;
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({
  isOpen,
  onClose,
  onBookingUpdated,
}) => {
  const [referenceId, setReferenceId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Reschedule mode
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<{ displayTime: string; available: boolean }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Cancel mode
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim() || !phone.trim()) return;

    setLoading(true);
    setError(null);
    setAppointment(null);

    try {
      const apt = await api.getAppointmentByReference(referenceId.trim(), phone.trim());
      if (apt) {
        setAppointment(apt);
      } else {
        setError('No appointment found matching this Reference ID and Mobile Number. Please verify your details.');
      }
    } catch (err) {
      console.error(err);
      setError('Error retrieving appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChangeForReschedule = async (dateStr: string) => {
    setNewDate(dateStr);
    setNewTime('');
    if (!dateStr) {
      setAvailableSlots([]);
      return;
    }
    setSlotsLoading(true);
    try {
      const res = await api.getAvailableSlots(dateStr);
      if (res.isWorkingDay && !res.isHoliday) {
        setAvailableSlots(res.slots.map(s => ({ displayTime: s.displayTime, available: s.available })));
      } else {
        setAvailableSlots([]);
      }
    } catch {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!appointment || !newDate || !newTime) return;
    setLoading(true);
    setActionError(null);
    try {
      const updated = await api.rescheduleAppointment(appointment.id, newDate, newTime);
      if (updated) {
        setAppointment(updated);
        setIsRescheduling(false);
        if (onBookingUpdated) onBookingUpdated();
      }
    } catch (err: any) {
      console.error(err);
      setActionError(err?.message || 'Failed to reschedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!appointment) return;
    setLoading(true);
    setActionError(null);
    try {
      await api.cancelAppointment(appointment.id, cancelReason);
      setAppointment(prev => prev ? { ...prev, status: 'Cancelled' } : null);
      setIsCancelling(false);
      if (onBookingUpdated) onBookingUpdated();
    } catch (err: any) {
      console.error(err);
      setActionError(err?.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">Confirmed</span>;
      case 'Pending':
        return <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">Pending Scrutiny</span>;
      case 'Rescheduled':
        return <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-sm border border-sky-200">Rescheduled</span>;
      case 'Completed':
        return <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-300">Completed</span>;
      case 'Cancelled':
        return <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200">Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 text-left relative my-8 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2b48] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-300" />
            <h3 className="text-base font-bold font-institutional">
              Track or Modify Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleLookup} className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Enter Booking Credentials
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Reference ID (e.g. ITI-JWG-2026-1011):
                </label>
                <input
                  type="text"
                  required
                  placeholder="ITI-JWG-2026-XXXX"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Registered Mobile Number:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5 text-sky-300" />
              <span>{loading ? 'Searching...' : 'Find Appointment Details'}</span>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Appointment Found Card */}
          {appointment && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Reference</span>
                  <span className="text-base font-bold font-mono text-[#0f2b48]">{appointment.reference_id}</span>
                </div>
                <div>{getStatusBadge(appointment.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Candidate / Visitor:</span>
                  <span className="font-semibold text-slate-900">{appointment.student_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mobile Phone:</span>
                  <span className="font-semibold text-slate-900 font-mono">{appointment.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Appointment Date:</span>
                  <span className="font-semibold text-slate-900 font-mono">{appointment.appointment_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Scheduled Time:</span>
                  <span className="font-semibold text-slate-900 font-mono">{appointment.appointment_time}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Purpose:</span>
                  <span className="font-semibold text-slate-900">{appointment.purpose}</span>
                  {appointment.trade_name && (
                    <span className="text-slate-600 block text-[11px] mt-0.5">
                      Selected Trade: {appointment.trade_name}
                    </span>
                  )}
                </div>
                {appointment.admin_notes && (
                  <div className="col-span-2 p-2.5 bg-sky-50 border border-sky-200 rounded text-sky-900 text-[11px]">
                    <span className="font-bold">Staff Instructions: </span>
                    {appointment.admin_notes}
                  </div>
                )}
              </div>

              {/* Reschedule View */}
              {isRescheduling && (
                <div className="pt-3 border-t border-slate-200 space-y-3 bg-slate-50 p-3 rounded-md">
                  <div className="text-xs font-bold text-slate-900">Select New Date & Time Slot:</div>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => handleDateChangeForReschedule(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                  {slotsLoading ? (
                    <div className="text-[11px] text-slate-500">Checking slot availability...</div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
                      {availableSlots.map(s => (
                        <button
                          key={s.displayTime}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setNewTime(s.displayTime)}
                          className={`py-1 px-2 text-[11px] rounded border ${
                            newTime === s.displayTime
                              ? 'bg-[#0f2b48] text-white font-bold'
                              : s.available
                              ? 'bg-white hover:bg-slate-100'
                              : 'opacity-40 cursor-not-allowed line-through'
                          }`}
                        >
                          {s.displayTime}
                        </button>
                      ))}
                    </div>
                  ) : newDate ? (
                    <div className="text-[11px] text-rose-600">No available slots on this date.</div>
                  ) : null}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-1 text-xs text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!newDate || !newTime}
                      onClick={handleConfirmReschedule}
                      className="px-4 py-1 text-xs font-semibold text-white bg-[#0f2b48] rounded disabled:opacity-50"
                    >
                      Save New Slot
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel View */}
              {isCancelling && (
                <div className="pt-3 border-t border-slate-200 space-y-3 bg-rose-50 p-3 rounded-md">
                  <div className="text-xs font-bold text-rose-900">Confirm Appointment Cancellation:</div>
                  <input
                    type="text"
                    placeholder="Reason for cancellation (Optional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-rose-300 bg-white"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCancelling(false)}
                      className="px-3 py-1 text-xs text-slate-600"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      className="px-4 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              )}

              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Action Buttons if active */}
              {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && !isRescheduling && !isCancelling && (
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRescheduling(true)}
                      className="py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reschedule Slot</span>
                    </button>
                    <button
                      onClick={() => setIsCancelling(true)}
                      className="py-1.5 px-3 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cancel</span>
                    </button>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="py-1.5 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
