import React from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { X, PackageCheck, Truck, Clock, CheckCircle2, MapPin, ShieldCheck, Thermometer } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const { activeOrder, orders } = useRealtime();

  if (!isOpen) return null;

  const currentOrder = activeOrder || orders[0];

  if (!currentOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <p className="text-sm text-stone-600">No active orders found.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'confirmed', title: 'Order Confirmed', subtitle: 'Transmitted to Montana Organic Kitchens', done: true },
    { key: 'cold_packing', title: 'Cold-Chain Packing', subtitle: 'Vacuum-sealed with dry-ice biodegradable liners', done: currentOrder.status !== 'confirmed' },
    { key: 'out_for_delivery', title: 'Express Dispatch', subtitle: 'Temperature controlled carrier en route', done: currentOrder.status === 'out_for_delivery' || currentOrder.status === 'delivered' },
    { key: 'delivered', title: 'Arrived at Doorstep', subtitle: 'Insulated cooler safe at room temperature for 14 hrs', done: currentOrder.status === 'delivered' },
  ];

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

        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Fulfillment Tracker</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Order #{currentOrder.id}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-mono">
              <span>Tracking: <strong className="text-stone-800">{currentOrder.trackingNumber}</strong></span>
              <span>·</span>
              <span>Placed at: {currentOrder.createdAt}</span>
            </div>
          </div>

          {/* Real-time Progress Bar */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-emerald-700" />
                <span>Cold-Chain Status: Under 38°F Guaranteed</span>
              </span>
              <span className="text-emerald-800 font-mono font-medium">Estimated: {currentOrder.estimatedDelivery.split(',')[0]}</span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 pt-2">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="relative flex flex-col items-center">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div 
                        className={`w-0.5 h-7 my-1 ${
                          step.done ? 'bg-emerald-600' : 'bg-stone-200'
                        }`} 
                      />
                    )}
                  </div>

                  <div className="pt-0.5 space-y-0.5">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                      <span>{step.title}</span>
                      {step.done && currentOrder.status === step.key && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-mono">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">{step.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address and Special Pet Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Shipping Destination:</span>
              </span>
              <p className="text-stone-900 font-medium">{currentOrder.customerName}</p>
              <p className="text-stone-600">{currentOrder.shippingAddress}</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-700">Special Instructions:</span>
              <p className="text-stone-600 italic">"{currentOrder.petNotes}"</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-2 pt-2 border-t border-stone-200 text-xs">
            <span className="font-semibold text-stone-800">Packed Organic Items:</span>
            <div className="divide-y divide-stone-100">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-stone-900">{item.product.name}</span>
                    <span className="text-stone-500 text-[11px] ml-2 font-mono">({item.selectedSize} × {item.quantity})</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-stone-900">
                    ₹{Math.round(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-sm text-stone-950 pt-2 border-t border-stone-200 font-mono">
              <span>Total Paid:</span>
              <span>₹{Math.round(currentOrder.total).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
