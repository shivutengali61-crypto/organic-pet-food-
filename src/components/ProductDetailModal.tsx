import React, { useState } from 'react';
import { PetFoodProduct } from '../types';
import { useRealtime } from '../context/RealtimeContext';
import { ProductVisual } from './ProductVisual';
import { X, ShieldCheck, Star, Plus, Minus, Check, RefreshCw, Sparkles, Scale, Info } from 'lucide-react';

interface ProductDetailModalProps {
  product: PetFoodProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useRealtime();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.weightOptions[0].size);
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const currentOption = product.weightOptions.find(o => o.size === selectedSize) || product.weightOptions[0];
  const rawPrice = product.price * currentOption.priceMultiplier;
  const unitPrice = isSubscription ? rawPrice * 0.9 : rawPrice;
  const totalPrice = Math.round(unitPrice * quantity).toLocaleString('en-IN');

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, isSubscription);
    }
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Product Visual Showcase */}
        <div className="md:w-5/12 bg-stone-900 flex flex-col justify-between relative overflow-hidden">
          <div className="h-full min-h-[320px] md:min-h-[460px]">
            <ProductVisual product={product} size="lg" className="h-full" />
          </div>
        </div>

        {/* Right Side: Contiguous Purchase Module & Nutrition Specs */}
        <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="uppercase tracking-wider font-semibold text-emerald-800">
                {product.category.replace(/-/g, ' ')}
              </span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1 font-mono text-stone-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {product.name}
            </h2>

            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size / Packaging Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              Packaging Format & Size:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.size}
                  onClick={() => setSelectedSize(opt.size)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-colors ${
                    selectedSize === opt.size
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-semibold truncate">{opt.size}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedSize === opt.size ? 'text-stone-300' : 'text-stone-500'}`}>
                    ₹{Math.round(product.price * opt.priceMultiplier).toLocaleString('en-IN')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Preference: One-time vs Subscribe & Save */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              Purchase Preference:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setIsSubscription(false)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  !isSubscription
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span>One-Time Order</span>
                  <span className="font-mono">₹{Math.round(rawPrice).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">Order once with no commitment</p>
              </div>

              <div
                onClick={() => setIsSubscription(true)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSubscription
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span className="text-emerald-900">Subscribe & Save 10%</span>
                  <span className="font-mono text-emerald-800">₹{Math.round(rawPrice * 0.9).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">Auto-delivered every 4 weeks</p>
              </div>
            </div>
          </div>

          {/* Guaranteed Analysis Nutrition Table */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Guaranteed Clinical Analysis</span>
              <span className="text-[11px] font-mono text-stone-500">{product.caloriesPerCup} kcal/cup</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="block text-[10px] text-stone-400">Protein</span>
                <strong className="text-stone-900 font-mono text-[11px]">{product.guaranteedAnalysis.crudeProtein}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="block text-[10px] text-stone-400">Fat</span>
                <strong className="text-stone-900 font-mono text-[11px]">{product.guaranteedAnalysis.crudeFat}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="block text-[10px] text-stone-400">Fiber</span>
                <strong className="text-stone-900 font-mono text-[11px]">{product.guaranteedAnalysis.crudeFiber}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="block text-[10px] text-stone-400">Moisture</span>
                <strong className="text-stone-900 font-mono text-[11px]">{product.guaranteedAnalysis.moisture}</strong>
              </div>
            </div>
          </div>

          {/* Key Ingredients */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-800">Whole Food Ingredients:</span>
            <p className="text-xs text-stone-600 leading-normal">
              {product.keyIngredients.join(', ')}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-2 text-stone-600 hover:text-stone-950 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-bold font-mono tabular-nums text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-2 text-stone-600 hover:text-stone-950 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#163324] hover:bg-[#1f4531] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to PetCart!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart · ₹{totalPrice}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
