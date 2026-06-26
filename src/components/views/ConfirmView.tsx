import { useState } from 'react';
import { Screen, Reservation } from '../../types';
import { Download, Calendar, Ticket, Check, Copy } from 'lucide-react';

interface ConfirmViewProps {
  reservation: Reservation | null;
  onNavigate: (screen: Screen) => void;
}

export default function ConfirmView({ reservation, onNavigate }: ConfirmViewProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback mock details if reservation state is missing
  const activeReservation = reservation || {
    id: 'RS-8821',
    name: 'Alexander Sterling',
    guests: 2,
    date: '2026-06-26',
    time: '20:00',
    tableId: 'T1',
    seating: 'indoor',
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleAddToCalendar = () => {
    setAddedToCalendar(true);
    setTimeout(() => setAddedToCalendar(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeReservation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-[5vw] flex flex-col items-center justify-center animate-[fade-in_0.6s_ease-out]">
      {/* Glow highlight background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f2ca50]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header section */}
      <header className="text-center mb-10 max-w-xl">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#f2ca50] block mb-3">
          Royal Savor
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#e4e2e1] font-bold tracking-normal mb-3">
          Reservation Confirmed
        </h1>
        <p className="font-serif text-base text-[#d0c5af]/80 italic">
          We look forward to hosting you, {activeReservation.name.split(' ')[0]}.
        </p>
      </header>

      {/* Digital Receipt Card */}
      <div className="bg-[#1f2020]/40 backdrop-blur-2xl border border-[#f2ca50]/20 w-full max-w-2xl rounded-xl p-8 sm:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Decorative Ticket Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#f2ca50]/40 rounded-tl-xl m-4" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#f2ca50]/40 rounded-tr-xl m-4" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#f2ca50]/40 rounded-bl-xl m-4" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#f2ca50]/40 rounded-br-xl m-4" />

        <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
          {/* Left Column: Details */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Booking Reference */}
            <div className="flex justify-between items-end border-b border-dashed border-[#f2ca50]/20 pb-3.5">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#99907c]">
                Booking Reference
              </span>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-[#f2ca50] tracking-widest font-semibold">
                  {activeReservation.id}
                </span>
                <button 
                  onClick={handleCopyCode}
                  className="p-1 hover:text-[#f2ca50] text-[#99907c] transition-colors"
                  title="Copy Reference Code"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between items-end border-b border-dashed border-[#f2ca50]/20 pb-3.5">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#99907c]">
                Date & Time
              </span>
              <div className="text-right">
                <span className="font-sans text-xs text-[#e4e2e1] block font-light mb-1">
                  {formatDisplayDate(activeReservation.date)}
                </span>
                <span className="font-serif text-2xl text-[#f2ca50] font-medium leading-none">
                  {activeReservation.time}
                </span>
              </div>
            </div>

            {/* Party Details */}
            <div className="flex justify-between items-end border-b border-dashed border-[#f2ca50]/20 pb-3.5">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#99907c]">
                Party Details
              </span>
              <div className="text-right text-xs">
                <span className="font-sans text-[#e4e2e1] block font-semibold mb-1">
                  {activeReservation.guests} Guests
                </span>
                <span className="font-sans text-[#d0c5af] block font-light">
                  Table {activeReservation.tableId} ({activeReservation.seating === 'indoor' ? 'Indoor Room' : 'Terrace Outdoor'})
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Stylized QR & Scan Instructions */}
          <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-[#131313]/60 rounded-lg border border-[#4d4635]/40 w-full md:w-auto">
            <div className="w-32 h-32 bg-white p-2.5 rounded shadow-inner flex items-center justify-center relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO__a8p1Q6N16mQU6TmjH8UxQnpxxePGKrWTeShdcMJSArk2skmicHawrNlfOZM7XM2GQedhPhaosRTlC9mOMTaayz-bVgAxgU-Allv4Hz1wIZkxJSa-2KVEBOYxUdZu_otBUHWSD59aPz2GOHss7AGQy5sBurvOF1wyjbQRIZ6ier6IU4cRQ_k8mtX3wvZeNiThTrcz9l8L8tI-Rb6DHCFvbvpiadB6loNl7YwzsTHIkrhdScJnfpd3kKVG53rB-79DEu57UAK1Yn"
                alt="Verification QR Code"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply opacity-90"
              />
            </div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#f2ca50] text-center block">
              Scan upon arrival
            </span>
          </div>
        </div>

        {/* Action Buttons inside Card */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] border border-[#f2ca50]/30 text-[#f2ca50] bg-[#2a2a2a]/40 px-6 py-3.5 rounded-full hover:border-[#f2ca50] hover:text-[#131313] hover:bg-[#f2ca50] active:scale-95 transition-all duration-300 w-full sm:w-auto"
          >
            {downloaded ? (
              <>
                <Check size={14} className="text-green-400" />
                Ticket Saved
              </>
            ) : (
              <>
                <Download size={14} />
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handleAddToCalendar}
            className="flex items-center justify-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] border border-[#f2ca50]/30 text-[#f2ca50] bg-[#2a2a2a]/40 px-6 py-3.5 rounded-full hover:border-[#f2ca50] hover:text-[#131313] hover:bg-[#f2ca50] active:scale-95 transition-all duration-300 w-full sm:w-auto"
          >
            {addedToCalendar ? (
              <>
                <Check size={14} className="text-green-400" />
                Added to Calendar
              </>
            ) : (
              <>
                <Calendar size={14} />
                Add to Calendar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Button back to Home */}
      <button
        onClick={() => onNavigate('home')}
        className="mt-10 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#99907c] hover:text-[#f2ca50] transition-colors flex items-center gap-2"
      >
        <Ticket size={14} />
        Back to Dining Lounge
      </button>
    </div>
  );
}
