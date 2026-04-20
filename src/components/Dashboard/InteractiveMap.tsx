import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { DayPlan } from '../../store/TripStore';
import { useMemo, useEffect } from 'react';

// Fix Leaflet's default icon path issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map on markers
function MapBounds({ activities }: { activities: any[] }) {
  const map = useMap();
  useEffect(() => {
    // Force leaflet to re-calculate its container size after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    if (activities.length > 0) {
      const validActivities = activities.filter(a => a.a && a.a.location);
      if (validActivities.length > 0) {
        const bounds = L.latLngBounds(validActivities.map(a => [a.a.location.lat, a.a.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [activities, map]);
  return null;
}

interface InteractiveMapProps {
  dayPlan: DayPlan;
}

export default function InteractiveMap({ dayPlan }: InteractiveMapProps) {
  const activities = useMemo(() => [
    { a: dayPlan.slots.morning, label: 'Morning' },
    { a: dayPlan.slots.afternoon, label: 'Afternoon' },
    { a: dayPlan.slots.evening, label: 'Evening' }
  ], [dayPlan]);

  const defaultCenter = [48.8566, 2.3522] as [number, number];

  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden m-4 border border-white/5 shadow-2xl z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }} // Dark bg to blend with dark mode
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds activities={activities} />
        {activities.map(({ a, label }) => {
          if (!a || !a.location) return null;
          return (
            <Marker key={a.id} position={[a.location.lat, a.location.lng]}>
              <Popup>
                <div className="font-sans text-gray-900">
                  <h4 className="font-bold text-base m-0 mb-1">{a.name}</h4>
                  <p className="text-sm m-0 text-gray-600">{label}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
