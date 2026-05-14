import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteResult } from '../utils/routing';
import { getRoadPath, Coordinate } from '../utils/osrm';

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
  const [roadPaths, setRoadPaths] = useState<Map<string, Coordinate[]>>(new Map());

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

    const fetchAndDraw = async () => {
      const newRoadPaths = new Map(roadPaths);
      let pathsChanged = false;

      for (let i = 0; i < result.steps.length; i++) {
        const step = result.steps[i];
        if (step.path && step.path.length > 0) {
          const stepKey = `${step.fromName}-${step.toName}-${step.route || step.type}`;
          let detailedPath = roadPaths.get(stepKey);
          
          if (!detailedPath) {
            // For walking/tricycle, we might not always need OSRM if it's short, 
            // but let's use it for consistency if it's more than 2 points
            if (step.path.length > 2) {
              detailedPath = step.path;
            } else {
              detailedPath = await getRoadPath(step.path);
            }
            newRoadPaths.set(stepKey, detailedPath);
            pathsChanged = true;
          }

          const positions = detailedPath.map(p => [p.lat, p.lng] as [number, number]);
          
          L.polyline(positions, {
            color: step.routeColor,
            weight: 6,
            opacity: 0.9,
            lineJoin: 'round'
          }).addTo(map);

          positions.forEach(pos => bounds.extend(pos));

          // Add marker for the start of the step
          const startCoord = step.path[0];
          L.marker([startCoord.lat, startCoord.lng]).addTo(map)
            .bindPopup(`<b>${step.fromName}</b><br>${step.instruction}`);

          // Add marker for the end of the step
          const endCoord = step.path[step.path.length - 1];
          L.marker([endCoord.lat, endCoord.lng]).addTo(map)
            .bindPopup(`<b>${step.toName}</b>`);
        }
      }

      if (pathsChanged) {
        setRoadPaths(newRoadPaths);
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    fetchAndDraw();

  }, [result, roadPaths]);

  return <div ref={mapContainerRef} className="w-full h-64 rounded-lg overflow-hidden border border-white/20 mt-4 shadow-lg" />;
}
