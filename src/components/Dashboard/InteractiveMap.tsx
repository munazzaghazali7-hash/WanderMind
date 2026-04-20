import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { useMemo, useState } from 'react';
import type { DayPlan } from '../../store/TripStore';

const MAP_ID = 'bf51a910020fa8'; // Placeholder Map ID for styling
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface InteractiveMapProps {
  dayPlan: DayPlan;
}

export default function InteractiveMap({ dayPlan }: InteractiveMapProps) {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const activities = useMemo(() => [
    { a: dayPlan.slots.morning, label: 'Morning' },
    { a: dayPlan.slots.afternoon, label: 'Afternoon' },
    { a: dayPlan.slots.evening, label: 'Evening' }
  ].filter(item => item.a && item.a.location), [dayPlan]);

  const defaultCenter = activities.length > 0 
    ? { lat: activities[0].a!.location!.lat, lng: activities[0].a!.location!.lng }
    : { lat: 48.8566, lng: 2.3522 };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface/50 m-4 rounded-3xl border border-white/10 text-text-muted">
        Google Maps API Key required for map visualization.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden m-4 border border-white/5 shadow-2xl z-0">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={13}
          mapId={MAP_ID}
          colorScheme="DARK"
          disableDefaultUI={true}
        >
          {activities.map(({ a, label }) => {
            if (!a || !a.location) return null;
            return (
              <div key={a.id}>
                <Marker 
                  position={{ lat: a.location.lat, lng: a.location.lng }}
                  onClick={() => setSelectedActivityId(a.id)}
                />
                {selectedActivityId === a.id && (
                  <InfoWindow 
                    position={{ lat: a.location.lat, lng: a.location.lng }}
                    onCloseClick={() => setSelectedActivityId(null)}
                  >
                    <div className="text-gray-900 p-1 min-w-[120px]">
                      <p className="font-bold text-xs uppercase text-primary mb-1">{label}</p>
                      <h4 className="font-bold text-sm mb-0">{a.name}</h4>
                    </div>
                  </InfoWindow>
                )}
              </div>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
