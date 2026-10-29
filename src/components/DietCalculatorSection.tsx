import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { PetFoodProduct, Species } from '../types';
import { Scale, Flame, Utensils, CheckCircle, ArrowRight } from 'lucide-react';

export const DietCalculatorSection: React.FC = () => {
  const { products, addToCart, activePet } = useRealtime();

  const [petSpecies, setPetSpecies] = useState<Species>(activePet?.species || 'dog');
  const [weightLbs, setWeightLbs] = useState<number>(activePet?.weightLbs || 50);
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high' | 'working'>('moderate');
  const [dietGoal, setDietGoal] = useState<'maintenance' | 'weight_loss' | 'joint_support' | 'allergy_relief'>('maintenance');

  // Daily calorie computation using veterinary MER (Maintenance Energy Requirement) formula
  const weightKg = weightLbs * 0.453592;
  const rer = 70 * Math.pow(weightKg, 0.75); // Resting Energy Requirement
  
  let activityMultiplier = 1.6;
  if (petSpecies === 'cat') {
    activityMultiplier = activityLevel === 'low' ? 1.0 : activityLevel === 'high' ? 1.4 : 1.2;
  } else {
    if (activityLevel === 'low') activityMultiplier = 1.2;
    if (activityLevel === 'moderate') activityMultiplier = 1.6;
    if (activityLevel === 'high') activityMultiplier = 2.0;
    if (activityLevel === 'working') activityMultiplier = 2.8;
  }

  let goalMultiplier = 1.0;
  if (dietGoal === 'weight_loss') goalMultiplier = 0.85;
  if (dietGoal === 'joint_support') goalMultiplier = 1.05;

  const targetCaloriesDaily = Math.round(rer * activityMultiplier * goalMultiplier);
  const dailyGramsFood = Math.round((targetCaloriesDaily / 450) * 100);
  const mealsPerDay = petSpecies === 'dog' ? 2 : 3;
  const perMealGrams = Math.round(dailyGramsFood / mealsPerDay);

  // Match optimal product
  const recommendedProduct: PetFoodProduct = 
    petSpecies === 'cat' 
      ? products.find(p => p.category === 'sensitive-digestion' || p.species === 'cat') || products[3]
      : dietGoal === 'allergy_relief'
        ? products.find(p => p.id === 'prod-6') || products[1]
        : products.find(p => p.id === 'prod-2') || products[0];

  return (
    <section id="diet-calculator" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="bg-[#163324] text-white rounded-3xl p-8 lg:p-12 shadow-xl border border-emerald-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Form: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Veterinary Caloric Algorithm
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Calculate {activePet ? activePet.name + "'s" : "Your Pet's"} Daily Organic Feeding Plan
              </h2>
              <p className="text-sm text-emerald-100/80 mt-1">
                Every pet has a unique metabolic signature. Configure your companion's metrics below for a scientifically balanced raw or cooked portion guide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Species Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-emerald-200">Companion Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPetSpecies('dog')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                      petSpecies === 'dog'
                        ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                        : 'bg-emerald-900/60 text-white border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    Canine (Dog)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPetSpecies('cat')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                      petSpecies === 'cat'
                        ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                        : 'bg-emerald-900/60 text-white border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    Feline (Cat)
                  </button>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-200">Current Body Weight</span>
                  <span className="font-mono tabular-nums font-bold text-white text-sm">{weightLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min={petSpecies === 'cat' ? 4 : 5}
                  max={petSpecies === 'cat' ? 25 : 150}
                  step={1}
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-emerald-950 rounded-lg"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-emerald-200">Daily Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                  className="w-full bg-emerald-950/80 border border-emerald-800 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="low">Sedentary / Senior / Couch Cuddler</option>
                  <option value="moderate">Moderate (1-2 walks daily, playful)</option>
                  <option value="high">High Energy (Running, Agility, Hiking)</option>
                  <option value="working">Working Dog / High Performance</option>
                </select>
              </div>

              {/* Nutrition Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-emerald-200">Wellness Goal</label>
                <select
                  value={dietGoal}
                  onChange={(e) => setDietGoal(e.target.value as any)}
                  className="w-full bg-emerald-950/80 border border-emerald-800 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="maintenance">Optimum Longevity & Vitality</option>
                  <option value="weight_loss">Gentle Calorie & Weight Management</option>
                  <option value="joint_support">Joint Mobility & Hip Health</option>
                  <option value="allergy_relief">Sensitive Digestion & Skin Soothe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Computed Portion Card & Recommendation */}
          <div className="lg:col-span-5 bg-stone-900/90 rounded-2xl p-6 border border-emerald-800/60 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Tailored Daily Prescription
              </span>
              <span className="text-[11px] font-mono text-stone-400">MER Calculation</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Daily Caloric Need</span>
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">
                  {targetCaloriesDaily} <span className="text-xs font-normal text-stone-400">kcal/day</span>
                </div>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <span>Portion Per Meal</span>
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">
                  {perMealGrams} <span className="text-xs font-normal text-stone-400">g ({mealsPerDay}x daily)</span>
                </div>
              </div>
            </div>

            {/* Matched Product Proposal */}
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/40 space-y-3">
              <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Optimal Matched Recipe:</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{recommendedProduct.name}</h4>
                <p className="text-xs text-emerald-100/70 mt-0.5 line-clamp-1">{recommendedProduct.subtitle}</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono tabular-nums text-emerald-300 text-base font-bold">
                  ₹{recommendedProduct.price.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => addToCart(recommendedProduct, recommendedProduct.weightOptions[0].size)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Add To Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
