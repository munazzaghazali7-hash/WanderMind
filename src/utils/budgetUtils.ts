import { DayPlan } from '../store/TripStore';

export function calculateTotalSpent(itinerary: DayPlan[]): number {
  let spent = 0;
  itinerary.forEach(day => {
    Object.values(day.slots).forEach(activity => {
      if (activity && activity.estimatedCost) {
        spent += activity.estimatedCost;
      }
    });
  });
  return spent;
}

export function getBudgetStatus(spent: number, total: number) {
  const percentage = total > 0 ? (spent / total) * 100 : 0;
  
  if (percentage >= 100) return 'Over Budget';
  if (percentage >= 80) return 'Near Limit';
  return 'On Track';
}
