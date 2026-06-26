import { useState } from 'react';
import { Screen, Reservation, Table } from '../../types';
import { 
  Search, Bell, Calendar as CalendarIcon, BookOpen, Users, 
  DollarSign, Check, X, Mail, Edit3, Award, Plus, Trash2 
} from 'lucide-react';
import { INITIAL_TABLES } from '../../data';

interface AdminViewProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onAddReservation: (res: Reservation) => void;
  onNavigate: (screen: Screen) => void;
}

export default function AdminView({ reservations, onCancelReservation, onAddReservation, onNavigate }: AdminViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'lunch' | 'dinner'>('all');
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [editGuests, setEditGuests] = useState<number>(2);

  // Filter reservations based on search term and category
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tableId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (categoryFilter === 'all') return true;
    
    // Simple mock partition: Lunch is before 16:00, Dinner is 16:00 onwards
    const hour = parseInt(res.time.split(':')[0]);
    if (categoryFilter === 'lunch') return hour < 16;
    if (categoryFilter === 'dinner') return hour >= 16;
    
    return true;
  });

  // Dynamic statistics calculations
  const totalBookings = reservations.filter(r => r.status !== 'cancelled').length;
  const activeTablesCount = reservations.filter(r => r.status !== 'cancelled').map(r => r.tableId);
  const uniqueTablesInUse = new Set(activeTablesCount).size;
  const availableTablesCount = Math.max(0, INITIAL_TABLES.length - uniqueTablesInUse);
  
  // Calculate est revenue based on guests * ₹1200
  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + (r.guests * 1100), 0);

  const formatRevenue = (val: number) => {
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val}`;
  };

  const handleUpdateGuests = (id: string) => {
    // Save edit locally (simulate saving)
    setEditingResId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden text-[#e4e2e1] pt-20 animate-[fade-in_0.4s_ease-out]">
      {/* Top Banner Control Center */}
      <header className="h-20 bg-[#1f2020]/40 backdrop-blur-xl border-b border-[#f2ca50]/15 flex items-center justify-between px-8 shrink-0 z-10">
        <h2 className="font-serif text-xl md:text-2xl text-[#e4e2e1] font-semibold">
          Maitre d' Control Center
        </h2>
        
        <div className="flex items-center gap-5">
          {/* Search bar */}
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#131313]/60 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 text-[#e4e2e1] font-sans text-xs rounded-sm py-2 pl-10 pr-4 w-60 focus:outline-none transition-colors placeholder:text-[#99907c]/50"
              placeholder="Search guests, table, or reference..."
            />
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-2 text-[#f2ca50] border border-[#f2ca50]/30 rounded-full px-4 py-1.5 bg-[#131313]/40 backdrop-blur-md">
            <CalendarIcon size={14} />
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.15em]">
              Today, Oct 24
            </span>
          </div>

          <button className="text-[#99907c] hover:text-[#f2ca50] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Stats and Lists Wrapper */}
      <div className="flex-grow overflow-y-auto p-8 bg-[#131313]/10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Stats Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stat 1: Total Reservations */}
            <div className="bg-[#1f2020]/30 backdrop-blur-md border border-[#f2ca50]/10 rounded-lg p-6 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="flex justify-between items-start">
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#99907c]">Total Reservations</p>
                <BookOpen size={16} className="text-[#f2ca50]" />
              </div>
              <p className="font-serif text-3xl md:text-4xl text-[#f2ca50] font-semibold">{totalBookings}</p>
            </div>

            {/* Stat 2: Today's Bookings */}
            <div className="bg-[#1f2020]/30 backdrop-blur-md border border-[#f2ca50]/10 rounded-lg p-6 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#f2ca50]/3 pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#99907c]">Today's Bookings</p>
                <Award size={16} className="text-[#f2ca50]" />
              </div>
              <div className="flex items-end gap-2 relative z-10">
                <p className="font-serif text-3xl md:text-4xl text-[#f2ca50] font-semibold">38</p>
                <p className="font-sans text-[10px] text-green-400 pb-1.5 font-light">+4 vs yesterday</p>
              </div>
            </div>

            {/* Stat 3: Available Tables */}
            <div className="bg-[#1f2020]/30 backdrop-blur-md border border-[#f2ca50]/10 rounded-lg p-6 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="flex justify-between items-start">
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#99907c]">Available Tables</p>
                <Users size={16} className="text-[#f2ca50]" />
              </div>
              <p className="font-serif text-3xl md:text-4xl text-[#f2ca50] font-semibold">
                {availableTablesCount} <span className="text-base text-[#99907c]/60 font-sans">/ {INITIAL_TABLES.length}</span>
              </p>
            </div>

            {/* Stat 4: Estimated Revenue */}
            <div className="bg-[#1f2020]/30 backdrop-blur-md border border-[#f2ca50]/10 rounded-lg p-6 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
              <div className="flex justify-between items-start">
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#99907c]">Est. Revenue</p>
                <DollarSign size={16} className="text-[#f2ca50]" />
              </div>
              <p className="font-serif text-3xl md:text-4xl text-[#f2ca50] font-semibold">{formatRevenue(totalRevenue)}</p>
            </div>
          </div>

          {/* Main layout split: Reservation table + floor layout map status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Upcoming Reservations List */}
            <div className="lg:col-span-2 bg-[#1f2020]/30 backdrop-blur-xl border border-[#f2ca50]/15 rounded-lg p-6 flex flex-col h-[520px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg text-[#f2ca50] tracking-wider font-semibold uppercase">
                  Upcoming Reservations
                </h3>
                <div className="flex gap-1 bg-[#131313]/40 p-1 rounded border border-[#f2ca50]/10">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`font-sans text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-sm transition-all duration-300 ${
                      categoryFilter === 'all' ? 'bg-[#f2ca50] text-[#131313]' : 'text-[#e4e2e1] hover:text-[#f2ca50]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCategoryFilter('lunch')}
                    className={`font-sans text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-sm transition-all duration-300 ${
                      categoryFilter === 'lunch' ? 'bg-[#f2ca50] text-[#131313]' : 'text-[#e4e2e1] hover:text-[#f2ca50]'
                    }`}
                  >
                    Lunch
                  </button>
                  <button
                    onClick={() => setCategoryFilter('dinner')}
                    className={`font-sans text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-sm transition-all duration-300 ${
                      categoryFilter === 'dinner' ? 'bg-[#f2ca50] text-[#131313]' : 'text-[#e4e2e1] hover:text-[#f2ca50]'
                    }`}
                  >
                    Dinner
                  </button>
                </div>
              </div>

              {/* Responsive search input inside list for small viewports */}
              <div className="relative block md:hidden mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99907c]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#131313]/60 border border-[#f2ca50]/20 text-[#e4e2e1] font-sans text-xs rounded-sm py-2 pl-9 pr-4 w-full focus:outline-none"
                  placeholder="Search guests, tables..."
                />
              </div>

              {/* Interactive List Container */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {/* List Header Labels */}
                <div className="grid grid-cols-12 gap-3 pb-2 border-b border-[#f2ca50]/15 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#99907c] px-4">
                  <div className="col-span-2">Time</div>
                  <div className="col-span-4">Guest Info</div>
                  <div className="col-span-2">Party Size</div>
                  <div className="col-span-2">Table</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Reservation Items */}
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-20 text-[#99907c]/60 font-sans text-xs font-light">
                    No matching reservations found.
                  </div>
                ) : (
                  filteredReservations.map((res) => (
                    <div
                      key={res.id}
                      className={`grid grid-cols-12 gap-3 items-center p-4 bg-[#2a2a2a]/20 rounded transition-all duration-300 border-l-2 hover:bg-[#2a2a2a]/40 ${
                        res.status === 'cancelled'
                          ? 'border-red-500 opacity-40'
                          : 'border-[#f2ca50]'
                      }`}
                    >
                      {/* Time */}
                      <div className="col-span-2 font-sans font-semibold text-xs text-[#f2ca50]">
                        {res.time}
                      </div>

                      {/* Guest Info */}
                      <div className="col-span-4 pr-2">
                        <p className="font-serif text-[14px] font-medium text-[#e4e2e1] truncate">
                          {res.name}
                        </p>
                        <p className="font-sans text-[9px] tracking-wide text-[#99907c] truncate uppercase">
                          {res.occasion !== 'none' ? `${res.occasion} | ` : ''}{res.id}
                        </p>
                      </div>

                      {/* Party size */}
                      <div className="col-span-2 flex items-center gap-1 font-sans text-xs text-[#e4e2e1]">
                        <Users size={12} className="text-[#f2ca50]/50" />
                        {editingResId === res.id ? (
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={editGuests}
                            onChange={(e) => setEditGuests(parseInt(e.target.value) || 1)}
                            className="bg-[#131313] w-12 border border-[#f2ca50]/30 rounded text-center text-xs text-[#e4e2e1]"
                          />
                        ) : (
                          <span>{res.guests} Guests</span>
                        )}
                      </div>

                      {/* Table code */}
                      <div className="col-span-2 font-sans text-xs font-medium text-[#d0c5af]">
                        {res.tableId}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-end gap-1.5 md:gap-3">
                        {res.status !== 'cancelled' ? (
                          <>
                            {editingResId === res.id ? (
                              <button
                                onClick={() => handleUpdateGuests(res.id)}
                                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                title="Save changes"
                              >
                                <Check size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingResId(res.id);
                                  setEditGuests(res.guests);
                                }}
                                className="p-1 text-[#99907c] hover:text-[#f2ca50] transition-colors"
                                title="Edit Party Size"
                              >
                                <Edit3 size={15} />
                              </button>
                            )}

                            <button
                              onClick={() => alert(`Emailing booking details & confirmation voucher to: ${res.email}`)}
                              className="p-1 text-[#99907c] hover:text-[#f2ca50] transition-colors"
                              title="Email Confirmation"
                            >
                              <Mail size={15} />
                            </button>

                            <button
                              onClick={() => onCancelReservation(res.id)}
                              className="p-1 text-[#99907c] hover:text-red-400 transition-colors"
                              title="Cancel Reservation"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        ) : (
                          <span className="font-sans text-[8px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20 px-2 py-0.5 rounded-sm">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Table Mini-Floor Grid representation */}
            <div className="bg-[#1f2020]/30 backdrop-blur-xl border border-[#f2ca50]/15 rounded-lg p-6 flex flex-col h-[520px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg text-[#f2ca50] tracking-wider font-semibold uppercase">
                  Table Layout Status
                </h3>
              </div>

              {/* Status color bar indicators */}
              <div className="flex justify-between gap-2 mb-6 font-sans text-[8px] font-bold uppercase tracking-[0.15em] text-[#d0c5af]">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-[#f2ca50]/20 border border-[#f2ca50]" />
                  Active
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-[#353535]" />
                  Open
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-red-950/20 border border-red-500/30" />
                  Cancelled
                </div>
              </div>

              {/* Real-time Stacking Grid representing tables */}
              <div className="grid grid-cols-3 gap-3.5 flex-grow content-start">
                {INITIAL_TABLES.map((tbl) => {
                  const associatedBooking = reservations.find(r => r.tableId === tbl.id && r.status !== 'cancelled');
                  const isOccupied = !!associatedBooking;

                  return (
                    <div
                      key={tbl.id}
                      onClick={() => {
                        if (isOccupied) {
                          alert(`Seated Reservation:\nGuest: ${associatedBooking.name}\nTime: ${associatedBooking.time}\nGuests: ${associatedBooking.guests}`);
                        } else {
                          alert(`Table ${tbl.id} is currently open for walk-ins.\nCapacity: ${tbl.capacity} Seats.`);
                        }
                      }}
                      className={`aspect-square rounded flex flex-col items-center justify-center font-sans text-xs transition-all duration-300 cursor-pointer shadow-md ${
                        isOccupied
                          ? 'bg-[#f2ca50]/20 border border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50]/30 shadow-[0_0_8px_rgba(242,202,80,0.15)]'
                          : 'bg-[#353535]/40 text-[#99907c] hover:bg-[#353535]/70 border border-transparent'
                      }`}
                    >
                      <span className="font-bold text-[13px]">{tbl.id}</span>
                      <span className="text-[8px] uppercase tracking-wider mt-0.5 opacity-80">
                        {isOccupied ? 'Seated' : 'Open'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Concierge / Quick Actions */}
      <button
        onClick={() => onNavigate('reserve')}
        className="fixed bottom-8 right-8 bg-[#2a2a2a] border border-[#f2ca50] text-[#f2ca50] px-6 py-3.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(242,202,80,0.25)] hover:bg-[#f2ca50] hover:text-[#131313] hover:scale-105 active:scale-95 z-50 flex items-center gap-2 transition-all duration-300"
      >
        <Plus size={14} />
        New Reservation
      </button>
    </div>
  );
}
