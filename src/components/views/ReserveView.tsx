import React, { useState } from 'react';
import { Screen, Reservation } from '../../types';
import { MapPin, Phone, Calendar, Clock, Sparkles } from 'lucide-react';

interface ReserveViewProps {
  formData: Partial<Reservation>;
  onUpdateForm: (data: Partial<Reservation>) => void;
  onNavigate: (screen: Screen) => void;
}

export default function ReserveView({ formData, onUpdateForm, onNavigate }: ReserveViewProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateForm({ [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (name: 'seating' | 'environment', value: string) => {
    onUpdateForm({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    onNavigate('table-select');
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-[5vw] max-w-4xl w-full mx-auto animate-[fade-in_0.5s_ease-out]">
      {/* Hero Header */}
      <header className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#f2ca50] mb-4 tracking-tight font-bold uppercase">
          Reserve Your Table
        </h1>
        <p className="font-serif text-lg md:text-xl text-[#d0c5af] italic font-light">
          An Exquisite Dining Experience Awaits
        </p>

        {/* Contact/Address badges */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 font-sans text-xs text-[#99907c] border-t border-[#f2ca50]/20 pt-6 mt-6 max-w-xl mx-auto">
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-[#f2ca50]" />
            123 Heritage Lane, Luxury District, Bangalore
          </span>
          <span className="hidden md:inline text-[#f2ca50]/30">|</span>
          <span className="flex items-center gap-2">
            <Phone size={14} className="text-[#f2ca50]" />
            +91 80 4567 8900
          </span>
        </div>
      </header>

      {/* Reservation Form Card */}
      <div className="w-full bg-[#1f2020]/40 backdrop-blur-2xl border border-[#f2ca50]/20 rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transform transition-all duration-500">
        {/* Decorative thin gold indicator line at top */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f2ca50]/50 to-transparent" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors"
                placeholder="John Doe"
              />
              {errors.name && <span className="text-red-400 text-[11px] font-sans">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && <span className="text-red-400 text-[11px] font-sans">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors"
                placeholder="+91 98765 43210"
              />
              {errors.phone && <span className="text-red-400 text-[11px] font-sans">{errors.phone}</span>}
            </div>

            {/* Number of Guests */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
                Number of Guests
              </label>
              <input
                type="number"
                name="guests"
                min="1"
                max="20"
                value={formData.guests || 2}
                onChange={handleChange}
                className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50] flex items-center gap-1.5">
                <Calendar size={12} className="text-[#f2ca50]/70" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date || ''}
                onChange={handleChange}
                className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors"
              />
              {errors.date && <span className="text-red-400 text-[11px] font-sans">{errors.date}</span>}
            </div>

            {/* Time */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50] flex items-center gap-1.5">
                <Clock size={12} className="text-[#f2ca50]/70" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time || ''}
                onChange={handleChange}
                className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors"
              />
              {errors.time && <span className="text-red-400 text-[11px] font-sans">{errors.time}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#f2ca50]/10 pt-6 mt-2">
            {/* Seating Preference */}
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
                Seating Preference
              </span>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => handleRadioChange('seating', 'indoor')}
                  className="flex items-center gap-2.5 text-[#e4e2e1] text-sm cursor-pointer hover:text-[#f2ca50] transition-colors"
                >
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${formData.seating === 'indoor' ? 'border-[#f2ca50]' : 'border-[#99907c]'}`}>
                    {formData.seating === 'indoor' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] shadow-[0_0_8px_#f2ca50]" />
                    )}
                  </div>
                  Indoor Dining
                </button>

                <button
                  type="button"
                  onClick={() => handleRadioChange('seating', 'outdoor')}
                  className="flex items-center gap-2.5 text-[#e4e2e1] text-sm cursor-pointer hover:text-[#f2ca50] transition-colors"
                >
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${formData.seating === 'outdoor' ? 'border-[#f2ca50]' : 'border-[#99907c]'}`}>
                    {formData.seating === 'outdoor' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] shadow-[0_0_8px_#f2ca50]" />
                    )}
                  </div>
                  Terrace Outdoor
                </button>
              </div>
            </div>

            {/* AC Environment */}
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
                Environment
              </span>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => handleRadioChange('environment', 'ac')}
                  className="flex items-center gap-2.5 text-[#e4e2e1] text-sm cursor-pointer hover:text-[#f2ca50] transition-colors"
                >
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${formData.environment === 'ac' ? 'border-[#f2ca50]' : 'border-[#99907c]'}`}>
                    {formData.environment === 'ac' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] shadow-[0_0_8px_#f2ca50]" />
                    )}
                  </div>
                  Air Conditioned (AC)
                </button>

                <button
                  type="button"
                  onClick={() => handleRadioChange('environment', 'non-ac')}
                  className="flex items-center gap-2.5 text-[#e4e2e1] text-sm cursor-pointer hover:text-[#f2ca50] transition-colors"
                >
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${formData.environment === 'non-ac' ? 'border-[#f2ca50]' : 'border-[#99907c]'}`}>
                    {formData.environment === 'non-ac' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] shadow-[0_0_8px_#f2ca50]" />
                    )}
                  </div>
                  Ambient Natural (Non-AC)
                </button>
              </div>
            </div>
          </div>

          {/* Special Occasion */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50] flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#f2ca50]/70" />
              Special Occasion
            </label>
            <select
              name="occasion"
              value={formData.occasion || 'none'}
              onChange={handleChange}
              className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors cursor-pointer"
            >
              <option value="none">None</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="business">Business Meeting</option>
              <option value="date-night">Romantic Date Night</option>
            </select>
          </div>

          {/* Special Requests */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50]">
              Special Requests / Dietary Restrictions
            </label>
            <textarea
              name="requests"
              value={formData.requests || ''}
              onChange={handleChange}
              rows={3}
              className="bg-[#131313]/80 border border-[#f2ca50]/20 hover:border-[#f2ca50]/40 focus:border-[#f2ca50] focus:ring-0 rounded-sm p-3.5 text-[#e4e2e1] font-sans text-sm focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="Any specific table placement requests, food allergies, or special instructions?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#f2ca50] text-[#3c2f00] font-sans text-xs font-bold uppercase tracking-[0.2em] py-4.5 rounded-sm hover:scale-[1.01] hover:bg-[#ffe088] transition-all duration-300 shadow-xl cursor-pointer hover:shadow-[0_0_25px_rgba(242,202,80,0.25)] mt-4 active:scale-98 flex justify-center items-center gap-2"
          >
            Select Your Table
          </button>
        </form>
      </div>
    </div>
  );
}
