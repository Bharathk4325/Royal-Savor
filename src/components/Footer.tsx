import { Screen } from '../types';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full flex flex-col items-center gap-6 px-[5vw] py-12 bg-[#0e0e0e] border-t border-[#f2ca50]/10 mt-20 relative z-10 transition-all">
      {/* Brand title */}
      <button 
        onClick={() => onNavigate('home')}
        className="font-serif text-3xl md:text-4xl text-[#f2ca50] tracking-[0.25em] hover:opacity-85 transition-opacity duration-300"
      >
        Royal Savor
      </button>

      {/* Decorative center divider */}
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f2ca50]/50 to-transparent my-1" />

      {/* Auxiliary links */}
      <div className="flex gap-6 items-center justify-center flex-wrap">
        <a 
          href="#privacy" 
          onClick={(e) => e.preventDefault()} 
          className="font-sans text-[13px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-300"
        >
          Privacy Policy
        </a>
        <span className="text-[#f2ca50]/30 text-xs">|</span>
        <a 
          href="#terms" 
          onClick={(e) => e.preventDefault()} 
          className="font-sans text-[13px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-300"
        >
          Terms of Service
        </a>
        <span className="text-[#f2ca50]/30 text-xs">|</span>
        <a 
          href="#careers" 
          onClick={(e) => e.preventDefault()} 
          className="font-sans text-[13px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-300"
        >
          Careers
        </a>
      </div>

      {/* Legal copy */}
      <div className="font-sans text-[12px] text-[#99907c] mt-2">
        © 2024 Royal Savor. All rights reserved.
      </div>
    </footer>
  );
}
