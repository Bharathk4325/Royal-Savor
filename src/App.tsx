import { useState, useEffect } from 'react';
import { Screen, Reservation } from './types';
import { INITIAL_RESERVATIONS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import CandlelightBackground from './components/CandlelightBackground';
import HomeView from './components/views/HomeView';
import MenuView from './components/views/MenuView';
import ReserveView from './components/views/ReserveView';
import TableSelectView from './components/views/TableSelectView';
import ConfirmView from './components/views/ConfirmView';
import AdminView from './components/views/AdminView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookingForm, setBookingForm] = useState<Partial<Reservation>>({
    guests: 2,
    seating: 'indoor',
    environment: 'ac',
    occasion: 'none',
    requests: '',
  });
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Initialize and sync reservations with localStorage
  useEffect(() => {
    const saved = localStorage.getItem('royal_savor_reservations');
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading reservations', e);
        setReservations(INITIAL_RESERVATIONS);
      }
    } else {
      setReservations(INITIAL_RESERVATIONS);
      localStorage.setItem('royal_savor_reservations', JSON.stringify(INITIAL_RESERVATIONS));
    }
  }, []);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    // Smooth transition: scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateForm = (data: Partial<Reservation>) => {
    setBookingForm((prev) => ({ ...prev, ...data }));
  };

  const handleConfirmReservation = (tableId: string) => {
    const newId = `RS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      id: newId,
      name: bookingForm.name || 'Alexander Sterling',
      email: bookingForm.email || 'alexander@sterling.com',
      phone: bookingForm.phone || '+91 99000 12345',
      guests: bookingForm.guests || 2,
      date: bookingForm.date || '2026-06-26',
      time: bookingForm.time || '20:00',
      seating: bookingForm.seating || 'indoor',
      environment: bookingForm.environment || 'ac',
      occasion: bookingForm.occasion || 'none',
      requests: bookingForm.requests || '',
      tableId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const updated = [newReservation, ...reservations];
    setReservations(updated);
    localStorage.setItem('royal_savor_reservations', JSON.stringify(updated));
    setConfirmedReservation(newReservation);
    
    // Clear booking form for next session
    setBookingForm({
      guests: 2,
      seating: 'indoor',
      environment: 'ac',
      occasion: 'none',
      requests: '',
    });

    handleNavigate('confirm');
  };

  const handleCancelReservation = (id: string) => {
    const updated = reservations.map((res) => {
      if (res.id === id) {
        return { ...res, status: 'cancelled' as const };
      }
      return res;
    });
    setReservations(updated);
    localStorage.setItem('royal_savor_reservations', JSON.stringify(updated));
  };

  const handleAddReservation = (res: Reservation) => {
    const updated = [res, ...reservations];
    setReservations(updated);
    localStorage.setItem('royal_savor_reservations', JSON.stringify(updated));
  };

  const renderActiveView = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'menu':
        return <MenuView />;
      case 'reserve':
        return (
          <ReserveView
            formData={bookingForm}
            onUpdateForm={handleUpdateForm}
            onNavigate={handleNavigate}
          />
        );
      case 'table-select':
        return (
          <TableSelectView
            formData={bookingForm}
            onConfirmReservation={handleConfirmReservation}
            onNavigate={handleNavigate}
          />
        );
      case 'confirm':
        return <ConfirmView reservation={confirmedReservation} onNavigate={handleNavigate} />;
      case 'admin':
        return (
          <AdminView
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onAddReservation={handleAddReservation}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden select-none bg-[#131313] text-[#e4e2e1] antialiased">
      {/* 1. Shading Background */}
      <CandlelightBackground />

      {/* 2. Top Navigation Bar */}
      <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* 3. Screen Body Router */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* 4. Tonal Footer */}
      {currentScreen !== 'admin' && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
