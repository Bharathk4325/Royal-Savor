import React, { useRef, useState, useEffect } from 'react';
import { Screen } from '../../types';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Volume2, VolumeX, ArrowDown, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Scroll-linked cinematic parallax for the Hero section
  const { scrollY } = useScroll();
  const heroTransformY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.12]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Mouse tracking on Hero for interactive holographic parallax and spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 90 };
  const videoTranslateX = useSpring(useTransform(mouseX, [-500, 500], [-18, 18]), springConfig);
  const videoTranslateY = useSpring(useTransform(mouseY, [-500, 500], [-18, 18]), springConfig);

  const spotlightX = useSpring(useTransform(mouseX, (val) => {
    if (!heroRef.current) return '50%';
    const width = heroRef.current.clientWidth || window.innerWidth;
    return `${(val + width / 2) / width * 100}%`;
  }), springConfig);

  const spotlightY = useSpring(useTransform(mouseY, (val) => {
    if (!heroRef.current) return '50%';
    const height = heroRef.current.clientHeight || window.innerHeight;
    return `${(val + height / 2) / height * 100}%`;
  }), springConfig);

  const spotlightGradient = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) => `radial-gradient(circle 380px at ${x} ${y}, rgba(242, 202, 80, 0.16) 0%, transparent 100%)`
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { width, height, left, top } = heroRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Toggle video mute state
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Tilt Card State and Calculations
  const Card3D = ({ 
    children, 
    className, 
    bgImage, 
    title, 
    subtitle,
    description 
  }: { 
    children?: React.ReactNode; 
    className?: string; 
    bgImage: string; 
    title: string; 
    subtitle: string;
    description?: string;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

    const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseXVal = e.clientX - rect.left - width / 2;
      const mouseYVal = e.clientY - rect.top - height / 2;
      x.set(mouseXVal / width);
      y.set(mouseYVal / height);
    };

    const handleMouseLeaveCard = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMoveCard}
        onMouseLeave={handleMouseLeaveCard}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative rounded-lg overflow-hidden group border border-[#f2ca50]/15 hover:border-[#f2ca50]/45 transition-colors duration-500 shadow-2xl flex flex-col justify-end ${className}`}
      >
        {/* Background Image with Zoom */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        
        {/* Shiny Light sweep / reflection overlay tracking mouse */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(242,202,80,0.18)_0%,_transparent_50%)]" 
          style={{
            // Dynamic CSS custom properties injected on mousemove
            ['--x' as any]: `${(x.get() + 0.5) * 100}%`,
            ['--y' as any]: `${(y.get() + 0.5) * 100}%`,
          }}
        />

        {/* Cinematic Golden Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/35 to-transparent opacity-90 group-hover:opacity-85 transition-all duration-500" />
        
        {/* Classic ticket borders */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#f2ca50]/20 group-hover:border-[#f2ca50]/60 transition-colors duration-500" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#f2ca50]/20 group-hover:border-[#f2ca50]/60 transition-colors duration-500" />

        {/* Card Content with translate-z for 3D depth */}
        <div className="relative p-8 z-10" style={{ transform: 'translateZ(40px)' }}>
          <span className="font-sans text-[10px] tracking-[0.2em] text-[#f2ca50]/80 font-bold block mb-1 uppercase">
            {subtitle}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#e4e2e1] mb-2 font-medium tracking-wide">
            {title}
          </h3>
          {description && (
            <p className="font-sans text-xs text-[#d0c5af]/80 leading-relaxed font-light max-w-md mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center select-none w-full">
      {/* Cinematic Hero Section with full-screen video background */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-screen flex flex-col items-center justify-center px-[5vw] text-center overflow-hidden"
      >
        {/* 1. Cinematic Video Background with smooth mouse-tracking parallax */}
        <motion.div 
          className="absolute inset-0 w-[108%] h-[108%] -left-[4%] -top-[4%] pointer-events-none -z-20"
          style={{
            scale: heroScale,
            y: heroTransformY,
          }}
        >
          <motion.div
            className="w-full h-full absolute inset-0"
            style={{
              x: videoTranslateX,
              y: videoTranslateY,
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                videoLoaded ? 'opacity-40' : 'opacity-0'
              }`}
              poster="https://lh3.googleusercontent.com/aida-public/AB6AXuAHKaz2QBfnjY1YiM43Zrw4K8Omj2QUzje-uQD-dwT7zccA96fbgv8b8mszr2k-urvpCXmtWQE9yrqUrNwI8c8vO3nOhwCK_4HsPrLYFQ2NQZVZT6I9NxoCPYQtdcBkXxYTqOiLS13uCyEc44CI1SyhO16OyYAszRVbjndbp36pIDP24hoQCmfeXfeOgWxLgP7Wt6WBWVNpMFq9Wt8NuT8AgzokBROpZTBHvGKLmXsaflLVaHqX8k6AtOsooTetnYYzb7Rccxvo5d10"
            >
              {/* High-quality matching loopable lounge dining video preview from Mixkit */}
              <source 
                src="https://assets.mixkit.co/videos/preview/mixkit-dining-in-a-dimly-lit-restaurant-41551-large.mp4" 
                type="video/mp4" 
              />
            </video>
            
            {/* Backup Poster Overlay if video fails to play or load */}
            {!videoLoaded && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 animate-[pulse_4s_infinite_alternate]"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHKaz2QBfnjY1YiM43Zrw4K8Omj2QUzje-uQD-dwT7zccA96fbgv8b8mszr2k-urvpCXmtWQE9yrqUrNwI8c8vO3nOhwCK_4HsPrLYFQ2NQZVZT6I9NxoCPYQtdcBkXxYTqOiLS13uCyEc44CI1SyhO16OyYAszRVbjndbp36pIDP24hoQCmfeXfeOgWxLgP7Wt6WBWVNpMFq9Wt8NuT8AgzokBROpZTBHvGKLmXsaflLVaHqX8k6AtOsooTetnYYzb7Rccxvo5d10')`
                }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Spotlight Overlay specifically lighting up the video under user cursor */}
        <motion.div 
          className="absolute inset-0 pointer-events-none -z-15 mix-blend-screen opacity-90"
          style={{
            background: spotlightGradient
          }}
        />

        {/* 2. Premium visual masking overlays */}
        {/* Dark Golden atmospheric vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/90 via-transparent to-[#131313] pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#131313_110%)] mix-blend-multiply opacity-85 pointer-events-none -z-10" />

        {/* 3. Hero Content with staggered elegant reveal animations */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="max-w-4xl z-10"
        >
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f2ca50]/20 bg-[#131313]/65 backdrop-blur-md mb-8"
          >
            <Sparkles size={12} className="text-[#f2ca50] animate-pulse" />
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#f2ca50]">
              Maitre d' Control & Interactive Bookings
            </span>
          </motion.div>

          {/* Majestic Title letters */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[105px] text-[#f2ca50] font-bold leading-[0.95] tracking-[0.06em] mb-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
          >
            ROYAL<br />SAVOR
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
            className="font-sans text-[11px] sm:text-xs md:text-sm lg:text-base text-[#d0c5af] tracking-[0.35em] uppercase mb-12 max-w-3xl mx-auto font-light leading-loose"
          >
            An Immersive Candlelit Dining Experience
          </motion.p>
          
          {/* Subtle elegant divider */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent mx-auto mb-12" 
          />

          {/* Interactive magnetic action button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => onNavigate('reserve')}
              className="group relative inline-flex items-center justify-center font-sans text-[11px] font-bold uppercase tracking-[0.25em] bg-[#131313]/90 border border-[#f2ca50]/50 text-[#f2ca50] px-12 py-5 rounded-sm hover:border-[#f2ca50] hover:text-[#131313] transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Golden button flare shift */}
              <span className="absolute inset-0 bg-[#f2ca50] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
              BOOK A TABLE
            </button>
          </motion.div>
        </motion.div>

        {/* 4. Controls & micro-UI overlay */}
        {/* Cinematic sound controller toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2 }}
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-20 flex items-center gap-2.5 bg-[#131313]/50 backdrop-blur-md border border-[#f2ca50]/20 hover:border-[#f2ca50]/60 hover:opacity-100 p-3 rounded-full text-[#f2ca50] transition-all duration-300 active:scale-95 cursor-pointer"
          title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#99907c]/60 flex flex-col items-center gap-1.5"
        >
          <span className="font-sans text-[8px] font-bold uppercase tracking-[0.25em]">Explore</span>
          <ArrowDown size={12} className="text-[#f2ca50]/60" />
        </motion.div>
      </section>

      {/* Experience Section with 3D Tilt Interactive Bento Cards */}
      <section className="py-24 px-[5vw] max-w-7xl w-full mx-auto">
        <div className="w-full text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#f2ca50] font-bold block mb-3">
            The Experience
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#e4e2e1] font-semibold tracking-wide">
            Designed for the Senses
          </h2>
          <div className="w-12 h-[1px] bg-[#f2ca50]/50 mx-auto mt-4" />
        </div>

        {/* Dynamic Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 perspective-[1500px]">
          
          {/* Card 1: The Art (Chef Plating with 3D Tilt) */}
          <Card3D 
            className="col-span-1 md:col-span-5 h-[400px]"
            bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAo4I_MSbr5-Nqh32rn625gxLYNbadplpnweJy0jAgGdBWGbYMoeMvbKR2jJD1xFUvHxo-n_1onhPSIGTvXvc1_WALtzUPmdZjnkCIWhbh2Nph6Cm6PDAnQJzRfGYphfe4lgTLnle6w0ZZS9mJSAwb2Obuzsp9N0RCFZfN-AHEjTqzXKoeigtoKUrEbHF_h-KTJmRX35_8JEdhHkGEuZBwFWIrxGQgX0lTlG0JjlThPGkc90YDu2JV7v5UVKOa1GbxZkeg-76jt-SYS"
            title="The Art"
            subtitle="Cuisine Masterpiece"
            description="Our chefs treat every plating as a work of fine art, combining authentic spices and modern styling to create visual poetry before the first bite."
          />

          {/* Card 2: Symphony of Senses (Elegant Dining Room with 3D Tilt) */}
          <Card3D 
            className="col-span-1 md:col-span-7 h-[400px]"
            bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAHKaz2QBfnjY1YiM43Zrw4K8Omj2QUzje-uQD-dwT7zccA96fbgv8b8mszr2k-urvpCXmtWQE9yrqUrNwI8c8vO3nOhwCK_4HsPrLYFQ2NQZVZT6I9NxoCPYQtdcBkXxYTqOiLS13uCyEc44CI1SyhO16OyYAszRVbjndbp36pIDP24hoQCmfeXfeOgWxLgP7Wt6WBWVNpMFq9Wt8NuT8AgzokBROpZTBHvGKLmXsaflLVaHqX8k6AtOsooTetnYYzb7Rccxvo5d10"
            title="Symphony of Senses"
            subtitle="The Ambient Hall"
            description="An ultra-exclusive space combining dim candlelight accents with a soft, live-curated dining murmur to keep every moment intimate."
          />

        </div>
      </section>
    </div>
  );
}
