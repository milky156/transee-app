import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteResult } from '../utils/routing';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteResultMapProps {
  result: RouteResult;
}

export function RouteResultMap({ result }: RouteResultMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([8.947864, 125.543641], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;
    
    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        layer.remove();
      }
    });

    const bounds = L.latLngBounds([]);

    result.steps.forEach((step) => {
      if (step.path && step.path.length > 0) {
        const positions = step.path.map(stop => [stop.lat, stop.lng] as [number, number]);
        
        L.polyline(positions, {
          color: step.routeColor,
          weight: 5,
          opacity: 0.8
        }).addTo(map);

        positions.forEach(pos => bounds.extend(pos));

        // Add marker for the start of the step
        const startStop = step.path[0];
        L.marker([startStop.lat, startStop.lng]).addTo(map)
          .bindPopup(`<b>${startStop.name}</b><br>Board ${step.routeName}`);

        // Add marker for the end of the step
        const endStop = step.path[step.path.length - 1];
        L.marker([endStop.lat, endStop.lng]).addTo(map)
          .bindPopup(`<b>${endStop.name}</b><br>Alight here`);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }

  }, [result]);

  return <div ref={mapContainerRef} className="w-full h-64 rounded-lg overflow-hidden border border-white/20 mt-4 shadow-lg" />;
}
