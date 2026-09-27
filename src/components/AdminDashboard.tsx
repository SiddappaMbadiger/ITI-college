import React, { useState } from 'react';
import {
  Appointment,
  Trade,
  Notice,
  FAQItem,
  ScheduleSettings,
  AppointmentStatus
} from '../types';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Clock3,
  CalendarCheck2,
  XCircle,
  Ban,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Save,
  Check,
  AlertCircle,
  Layers,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  PhoneCall,
  Database,
  Copy,
  ExternalLink,
  RefreshCw,
  Eye,
  Download,
  Terminal,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Printer,
  ChevronRight,
} from 'lucide-react';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  testSupabaseConnection,
} from '../lib/supabase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  appointments: Appointment[];
  trades: Trade[];
  notices: Notice[];
  faqs: FAQItem[];
  settings: ScheduleSettings;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  appointments,
  trades,
  notices,
  faqs,
  settings,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'schedule' | 'trades' | 'notices' | 'faqs' | 'contact' | 'database'>('appointments');

  // Supabase connection state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    loading: boolean;
    connected: boolean;
    tableExists: boolean;
    error?: string;
  }>({
    tested: false,
    loading: false,
    connected: true,
    tableExists: true,
  });
  const [copiedSql, setCopiedSql] = useState(false);

  // Function to test Supabase
  const handleTestSupabase = async () => {
    setSupabaseStatus(prev => ({ ...prev, loading: true }));
    const res = await testSupabaseConnection();
    setSupabaseStatus({
      tested: true,
      loading: false,
      connected: res.connected,
      tableExists: res.tableExists,
      error: res.error,
    });
  };

  // Appointment filter & search
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Note editing modal
  const [editingNoteAptId, setEditingNoteAptId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Detailed View Modal State
  const [viewingApt, setViewingApt] = useState<Appointment | null>(null);

  // Edit Appointment Modal State
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appointment>>({});

  // Cancel Appointment Modal State
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Permanent Delete Modal State
  const [deletingApt, setDeletingApt] = useState<Appointment | null>(null);

  // Supabase sync and test state
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [isInsertingTest, setIsInsertingTest] = useState<boolean>(false);
  const [testInsertSuccess, setTestInsertSuccess] = useState<string | null>(null);

  // Confirm delete states for trades and notices (no window.confirm)
  const [deleteConfirmTradeId, setDeleteConfirmTradeId] = useState<string | null>(null);
  const [deleteConfirmNoticeId, setDeleteConfirmNoticeId] = useState<string | null>(null);

  // Trade editor state
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [newTradeModal, setNewTradeModal] = useState<boolean>(false);
  const [tradeForm, setTradeForm] = useState<Partial<Trade>>({
    name: '',
    code: '',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Pass in 10th Standard (SSLC)',
    course_type: 'Engineering',
    description: '',
    key_skills: ['Practical Workshop Training'],
    career_opportunities: ['Industrial Technician'],
    is_active: true,
  });

  // Schedule settings edit state
  const [scheduleForm, setScheduleForm] = useState<ScheduleSettings>(settings);
  const [newHolidayInput, setNewHolidayInput] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Notice editor state
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNoticeModal, setNewNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState<Partial<Notice>>({
    title: '',
    category: 'Admissions',
    date: new Date().toISOString().split('T')[0],
    description: '',
    is_published: true,
  });

  if (!isOpen) return null;

  // Compute metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.appointment_date === todayStr);
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Rescheduled').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const totalEnquiries = appointments.length;

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesDate = !selectedDateFilter || apt.appointment_date === selectedDateFilter;
    const matchesSearch =
      apt.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reference_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      (apt.trade_name && apt.trade_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesDate && matchesSearch;
  });

  // Action handlers
  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    await api.updateAppointmentStatus(id, status);
    onRefreshData();
  };

  const handleSaveNotes = async () => {
    if (!editingNoteAptId) return;
    await api.updateAppointmentStatus(editingNoteAptId, appointments.find(a => a.id === editingNoteAptId)?.status || 'Confirmed', noteText);
    setEditingNoteAptId(null);
    onRefreshData();
  };

  // Sync Supabase live bookings
  const handleSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    setSyncToast(null);
    try {
      const res = await api.syncAppointmentsWithSupabase();
      onRefreshData();
      if (res.source === 'supabase') {
        setSyncToast(`Live Supabase Sync Complete! Retrieved ${res.count} records from project humbckobaficvgtkohjp.`);
      } else {
        setSyncToast(`Loaded ${res.count} appointment records. (Supabase status: ${res.error || 'Connected'})`);
      }
      setTimeout(() => setSyncToast(null), 5000);
    } catch (err: any) {
      setSyncToast(`Sync exception: ${err?.message || 'Failed to sync'}`);
      setTimeout(() => setSyncToast(null), 5000);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  // Developer Test Tool: Insert Sample Booking to Supabase
  const handleInsertTestAppointment = async () => {
    setIsInsertingTest(true);
    setTestInsertSuccess(null);
    try {
      const newApt = await api.createTestAppointment();
      onRefreshData();
      setTestInsertSuccess(`Test booking ${newApt.reference_id} created and dispatched to Supabase!`);
      setTimeout(() => setTestInsertSuccess(null), 5000);
    } catch (err: any) {
      setTestInsertSuccess(`Test creation failed: ${err?.message || 'Error'}`);
      setTimeout(() => setTestInsertSuccess(null), 5000);
    } finally {
      setIsInsertingTest(false);
    }
  };

  // Open Full Edit Modal
  const handleOpenEdit = (apt: Appointment) => {
    setEditingApt(apt);
    setEditForm({
      student_name: apt.student_name,
      phone: apt.phone,
      email: apt.email || '',
      applicant_type: apt.applicant_type,
      purpose: apt.purpose,
      trade_id: apt.trade_id || '',
      trade_name: apt.trade_name || '',
      appointment_date: apt.appointment_date,
      appointment_time: apt.appointment_time,
      message: apt.message || '',
      status: apt.status,
      admin_notes: apt.admin_notes || '',
    });
  };

  // Save Full Edit Modal
  const handleSaveEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    const selectedTrade = trades.find(t => t.id === editForm.trade_id);
    await api.updateAppointment(editingApt.id, {
      ...editForm,
      trade_name: selectedTrade ? selectedTrade.name : editForm.trade_name,
    });
    setEditingApt(null);
    onRefreshData();
  };

  // Confirm Cancellation
  const handleConfirmCancelApt = async () => {
    if (!cancellingApt) return;
    await api.cancelAppointment(cancellingApt.id, cancelReason);
    setCancellingApt(null);
    setCancelReason('');
    if (viewingApt?.id === cancellingApt.id) {
      setViewingApt(prev => prev ? { ...prev, status: 'Cancelled' } : null);
    }
    onRefreshData();
  };

  // Confirm Permanent Deletion
  const handleConfirmDeleteApt = async () => {
    if (!deletingApt) return;
    await api.deleteAppointment(deletingApt.id, true);
    setDeletingApt(null);
    if (viewingApt?.id === deletingApt.id) setViewingApt(null);
    onRefreshData();
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (appointments.length === 0) return;
    const headers = [
      'Reference ID',
      'Candidate Name',
      'Phone Number',
      'Email',
      'Applicant Type',
      'Purpose',
      'Trade / Course',
      'Date',
      'Time Slot',
      'Status',
      'Applicant Message',
      'Admin Notes',
      'Created At',
      'Database Record ID'
    ];

    const rows = appointments.map(a => [
      `"${a.reference_id}"`,
      `"${a.student_name.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${a.applicant_type}"`,
      `"${a.purpose.replace(/"/g, '""')}"`,
      `"${(a.trade_name || 'General').replace(/"/g, '""')}"`,
      `"${a.appointment_date}"`,
      `"${a.appointment_time}"`,
      `"${a.status}"`,
      `"${(a.message || '').replace(/"/g, '""')}"`,
      `"${(a.admin_notes || '').replace(/"/g, '""')}"`,
      `"${a.created_at}"`,
      `"${a.id}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `iti_jewargi_appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveScheduleSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(scheduleForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    onRefreshData();
  };

  const handleAddHoliday = () => {
    if (!newHolidayInput || scheduleForm.holidays.includes(newHolidayInput)) return;
    setScheduleForm(prev => ({
      ...prev,
      holidays: [...prev.holidays, newHolidayInput]
    }));
    setNewHolidayInput('');
  };

  const handleRemoveHoliday = (hDate: string) => {
    setScheduleForm(prev => ({
      ...prev,
      holidays: prev.holidays.filter(d => d !== hDate)
    }));
  };

  const handleSaveTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const tradeToSave: Trade = {
      id: editingTrade?.id || `trade-${Date.now()}`,
      code: tradeForm.code || 'GEN-01',
      name: tradeForm.name || 'Vocational Trade',
      duration: tradeForm.duration || '1 Year',
      eligibility: tradeForm.eligibility || 'Pass in 10th Standard (SSLC)',
      course_type: tradeForm.course_type as 'Engineering' | 'Non-Engineering' || 'Engineering',
      description: tradeForm.description || '',
      key_skills: Array.isArray(tradeForm.key_skills) ? tradeForm.key_skills : ['Practical Training'],
      career_opportunities: Array.isArray(tradeForm.career_opportunities) ? tradeForm.career_opportunities : ['Employment in Industrial Sectors'],
      is_active: tradeForm.is_active ?? true,
      status_note: 'Configured by College Admin',
    };
    await api.saveTrade(tradeToSave);
    setNewTradeModal(false);
    setEditingTrade(null);
    onRefreshData();
  };

  const handleDeleteTrade = async (id: string) => {
    setDeleteConfirmTradeId(id);
  };

  const handleConfirmDeleteTrade = async () => {
    if (!deleteConfirmTradeId) return;
    await api.deleteTrade(deleteConfirmTradeId);
    setDeleteConfirmTradeId(null);
    onRefreshData();
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const noticeToSave: Notice = {
      id: editingNotice?.id || `notice-${Date.now()}`,
      title: noticeForm.title || 'Official Notice',
      category: noticeForm.category as any || 'Admissions',
      date: noticeForm.date || todayStr,
      description: noticeForm.description || '',
      is_published: noticeForm.is_published ?? true,
    };
    await api.saveNotice(noticeToSave);
    setNewNoticeModal(false);
    setEditingNotice(null);
    onRefreshData();
  };

  const handleDeleteNotice = async (id: string) => {
    setDeleteConfirmNoticeId(id);
  };

  const handleConfirmDeleteNotice = async () => {
    if (!deleteConfirmNoticeId) return;
    await api.deleteNotice(deleteConfirmNoticeId);
    setDeleteConfirmNoticeId(null);
    onRefreshData();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[95vh] shadow-2xl border border-slate-200 text-left relative flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="bg-[#0f2b48] text-white px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center font-bold text-sky-400 font-mono">
              <Terminal className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-institutional leading-tight flex items-center gap-2">
                <span>Government ITI College Jewargi — Software Developer & Controller</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.5 rounded font-mono font-normal">
                  v2.0 Database Live
                </span>
              </h2>
              <div className="text-[11px] text-sky-200">
                Connected to Supabase Project: <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">humbckobaficvgtkohjp</code> · Real-Time Appointment Control
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync with Supabase Button */}
            <button
              onClick={handleSyncSupabase}
              disabled={isSyncingSupabase}
              className="text-xs px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              title="Query Supabase appointments table and reload database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-100 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Supabase'}</span>
            </button>

            {/* Quick Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="hidden md:flex text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors items-center gap-1.5 cursor-pointer border border-white/10"
              title="Download all appointments as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-sky-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onLogout}
              className="text-xs px-2.5 py-1.5 rounded bg-rose-900/60 hover:bg-rose-900 text-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-sm cursor-pointer ml-1"
              aria-label="Close dashboard"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncToast && (
          <div className="bg-emerald-900 text-emerald-100 text-xs px-6 py-2 flex items-center justify-between border-b border-emerald-700 animate-in fade-in duration-150 shrink-0 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncToast}</span>
            </div>
            <button
              onClick={() => setSyncToast(null)}
              className="text-emerald-300 hover:text-white text-xs cursor-pointer ml-4 font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-white text-[#0f2b48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Appointments & Enquiries ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-white text-[#0f2b48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Schedule & Timings</span>
          </button>

          <button
            onClick={() => setActiveTab('trades')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'trades'
                ? 'bg-white text-[#0f2b48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Trades ({trades.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'notices'
                ? 'bg-white text-[#0f2b48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notices Board ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-white text-[#0f2b48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact & Verified Info</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('database');
              handleTestSupabase();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'database'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud Database</span>
          </button>
        </div>

        {/* Dashboard Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Today's Visits</div>
                  <div className="text-2xl font-bold font-mono text-[#0f2b48] mt-1 tabular-nums">
                    {todaysAppointments.length}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-mono uppercase text-amber-700 font-semibold">Pending Requests</div>
                  <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
                    {pendingCount}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-mono uppercase text-emerald-700 font-semibold">Confirmed Slots</div>
                  <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                    {confirmedCount}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Completed</div>
                  <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
                    {completedCount}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Total Bookings</div>
                  <div className="text-2xl font-bold font-mono text-sky-800 mt-1 tabular-nums">
                    {totalEnquiries}
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Status:</span>
                  {(['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-[#0f2b48] text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded border border-slate-300 font-mono bg-white"
                  />
                  {selectedDateFilter && (
                    <button
                      onClick={() => setSelectedDateFilter('')}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name / phone / ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 flex items-center gap-1 cursor-pointer font-medium"
                    title="Export all appointments to CSV format"
                  >
                    <Download className="w-3 h-3 text-slate-600" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleInsertTestAppointment}
                    disabled={isInsertingTest}
                    className="px-2.5 py-1 text-xs bg-sky-50 hover:bg-sky-100 text-sky-800 rounded border border-sky-300 flex items-center gap-1 cursor-pointer font-medium disabled:opacity-50"
                    title="Generate a sample student appointment to verify database insertion"
                  >
                    <Plus className="w-3 h-3 text-sky-600" />
                    <span>{isInsertingTest ? 'Adding...' : 'Test Booking'}</span>
                  </button>
                </div>
              </div>

              {testInsertSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{testInsertSuccess}</span>
                  </div>
                  <button onClick={() => setTestInsertSuccess(null)} className="text-emerald-700 font-bold hover:underline cursor-pointer">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Appointments Table */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-mono uppercase text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Candidate / Phone</th>
                        <th className="py-3 px-4">Purpose & Trade</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Controller & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            No appointment records match the current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#0f2b48]">
                              <button
                                onClick={() => setViewingApt(apt)}
                                className="hover:underline text-left cursor-pointer flex items-center gap-1 group"
                                title="Click to view complete details"
                              >
                                <span>{apt.reference_id}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#0f2b48]" />
                              </button>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {new Date(apt.created_at).toLocaleDateString()}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{apt.student_name}</div>
                              <div className="font-mono text-slate-500">{apt.phone}</div>
                              {apt.email && <div className="text-[10px] text-slate-400">{apt.email}</div>}
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-semibold text-slate-800">{apt.purpose}</div>
                              <div className="text-[11px] text-sky-800">{apt.trade_name || 'Trade: Not Selected'}</div>
                              {apt.message && (
                                <div className="text-[10px] text-slate-500 italic truncate mt-0.5" title={apt.message}>
                                  "{apt.message}"
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 font-mono">
                              <div className="font-bold text-slate-900">{apt.appointment_date}</div>
                              <div className="text-slate-600">{apt.appointment_time}</div>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  apt.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : apt.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : apt.status === 'Rescheduled'
                                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                    : apt.status === 'Completed'
                                    ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {apt.status}
                              </span>
                              {apt.admin_notes && (
                                <div className="text-[10px] text-slate-500 mt-1 max-w-[150px] truncate" title={apt.admin_notes}>
                                  Note: {apt.admin_notes}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* View Details */}
                                <button
                                  onClick={() => setViewingApt(apt)}
                                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer flex items-center gap-1 transition-colors"
                                  title="View complete candidate details"
                                >
                                  <Eye className="w-3 h-3 text-sky-700" />
                                  <span>View</span>
                                </button>

                                {/* Edit Full Appointment */}
                                <button
                                  onClick={() => handleOpenEdit(apt)}
                                  className="px-2 py-1 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-sky-700 rounded cursor-pointer flex items-center gap-1 border border-sky-200/60 transition-colors"
                                  title="Edit appointment fields & trade"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>

                                {apt.status === 'Pending' && (
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                                    className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer shadow-2xs"
                                    title="Approve Appointment"
                                  >
                                    Approve
                                  </button>
                                )}

                                {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                                    className="px-2 py-1 text-[11px] font-semibold bg-[#0f2b48] hover:bg-[#153e68] text-white rounded cursor-pointer"
                                    title="Mark as Completed"
                                  >
                                    Complete
                                  </button>
                                )}

                                {apt.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => {
                                      setCancellingApt(apt);
                                      setCancelReason('');
                                    }}
                                    className="px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-50 border border-rose-200 rounded cursor-pointer transition-colors"
                                    title="Cancel appointment with reason"
                                  >
                                    Cancel
                                  </button>
                                )}

                                {/* Delete from Database */}
                                <button
                                  onClick={() => setDeletingApt(apt)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                                  title="Permanently Delete Record from Supabase"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Settings Tab */}
          {activeTab === 'schedule' && (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-institutional">
                    Appointment Timings & Capacity Configuration
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control working hours, lunch recess, slot durations, and double-booking caps.
                  </p>
                </div>
                {settingsSaved && (
                  <div className="text-xs text-emerald-700 flex items-center gap-1 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settings Saved Successfully!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveScheduleSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Daily Opening Time (24h format):
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.opening_time}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, opening_time: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Daily Closing Time (24h format):
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.closing_time}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, closing_time: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Lunch Break Recess (Start to End):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={scheduleForm.break_start}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, break_start: e.target.value }))}
                        className="w-1/2 px-3 py-2 rounded border border-slate-300 font-mono"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={scheduleForm.break_end}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, break_end: e.target.value }))}
                        className="w-1/2 px-3 py-2 rounded border border-slate-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Slot Duration (Minutes):
                    </label>
                    <select
                      value={scheduleForm.slot_duration_minutes}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, slot_duration_minutes: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes (Recommended)</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Maximum Allowed Appointments Per Slot (Double-Booking Prevention):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={scheduleForm.max_per_slot}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, max_per_slot: Number(e.target.value) }))}
                    className="w-32 px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                  <span className="text-[11px] text-slate-500 ml-2">
                    Once a slot reaches this number, the portal automatically closes that slot to prevent overcrowding.
                  </span>
                </div>

                {/* Holiday Management */}
                <div className="pt-3 border-t border-slate-200">
                  <label className="block font-bold text-slate-700 mb-1">
                    Institute Holidays & Blocked Dates:
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="date"
                      value={newHolidayInput}
                      onChange={(e) => setNewHolidayInput(e.target.value)}
                      className="px-3 py-1.5 rounded border border-slate-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddHoliday}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded font-medium cursor-pointer"
                    >
                      Add Holiday
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {scheduleForm.holidays.map((hDate) => (
                      <span
                        key={hDate}
                        className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded text-xs font-mono"
                      >
                        <span>{hDate}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHoliday(hDate)}
                          className="text-rose-500 hover:text-rose-800 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f2b48] hover:bg-[#153e68] text-white font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-sky-300" />
                    <span>Save Schedule Configuration</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Manage Trades Tab */}
          {activeTab === 'trades' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-institutional">
                    Course & Trade Offerings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add or update technical trades, eligibility requirements, and duration for Government ITI Jewargi.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingTrade(null);
                    setTradeForm({
                      name: '',
                      code: `TRD-0${trades.length + 1}`,
                      duration: '2 Years (4 Semesters)',
                      eligibility: 'Pass in 10th Standard (SSLC)',
                      course_type: 'Engineering',
                      description: '',
                      key_skills: ['Practical Workshop Training'],
                      career_opportunities: ['Public Sector Undertakings'],
                      is_active: true,
                    });
                    setNewTradeModal(true);
                  }}
                  className="px-4 py-2 bg-[#0f2b48] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-sky-300" />
                  <span>Add New Trade</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trades.map((trade) => (
                  <div key={trade.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0f2b48]">{trade.code}</span>
                      <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {trade.course_type}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 font-institutional">{trade.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{trade.description}</p>
                    <div className="text-[11px] text-slate-500">Duration: {trade.duration}</div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTrade(trade);
                          setTradeForm(trade);
                          setNewTradeModal(true);
                        }}
                        className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                        title="Edit trade"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrade(trade.id)}
                        className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                        title="Delete trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices Management Tab */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-institutional">
                    Institutional Circulars & Notice Board
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish official notices for student admission, examinations, and government directives.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingNotice(null);
                    setNoticeForm({
                      title: '',
                      category: 'Admissions',
                      date: todayStr,
                      description: '',
                      is_published: true,
                    });
                    setNewNoticeModal(true);
                  }}
                  className="px-4 py-2 bg-[#0f2b48] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-sky-300" />
                  <span>Publish New Circular</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg shadow-2xs divide-y divide-slate-100 text-xs">
                {notices.map((n) => (
                  <div key={n.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                        <span className="font-semibold text-sky-800">{n.category}</span>
                        <span>·</span>
                        <span>{n.date}</span>
                        <span>·</span>
                        <span className={n.is_published ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                          {n.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 font-institutional text-sm">{n.title}</h4>
                      <p className="text-slate-600 max-w-3xl line-clamp-1">{n.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNotice(n);
                          setNoticeForm(n);
                          setNewNoticeModal(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Verified Info Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 font-institutional pb-2 border-b border-slate-200">
                College Contact & Verified Details
              </h3>
              <p className="text-slate-500">
                Update the official institutional phone number, email address, and operating hours once confirmed by the institute principal or administrative department.
              </p>

              <form onSubmit={handleSaveScheduleSettings} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official College Phone / Helpline:
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.phone}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 08472-XXXXXX or +91 98450 XXXXX"
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    If not yet provided by the client, keep as '[To be verified]'
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Email Address:
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.email}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. iti.jewargi@karnataka.gov.in"
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Physical Campus Address:
                  </label>
                  <textarea
                    rows={2}
                    value={scheduleForm.address}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Office Hours:
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.office_hours_display}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, office_hours_display: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f2b48] hover:bg-[#153e68] text-white font-semibold rounded-md cursor-pointer"
                  >
                    Save Verified Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Supabase Cloud Database Tab */}
          {activeTab === 'database' && (
            <div className="max-w-4xl mx-auto space-y-6 text-xs text-left">
              {/* Connection Status Card */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-institutional">
                        Supabase Backend Live Connection
                      </h3>
                      <p className="text-slate-500">
                        Government ITI College, Jewargi appointment data synchronizes with your cloud Supabase database.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={supabaseStatus.loading}
                      onClick={handleTestSupabase}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${supabaseStatus.loading ? 'animate-spin' : ''}`} />
                      <span>{supabaseStatus.loading ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Supabase Dashboard</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block font-semibold">
                      Supabase Project ID
                    </span>
                    <span className="font-mono font-bold text-[#0f2b48] text-sm">
                      {SUPABASE_PROJECT_ID}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block font-semibold">
                      Endpoint Status
                    </span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active (Connected)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block font-semibold">
                      Table Schema Status
                    </span>
                    <span className={`font-semibold flex items-center gap-1 mt-0.5 ${supabaseStatus.tableExists ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {supabaseStatus.tableExists ? 'Table "appointments" Ready' : 'Pending Table Creation'}
                    </span>
                  </div>
                </div>

                {/* API Credentials Info */}
                <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">API URL:</span>
                    <span className="text-slate-800 font-bold">{SUPABASE_URL}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Publishable / Anon Key:</span>
                    <span className="text-slate-700 truncate max-w-xs">{SUPABASE_ANON_KEY.slice(0, 16)}...{SUPABASE_ANON_KEY.slice(-10)}</span>
                  </div>
                </div>

                {supabaseStatus.error && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-md flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Supabase Notice:</div>
                      <div className="text-[11px] mt-0.5">{supabaseStatus.error}</div>
                      {!supabaseStatus.tableExists && (
                        <div className="mt-1 font-semibold text-[11px]">
                          👉 Please copy and execute the SQL script below in your Supabase SQL Editor to initialize the appointments table and security rules.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SQL Setup Instructions Box */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-institutional">
                      Supabase SQL Table & RLS Setup Script
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Execute this in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query) if you haven't run it yet:
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sql = `-- Supabase Table Setup for Government ITI College Jewargi
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    applicant_type TEXT NOT NULL,
    purpose TEXT NOT NULL,
    trade_id TEXT,
    trade_name TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (Student / Parent booking)
CREATE POLICY "Allow public insert to appointments"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public read of appointments (Tracking & Slot availability)
CREATE POLICY "Allow public select of appointments"
ON appointments FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updates (Rescheduling & Cancellation)
CREATE POLICY "Allow public update of appointments"
ON appointments FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments (reference_id);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments (phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);`;
                      navigator.clipboard.writeText(sql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="px-3 py-1.5 bg-[#0f2b48] hover:bg-[#153e68] text-white rounded font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-sky-300" />
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-slate-200 rounded-md font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
{`-- Supabase Table Setup for Government ITI College Jewargi
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    applicant_type TEXT NOT NULL,
    purpose TEXT NOT NULL,
    trade_id TEXT,
    trade_name TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (Student / Parent booking)
CREATE POLICY "Allow public insert to appointments"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public read of appointments (Tracking & Slot availability)
CREATE POLICY "Allow public select of appointments"
ON appointments FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updates (Rescheduling & Cancellation)
CREATE POLICY "Allow public update of appointments"
ON appointments FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments (reference_id);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments (phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);`}
                  </pre>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-md text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Automatic Synchronization:</strong> Whenever a student or parent fills out the "Book Appointment" form on the website, the appointment is dispatched immediately to your Supabase <code>appointments</code> table. Any status updates, rescheduling, or notes added from this admin console will also be synchronized to Supabase in real-time.
                  </div>
                </div>
              </div>

              {/* Live Database Records Inspector Card */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-institutional flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Live Database Records Inspector (Supabase Table: <code>appointments</code>)</span>
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Displaying active rows stored in your database ({appointments.length} records loaded):
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSyncSupabase}
                      disabled={isSyncingSupabase}
                      className="px-3 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSupabase ? 'Syncing...' : 'Fetch Live Supabase'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleInsertTestAppointment}
                      disabled={isInsertingTest}
                      className="px-3 py-1.5 text-xs bg-[#0f2b48] hover:bg-[#153e68] text-white rounded font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5 text-sky-300" />
                      <span>{isInsertingTest ? 'Writing to Supabase...' : 'Insert Test Record'}</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-80 border border-slate-200 rounded-md">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 font-mono text-slate-700 uppercase sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Reference ID</th>
                        <th className="py-2 px-3">Candidate</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Trade</th>
                        <th className="py-2 px-3">Date & Slot</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 font-mono">Supabase UUID / ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-slate-400 font-sans">
                            No records in database. Click "Insert Test Record" above to seed a verified appointment.
                          </td>
                        </tr>
                      ) : (
                        appointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-[#0f2b48]">{apt.reference_id}</td>
                            <td className="py-2 px-3 font-sans font-medium text-slate-900">{apt.student_name}</td>
                            <td className="py-2 px-3 text-slate-600">{apt.phone}</td>
                            <td className="py-2 px-3 font-sans text-sky-900">{apt.trade_name || 'General'}</td>
                            <td className="py-2 px-3 text-slate-700">{apt.appointment_date} · {apt.appointment_time}</td>
                            <td className="py-2 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                apt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-[10px] text-slate-400 truncate max-w-[140px]" title={apt.id}>{apt.id}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. View Appointment Details Modal */}
      {viewingApt && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 text-left my-8 overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-[#0f2b48] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-institutional leading-tight">
                    Candidate Appointment Details
                  </h3>
                  <p className="text-[11px] text-sky-200 font-mono">
                    Ref ID: {viewingApt.reference_id} · Stored in Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingApt(null)}
                className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Status and Action Ribbon */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold font-mono mt-0.5 ${
                    viewingApt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    viewingApt.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    viewingApt.status === 'Rescheduled' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                    viewingApt.status === 'Completed' ? 'bg-slate-200 text-slate-800' :
                    'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {viewingApt.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Submission Date</span>
                  <span className="font-mono text-slate-700 font-medium">{new Date(viewingApt.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingApt.student_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Applicant Category:</span>
                  <span className="font-semibold text-slate-800">{viewingApt.applicant_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Phone:</span>
                  <a href={`tel:${viewingApt.phone}`} className="font-mono font-bold text-sky-700 hover:underline">
                    {viewingApt.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address:</span>
                  <span className="font-mono text-slate-700">{viewingApt.email || 'Not provided'}</span>
                </div>
              </div>

              {/* Appointment Booking Info */}
              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Purpose of Visit:</span>
                  <span className="font-bold text-slate-900">{viewingApt.purpose}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Trade / Program:</span>
                  <span className="font-semibold text-sky-900">{viewingApt.trade_name || 'General / Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Appointment Date:</span>
                  <span className="font-mono font-bold text-slate-900">{viewingApt.appointment_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Designated Time Slot:</span>
                  <span className="font-mono font-bold text-[#0f2b48]">{viewingApt.appointment_time}</span>
                </div>
              </div>

              {/* Message from Candidate */}
              {viewingApt.message && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    Candidate Query / Notes:
                  </span>
                  <p className="text-slate-700 italic font-medium leading-relaxed">
                    "{viewingApt.message}"
                  </p>
                </div>
              )}

              {/* Staff / Administrative Notes */}
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block mb-1">
                  Internal Staff Instructions & Notes:
                </span>
                <p className="text-slate-800">
                  {viewingApt.admin_notes || 'No internal notes added yet.'}
                </p>
              </div>

              {/* Supabase Technical Details */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Database Record ID:</span>
                  <span className="text-slate-700">{viewingApt.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Supabase Table:</span>
                  <span className="text-emerald-700 font-bold">public.appointments</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Database Sync:</span>
                  <span className="text-slate-600">{new Date(viewingApt.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(viewingApt);
                    setViewingApt(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                {viewingApt.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(viewingApt.id, 'Confirmed');
                      setViewingApt(prev => prev ? { ...prev, status: 'Confirmed' } : null);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                  >
                    Approve
                  </button>
                )}

                {viewingApt.status !== 'Completed' && viewingApt.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(viewingApt.id, 'Completed');
                      setViewingApt(prev => prev ? { ...prev, status: 'Completed' } : null);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#0f2b48] hover:bg-[#153e68] text-white rounded cursor-pointer"
                  >
                    Complete
                  </button>
                )}

                {viewingApt.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      setCancellingApt(viewingApt);
                      setCancelReason('');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => setDeletingApt(viewingApt)}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <button
                onClick={() => setViewingApt(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Edit Appointment Modal */}
      {editingApt && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 text-left my-8 overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-[#0f2b48] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold font-institutional">
                  Edit Appointment · {editingApt.reference_id}
                </h3>
              </div>
              <button
                onClick={() => setEditingApt(null)}
                className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditAppointment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.student_name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, student_name: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicant Type</label>
                  <select
                    value={editForm.applicant_type || 'Student'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, applicant_type: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purpose of Visit *</label>
                  <select
                    value={editForm.purpose || 'Admission Enquiry'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, purpose: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
                  >
                    <option value="Admission Enquiry">Admission Enquiry</option>
                    <option value="Course/Trade Information">Course / Trade Information</option>
                    <option value="Eligibility Enquiry">Eligibility Enquiry</option>
                    <option value="Document Enquiry">Document Verification</option>
                    <option value="Fee Enquiry">Fee Enquiry</option>
                    <option value="Scholarship Enquiry">Scholarship (SSP) Enquiry</option>
                    <option value="General Enquiry">General Information</option>
                    <option value="Meet Staff">Meet Administrative Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trade / Course</label>
                  <select
                    value={editForm.trade_id || ''}
                    onChange={(e) => {
                      const selectedT = trades.find(t => t.id === e.target.value);
                      setEditForm(prev => ({
                        ...prev,
                        trade_id: e.target.value,
                        trade_name: selectedT ? selectedT.name : ''
                      }));
                    }}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white"
                  >
                    <option value="">General (No trade selected)</option>
                    {trades.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.duration})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={editForm.appointment_date || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, appointment_date: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={editForm.appointment_time || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, appointment_time: e.target.value }))}
                    placeholder="e.g. 10:30 AM - 11:00 AM"
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status || 'Pending'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-bold bg-white"
                  >
                    <option value="Pending">Pending Scrutiny</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Message / Specific Inquiries</label>
                <textarea
                  rows={2}
                  value={editForm.message || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Administrative Staff Notes</label>
                <textarea
                  rows={2}
                  value={editForm.admin_notes || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                  placeholder="e.g. Verified SSLC documents. Assigned to Principal chamber Desk 1."
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none bg-amber-50/40"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Changes save directly to Supabase table
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md cursor-pointer transition-colors shadow-xs"
                  >
                    Save Changes to Supabase
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Cancel Appointment Modal */}
      {cancellingApt && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left text-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Ban className="w-5 h-5 text-rose-600" />
              <span>Cancel Appointment</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              You are cancelling the appointment for <strong className="text-slate-900">{cancellingApt.student_name}</strong> (Ref: <code className="font-mono text-[#0f2b48]">{cancellingApt.reference_id}</code>) scheduled on {cancellingApt.appointment_date}.
            </p>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Quick Reason Selection:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Candidate requested cancellation',
                  'Candidate unreachable on phone',
                  'Institute closed / declared holiday',
                  'Duplicate enquiry',
                  'Admitted under direct quota'
                ].map((reasonPreset) => (
                  <button
                    key={reasonPreset}
                    type="button"
                    onClick={() => setCancelReason(reasonPreset)}
                    className={`px-2 py-1 rounded text-[11px] border cursor-pointer transition-colors ${
                      cancelReason === reasonPreset
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {reasonPreset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cancellation Reason / Explanation:</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason logged in database..."
                className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellingApt(null)}
                className="px-4 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelApt}
                className="px-4 py-1.5 font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md cursor-pointer transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Permanent Delete Confirmation Modal */}
      {deletingApt && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left text-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Permanently Delete from Database</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-900 text-xs">
              <strong>⚠️ Warning:</strong> This will permanently delete this appointment row from your Supabase <code>appointments</code> table and local storage. This action cannot be reversed.
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] space-y-1">
              <div>Candidate: <strong className="text-slate-900 font-sans">{deletingApt.student_name}</strong></div>
              <div>Reference ID: <strong className="text-[#0f2b48]">{deletingApt.reference_id}</strong></div>
              <div>Database ID: <span className="text-slate-500">{deletingApt.id}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingApt(null)}
                className="px-4 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteApt}
                className="px-4 py-1.5 font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md cursor-pointer transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Trade Delete Confirmation Modal */}
      {deleteConfirmTradeId && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Delete Trade Offering</h4>
            <p className="text-slate-600">
              Are you sure you want to remove this trade from the public institute catalog?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmTradeId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTrade}
                className="px-4 py-1.5 font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded cursor-pointer"
              >
                Delete Trade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Notice Delete Confirmation Modal */}
      {deleteConfirmNoticeId && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Delete Official Notice</h4>
            <p className="text-slate-600">
              Are you sure you want to unpublish and delete this notice from the board?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmNoticeId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteNotice}
                className="px-4 py-1.5 font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded cursor-pointer"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Editing Modal */}
      {editingNoteAptId && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold font-institutional text-slate-900">
              Staff Notes for Appointment
            </h4>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Assigned to Desk 2. Instruct candidate to bring original 10th marks card."
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingNoteAptId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0f2b48] rounded cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Create/Edit Modal */}
      {newTradeModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8 text-xs">
            <h4 className="text-sm font-bold font-institutional text-slate-900">
              {editingTrade ? 'Edit Trade' : 'Add New Trade'}
            </h4>
            <form onSubmit={handleSaveTrade} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Trade Name *</label>
                  <input
                    type="text"
                    required
                    value={tradeForm.name}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Trade Code *</label>
                  <input
                    type="text"
                    required
                    value={tradeForm.code}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Course Type</label>
                  <select
                    value={tradeForm.course_type}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, course_type: e.target.value as any }))}
                    className="w-full px-3 py-1.5 rounded border border-slate-300"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Non-Engineering">Non-Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={tradeForm.duration}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Entry Eligibility</label>
                <input
                  type="text"
                  value={tradeForm.eligibility}
                  onChange={(e) => setTradeForm(prev => ({ ...prev, eligibility: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={tradeForm.description}
                  onChange={(e) => setTradeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTradeModal(false)}
                  className="px-3 py-1.5 text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-[#0f2b48] rounded cursor-pointer"
                >
                  Save Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Create/Edit Modal */}
      {newNoticeModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 text-xs">
            <h4 className="text-sm font-bold font-institutional text-slate-900">
              {editingNotice ? 'Edit Notice' : 'Publish Notice'}
            </h4>
            <form onSubmit={handleSaveNotice} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-1.5 rounded border border-slate-300"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Examination">Examination</option>
                    <option value="Training">Training</option>
                    <option value="Events">Events</option>
                    <option value="Important Notice">Important Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={noticeForm.date}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notice Description</label>
                <textarea
                  rows={3}
                  value={noticeForm.description}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewNoticeModal(false)}
                  className="px-3 py-1.5 text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-[#0f2b48] rounded cursor-pointer"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
