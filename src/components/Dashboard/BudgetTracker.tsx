import useTripStore from '../../store/TripStore';
import { calculateTotalSpent, getBudgetStatus } from '../../utils/budgetUtils';

export default function BudgetTracker() {
  const { itinerary, criteria } = useTripStore();

  const totalBudget = criteria.budget;
  const spent = calculateTotalSpent(itinerary);
  const percentage = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const status = getBudgetStatus(spent, totalBudget);
  
  let statusColor = 'bg-green-500';
  let textColor = 'text-green-400';
  if (percentage >= 100) {
    statusColor = 'bg-red-500';
    textColor = 'text-red-400';
  } else if (percentage >= 80) {
    statusColor = 'bg-yellow-500';
    textColor = 'text-yellow-400';
  }

  return (
    <div className="absolute bottom-0 left-0 w-full md:w-1/2 lg:w-2/5 bg-surface/90 backdrop-blur-md border-t border-white/10 p-4 shrink-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Total Budget</p>
          <div className="flex items-center gap-1 font-mono text-xl mt-1">
            <span className={textColor}>{spent}</span>
            <span className="text-text-muted">/ {totalBudget}</span>
            <span className="text-xs ml-1 text-text-muted">{criteria.currency}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Status</p>
          <span className={`text-xs px-2 py-1 rounded w-fit inline-block font-medium ${
             percentage >= 100 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
             percentage >= 80 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
             'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {status}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div 
        role="progressbar"
        aria-valuenow={Math.round(spent)}
        aria-valuemin={0}
        aria-valuemax={totalBudget}
        aria-label="Budget utilization"
        className="h-2 w-full bg-black/40 rounded-full overflow-hidden mt-2"
      >
        <div 
          className={`h-full ${statusColor} transition-all duration-500`} 
          style={{ width: `${Math.min(percentage, 100)}%` }} 
        />
      </div>
    </div>
  );
}
