/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trade,
  Notice,
  FAQItem,
  ScheduleSettings,
  Appointment,
} from './types';
import {
  initialFacilities,
  initialGallery,
  initialSettings,
  initialTrades,
  initialNotices,
  initialFAQs,
} from './data/initialData';
import { api } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickInfoBar } from './components/QuickInfoBar';
import { About } from './components/About';
import { Trades } from './components/Trades';
import { Admissions } from './components/Admissions';
import { Facilities } from './components/Facilities';
import { Gallery } from './components/Gallery';
import { Notices } from './components/Notices';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TrackBookingModal } from './components/TrackBookingModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [settings, setSettings] = useState<ScheduleSettings>(initialSettings);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedTradeId, setPreselectedTradeId] = useState<string | undefined>(undefined);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load live data from API / storage
  const loadData = useCallback(async () => {
    try {
      const [fetchedTrades, fetchedNotices, fetchedFaqs, fetchedSettings, fetchedAppointments] =
        await Promise.all([
          api.getTrades(),
          api.getNotices(),
          api.getFAQs(),
          api.getSettings(),
          api.getAppointments(),
        ]);
      setTrades(fetchedTrades);
      setNotices(fetchedNotices);
      setFaqs(fetchedFaqs);
      setSettings(fetchedSettings);
      setAppointments(fetchedAppointments);
      setIsAdminLoggedIn(api.isAdminLoggedIn());
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open booking modal
  const handleOpenBooking = (tradeId?: string) => {
    setPreselectedTradeId(tradeId);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment registered successfully! Reference ID: ${newApt.reference_id}`);
  };

  // Open admin
  const handleOpenAdmin = () => {
    if (api.isAdminLoggedIn()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
    showToast('Administrator authenticated successfully');
  };

  const handleAdminLogout = () => {
    api.adminLogout();
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
    showToast('Signed out of administrative console');
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-60 bg-[#0f2b48] text-white px-4 py-2.5 rounded-md shadow-lg border border-sky-400/40 text-xs flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Institutional Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTrackBooking={() => setIsTrackOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreTrades={() => handleScrollTo('trades')}
        />

        {/* 2. Quick Information Bar */}
        <QuickInfoBar />

        {/* 3. About Section */}
        <About
          onLearnMore={() => handleScrollTo('admissions')}
          onViewLocation={() => handleScrollTo('contact')}
        />

        {/* 4. Trades / Courses Section */}
        <Trades
          trades={trades}
          onEnquireTrade={(tradeId) => handleOpenBooking(tradeId)}
        />

        {/* 5. Admissions Section */}
        <Admissions
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 6. Facilities Section */}
        <Facilities facilities={initialFacilities} />

        {/* 7. Gallery Section with Lightbox */}
        <Gallery images={initialGallery} />

        {/* 8. Notices Board */}
        <Notices notices={notices} />

        {/* 9. FAQ Section */}
        <FAQ
          faqs={faqs}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 10. Contact & Verified Google Maps Section */}
        <Contact
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenTrackBooking={() => setIsTrackOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        trades={trades}
        settings={settings}
        preselectedTradeId={preselectedTradeId}
        onBookingSuccess={handleBookingSuccess}
      />

      <TrackBookingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        onBookingUpdated={loadData}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
        appointments={appointments}
        trades={trades}
        notices={notices}
        faqs={faqs}
        settings={settings}
        onRefreshData={loadData}
      />
    </div>
  );
}
