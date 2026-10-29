import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PetFoodProduct, 
  CartItem, 
  Veterinarian, 
  ScheduledAppointment, 
  Order, 
  PetProfile 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  VETERINARIANS, 
  INITIAL_PET, 
  INITIAL_SECONDARY_PET 
} from '../data/mockData';

interface RealtimeContextType {
  products: PetFoodProduct[];
  cart: CartItem[];
  addToCart: (product: PetFoodProduct, selectedSize: string, isSubscription?: boolean) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  reservationSecondsLeft: number;
  
  // Vets & Appointments
  veterinarians: Veterinarian[];
  appointments: ScheduledAppointment[];
  activeAppointment: ScheduledAppointment | null;
  setActiveAppointment: (appt: ScheduledAppointment | null) => void;
  bookAppointment: (
    vetId: string, 
    petId: string, 
    type: 'telehealth' | 'in_clinic', 
    date: string, 
    time: string, 
    reason: string, 
    notes: string
  ) => ScheduledAppointment;
  cancelAppointment: (appointmentId: string) => void;
  
  // Orders & Real-time tracking
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (
    shippingAddress: string, 
    customerName: string, 
    customerEmail: string, 
    petNotes: string
  ) => Order;
  
  // Pets
  activePet: PetProfile;
  pets: PetProfile[];
  setActivePet: (pet: PetProfile) => void;
  addNewPet: (pet: Omit<PetProfile, 'id'>) => void;
  
