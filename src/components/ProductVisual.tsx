import React from 'react';
import { PetFoodProduct } from '../types';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

interface ProductVisualProps {
  product: PetFoodProduct;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, className = '', size = 'md' }) => {
  const getGradientByIcon = () => {
    switch (product.foodTypeIcon) {
      case 'fish':
        return 'from-sky-950 via-teal-900 to-slate-900';
      case 'meat':
        return 'from-emerald-950 via-stone-900 to-zinc-950';
      case 'poultry':
        return 'from-amber-950 via-stone-900 to-zinc-900';
      case 'bison':
        return 'from-stone-950 via-amber-950 to-neutral-900';
      case 'broth':
        return 'from-amber-900 via-yellow-950 to-stone-900';
      default:
        return 'from-emerald-950 via-stone-900 to-slate-950';
    }
  };

  const getPouchColor = () => {
    switch (product.foodTypeIcon) {
      case 'fish':
        return 'bg-gradient-to-b from-teal-800 to-cyan-950 border-teal-700/50';
      case 'meat':
        return 'bg-gradient-to-b from-emerald-800 to-stone-900 border-emerald-700/50';
      case 'poultry':
        return 'bg-gradient-to-b from-amber-700 to-stone-900 border-amber-600/50';
      case 'bison':
        return 'bg-gradient-to-b from-stone-800 to-amber-950 border-stone-700/50';
      case 'broth':
        return 'bg-gradient-to-b from-amber-600 to-amber-950 border-amber-500/50';
      default:
        return 'bg-gradient-to-b from-emerald-800 to-stone-900 border-emerald-700/50';
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br ${getGradientByIcon()} p-6 select-none ${className}`}
    >
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id={`pattern-${product.id}`} width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="white" />
            <path d="M18 10 C 22 4, 30 6, 26 14 C 22 18, 18 10, 18 10" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-${product.id})`} />
        </svg>
      </div>

      {/* Subtle warm glow behind product */}
      <div 
        className="absolute w-44 h-44 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ backgroundColor: product.accentColor }}
      />

      {/* Pouch / Container Illustration */}
      <div className={`relative z-10 w-44 ${size === 'lg' ? 'w-56' : ''} transition-transform duration-300 group-hover:scale-105`}>
        {/* Top zip-seal tab */}
        <div className="mx-auto w-28 h-2 bg-stone-300/40 rounded-t-sm border border-stone-200/30 flex justify-center items-center gap-1">
          <div className="w-8 h-0.5 bg-stone-400/50 rounded-full" />
        </div>

        {/* Main Pouch Body */}
        <div className={`relative rounded-b-2xl rounded-t-lg p-3.5 shadow-2xl border ${getPouchColor()} text-stone-100 flex flex-col justify-between aspect-[3/4]`}>
          {/* Packaging Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                PETCART ORGANIC
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-stone-300/80">
              {product.isRaw ? 'RAW · FREEZE-DRIED' : 'FARM TO BOWL'}
            </span>
          </div>

          {/* Center Graphic: Botanical & Wholesome Seal */}
          <div className="my-auto text-center py-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2 shadow-inner">
              {product.foodTypeIcon === 'fish' && (
                <svg className="w-7 h-7 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z" />
                  <path d="M18 12v.5" />
                  <path d="M16 17.93a10.97 10.97 0 0 1-5.5-1.93" />
                  <path d="M2 10l4.5 2L2 14" />
                </svg>
              )}
              {product.foodTypeIcon === 'meat' && (
                <svg className="w-7 h-7 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              )}
              {product.foodTypeIcon === 'poultry' && (
                <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="8" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              )}
              {product.foodTypeIcon === 'bison' && (
                <svg className="w-7 h-7 text-stone-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M4 14c0 3 2 6 8 6s8-3 8-6-4-7-8-7-8 4-8 7Z" />
                  <path d="M7 8V4l4 3" />
                  <path d="M17 8V4l-4 3" />
                </svg>
              )}
              {product.foodTypeIcon === 'broth' && (
                <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M4 11h16a1 1 0 0 1 1 1c0 5-3.5 8-9 8s-9-3-9-8a1 1 0 0 1 1-1Z" />
                  <path d="M6 7c1-2 2-2 3 0" />
                  <path d="M11 5c1-2 2-2 3 0" />
                  <path d="M16 7c1-2 2-2 3 0" />
                </svg>
              )}
            </div>

            <div className="font-semibold text-xs tracking-tight text-white line-clamp-2 px-1">
              {product.name}
            </div>
            <div className="text-[10px] text-stone-300/90 mt-0.5">
              100% Certified USDA Organic
            </div>
          </div>

          {/* Bottom Packaging Footer */}
          <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[9px] text-stone-300">
            <span className="font-mono tabular-nums text-white font-medium">
              {product.guaranteedAnalysis.crudeProtein.split(' ')[0]} Protein
            </span>
            <span className="uppercase tracking-wide font-medium text-emerald-300">
              {product.species === 'both' ? 'Dog & Cat' : product.species}
            </span>
          </div>

          {/* Realistic light glare / reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 rounded-b-2xl pointer-events-none" />
        </div>

        {/* Shadow base on surface */}
        <div className="mx-auto mt-2 w-36 h-2 bg-black/40 rounded-full blur-md" />
      </div>

      {/* Top Left Organic Stamp */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-stone-200 text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="tracking-tight font-medium">USDA Organic</span>
      </div>

      {/* Top Right Life Stage / Species */}
      <div className="absolute top-3 right-3 text-right">
        <span className="text-[11px] font-medium tracking-tight text-stone-300/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 capitalize">
          {product.species === 'both' ? 'Dogs & Cats' : product.species === 'dog' ? 'Canine' : 'Feline'}
        </span>
      </div>

      {/* Bottom Certifications Pill-Free Footer */}
      <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[11px] text-stone-400">
        <span className="truncate">Non-GMO Project</span>
        <span>·</span>
        <span className="truncate">Human Grade</span>
        <span>·</span>
        <span className="truncate">Grain-Free</span>
      </div>
    </div>
  );
};
