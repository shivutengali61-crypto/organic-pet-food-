import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Clock, ShieldCheck, ArrowRight, Tag } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    reservationSecondsLeft 
  } = useRealtime();

  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  if (!isCartOpen) return null;

  const minutes = Math.floor(reservationSecondsLeft / 60);
  const seconds = reservationSecondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const freeShippingThreshold = 999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingProgressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const shippingCost = finalSubtotal >= freeShippingThreshold || finalSubtotal === 0 ? 0 : 99;
  const orderTotal = Math.round(finalSubtotal + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'ORGANICPET') {
      setAppliedPromo({ code: clean, discount: 250 });
      setPromoError('');
    } else if (clean === 'VETCARE') {
      setAppliedPromo({ code: clean, discount: Math.round(cartSubtotal * 0.15) });
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "ORGANICPET" (₹250 off) or "VETCARE" (15% off).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-bold text-stone-900">Your Fresh PetCart</h2>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Inventory Reservation Countdown */}
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 animate-spin" />
              <span>Items reserved in small kitchen batch for:</span>
            </div>
            <span className="font-mono tabular-nums font-bold text-amber-950">{timeFormatted}</span>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs">
            {amountToFreeShipping > 0 ? (
              <div className="flex items-center justify-between text-stone-600 mb-1.5">
                <span>Add <strong className="text-emerald-800 font-mono">₹{Math.round(amountToFreeShipping).toLocaleString('en-IN')}</strong> for Free Cold-Chain Delivery</span>
              </div>
            ) : (
              <div className="text-emerald-800 font-semibold mb-1.5 flex items-center gap-1">
                <span>🎉 You unlocked Free Express Cold-Chain Delivery!</span>
              </div>
            )}
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${shippingProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-stone-900">Your PetCart is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Explore our farm-fresh certified organic meals, freeze-dried raw formulas, and bone broths.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-colors"
                >
                  Browse Organic Foods
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Item Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-xs text-stone-900 leading-snug">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500">
                      Format: <span className="font-medium text-stone-700">{item.selectedSize}</span>
                      {item.isSubscription && (
                        <span className="text-emerald-700 font-medium ml-1.5">(Auto-deliver 4 wks)</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-950"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-950"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                        ₹{Math.round(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Module */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. ORGANICPET)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-rose-600">{promoError}</p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span>Promo {appliedPromo.code} Applied</span>
                  <span className="font-mono">-₹{appliedPromo.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums font-medium text-stone-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount:</span>
                    <span className="font-mono tabular-nums">-₹{appliedPromo.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Cold-Chain Express Shipping:</span>
                  <span className="font-mono tabular-nums font-medium text-stone-900">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${shippingCost.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total:</span>
                  <span className="font-mono tabular-nums text-base">₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Express Checkout</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>100% Guaranteed Freshness & Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
