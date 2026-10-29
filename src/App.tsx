import React, { useState } from 'react';
import { RealtimeProvider, useRealtime } from './context/RealtimeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { VeterinaryCareSection } from './components/VeterinaryCareSection';
import { DietCalculatorSection } from './components/DietCalculatorSection';
import { FarmTraceabilitySection } from './components/FarmTraceabilitySection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { LiveConsultationRoom } from './components/LiveConsultationRoom';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PetProfileModal } from './components/PetProfileModal';
import { Footer } from './components/Footer';
import { Bell, Sparkles } from 'lucide-react';

function PetCartApp() {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail,
    recentTicker,
    orders
  } = useRealtime();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedVetId, setPreselectedVetId] = useState<string | undefined>(undefined);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);

  const handleOpenBooking = (vetId?: string) => {
    setPreselectedVetId(vetId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Navbar with 3-zone contract */}
      <Navbar 
        onOpenPetModal={() => setIsPetModalOpen(true)}
        onOpenBookingModal={() => handleOpenBooking()}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection onOpenBookingModal={() => handleOpenBooking()} />
        <ProductCatalog onSelectProduct={(prod) => setSelectedProductForDetail(prod)} />
        <VeterinaryCareSection onBookVet={handleOpenBooking} />
        <DietCalculatorSection />
        <FarmTraceabilitySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Real-Time Live Activity Notification */}
      {recentTicker && (
        <div className="fixed bottom-6 left-6 z-30 max-w-sm hidden sm:block animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-stone-200/90 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-stone-900">Real-Time Community Feed</div>
              <p className="text-stone-600 mt-0.5 line-clamp-2">{recentTicker.message}</p>
              <span className="text-[10px] text-stone-400 mt-1 block font-mono">{recentTicker.timestamp}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Order Tracker Quick Button (if user has orders) */}
      {orders.length > 0 && (
        <button
          onClick={() => setIsOrderTrackerOpen(true)}
          className="fixed bottom-6 right-6 z-30 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2 border border-stone-700 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Track Order #{orders[0].id}</span>
        </button>
      )}

      {/* Interactive Modals and Slide-Over Views */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />

      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedVetId={preselectedVetId}
      />

      <LiveConsultationRoom />

      <CartDrawer 
        onOpenCheckout={() => setIsCheckoutOpen(true)} 
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => setIsOrderTrackerOpen(true)}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      <PetProfileModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RealtimeProvider>
      <PetCartApp />
    </RealtimeProvider>
  );
}
