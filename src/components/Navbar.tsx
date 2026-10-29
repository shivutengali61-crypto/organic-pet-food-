import React from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { ShoppingBag, Video, PawPrint, Clock } from 'lucide-react';

interface NavbarProps {
  onOpenPetModal: () => void;
  onOpenBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPetModal, onOpenBookingModal }) => {
  const { 
    cartItemCount, 
    cartSubtotal, 
    setIsCartOpen, 
    activePet, 
    activeAppointment, 
    setIsConsultRoomOpen 
  } = useRealtime();

  return (
    <>
      {/* Top Announcement & Live Ticker Strip */}
      <div className="bg-[#163324] text-emerald-100/90 text-xs py-2 px-4 border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-emerald-300 tracking-wide">FARM-TO-BOWL ASSURANCE</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">USDA Certified Organic · Same-Day Cold Chain Dispatch</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px] text-emerald-200/80">
            {activeAppointment && activeAppointment.status === 'live_now' && (
              <button
                onClick={() => setIsConsultRoomOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-700/60 hover:bg-emerald-600/80 text-white px-2.5 py-0.5 rounded text-xs transition-colors"
              >
                <Video className="w-3 h-3 text-emerald-300" />
                <span>Live Vet Consult Ready ({activeAppointment.vetName.split(',')[0]})</span>
              </button>
            )}
            <span>Orders over ₹999 Ship Free in Compostable Insulated Coolers</span>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a 
            href="#" 
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-90"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#163324] text-white">
              <PawPrint className="w-4 h-4 text-emerald-400" />
            </span>
            <span className="font-serif">PetCart</span>
          </a>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a href="#organic-food" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
              Organic Food
            </a>
            <a href="#veterinary-care" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
              Veterinary Care
            </a>
            <a href="#diet-calculator" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
              Diet Tailoring
            </a>
            <a href="#telehealth-suite" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
              Live Consultations
            </a>
            <a href="#certifications" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
              Farm Traceability
            </a>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Active Pet Pill Button */}
            <button
              onClick={onOpenPetModal}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Switch or edit pet profile"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Pet: <strong className="text-stone-900">{activePet.name}</strong></span>
              <span className="text-stone-400">({activePet.breed.split(' ')[0]})</span>
            </button>

            {/* Book Consult CTA */}
            <button
              onClick={onOpenBookingModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Video className="w-3.5 h-3.5 text-emerald-800" />
              <span>Book Vet Appointment</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#163324] hover:bg-[#1f4531] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="tabular-nums font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              {cartItemCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold bg-amber-500 text-stone-950 rounded-full font-mono tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
