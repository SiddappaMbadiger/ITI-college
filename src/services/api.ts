import {
  Appointment,
  Trade,
  Notice,
  FAQItem,
  ScheduleSettings,
  AppointmentStatus,
} from '../types';
import {
  initialTrades,
  initialNotices,
  initialFAQs,
  initialSettings,
  initialAppointments
} from '../data/initialData';
import { supabase, testSupabaseConnection, SUPABASE_PROJECT_ID } from '../lib/supabase';

export const AUTHORIZED_ADMIN = {
  email: 'siddappambadiger051@gmail.com',
  defaultPassword: 'Siddhappa@143',
  name: 'Siddhappa M Badiger',
  role: 'Super Admin & Software Controller',
  institution: 'Government ITI College, Jewargi',
};

const STORAGE_KEYS = {
  APPOINTMENTS: 'iti_jwg_appointments_v1',
  TRADES: 'iti_jwg_trades_v1',
  NOTICES: 'iti_jwg_notices_v1',
  FAQS: 'iti_jwg_faqs_v1',
  SETTINGS: 'iti_jwg_settings_v1',
  ADMIN_TOKEN: 'iti_jwg_admin_token_v1',
  ADMIN_USER: 'iti_jwg_admin_user_v1',
};

// Seed local storage if empty
function initializeStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.TRADES)) {
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(initialTrades));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(initialNotices));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(initialFAQs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
  }
}

