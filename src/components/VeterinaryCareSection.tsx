import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { Veterinarian, ScheduledAppointment } from '../types';
import { Video, Calendar, Clock, MapPin, Award, CheckCircle2, ChevronRight, AlertCircle, PhoneCall } from 'lucide-react';

interface VeterinaryCareSectionProps {
  onBookVet: (vetId?: string) => void;
}

export const VeterinaryCareSection: React.FC<VeterinaryCareSectionProps> = ({ onBookVet }) => {
  const { 
    veterinarians, 
    appointments, 
    activeAppointment, 
    setIsConsultRoomOpen, 
    cancelAppointment 
  } = useRealtime();

  const [consultTypeFilter, setConsultTypeFilter] = useState<'all' | 'telehealth' | 'in_clinic'>('all');

  return (
    <section id="veterinary-care" className="py-16 bg-stone-100/70 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Integrative Medical & Telehealth Practice
            </div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight mt-1">
              Scheduled Veterinary Appointments
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Connect directly with board-certified clinical nutritionists and companion animal physicians. Book on-demand real-time video consults or reserve in-clinic health exams.
            </p>
          </div>

          <button
            onClick={() => onBookVet()}
            className="self-start md:self-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Real-Time Ongoing / Upcoming Appointments Banner (if any) */}
        {appointments.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-sm">Your Scheduled Appointments</span>
                <span className="text-xs text-stone-500 font-mono">({appointments.length})</span>
              </div>
              <span className="text-xs text-emerald-700 font-medium">Real-Time Sync Active</span>
            </div>

            <div className="divide-y divide-stone-100">
              {appointments.map((appt) => (
                <div key={appt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 text-sm">{appt.vetName}</span>
                      <span className="text-xs text-stone-500 font-mono">{appt.date} · {appt.time}</span>
                      {appt.status === 'live_now' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Ready to Join Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-600">
                      Patient: <strong className="text-stone-800">{appt.petName}</strong> ({appt.species}) · Type: {appt.type === 'telehealth' ? 'Live Telehealth Video' : 'In-Clinic Physical Visit'}
                    </div>
                    <div className="text-xs text-stone-500 italic">
                      "{appt.reason}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {appt.type === 'telehealth' && (
                      <button
                        onClick={() => setIsConsultRoomOpen(true)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch Live Consultation</span>
                      </button>
                    )}
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      className="px-3 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Veterinarians Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-stone-900">
              Meet Our Board-Certified Clinicians
            </h3>
            <span className="text-xs text-stone-500">
              {veterinarians.filter(v => v.isOnlineNow).length} Clinicians Online Now
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {veterinarians.map((vet) => (
              <div 
                key={vet.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Doctor Profile Header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-inner ${vet.avatarBg}`}>
                      {vet.name.split(' ')[1]?.[0] || 'D'}{vet.name.split(' ')[2]?.[0] || 'V'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-stone-900 leading-snug">{vet.name}</h4>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">{vet.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                        <span>★ {vet.rating}</span>
                        <span>·</span>
                        <span>{vet.reviewsCount} Consults</span>
                        <span>·</span>
                        <span>{vet.experienceYears}y Exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Availability status */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Live Status:</span>
                      <span className={`font-medium ${vet.isOnlineNow ? 'text-emerald-700' : 'text-stone-600'}`}>
                        {vet.isOnlineNow ? '● Online & Accepting Visits' : '○ Off-Duty (Accepting Advance)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="text-stone-500">Next Slot:</span>
                      <span className="font-semibold text-stone-900 font-mono">{vet.nextSlotToday}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Clinical Focus:
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs text-stone-700">
                      {vet.specializations.map((spec, i) => (
                        <span key={spec} className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio brief */}
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {vet.bio}
                  </p>
                </div>

                {/* Fees and Booking Action */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Telehealth Video Consult:</span>
                    <strong className="text-stone-900 font-mono text-sm">₹{vet.telehealthFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">In-Clinic Comprehensive:</span>
                    <span className="text-stone-700 font-mono text-xs">₹{vet.inClinicFee.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={() => onBookVet(vet.id)}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Schedule Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telehealth Features Bar */}
        <div id="telehealth-suite" className="bg-[#163324] text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Encrypted HD Video Telehealth</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Connect directly on your phone or laptop. Show visible skin lesions, mobility gait, or current food labels to the vet in real time.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Digital Rx & Custom Diet Prescription</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Following each consultation, receive an official veterinary summary and personalized certified organic meal roadmap directly in your PetCart profile.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Under 15-Minute Response</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Need urgent guidance on ingested foreign objects or gastrointestinal flare-ups? Our on-call clinicians provide immediate triage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
