import React from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { ShieldCheck, Video, Sparkles, ArrowRight, CheckCircle2, Clock, Truck, Award } from 'lucide-react';

interface HeroSectionProps {
  onOpenBookingModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBookingModal }) => {
  const { veterinarians, setIsConsultRoomOpen, activeAppointment } = useRealtime();
  const onlineVets = veterinarians.filter(v => v.isOnlineNow);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F5] via-white to-[#FAF9F5] pt-10 pb-16 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Storytelling & Direct Conversion */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed category kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-800">
              <span>Pasture-Raised Organic Nutrition</span>
              <span aria-hidden="true">·</span>
              <span>On-Demand Telehealth</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] max-w-2xl text-balance">
              Fresh organic food for pets. Real-time veterinary care when they need it.
            </h1>

            <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
              Order human-grade, USDA Certified Organic meals prepared in small kitchen batches, and connect with board-certified veterinarians via live video consultation in under 15 minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#organic-food"
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Shop Organic Formulas</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenBookingModal}
                className="px-6 py-3.5 text-sm font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-emerald-800" />
                <span>Schedule Vet Consult</span>
              </button>

              {activeAppointment && activeAppointment.status === 'live_now' && (
                <button
                  onClick={() => setIsConsultRoomOpen(true)}
                  className="px-4 py-3 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all flex items-center gap-1.5 animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Enter Ongoing Consultation</span>
                </button>
              )}
            </div>

            {/* Trust Markers without pills */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-stone-500 border-t border-stone-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% USDA Certified Organic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Licensed DVM & Nutritionists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Rendered Meals or Fillers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card showcasing Meal + Live Vet Availability */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-stone-900 text-white p-6 shadow-2xl border border-stone-800 overflow-hidden">
              {/* Subtle visual glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Meal Spotlight Card */}
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                      Featured Kitchen Batch #240
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Freeze-Dried Raw Pacific Sockeye & Elk
                    </h3>
                  </div>
                  <span className="text-xl font-mono tabular-nums text-white font-bold">₹1,499</span>
                </div>

                {/* Fresh ingredients visual composition */}
                <div className="bg-stone-950/80 rounded-xl p-4 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Clinical Bio-Availability</span>
                    <span className="text-emerald-400 font-mono">98.4% Digestible</span>
                  </div>

                  {/* Ingredient breakdown bar */}
                  <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[65%]" title="65% Fresh Muscle Meat" />
                    <div className="bg-teal-400 h-full w-[20%]" title="20% Organ & Bone" />
                    <div className="bg-amber-400 h-full w-[15%]" title="15% Organic Greens & Berries" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-stone-300">
                    <div>
                      <span className="block text-stone-400 text-[10px]">Proteins</span>
                      <strong className="text-white">65% Muscle</strong>
                    </div>
                    <div>
                      <span className="block text-stone-400 text-[10px]">Vital Organs</span>
                      <strong className="text-white">20% Organs</strong>
                    </div>
                    <div>
                      <span className="block text-stone-400 text-[10px]">Superfoods</span>
                      <strong className="text-white">15% Greens</strong>
                    </div>
                  </div>
                </div>

                {/* Real-time Vet On-Duty Status Widget */}
                <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-800/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-xs">
                        EV
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-900" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Dr. Elena Vance, DVM</div>
                      <div className="text-[11px] text-emerald-300/80">Online Now · Next Consult: 10 mins</div>
                    </div>
                  </div>

                  <button
                    onClick={onOpenBookingModal}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0"
                  >
                    Quick Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Trust Strip below the Hero Split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Award className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>100% USDA Organic</span>
            </div>
            <p className="text-xs text-stone-500 leading-normal">
              Strictly certified farm ingredients with zero artificial pesticides, synthetics, or grains.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cold-Chain Dispatch</span>
            </div>
            <p className="text-xs text-stone-500 leading-normal">
              Packed in biodegradable insulated coolers to arrive ultra-fresh right at your doorstep.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Video className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Live Vet Telehealth</span>
            </div>
            <p className="text-xs text-stone-500 leading-normal">
              Licensed veterinary clinicians available same-day for diets, allergies, and wellness checkups.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Tailored Portions</span>
            </div>
            <p className="text-xs text-stone-500 leading-normal">
              Custom daily caloric algorithms matched directly to your pet's breed, age, and weight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
