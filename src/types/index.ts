export type Species = 'dog' | 'cat';

export type ProductCategory = 
  | 'all'
  | 'raw-freeze-dried'
  | 'slow-cooked-stew'
  | 'air-dried-kibble'
  | 'bone-broth-topper'
  | 'sensitive-digestion';

export interface PetFoodProduct {
  id: string;
  name: string;
  subtitle: string;
  species: Species | 'both';
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  weightOptions: { size: string; priceMultiplier: number }[];
  rating: number;
  reviewsCount: number;
  description: string;
  isOrganicCertified: boolean;
  isGrainFree: boolean;
  isRaw: boolean;
  caloriesPerCup: number;
  keyIngredients: string[];
  guaranteedAnalysis: {
    crudeProtein: string;
    crudeFat: string;
    crudeFiber: string;
    moisture: string;
  };
  inStock: boolean;
  stockCount: number;
  servingPortionDailyGrams: number;
  badge?: string;
  visualColor: string;
  accentColor: string;
  foodTypeIcon: 'meat' | 'fish' | 'poultry' | 'broth' | 'bison';
}

export interface CartItem {
  product: PetFoodProduct;
  selectedSize: string;
  unitPrice: number;
  quantity: number;
  isSubscription: boolean;
  subscriptionFrequencyWeeks?: number;
}

export interface PetProfile {
  id: string;
  name: string;
  species: Species;
  breed: string;
  ageYears: number;
  weightLbs: number;
  allergies: string[];
  dietaryGoal: string;
  dailyCaloricTarget: number;
  favoriteProductIds: string[];
}

export interface Veterinarian {
  id: string;
  name: string;
  credentials: string;
  title: string;
  clinicName: string;
  specializations: string[];
  rating: number;
  reviewsCount: number;
  telehealthFee: number;
  inClinicFee: number;
  experienceYears: number;
  isOnlineNow: boolean;
  nextSlotToday: string;
  bio: string;
  avatarBg: string;
  education: string;
  clinicAddress: string;
}

export interface ScheduledAppointment {
  id: string;
  vetId: string;
  vetName: string;
  vetCredentials: string;
  petId: string;
  petName: string;
  species: Species;
  type: 'telehealth' | 'in_clinic';
  date: string;
  time: string;
  reason: string;
  notes: string;
  fee: number;
  status: 'upcoming' | 'live_now' | 'completed' | 'cancelled';
  prescriptions?: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  petNotes: string;
  createdAt: string;
  trackingNumber: string;
  status: 'confirmed' | 'cold_packing' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
}
