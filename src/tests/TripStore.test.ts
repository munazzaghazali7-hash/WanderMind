import { describe, it, expect, beforeEach } from 'vitest';
import useTripStore from '../store/TripStore';

describe('TripStore', () => {
  beforeEach(() => {
    // Reset store state if possible, or manually reset
    useTripStore.getState().updateCriteria({
      destination: '',
      budget: 0,
      vibes: [],
    });
  });

  it('should update criteria correctly', () => {
    const { updateCriteria } = useTripStore.getState();
    
    updateCriteria({ destination: 'Paris', budget: 2000 });
    
    const state = useTripStore.getState();
    expect(state.criteria.destination).toBe('Paris');
    expect(state.criteria.budget).toBe(2000);
  });

  it('should toggle setup completion', () => {
    const { setSetupComplete } = useTripStore.getState();
    
    setSetupComplete(true);
    expect(useTripStore.getState().isSetupComplete).toBe(true);
    
    setSetupComplete(false);
    expect(useTripStore.getState().isSetupComplete).toBe(false);
  });
});
