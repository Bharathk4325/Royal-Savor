import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { Menu, X, Landmark, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; screen: Screen; icon?: React.ReactNode }[] = [
    { label: 'Home', screen: 'home' },
    { label: 'Menu', screen: 'menu' },
    { label: 'Reservations', screen: 'reserve' },
    { label: 'Maitre D\'', screen: 'admin' },
  ];

  if (currentScreen === 'admin') {
    // Elegant minimised transaction Header for the Admin Dashboard as seen in the HTML screenshots
    return (
      <header className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-[5vw] border-b border-[#f2ca50]/20 bg-[#131313]/90 backdrop-blur-xl">
        <button 
          onClick={() => onNavigate('home')}
          className="font-serif text-xl md:text-2xl text-[#f2ca50] tracking-[0.2em] font-medium transition-transform hover:scale-105"
        >
          ROYAL SAVOR
        </button>
        
        <div className="flex items-center gap-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#d0c5af]">
            Control Center
          </span>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-4 py-2 border border-[#f2ca50]/20 rounded-sm font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#131313] transition-all duration-300"
          >
            <User size={12} />
            Guest View
          </button>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full h-20 z-50 flex justify-between items-center px-[5vw] border-b border-[#f2ca50]/10 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#131313]/95 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md border-[#f2ca50]/20 h-20' 
            : 'bg-[#131313]/70 backdrop-blur-md h-20'
        }`}
      >
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.slice(0, 3).map((item) => {
            const isActive = currentScreen === item.screen || (item.screen === 'reserve' && currentScreen === 'table-select');
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`relative font-sans text-[11px] font-bold uppercase tracking-[0.2em] pb-1 cursor-pointer transition-colors duration-300 ${
                  isActive ? 'text-[#f2ca50]' : 'text-[#e4e2e1] hover:text-[#f2ca50]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f2ca50] shadow-[0_0_8px_#f2ca50]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Brand Logo Centered */}
        <button
          onClick={() => onNavigate('home')}
          className="font-serif text-xl md:text-2xl text-[#f2ca50] tracking-[0.25em] font-semibold text-center flex-1 md:flex-none cursor-pointer hover:opacity-85 active:scale-98 transition-all"
        >
          ROYAL SAVOR
        </button>

        {/* Action Button & Admin Login */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
            title="Maitre D' Management Panel"
          >
            <ShieldCheck size={14} className="text-[#f2ca50]/70" />
            Admin
          </button>
          
          <button
            onClick={() => onNavigate('reserve')}
            className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] bg-[#2a2a2a] border border-[#f2ca50]/30 text-[#f2ca50] px-6 py-3 rounded-sm hover:bg-[#f2ca50] hover:text-[#131313] hover:border-[#f2ca50] transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(242,202,80,0.05)] active:scale-95"
          >
            Book a Table
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#f2ca50] p-1 focus:outline-none transition-transform active:scale-90 cursor-pointer"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#131313]/98 flex flex-col justify-center items-center gap-8 md:hidden animate-[fade-in_0.3s_ease]">
          {navItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => {
                onNavigate(item.screen);
                setMobileMenuOpen(false);
              }}
              className={`font-serif text-2xl tracking-widest ${
                currentScreen === item.screen ? 'text-[#f2ca50]' : 'text-[#e4e2e1]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('reserve');
              setMobileMenuOpen(false);
            }}
            className="mt-4 font-sans text-[12px] font-bold uppercase tracking-[0.2em] bg-[#2a2a2a] border border-[#f2ca50] text-[#f2ca50] px-8 py-4 rounded-sm"
          >
            Book a Table
          </button>
        </div>
      )}
    </>
  );
}
