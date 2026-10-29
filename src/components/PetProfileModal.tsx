import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { PetProfile, Species } from '../types';
import { X, PawPrint, Plus, Check, Heart, ShieldAlert, Award } from 'lucide-react';

interface PetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PetProfileModal: React.FC<PetProfileModalProps> = ({ isOpen, onClose }) => {
  const { pets, activePet, setActivePet, addNewPet } = useRealtime();

  if (!isOpen) return null;

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState<string>('');
  const [ageYears, setAgeYears] = useState<number>(2);
  const [weightLbs, setWeightLbs] = useState<number>(30);
  const [allergiesText, setAllergiesText] = useState<string>('Corn, Wheat');
  const [dietaryGoal, setDietaryGoal] = useState<string>('Shiny coat, lean muscle & digestive vitality');

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const allergies = allergiesText.split(',').map(s => s.trim()).filter(Boolean);
    const weightKg = weightLbs * 0.453592;
    const rer = 70 * Math.pow(weightKg, 0.75);
    const dailyCaloricTarget = Math.round(rer * 1.6);

    addNewPet({
      name,
      species,
      breed: breed || (species === 'dog' ? 'Mixed Canine' : 'Domestic Shorthair'),
      ageYears,
      weightLbs,
      allergies,
      dietaryGoal,
      dailyCaloricTarget,
      favoriteProductIds: []
    });

    setIsAddingNew(false);
    setName('');
    setBreed('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8"
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
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Personalized Companion Nutrition
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Pet Profiles & Health Records
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Manage your companions to receive veterinary-calibrated portion sizes and tailored organic recommendations.
            </p>
          </div>

          {!isAddingNew ? (
            <div className="space-y-4">
              {/* Pet list cards */}
              <div className="space-y-3">
                {pets.map((pet) => {
                  const isActive = activePet.id === pet.id;
                  return (
                    <div
                      key={pet.id}
                      onClick={() => setActivePet(pet)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isActive
                          ? 'border-emerald-700 bg-emerald-50/60 shadow-sm'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-200 flex items-center justify-center font-bold text-base">
                          {pet.species === 'dog' ? '🐶' : '🐱'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-stone-900">{pet.name}</h4>
                            {isActive && (
                              <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.2 rounded-full">
                                Active Profile
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">
                            {pet.breed} · {pet.ageYears} yrs · <span className="font-mono">{pet.weightLbs} lbs</span>
                          </p>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Target: <span className="font-mono">{pet.dailyCaloricTarget} kcal/day</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 hover:text-stone-700 font-medium">
                            Select
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Pet Button */}
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Add Another Pet Companion</span>
              </button>
            </div>
          ) : (
            /* Add Pet Form */
            <form onSubmit={handleCreatePet} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-800">Pet Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Copper"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-800">Companion Type</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as Species)}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  >
                    <option value="dog">Canine (Dog)</option>
                    <option value="cat">Feline (Cat)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-800">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Australian Shepherd"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-800">Age (years)</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-800">Weight (lbs)</label>
                  <input
                    type="number"
                    min={2}
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-800">Known Allergies</label>
                  <input
                    type="text"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="e.g. Corn, Chicken"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-800">Dietary & Health Goal</label>
                <input
                  type="text"
                  value={dietaryGoal}
                  onChange={(e) => setDietaryGoal(e.target.value)}
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#163324] hover:bg-[#1f4531] rounded-xl transition-colors"
                >
                  Save Companion Profile
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
