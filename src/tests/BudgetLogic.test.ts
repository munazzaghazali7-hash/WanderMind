import { describe, it, expect } from 'vitest';
import { calculateTotalSpent, getBudgetStatus } from '../utils/budgetUtils';
import { DayPlan } from '../store/TripStore';

describe('Budget Logic', () => {
  const mockItinerary: DayPlan[] = [
    {
      dayNumber: 1,
      date: new Date(),
      slots: {
        morning: { id: '1', name: 'A', description: '', vibeReason: '', durationMinutes: 60, estimatedCost: 50, type: 'paid', category: 'Activities' },
        afternoon: { id: '2', name: 'B', description: '', vibeReason: '', durationMinutes: 60, estimatedCost: 100, type: 'paid', category: 'Activities' },
        evening: { id: '3', name: 'C', description: '', vibeReason: '', durationMinutes: 60, estimatedCost: 0, type: 'free', category: 'Activities' },
      }
    }
  ];

  it('should calculate total spent correctly', () => {
    expect(calculateTotalSpent(mockItinerary)).toBe(150);
  });

  it('should return correct status', () => {
    expect(getBudgetStatus(50, 100)).toBe('On Track');
    expect(getBudgetStatus(80, 100)).toBe('Near Limit');
    expect(getBudgetStatus(100, 100)).toBe('Over Budget');
    expect(getBudgetStatus(110, 100)).toBe('Over Budget');
    expect(getBudgetStatus(70, 100)).toBe('On Track');
  });
});