  // Live Notifications
  recentTicker: { message: string; timestamp: string } | null;
  
  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isConsultRoomOpen: boolean;
  setIsConsultRoomOpen: (open: boolean) => void;
  selectedProductForDetail: PetFoodProduct | null;
  setSelectedProductForDetail: (product: PetFoodProduct | null) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<PetFoodProduct[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initial cart with a trial organic salmon item
    return [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: '3.5 lb Bag',
        unitPrice: 1499,
        quantity: 1,
        isSubscription: false,
      }
    ];
  });

  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>(VETERINARIANS);
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>(() => {
    // Initial pre-scheduled consultation so user can immediately test live veterinary room!
    return [
      {
        id: 'appt-demo-1',
        vetId: 'vet-1',
        vetName: 'Dr. Elena Vance, DVM, DACVN',
        vetCredentials: 'Board Certified Veterinary Clinical Nutritionist',
        petId: 'pet-1',
        petName: 'Barnaby',
        species: 'dog',
        type: 'telehealth',
        date: 'Today',
        time: 'Immediate / Ready Now',
        reason: 'Organic elimination diet audit & coat sensitivity',
        notes: 'Barnaby has mild seasonal itching; reviewing pasture-raised beef vs wild salmon transition.',
        fee: 650,
        status: 'live_now',
        createdAt: new Date().toISOString(),
      }
    ];
  });

  const [activeAppointment, setActiveAppointment] = useState<ScheduledAppointment | null>(appointments[0]);
  const [isConsultRoomOpen, setIsConsultRoomOpen] = useState<boolean>(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [pets, setPets] = useState<PetProfile[]>([INITIAL_PET, INITIAL_SECONDARY_PET]);
  const [activePet, setActivePet] = useState<PetProfile>(INITIAL_PET);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<PetFoodProduct | null>(null);

  // Cart reservation countdown (10 mins)
  const [reservationSecondsLeft, setReservationSecondsLeft] = useState<number>(600);

  // Real-time live order events ticker
  const [recentTicker, setRecentTicker] = useState<{ message: string; timestamp: string } | null>({
    message: 'Dr. Elena Vance just prescribed Wild Salmon Feast for Milo in Seattle',
    timestamp: 'Just now'
  });

  // Timer loop for cart hold and simulated veterinary availability
  useEffect(() => {
    const timer = setInterval(() => {
      setReservationSecondsLeft(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic real-time updates for clinic queue and customer orders
  useEffect(() => {
    const tickerItems = [
      'Marcus L. in Denver ordered 2x Grass-Fed Beef & Organs for Luna',
      'Dr. Elena Vance has opened 1 new emergency telehealth slot for today',
      'Maya K. in Austin set up auto-delivery of Artisan Bone Broth for Winston',
      'Dr. Marcus Thorne finished a canine orthopedic mobility consult',
      'Organic Cold-Chain Batch #842 shipped from Montana Kitchens'
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % tickerItems.length;
      setRecentTicker({
        message: tickerItems[index],
        timestamp: 'Just now'
      });
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  // Periodic simulated progression of active orders
  useEffect(() => {
    if (!activeOrder) return;
    const orderInterval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(ord => {
          if (ord.id === activeOrder.id) {
            let nextStatus = ord.status;
            if (ord.status === 'confirmed') nextStatus = 'cold_packing';
            else if (ord.status === 'cold_packing') nextStatus = 'out_for_delivery';
            
            const updated = { ...ord, status: nextStatus };
            setActiveOrder(updated);
            return updated;
          }
          return ord;
        })
      );
    }, 25000);

    return () => clearInterval(orderInterval);
  }, [activeOrder]);

  const addToCart = (product: PetFoodProduct, selectedSize: string, isSubscription: boolean = false) => {
    const option = product.weightOptions.find(o => o.size === selectedSize) || product.weightOptions[0];
    const basePrice = product.price * option.priceMultiplier;
    const unitPrice = isSubscription ? Number((basePrice * 0.9).toFixed(2)) : Number(basePrice.toFixed(2));

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedSize === selectedSize && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        product,
        selectedSize: option.size,
        unitPrice,
        quantity: 1,
        isSubscription,
        subscriptionFrequencyWeeks: isSubscription ? 4 : undefined
      }];
    });

    setIsCartOpen(true);
    setReservationSecondsLeft(600); // reset hold timer
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (productId: string, selectedSize: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = Number(
    cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const bookAppointment = (
    vetId: string, 
    petId: string, 
    type: 'telehealth' | 'in_clinic', 
    date: string, 
    time: string, 
    reason: string, 
    notes: string
  ): ScheduledAppointment => {
    const vet = veterinarians.find(v => v.id === vetId) || veterinarians[0];
    const pet = pets.find(p => p.id === petId) || activePet;
    const fee = type === 'telehealth' ? vet.telehealthFee : vet.inClinicFee;

    const newAppt: ScheduledAppointment = {
      id: `appt-${Date.now()}`,
      vetId: vet.id,
      vetName: vet.name,
      vetCredentials: vet.credentials,
      petId: pet.id,
      petName: pet.name,
      species: pet.species,
      type,
      date,
      time,
      reason,
      notes,
      fee,
      status: date.toLowerCase().includes('today') || time.toLowerCase().includes('now') ? 'live_now' : 'upcoming',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppt, ...prev]);
    setActiveAppointment(newAppt);
    return newAppt;
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    if (activeAppointment?.id === appointmentId) {
      setActiveAppointment(null);
    }
  };

  const placeOrder = (
    shippingAddress: string, 
    customerName: string, 
    customerEmail: string, 
    petNotes: string
  ): Order => {
    const shipping = cartSubtotal >= 999 ? 0 : 99;
    const discount = 0;
    const total = Number((cartSubtotal + shipping - discount).toFixed(2));

    const newOrder: Order = {
      id: `PC-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal: cartSubtotal,
      discount,
      shipping,
      total,
      customerName,
      customerEmail,
      shippingAddress,
      petNotes,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trackingNumber: `1Z-PETCART-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'confirmed',
      estimatedDelivery: 'Tomorrow, Cold-Insulated Express (Before 2:00 PM)'
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    return newOrder;
  };

  const addNewPet = (petData: Omit<PetProfile, 'id'>) => {
    const newPet: PetProfile = {
      ...petData,
      id: `pet-${Date.now()}`
    };
    setPets(prev => [...prev, newPet]);
    setActivePet(newPet);
  };

  return (
    <RealtimeContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        reservationSecondsLeft,
        veterinarians,
        appointments,
        activeAppointment,
        setActiveAppointment,
        bookAppointment,
        cancelAppointment,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        activePet,
        pets,
        setActivePet,
        addNewPet,
        recentTicker,
        isCartOpen,
        setIsCartOpen,
        isConsultRoomOpen,
        setIsConsultRoomOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
