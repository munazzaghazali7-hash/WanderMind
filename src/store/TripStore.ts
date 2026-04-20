import { create } from 'zustand';

export interface Activity {
  id: string;
  name: string;
  description: string;
  vibeReason: string;
  durationMinutes: number;
  estimatedCost: number;
  type: 'free' | 'paid';
  category: 'Food' | 'Transport' | 'Activities' | 'Accommodation';
  location?: { lat: number; lng: number; address: string; placeId?: string };
  imageUrl?: string;
  rating?: number;
  weatherWarning?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: Date;
  slots: {
    morning?: Activity;
    afternoon?: Activity;
    evening?: Activity;
  };
}

export interface TripCriteria {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number;
  currency: 'INR' | 'USD' | 'EUR';
  groupSize: string;
  vibes: string[];
}

interface TripState {
  criteria: TripCriteria;
  itinerary: DayPlan[];
  isSetupComplete: boolean;
  isLoadingItinerary: boolean;
  updateCriteria: (updates: Partial<TripCriteria>) => void;
  setItinerary: (itinerary: DayPlan[]) => void;
  setSetupComplete: (complete: boolean) => void;
  setLoadingItinerary: (loading: boolean) => void;
  activeTab: 'itinerary' | 'bookings' | 'community';
  setActiveTab: (tab: 'itinerary' | 'bookings' | 'community') => void;
  hoveredActivityId: string | null;
  setHoveredActivityId: (id: string | null) => void;
}

const useTripStore = create<TripState>((set) => ({
  criteria: {
    destination: '',
    startDate: null,
    endDate: null,
    budget: 0,
    currency: 'USD',
    groupSize: 'solo',
    vibes: [],
  },
  itinerary: [],
  isSetupComplete: false,
  isLoadingItinerary: false,
  updateCriteria: (updates) => set((state) => ({ criteria: { ...state.criteria, ...updates } })),
  setItinerary: (itinerary) => set({ itinerary }),
  setSetupComplete: (isSetupComplete) => set({ isSetupComplete }),
  setLoadingItinerary: (isLoadingItinerary) => set({ isLoadingItinerary }),
  activeTab: 'itinerary',
  setActiveTab: (activeTab) => set({ activeTab }),
  hoveredActivityId: null,
  setHoveredActivityId: (id) => set({ hoveredActivityId: id }),
}));

export default useTripStore;
