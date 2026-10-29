import React from 'react';
import { PawPrint, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#163324] text-emerald-400">
                <PawPrint className="w-4 h-4" />
              </span>
              <span className="font-serif">PetCart</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Certified organic nutrition sourced directly from regenerative family ranches and paired with licensed veterinary care to help companion animals thrive.
            </p>
            <div className="text-[11px] text-stone-500 space-y-0.5">
              <div>USDA Organic Facility #892</div>
              <div>FDA Human-Grade Certified Kitchens</div>
            </div>
          </div>

          {/* Organic Foods */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Organic Formulas
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#organic-food" className="hover:text-white transition-colors">Freeze-Dried Raw Beef</a></li>
              <li><a href="#organic-food" className="hover:text-white transition-colors">Wild-Caught Alaskan Salmon</a></li>
              <li><a href="#organic-food" className="hover:text-white transition-colors">Free-Range Chicken Stew</a></li>
              <li><a href="#organic-food" className="hover:text-white transition-colors">Artisan Bone Broth & Collagen</a></li>
              <li><a href="#organic-food" className="hover:text-white transition-colors">High-Plains Raw Bison</a></li>
            </ul>
          </div>

          {/* Veterinary Practice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Veterinary Telehealth
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#veterinary-care" className="hover:text-white transition-colors">Immediate Telehealth Video</a></li>
              <li><a href="#veterinary-care" className="hover:text-white transition-colors">In-Clinic Physical Examinations</a></li>
              <li><a href="#veterinary-care" className="hover:text-white transition-colors">Elimination Diet Protocols</a></li>
              <li><a href="#diet-calculator" className="hover:text-white transition-colors">Caloric Algorithm (MER)</a></li>
              <li><a href="#telehealth-suite" className="hover:text-white transition-colors">Digital Prescription Records</a></li>
            </ul>
          </div>

          {/* Urgent Support & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Clinical Support
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              For active patients requiring urgent guidance or cold-package tracking inquiries:
            </p>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1">
              <span className="text-stone-400 text-[10px] block">Veterinary Triage Line:</span>
              <span className="font-mono text-emerald-400 font-bold">1-800-PET-CART (738-2278)</span>
              <span className="text-[10px] text-stone-500 block">Mon–Sun 7am–10pm PST</span>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="max-w-xl text-[11px] leading-relaxed">
            *PetCart organic recipes are formulated to meet or exceed nutritional levels established by the AAFCO Dog & Cat Food Nutrient Profiles for All Life Stages. Telehealth services are provided by state-licensed veterinarians.
          </div>
          <div className="text-right shrink-0">
            © 2026 PetCart Whole Animal Health, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