// Generate human-friendly reference ID: ITI-JWG-2026-XXXX
export function generateReferenceId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ITI-JWG-2026-${randomNum}`;
}

// Format 24h to 12h AM/PM
export function formatTimeSlot(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  const hDisplay = h < 10 ? `0${h}` : `${h}`;
  const mDisplay = m < 10 ? `0${m}` : `${m}`;
  return `${hDisplay}:${mDisplay} ${ampm}`;
}

// Helper to convert time string "09:30" to minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hStr = h < 10 ? `0${h}` : `${h}`;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  return `${hStr}:${mStr}`;
}

// API Service Implementation
export const api = {
  // Settings
  async getSettings(): Promise<ScheduleSettings> {
    initializeStorage();
    try {
      const res = await fetch('/api/settings');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : initialSettings;
  },

  async updateSettings(settings: ScheduleSettings): Promise<ScheduleSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // Trades
  async getTrades(): Promise<Trade[]> {
    initializeStorage();
    try {
      const res = await fetch('/api/trades');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const stored = localStorage.getItem(STORAGE_KEYS.TRADES);
    return stored ? JSON.parse(stored) : initialTrades;
  },

  async saveTrade(trade: Trade): Promise<Trade> {
    initializeStorage();
    const trades = await this.getTrades();
    const index = trades.findIndex(t => t.id === trade.id);
    let updated: Trade[];
    if (index >= 0) {
      updated = [...trades];
      updated[index] = trade;
    } else {
      updated = [trade, ...trades];
    }
    try {
      await fetch('/api/trades', {
        method: index >= 0 ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(updated));
    return trade;
  },

  async deleteTrade(id: string): Promise<boolean> {
    initializeStorage();
    const trades = await this.getTrades();
    const filtered = trades.filter(t => t.id !== id);
    try {
      await fetch(`/api/trades/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(filtered));
    return true;
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    initializeStorage();
    try {
      const res = await fetch('/api/notices');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const stored = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return stored ? JSON.parse(stored) : initialNotices;
  },

  async saveNotice(notice: Notice): Promise<Notice> {
    initializeStorage();
    const notices = await this.getNotices();
    const index = notices.findIndex(n => n.id === notice.id);
    let updated: Notice[];
    if (index >= 0) {
      updated = [...notices];
      updated[index] = notice;
    } else {
      updated = [notice, ...notices];
    }
    try {
      await fetch('/api/notices', {
        method: index >= 0 ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      });
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(updated));
    return notice;
  },

  async deleteNotice(id: string): Promise<boolean> {
    initializeStorage();
    const notices = await this.getNotices();
    const filtered = notices.filter(n => n.id !== id);
    try {
      await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(filtered));
    return true;
  },

  // FAQs
  async getFAQs(): Promise<FAQItem[]> {
    initializeStorage();
    try {
      const res = await fetch('/api/faqs');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const stored = localStorage.getItem(STORAGE_KEYS.FAQS);
    return stored ? JSON.parse(stored) : initialFAQs;
  },

  async saveFAQ(faq: FAQItem): Promise<FAQItem> {
    initializeStorage();
    const faqs = await this.getFAQs();
    const index = faqs.findIndex(f => f.id === faq.id);
    let updated: FAQItem[];
    if (index >= 0) {
      updated = [...faqs];
      updated[index] = faq;
    } else {
      updated = [...faqs, faq];
    }
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updated));
    return faq;
  },

  async deleteFAQ(id: string): Promise<boolean> {
    initializeStorage();
    const faqs = await this.getFAQs();
    const filtered = faqs.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(filtered));
    return true;
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    initializeStorage();

    // 1. Prioritize live data from Supabase backend
    try {
      const { data: sbAppointments, error: sbError } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!sbError && sbAppointments && sbAppointments.length > 0) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sbAppointments));
        return sbAppointments as Appointment[];
      }
    } catch (sbErr) {
      console.warn('[Supabase Query Info]:', sbErr);
    }

    // 2. Fallback to Express backend or LocalStorage
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          return serverData;
        }
      }
    } catch {
      // fallback
    }
    const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return stored ? JSON.parse(stored) : initialAppointments;
  },

  async getAppointmentByReference(referenceId: string, phone: string): Promise<Appointment | null> {
    const normalizedRef = referenceId.trim().toUpperCase();
    const normalizedPhone = phone.replace(/\D/g, '');

    // Check Supabase first
    try {
      const { data: sbMatch, error: sbError } = await supabase
        .from('appointments')
        .select('*')
        .ilike('reference_id', normalizedRef)
        .limit(1);

      if (!sbError && sbMatch && sbMatch.length > 0) {
        const found = sbMatch[0] as Appointment;
        if (found.phone.replace(/\D/g, '').endsWith(normalizedPhone.slice(-10))) {
          return found;
        }
      }
    } catch {
      // fallback to cached/stored
    }

    const appointments = await this.getAppointments();
    const found = appointments.find(
      a =>
        a.reference_id.toUpperCase() === normalizedRef &&
        a.phone.replace(/\D/g, '').endsWith(normalizedPhone.slice(-10))
    );
    return found || null;
  },

  async createAppointment(
    data: Omit<Appointment, 'id' | 'reference_id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<Appointment> {
    initializeStorage();
    const reference_id = generateReferenceId();
    const nowIso = new Date().toISOString();
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reference_id,
      status: 'Pending',
      created_at: nowIso,
      updated_at: nowIso,
    };

    // 1. Immediately insert into Supabase backend
    let supabaseSaved = false;
    try {
      const { data: inserted, error: sbError } = await supabase
        .from('appointments')
        .insert([
          {
            id: newAppointment.id,
            reference_id: newAppointment.reference_id,
            student_name: newAppointment.student_name,
            phone: newAppointment.phone,
            email: newAppointment.email || null,
            applicant_type: newAppointment.applicant_type,
            purpose: newAppointment.purpose,
            trade_id: newAppointment.trade_id || null,
            trade_name: newAppointment.trade_name || null,
            appointment_date: newAppointment.appointment_date,
            appointment_time: newAppointment.appointment_time,
            message: newAppointment.message || null,
            status: newAppointment.status,
            admin_notes: newAppointment.admin_notes || null,
            created_at: newAppointment.created_at,
            updated_at: newAppointment.updated_at,
          }
        ])
        .select();

      if (sbError) {
        console.warn('[Supabase Insert Notice]:', sbError.message, sbError.details);
      } else {
        supabaseSaved = true;
        console.log('[Supabase]: Appointment successfully written to Supabase database table "appointments"!');
      }
    } catch (sbEx) {
      console.warn('[Supabase Connection Exception]:', sbEx);
    }

    // 2. Also backup to server and local storage for offline resiliency
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });
      if (res.ok) {
        const saved = await res.json();
        const local = await this.getAppointments();
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([saved, ...local]));
        return saved;
      }
    } catch {
      // fallback
    }

    const appointments = await this.getAppointments();
    const updated = [newAppointment, ...appointments];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return newAppointment;
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    adminNotes?: string
  ): Promise<Appointment | null> {
    initializeStorage();
    const updated_at = new Date().toISOString();

    // Update in Supabase
    try {
      await supabase
        .from('appointments')
        .update({
          status,
          ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}),
          updated_at,
        })
        .eq('id', id);
    } catch (sbErr) {
      console.warn('[Supabase Update Error]:', sbErr);
    }

    const appointments = await this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return null;

    const updatedApt: Appointment = {
      ...appointments[index],
      status,
      admin_notes: adminNotes !== undefined ? adminNotes : appointments[index].admin_notes,
      updated_at,
    };

    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApt),
      });
    } catch {
      // fallback
    }

    const updated = [...appointments];
    updated[index] = updatedApt;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return updatedApt;
  },

  async rescheduleAppointment(
    id: string,
    newDate: string,
    newTime: string
  ): Promise<Appointment | null> {
    initializeStorage();
    const updated_at = new Date().toISOString();

    // Update in Supabase
    try {
      await supabase
        .from('appointments')
        .update({
          appointment_date: newDate,
          appointment_time: newTime,
          status: 'Rescheduled',
          updated_at,
        })
        .eq('id', id);
    } catch (sbErr) {
      console.warn('[Supabase Reschedule Error]:', sbErr);
    }

    const appointments = await this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return null;

    const updatedApt: Appointment = {
      ...appointments[index],
      appointment_date: newDate,
      appointment_time: newTime,
      status: 'Rescheduled',
      updated_at,
    };

    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApt),
      });
    } catch {
      // fallback
    }

    const updated = [...appointments];
    updated[index] = updatedApt;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return updatedApt;
  },

  async cancelAppointment(id: string, cancelReason?: string): Promise<boolean> {
    initializeStorage();
    const updated_at = new Date().toISOString();
    const notes = cancelReason
      ? `Cancelled by user/admin. Reason: ${cancelReason}`
      : 'Cancelled by user';

    // Update in Supabase
    try {
      await supabase
        .from('appointments')
        .update({
          status: 'Cancelled',
          admin_notes: notes,
          updated_at,
        })
        .eq('id', id);
    } catch (sbErr) {
      console.warn('[Supabase Cancel Error]:', sbErr);
    }

    const appointments = await this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return false;

    const updatedApt: Appointment = {
      ...appointments[index],
      status: 'Cancelled',
      admin_notes: notes,
      updated_at,
    };

    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApt),
      });
    } catch {
      // fallback
    }

    const updated = [...appointments];
    updated[index] = updatedApt;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return true;
  },

  // Full Edit Appointment for Admin / Controller
  async updateAppointment(
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment | null> {
    initializeStorage();
    const updated_at = new Date().toISOString();
    const payload = { ...updates, updated_at };

    // 1. Update in Supabase
    try {
      const { error: sbErr } = await supabase
        .from('appointments')
        .update(payload)
        .eq('id', id);

      if (sbErr) {
        console.warn('[Supabase updateAppointment warning]:', sbErr.message);
      } else {
        console.log('[Supabase]: Appointment updated successfully in Supabase database:', id);
      }
    } catch (sbEx) {
      console.warn('[Supabase updateAppointment exception]:', sbEx);
    }

    // 2. Update local state
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return null;

    const merged: Appointment = {
      ...appointments[index],
      ...payload,
    };

    // 3. Update backend server
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch {
      // fallback
    }

    const updated = [...appointments];
    updated[index] = merged;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return merged;
  },

  // Permanent Delete Appointment for Developer / Controller
  async deleteAppointment(id: string, permanent: boolean = true): Promise<boolean> {
    initializeStorage();

    // 1. Delete from Supabase
    try {
      const { error: sbErr } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (sbErr) {
        console.warn('[Supabase deleteAppointment warning]:', sbErr.message);
      } else {
        console.log('[Supabase]: Appointment record permanently deleted from Supabase:', id);
      }
    } catch (sbEx) {
      console.warn('[Supabase deleteAppointment exception]:', sbEx);
    }

    // 2. Delete from Server
    try {
      await fetch(`/api/appointments/${id}?permanent=${permanent}`, {
        method: 'DELETE',
      });
    } catch {
      // fallback
    }

    // 3. Delete from Local Storage
    const appointments = await this.getAppointments();
    const filtered = appointments.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filtered));
    return true;
  },

  // Manual Trigger: Pull latest data directly from Supabase
  async syncAppointmentsWithSupabase(): Promise<{
    appointments: Appointment[];
    count: number;
    source: 'supabase' | 'local';
    error?: string;
  }> {
    initializeStorage();
    try {
      const { data: sbAppointments, error: sbError } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        const local = await this.getAppointments();
        return {
          appointments: local,
          count: local.length,
          source: 'local',
          error: sbError.message,
        };
      }

      if (sbAppointments) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sbAppointments));
        return {
          appointments: sbAppointments as Appointment[],
          count: sbAppointments.length,
          source: 'supabase',
        };
      }
    } catch (err: any) {
      const local = await this.getAppointments();
      return {
        appointments: local,
        count: local.length,
        source: 'local',
        error: err?.message || 'Failed to sync with Supabase',
      };
    }

    const fallbackList = await this.getAppointments();
    return { appointments: fallbackList, count: fallbackList.length, source: 'local' };
  },

  // Developer Test Tool: Create verified sample booking in Supabase
  async createTestAppointment(): Promise<Appointment> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const today = new Date();
    today.setDate(today.getDate() + 2);
    const dateStr = today.toISOString().split('T')[0];

    return await this.createAppointment({
      student_name: `Dev Test Candidate ${randomSuffix}`,
      phone: `98450${randomSuffix}`,
      email: `test.candidate${randomSuffix}@iti-jewargi.edu.in`,
      applicant_type: 'Student',
      purpose: 'Course/Trade Information',
      trade_id: 'trade-electrician',
      trade_name: 'Electrician',
      appointment_date: dateStr,
      appointment_time: '11:00 AM - 11:30 AM',
      message: 'Automated test appointment generated by developer controller to verify Supabase live data persistence.',
    });
  },

  // Calculate available slots dynamically
  async getAvailableSlots(dateString: string): Promise<{
    isWorkingDay: boolean;
    isHoliday: boolean;
    holidayReason?: string;
    slots: {
      time24: string;
      displayTime: string;
      bookedCount: number;
      maxSlots: number;
      available: boolean;
    }[];
  }> {
    const settings = await this.getSettings();
    const appointments = await this.getAppointments();

    const selectedDate = new Date(`${dateString}T00:00:00`);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[selectedDate.getDay()];

    const isWorkingDay = settings.working_days.includes(dayOfWeek);
    const isHoliday = settings.holidays.includes(dateString);

    if (!isWorkingDay || isHoliday) {
      return {
        isWorkingDay,
        isHoliday,
        holidayReason: isHoliday
          ? 'Selected date is a declared institute holiday'
          : `Institute is closed on ${dayOfWeek}s`,
        slots: [],
      };
    }

    const startMin = timeToMinutes(settings.opening_time);
    const endMin = timeToMinutes(settings.closing_time);
    const breakStartMin = timeToMinutes(settings.break_start);
    const breakEndMin = timeToMinutes(settings.break_end);
    const step = settings.slot_duration_minutes || 30;

    // Filter appointments for that date that are not cancelled
    const dateAppointments = appointments.filter(
      a => a.appointment_date === dateString && a.status !== 'Cancelled'
    );

    const slots = [];
    for (let current = startMin; current + step <= endMin; current += step) {
      // Check if slot falls in break
      if (current >= breakStartMin && current < breakEndMin) {
        continue;
      }

      const time24 = minutesToTimeString(current);
      const displayTime = formatTimeSlot(time24);

      // Count existing bookings for this time
      const bookedCount = dateAppointments.filter(
        a => a.appointment_time === displayTime || a.appointment_time === time24
      ).length;

      const available = bookedCount < settings.max_per_slot;

      slots.push({
        time24,
        displayTime,
        bookedCount,
        maxSlots: settings.max_per_slot,
        available,
      });
    }

    return {
      isWorkingDay: true,
      isHoliday: false,
      slots,
    };
  },

  // Admin authentication (Restricted Exclusively to Designated Super Administrator)
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string; user?: any }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both administrator email and password.' };
    }

    // Attempt server-side authentication first
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
        if (data.user) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(data.user));
        }
        return { success: true, token: data.token, user: data.user };
      }
      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Access Denied: Administrative authentication failed.',
        };
      }
    } catch {
      // Local verification fallback if server is unreachable
    }

    // Direct check for authorized admin
    if (cleanEmail === AUTHORIZED_ADMIN.email.toLowerCase() && cleanPassword === AUTHORIZED_ADMIN.defaultPassword) {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const user = {
        email: AUTHORIZED_ADMIN.email,
        name: AUTHORIZED_ADMIN.name,
        role: AUTHORIZED_ADMIN.role,
        institution: AUTHORIZED_ADMIN.institution,
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
      return { success: true, token, user };
    }

    return {
      success: false,
      error: 'Access Denied: Invalid administrator email or password. Access is strictly restricted.',
    };
  },

  getAdminUser(): { email: string; name: string; role: string; institution?: string } | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  },

  adminLogout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  },
};
