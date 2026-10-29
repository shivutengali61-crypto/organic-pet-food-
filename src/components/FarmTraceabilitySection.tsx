import React from 'react';
import { ShieldCheck, Leaf, Compass, CheckCircle2, HeartHandshake } from 'lucide-react';

export const FarmTraceabilitySection: React.FC = () => {
  return (
    <section id="certifications" className="py-16 px-6 max-w-7xl mx-auto border-t border-stone-200">
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Regenerative Standards & Traceability
          </div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
            From Certified Organic Ranches to Your Pet's Bowl
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Every batch is traceable back to its farm of origin. We reject factory farming, hormone implants, chemical pesticides, and synthetic fillers.
          </p>
        </div>

        {/* 4-Step Origin Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-stone-900">Pasture-Raised Cattle & Wild Catch</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              100% grass-fed Montana beef and sustainably harvested Alaskan sockeye salmon. Animals raised humanely without subtherapeutic antibiotics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-stone-900">USDA Inspected Kitchens</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prepared in human-food certified commercial kitchens in accordance with strict FDA human-grade safety protocols and zero synthetic binders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-stone-900">Low-Temperature Freeze-Drying</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sub-zero sublimation extracts moisture while locking in fragile live enzymes, amino acids, and essential vitamins without heat degradation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-stone-900">Direct Cold-Chain Fulfillment</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dispatched with insulated biodegradable thermal liners to maintain nutrient integrity straight to your front doorstep.
            </p>
          </div>
        </div>

        {/* Third Party Proof Bar */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-wrap items-center justify-around gap-6 text-stone-700 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>USDA Organic Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <span>Non-GMO Project Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>AAFCO Formulated for All Life Stages</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>1% For The Planet Member</span>
          </div>
        </div>
      </div>
    </section>
  );
};
