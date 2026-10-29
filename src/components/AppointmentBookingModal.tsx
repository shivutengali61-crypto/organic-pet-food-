import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { Veterinarian } from '../types';
import confetti from 'canvas-confetti';
import { X, Video, Calendar, Clock, Check, User, Sparkles, MapPin, AlertCircle } from 'lucide-react';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedVetId?: string;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedVetId,
}) => {
  const { veterinarians, pets, activePet, bookAppointment, setIsConsultRoomOpen } = useRealtime();

  if (!isOpen) return null;

  const [selectedPetId, setSelectedPetId] = useState<string>(activePet?.id || pets[0]?.id || 'pet-1');
  const [selectedVetId, setSelectedVetId] = useState<string>(preselectedVetId || veterinarians[0].id);
  const [appointmentType, setAppointmentType] = useState<'telehealth' | 'in_clinic'>('telehealth');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTime, setSelectedTime] = useState<string>('Immediate / Next Available Slot');
  const [reason, setReason] = useState<string>('Organic diet transition and skin allergy assessment');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  const selectedVet = veterinarians.find(v => v.id === selectedVetId) || veterinarians[0];
  const selectedPet = pets.find(p => p.id === selectedPetId) || activePet;

  const fee = appointmentType === 'telehealth' ? selectedVet.telehealthFee : selectedVet.inClinicFee;

  const timeSlots = selectedDate === 'Today' 
    ? ['Immediate / Next Available Slot', '11:30 AM', '2:00 PM', '4:15 PM', '6:00 PM']
    : ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM'];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment(
      selectedVet.id,
      selectedPet.id,
      appointmentType,
      selectedDate,
      selectedTime,
      reason,
      clinicalNotes
    );

    // Launch celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsBooked(true);
  };

  const handleLaunchConsult = () => {
    onClose();
    setIsConsultRoomOpen(true);
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

        {isBooked ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-stone-900">
                Veterinary Consultation Confirmed!
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Appointment reserved with <strong className="text-stone-900">{selectedVet.name}</strong> for patient <strong className="text-stone-900">{selectedPet.name}</strong>.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Service:</span>
                <span className="font-semibold text-stone-900 capitalize">{appointmentType === 'telehealth' ? 'Live Telehealth Video' : 'In-Clinic Physical Visit'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-semibold text-stone-900">{selectedDate} · {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Reason:</span>
                <span className="font-medium text-stone-800 truncate max-w-[220px]">{reason}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-mono">
                <span className="text-stone-500">Total Consult Fee:</span>
                <span className="font-bold text-stone-900">₹{fee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {appointmentType === 'telehealth' && (
                <button
                  onClick={handleLaunchConsult}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Enter Live Telehealth Suite Now</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Close & View Schedule
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirm} className="p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Online Veterinary Scheduling
              </div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
                Book a Veterinary Appointment
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Select your patient companion, choose between instant video consult or clinic visit, and lock in your slot.
              </p>
            </div>

            {/* 1. Patient Pet Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 block">
                1. Select Patient Pet:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      selectedPetId === pet.id
                        ? 'border-emerald-700 bg-emerald-50/50'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-stone-900">{pet.name}</div>
                    <div className="text-[11px] text-stone-500 capitalize">{pet.breed} · {pet.weightLbs} lbs</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Consultation Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 block">
                2. Consultation Mode:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAppointmentType('telehealth')}
                  className={`p-3 rounded-xl border text-left transition-colors flex items-start gap-3 ${
                    appointmentType === 'telehealth'
                      ? 'border-emerald-700 bg-emerald-50/50'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <Video className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-stone-900">Live Video Telehealth</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Online encrypted call from anywhere</div>
                    <div className="text-xs font-mono font-bold text-emerald-800 mt-1">From ₹{selectedVet.telehealthFee.toLocaleString('en-IN')}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAppointmentType('in_clinic')}
                  className={`p-3 rounded-xl border text-left transition-colors flex items-start gap-3 ${
                    appointmentType === 'in_clinic'
                      ? 'border-emerald-700 bg-emerald-50/50'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-stone-900">In-Clinic Physical Visit</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Comprehensive hands-on exam</div>
                    <div className="text-xs font-mono font-bold text-emerald-800 mt-1">From ₹{selectedVet.inClinicFee.toLocaleString('en-IN')}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Choose Clinician */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 block">
                3. Choose Veterinary Clinician:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {veterinarians.map((vet) => (
                  <button
                    key={vet.id}
                    type="button"
                    onClick={() => setSelectedVetId(vet.id)}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      selectedVetId === vet.id
                        ? 'border-emerald-700 bg-emerald-50/50'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-stone-900 truncate">{vet.name.split(',')[0]}</div>
                    <div className="text-[10px] text-emerald-800 truncate">{vet.specializations[0]}</div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {vet.isOnlineNow ? 'Online Now' : 'Advance Slots'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">Appointment Day:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Today', 'Tomorrow', 'Thursday'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                        selectedDate === day
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">Available Real-Time Slot:</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Chief Complaint / Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 block">
                Primary Reason for Consultation:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              >
                <option value="Organic diet transition and skin allergy assessment">Organic Diet Transition & Skin Allergy Assessment</option>
                <option value="Raw food safety & whole-food elimination diet">Raw Food Safety & Elimination Protocol</option>
                <option value="Senior pet mobility & joint supplement audit">Senior Pet Mobility & Joint Care</option>
                <option value="Gastrointestinal vomiting / soft stool evaluation">Gastrointestinal / Sensitive Stomach Flare-up</option>
                <option value="Feline hydration & kidney urinary wellness">Feline Hydration & Renal Diet Review</option>
                <option value="General comprehensive wellness consultation">General Comprehensive Wellness Consultation</option>
              </select>
            </div>

            {/* 6. Pre-visit Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 block">
                Pre-Consultation Clinical Notes (optional):
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Mention current brand of kibble, itching patterns, or medication history..."
                rows={2}
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 placeholder:text-stone-400"
              />
            </div>

            {/* Footer Summary & Book Submit */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Due at Booking:</span>
                <span className="text-xl font-bold font-mono tabular-nums text-stone-900">₹{fee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Confirm & Lock Appointment</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
