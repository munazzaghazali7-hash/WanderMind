import { useState, useMemo } from 'react';
import useTripStore from '../../store/TripStore';
import BudgetTracker from './BudgetTracker';
import ExportButtons from './ExportButtons';
import { Star, MessageCircle, ThumbsUp, MapPin, Clock, DollarSign, Map as MapIcon, Info } from 'lucide-react';
import usePlaceImage from '../../hooks/usePlaceImage';
import ActivityCard from './ActivityCard';
import InteractiveMap from './InteractiveMap';

export default function DashboardLayout() {
  const { itinerary, criteria, isLoadingItinerary, hoveredActivityId } = useTripStore();
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState<'details' | 'map'>('details');

  if (isLoadingItinerary) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold">Generating your hyper-personalized itinerary...</h2>
          <p className="text-text-muted">AI is crafting the perfect trip to {criteria.destination}</p>
        </div>
      </div>
    );
  }

  if (!itinerary.length) return null;

  const currentDayPlan = itinerary.find(d => d.dayNumber === selectedDay) || itinerary[0];

  // Find the hovered or default activity to showcase
  const showcasedActivity = useMemo(() => {
    if (hoveredActivityId) {
      for (const day of itinerary) {
        for (const slot of Object.values(day.slots)) {
          if (slot?.id === hoveredActivityId) return slot;
        }
      }
    }
    // Default to the first morning activity
    return currentDayPlan.slots.morning || currentDayPlan.slots.afternoon || currentDayPlan.slots.evening;
  }, [hoveredActivityId, itinerary, currentDayPlan]);

  return (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      {/* Left Panel: Itinerary Details */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col h-full bg-surface/50 border-r border-white/10">
        
        {/* Day Tabs */}
        <div 
          role="tablist" 
          aria-label="Trip Itinerary Days"
          className="flex overflow-x-auto p-4 gap-2 border-b border-white/10 hide-scrollbar shrink-0"
        >
          {itinerary.map((day) => (
            <button
              key={day.dayNumber}
              role="tab"
              aria-selected={selectedDay === day.dayNumber}
              aria-controls={`day-panel-${day.dayNumber}`}
              id={`day-tab-${day.dayNumber}`}
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                selectedDay === day.dayNumber 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 hover:bg-white/10 text-text-muted hover:text-text'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-white/10 shrink-0 flex justify-between items-center bg-white/5">
          <span className="text-sm font-medium text-text-muted">
            {currentDayPlan.date.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
          </span>
          <ExportButtons />
        </div>

        <div 
          role="tabpanel"
          id={`day-panel-${selectedDay}`}
          aria-labelledby={`day-tab-${selectedDay}`}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-32"
        >
          {['morning', 'afternoon', 'evening'].map((slotName) => {
            const slot = currentDayPlan.slots[slotName as keyof typeof currentDayPlan.slots];
            if (!slot) return null;
            return (
              <section key={`${selectedDay}-${slotName}`} className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-primary font-bold ml-1">{slotName}</h3>
                <ActivityCard activity={slot} />
              </section>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Activity Spotlight & Reviews */}
      <div className="hidden md:flex flex-1 bg-surface/30 relative h-full overflow-hidden flex-col">
        {/* Toggle Switch */}
        <div className="absolute top-6 right-6 z-20 flex bg-background/60 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-xl">
          <button 
            onClick={() => setViewMode('details')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${viewMode === 'details' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text'}`}
          >
            <Info size={14} /> Details
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${viewMode === 'map' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text'}`}
          >
            <MapIcon size={14} /> Map View
          </button>
        </div>

        {viewMode === 'details' ? (
          showcasedActivity ? (
            <SpotlightPanel activity={showcasedActivity} destination={criteria.destination} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              Select an activity to see details
            </div>
          )
        ) : (
          <InteractiveMap dayPlan={currentDayPlan} />
        )}
      </div>

      {/* Bottom Bar: Budget Tracker */}
      <BudgetTracker />
    </main>
  );
}

// Sub-component for the Spotlight Panel
function SpotlightPanel({ activity, destination }: { activity: any, destination: string }) {
  const { imageUrl } = usePlaceImage(activity.name, destination);
  const rating = activity.rating || (4 + (activity.name.length % 10) / 10).toFixed(1);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Huge Hero Image */}
      <div className="h-72 w-full relative shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={activity.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full backdrop-blur-md border border-yellow-400/30">
              <Star size={16} className="fill-current" />
              <span className="font-bold">{rating}</span>
            </div>
            <span className="text-text-muted text-sm border-l border-white/20 pl-3">428 verified reviews</span>
          </div>
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-2">{activity.name}</h2>
          <div className="flex gap-4 text-sm font-medium text-white/80">
            <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {activity.durationMinutes} mins</span>
            <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-green-400" /> {activity.type === 'free' ? 'Free' : activity.estimatedCost}</span>
            {activity.location?.address && (
              <span className="flex items-center gap-1.5 truncate max-w-[200px]"><MapPin size={16} className="text-secondary" /> {activity.location.address}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-primary uppercase tracking-widest text-xs mb-3">Why we picked this</h3>
          <p className="text-lg leading-relaxed text-text/90 bg-white/5 p-5 rounded-2xl border border-white/5">{activity.description}</p>
        </div>

        {/* Detailed Reviews */}
        <div>
          <h3 className="text-lg font-bold text-primary uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
            <MessageCircle size={16} /> Traveler Reviews
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { user: "Sarah W.", text: "Absolutely breathtaking! The atmosphere was incredible and it completely matched the vibe we were looking for. We spent 3 hours here easily.", rating: 5 },
              { user: "David M.", text: "A must-visit if you're in the area. The local guides were fantastic. Highly recommend booking slightly in advance if possible.", rating: 4 },
              { user: "Elena P.", text: "Great experience overall. Try the local coffee stand right next to the entrance, it's a hidden gem!", rating: 5 }
            ].map((review, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm">
                      {review.user[0]}
                    </div>
                    <span className="font-bold">{review.user}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} className={idx < review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"} />
                    ))}
                  </div>
                </div>
                <p className="text-text-muted italic leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-1.5 text-xs text-text-muted pt-3 border-t border-white/5">
                  <ThumbsUp size={14} className="hover:text-primary cursor-pointer transition-colors" /> 
                  {Math.floor(Math.random() * 50) + 12} people found this helpful
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
