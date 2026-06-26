import { useState } from 'react';
import { Screen, Table, Reservation } from '../../types';
import { Calendar, Clock, Users, CheckCircle, Info, ChevronRight, X } from 'lucide-react';
import { INITIAL_TABLES } from '../../data';

interface TableSelectViewProps {
  formData: Partial<Reservation>;
  onConfirmReservation: (tableId: string) => void;
  onNavigate: (screen: Screen) => void;
}

export default function TableSelectView({ formData, onConfirmReservation, onNavigate }: TableSelectViewProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);

  const handleTableClick = (table: Table) => {
    if (table.status === 'reserved' || table.status === 'cleaning') {
      return; // Cannot select
    }
    setSelectedTable(table);
  };

  const getStatusColor = (status: Table['status'], isSelected: boolean) => {
    if (isSelected) return 'border-[#f2ca50] bg-[#f2ca50]/20 shadow-[0_0_15px_#f2ca50] scale-110';
    switch (status) {
      case 'available': return 'border-[#10b981] hover:border-[#10b981]/80 hover:bg-[#10b981]/5';
      case 'vip': return 'border-[#d4af37] bg-[#d4af37]/5 shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:scale-105';
      case 'reserved': return 'border-[#ef4444] opacity-50 cursor-not-allowed';
      case 'cleaning': return 'border-[#f59e0b] opacity-60 cursor-wait';
      default: return 'border-gray-500';
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Available';
      case 'vip': return 'VIP Private Booth';
      case 'reserved': return 'Reserved';
      case 'cleaning': return 'Sanitizing / Cleaning';
    }
  };

  const handleConfirm = () => {
    if (!selectedTable) return;
    onConfirmReservation(selectedTable.id);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-[5vw] flex flex-col lg:flex-row gap-8 animate-[fade-in_0.5s_ease-out]">
      {/* floor plan layout */}
      <section className="flex-grow flex flex-col relative h-[640px] lg:h-auto border border-[#4d4635] rounded-xl overflow-hidden bg-[#0e0e0e]/50 backdrop-blur-xl p-6">
        <div className="z-20 max-w-lg mb-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#f2ca50] font-bold tracking-tight mb-2 uppercase">
            Choose Your Atmosphere
          </h1>
          <p className="font-sans text-xs text-[#d0c5af]/80 leading-relaxed font-light">
            Select an available table from the floor map to finalize your intimate dining arrangements.
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-[#1f2020]/90 border border-[#f2ca50]/10 p-4 rounded-md flex flex-wrap gap-4 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#d0c5af]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-[#10b981] bg-[#10b981]/10" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_8px_#d4af37]" />
            VIP
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-[#ef4444] bg-[#ef4444]/10 opacity-60" />
            Reserved
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-[#f59e0b] bg-[#f59e0b]/10 opacity-70" />
            Cleaning
          </div>
        </div>

        {/* Floor Canvas Map wrapper */}
        <div className="relative w-full flex-grow min-h-[420px] bg-[#131313]/30 rounded-xl border border-[#f2ca50]/5 overflow-hidden mt-6">
          
          {/* Main Dining Room Bounds */}
          <div className="absolute inset-4 md:inset-8 border border-[#4d4635]/35 rounded-xl bg-[linear-gradient(45deg,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]">
            <div className="absolute top-4 left-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#99907c]">
              Main Dining Room
            </div>

            {/* Interactive table nodes */}
            {tables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              const isReservedOrCleaning = table.status === 'reserved' || table.status === 'cleaning';

              return (
                <div
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={`absolute group cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-[#2a2a2a]/20 backdrop-blur-md text-xs font-semibold font-sans text-[#e4e2e1] transition-all duration-300 ${getStatusColor(
                    table.status,
                    isSelected
                  )}`}
                  style={{
                    top: table.top,
                    left: table.left,
                    width: table.capacity === 2 ? '48px' : table.capacity === 4 ? '56px' : table.capacity === 6 ? '76px' : '90px',
                    height: table.capacity === 2 ? '48px' : table.capacity === 4 ? '56px' : '52px',
                    borderRadius: table.type === 'circle' ? '9999px' : '4px',
                    transform: isSelected ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%)',
                  }}
                >
                  <span className={`tracking-wider ${isSelected ? 'text-[#f2ca50]' : 'text-[#e4e2e1]'}`}>
                    {table.id}
                  </span>

                  {/* Enhanced Premium Tooltip */}
                  <div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 bg-[#1f2020] border border-[#f2ca50]/30 p-3 rounded shadow-2xl z-40 w-44 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 text-center">
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1f2020]" />
                    
                    <span className="block font-serif text-[13px] text-[#f2ca50] font-medium tracking-wide mb-1">
                      {table.status === 'vip' ? 'VIP Booth' : `Table ${table.id}`}
                    </span>
                    <span className="block font-sans text-[10px] text-[#d0c5af] tracking-wide mb-1">
                      Capacity: {table.capacity} Guests
                    </span>
                    <span className={`block font-sans text-[9px] font-bold uppercase tracking-wider ${
                      table.status === 'available' ? 'text-green-400' : table.status === 'vip' ? 'text-[#d4af37]' : table.status === 'cleaning' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {getStatusText(table.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terrace Divider Area */}
          <div className="absolute right-0 top-4 bottom-4 w-[16%] border-l border-[#f2ca50]/15 flex flex-col items-center justify-center gap-2">
            <span className="absolute top-4 font-sans text-[8px] font-bold uppercase tracking-[0.25em] text-[#99907c] text-center w-full">
              Terrace AC
            </span>
          </div>
        </div>
      </section>

      {/* Sidebar Summary Card */}
      <aside className="w-full lg:w-96 shrink-0 bg-[#1f2020]/40 backdrop-blur-2xl border border-[#f2ca50]/20 rounded-xl p-6 flex flex-col justify-between h-fit lg:sticky lg:top-28 shadow-2xl">
        <div>
          <h2 className="font-serif text-2xl text-[#f2ca50] font-bold tracking-wider mb-6 border-b border-[#f2ca50]/10 pb-4 uppercase">
            Reservation Details
          </h2>

          <div className="space-y-4.5 font-sans text-xs">
            {/* Date Details */}
            <div className="flex justify-between items-center bg-[#131313]/40 p-3.5 rounded-sm border border-[#f2ca50]/5">
              <span className="text-[#99907c] uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} className="text-[#f2ca50]" />
                Date
              </span>
              <span className="text-[#e4e2e1] font-semibold tracking-wide">
                {formData.date || 'Oct 24, 2024'}
              </span>
            </div>

            {/* Time Details */}
            <div className="flex justify-between items-center bg-[#131313]/40 p-3.5 rounded-sm border border-[#f2ca50]/5">
              <span className="text-[#99907c] uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-[#f2ca50]" />
                Time
              </span>
              <span className="text-[#e4e2e1] font-semibold tracking-wide">
                {formData.time || '19:30'}
              </span>
            </div>

            {/* Guest Details */}
            <div className="flex justify-between items-center bg-[#131313]/40 p-3.5 rounded-sm border border-[#f2ca50]/5">
              <span className="text-[#99907c] uppercase tracking-wider flex items-center gap-2">
                <Users size={14} className="text-[#f2ca50]" />
                Guests
              </span>
              <span className="text-[#e4e2e1] font-semibold tracking-wide">
                {formData.guests || 2} Guests
              </span>
            </div>

            {/* Dynamic Table Selection state container */}
            <div className="pt-6 mt-6 border-t border-[#f2ca50]/10 flex flex-col gap-3">
              <span className="font-sans text-[10px] font-bold tracking-[0.15em] text-[#99907c] uppercase">
                Selected Atmosphere
              </span>

              {selectedTable ? (
                <div className="bg-[#f2ca50]/5 p-4 rounded border border-[#f2ca50]/40 text-center animate-[pop_0.3s_ease]">
                  <div className="font-serif text-2xl text-[#f2ca50] font-semibold mb-1">
                    Table {selectedTable.id}
                  </div>
                  <div className="font-sans text-[11px] text-[#d0c5af] font-light">
                    {selectedTable.capacity} Seats • {selectedTable.location}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1b1c1c]/40 p-5 rounded border border-[#4d4635]/30 text-[#99907c] text-center text-xs font-light leading-relaxed">
                  <Info size={14} className="mx-auto mb-2 text-[#99907c]/60" />
                  Please select an available table from the floor blueprint map.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Proceed Action Button */}
        <div className="mt-8">
          <button
            onClick={handleConfirm}
            disabled={!selectedTable}
            className={`w-full py-4.5 rounded-sm font-sans text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 ${
              selectedTable
                ? 'bg-[#f2ca50] text-[#3c2f00] hover:bg-[#ffe088] shadow-lg hover:shadow-[0_0_20px_rgba(242,202,80,0.2)] active:scale-98 cursor-pointer'
                : 'bg-[#2a2a2a] text-[#99907c] opacity-50 cursor-not-allowed border border-[#99907c]/20'
            }`}
          >
            Confirm Table Selection
            <ChevronRight size={14} />
          </button>
        </div>
      </aside>
    </div>
  );
}
