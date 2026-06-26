import React, { useState } from 'react';
import { MENU_ITEMS } from '../../data';
import { MenuItem } from '../../types';
import { ChefHat, Pizza, IceCream, Coffee, UtensilsCrossed } from 'lucide-react';

export default function MenuView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [tiltStyle, setTiltStyle] = useState<{ [key: string]: string }>({});

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'south-indian', label: 'SOUTH INDIAN' },
    { id: 'north-indian', label: 'NORTH INDIAN' },
    { id: 'pizza', label: 'PIZZA' },
    { id: 'ice-cream', label: 'ICE CREAM' },
    { id: 'desserts', label: 'DESSERTS' },
    { id: 'beverages', label: 'BEVERAGES' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max 6 degrees rotation
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;
    
    setTiltStyle(prev => ({
      ...prev,
      [id]: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    }));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredCardId(null);
    setTiltStyle(prev => ({
      ...prev,
      [id]: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pizza': return <Pizza size={18} />;
      case 'ice-cream': return <IceCream size={18} />;
      case 'beverages': return <Coffee size={18} />;
      case 'south-indian':
      case 'north-indian': return <ChefHat size={18} />;
      default: return <UtensilsCrossed size={18} />;
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-[5vw] max-w-7xl w-full mx-auto animate-[fade-in_0.5s_ease-out]">
      {/* Dynamic Ambient overlay */}
      <div className="absolute inset-0 bg-[#0e0e0e]/50 backdrop-blur-[3px] -z-10 rounded-3xl" />

      {/* Header Section */}
      <section className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#f2ca50] mb-4 tracking-wider font-bold drop-shadow-md uppercase">
          CULINARY COLLECTION
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-[#d0c5af] tracking-[0.2em] uppercase font-light">
          Our Curated Menu of Exquisite Flavors
        </p>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#f2ca50]/50 to-transparent mx-auto mt-6" />
      </section>

      {/* Category Navigation */}
      <section className="flex justify-center mb-16 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex flex-nowrap gap-2 md:gap-3 bg-[#1f2020]/40 p-2 rounded-full border border-[#f2ca50]/10 backdrop-blur-xl shadow-lg shrink-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full border transition-all duration-300 font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] cursor-pointer ${
                  isActive
                    ? 'bg-[#f2ca50]/20 text-[#f2ca50] border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.15)]'
                    : 'border-transparent text-[#e4e2e1] hover:text-[#f2ca50] hover:bg-[#353535]/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map((item, index) => {
          const isHovered = hoveredCardId === item.id;
          const currentStyle = tiltStyle[item.id] || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';

          return (
            <div
              key={item.id}
              className="group cursor-pointer rounded-xl overflow-hidden border border-[#f2ca50]/10 hover:border-[#f2ca50]/40 bg-[#1f2020]/25 backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl h-[420px]"
              style={{ 
                transform: currentStyle,
                transition: isHovered ? 'none' : 'transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                boxShadow: isHovered ? '0 15px 35px rgba(242, 202, 80, 0.12)' : 'none'
              }}
              onMouseMove={(e) => {
                setHoveredCardId(item.id);
                handleMouseMove(e, item.id);
              }}
              onMouseLeave={() => handleMouseLeave(item.id)}
            >
              {/* Card Image Area */}
              <div className="relative h-56 overflow-hidden bg-[#2a2a2a]/30 p-3">
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/90 to-transparent z-10" />
                
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-[#2a2a2a] flex flex-col gap-3 items-center justify-center text-[#f2ca50]/50">
                    {getCategoryIcon(item.category)}
                    <span className="font-sans text-[10px] tracking-[0.1em] uppercase">Signature</span>
                  </div>
                )}

                {/* Category small floating tag */}
                <div className="absolute top-5 right-5 z-20 bg-[#131313]/90 border border-[#f2ca50]/30 px-3 py-1 rounded-sm flex items-center gap-1.5 font-sans text-[8px] font-bold uppercase tracking-[0.15em] text-[#f2ca50]">
                  {getCategoryIcon(item.category)}
                  {item.category.replace('-', ' ')}
                </div>
              </div>

              {/* Card Description / Info */}
              <div className="p-6 flex-grow flex flex-col justify-between -mt-6 relative z-20">
                <div>
                  <h3 className="font-serif text-xl text-[#e4e2e1] group-hover:text-[#f2ca50] transition-colors duration-300 font-medium mb-2 tracking-wide leading-snug">
                    {item.name}
                  </h3>
                  <p className="font-sans text-xs text-[#99907c] line-clamp-3 leading-relaxed font-light mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-[#f2ca50]/10 pt-4">
                  <span className="font-serif text-lg text-[#f2ca50] font-medium tracking-wide">
                    ₹{item.price}
                  </span>
                  
                  {item.isFeatured && (
                    <span className="font-sans text-[8px] font-bold tracking-[0.2em] bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] px-2 py-0.5 rounded-sm uppercase">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
