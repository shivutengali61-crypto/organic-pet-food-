import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import confetti from 'canvas-confetti';
import { X, Truck, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, cartSubtotal, placeOrder, activePet } = useRealtime();

  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState<string>('Sarah Sharma');
  const [customerEmail, setCustomerEmail] = useState<string>('sarah.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98450 12345');
  const [shippingAddress, setShippingAddress] = useState<string>('Flat 402, Green Glen Heights');
  const [cityStateZip, setCityStateZip] = useState<string>('Bengaluru, Karnataka 560103');
  const [petNotes, setPetNotes] = useState<string>(`Cold-insulated packaging for ${activePet ? activePet.name : 'my pet'}. Ring bell on arrival.`);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const shippingCost = cartSubtotal >= 999 ? 0 : 99;
  const orderTotal = Math.round(cartSubtotal + shippingCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const fullAddress = `${shippingAddress}, ${cityStateZip}`;
      placeOrder(fullAddress, customerName, customerEmail, petNotes);

      // Confetti celebration
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      setIsSubmitting(false);
      onClose();
      onOrderSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Cold-Chain Organic Delivery
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Checkout & Delivery Details
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Orders are packaged with biodegradable insulated liners and eco-gel ice packs to ensure 100% fresh delivery.
            </p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800">Recipient Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800">Email Address (for real-time tracking)</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-800">Delivery Street Address</label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800">City, State & Postal Code</label>
              <input
                type="text"
                required
                value={cityStateZip}
                onChange={(e) => setCityStateZip(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800">Contact Phone (for driver delivery SMS)</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-800">Cold-Drop Instructions</label>
              <input
                type="text"
                value={petNotes}
                onChange={(e) => setPetNotes(e.target.value)}
                placeholder="e.g. Leave in shaded porch by the front planter..."
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">Payment Authorization</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-emerald-700 bg-emerald-50/50 text-stone-900 font-semibold'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>Credit / Debit Card</span>
                <span className="text-[11px] font-mono text-stone-500">•••• 4242</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                  paymentMethod === 'apple_pay'
                    ? 'border-emerald-700 bg-emerald-50/50 text-stone-900 font-semibold'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>Apple Pay / Instant GPay</span>
                <span className="text-[11px] font-mono text-emerald-800">1-Touch</span>
              </button>
            </div>
          </div>

          {/* Order Summary Line */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
              <span className="font-mono tabular-nums text-stone-900 font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Cold-Chain Express Shipping:</span>
              <span className="font-mono tabular-nums text-stone-900">
                {shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Final Total Charged:</span>
              <span className="font-mono tabular-nums text-base">₹{orderTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>256-Bit SSL Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-xs font-bold text-white bg-[#163324] hover:bg-[#1f4531] disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Packing Order...</span>
              ) : (
                <>
                  <span>Place Order & Track Live</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
