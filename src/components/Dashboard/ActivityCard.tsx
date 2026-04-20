import type { Activity } from '../../store/TripStore';
import { Clock, MapPin, DollarSign, Sparkles, CloudRain, Image as ImageIcon, Star } from 'lucide-react';
import usePlaceImage from '../../hooks/usePlaceImage';
import useTripStore from '../../store/TripStore';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { criteria, setHoveredActivityId } = useTripStore();
  const searchQuery = activity.name;
  const { imageUrl, loading } = usePlaceImage(searchQuery, criteria.destination);
  const displayRating = activity.rating || (4 + (activity.name.length % 10) / 10).toFixed(1);

  return (
    <div 
      onMouseEnter={() => setHoveredActivityId(activity.id)}
      onMouseLeave={() => setHoveredActivityId(null)}
      className="glass-panel rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(var(--color-primary),0.3)] bg-gradient-to-b from-white/5 to-transparent"
    >
      
      {/* Vibe Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-secondary opacity-50 group-hover:opacity-100 transition-opacity z-20" />

      {/* Hero Image Section */}
      <div className="relative h-56 w-full bg-surface overflow-hidden shrink-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-white/5">
            <ImageIcon size={32} className="text-white/20" />
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={activity.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <MapPin size={32} className="text-white/30" />
          </div>
        )}
        
        {/* Dark gradient overlay to blend image with card content */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
        
        {/* Weather Warning Badge overlaying the image */}
        {activity.weatherWarning && (
          <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-red-400/30">
            <CloudRain size={14} />
            {activity.weatherWarning}
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div className="p-6 pt-0 flex-1 flex flex-col z-10 -mt-12 relative">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors drop-shadow-md">
              {activity.name}
            </h4>
          </div>
          <button 
            title="Surprise me with an alternative!"
            className="shrink-0 p-2.5 rounded-full bg-background/80 hover:bg-white/20 text-text hover:text-white transition-all border border-white/10 backdrop-blur-xl shadow-lg"
          >
            <Sparkles size={16} />
          </button>
        </div>

        <p className="text-sm text-text-muted mt-3 leading-relaxed flex-1">
          {activity.description}
        </p>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-3 rounded-xl text-primary/90 backdrop-blur-sm">
            <Clock size={14} />
            {activity.durationMinutes} min
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-3 rounded-xl text-green-400/90 backdrop-blur-sm">
            <DollarSign size={14} />
            {activity.type === 'free' ? 'Free' : `${activity.estimatedCost}`}
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-3 rounded-xl text-yellow-400/90 backdrop-blur-sm">
            <Star size={14} className="fill-current" />
            {displayRating}
          </div>
          {activity.location?.address && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-3 rounded-xl text-secondary/90 truncate max-w-[200px] backdrop-blur-sm" title={activity.location.address}>
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{activity.location.address}</span>
            </div>
          )}
        </div>

        {/* Vibe Reason Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 text-xs italic text-text-muted flex gap-2 items-center">
          <span className="text-secondary shrink-0 opacity-80">✦</span>
          <span className="line-clamp-2 opacity-80">{activity.vibeReason}</span>
        </div>
      </div>
    </div>
  );
}
