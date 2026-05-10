import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { routes } from '../data/routes';
import { getRoadPath, Coordinate } from '../utils/osrm';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TransportMapProps {
  onBack: () => void;
}

const routeGroups = [
  { name: 'Western Connectors', routes: ['R1', 'R2'], color: 'text-blue-300' },
  { name: 'Main Cross-City Artery', routes: ['R3'], color: 'text-green-300' },
  { name: 'Eastern Feeders', routes: ['R4', 'R5'], color: 'text-pink-300' },
  { name: 'Southern Feeders', routes: ['R6', 'R7'], color: 'text-yellow-300' }
];

export function TransportMap({ onBack }: TransportMapProps) {
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayers = useRef<Map<string, L.Polyline>>(new Map());
  const markerLayers = useRef<Map<string, L.Marker>>(new Map());
  const [roadPaths, setRoadPaths] = useState<Map<string, Coordinate[]>>(new Map());
  const [isLoadingPaths, setIsLoadingPaths] = useState(false);

  const toggleRoute = (routeId: string) => {
    setSelectedRoutes(prev =>
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const toggleGroup = (groupRoutes: string[]) => {
    const allSelected = groupRoutes.every(id => selectedRoutes.includes(id));
    if (allSelected) {
      setSelectedRoutes(prev => prev.filter(id => !groupRoutes.includes(id)));
    } else {
      setSelectedRoutes(prev => [...new Set([...prev, ...groupRoutes])]);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([8.947864, 125.543641], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    routeLayers.current.forEach(layer => layer.remove());
    markerLayers.current.forEach(marker => marker.remove());
    routeLayers.current.clear();
    markerLayers.current.clear();
  }, [selectedRoutes]);

  // Pre-fetch road paths for selected routes
  useEffect(() => {
    const fetchPaths = async () => {
      const missingRoutes = routes.filter(r => selectedRoutes.includes(r.id) && !roadPaths.has(r.id));
      if (missingRoutes.length === 0) return;

      setIsLoadingPaths(true);
      const newPaths = new Map(roadPaths);

      for (const route of missingRoutes) {
        const coords = route.stops.map(s => ({ lat: s.lat, lng: s.lng }));
        const roadPath = await getRoadPath(coords);
        newPaths.set(route.id, roadPath);
      }

      setRoadPaths(newPaths);
      setIsLoadingPaths(false);
    };

    fetchPaths();
  }, [selectedRoutes, roadPaths]);

  // Render routes when roadPaths or selectedRoutes change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear only route layers, keep markers if possible? 
    // Actually, markers are cleared in the previous useEffect for simplicity
    routeLayers.current.forEach(layer => layer.remove());
    routeLayers.current.clear();

    const filteredRoutes = routes.filter(route => selectedRoutes.includes(route.id));

    filteredRoutes.forEach((route) => {
      const path = roadPaths.get(route.id);
      if (!path) return; // Wait for path to be fetched

      const positions = path.map(p => [p.lat, p.lng] as [number, number]);

      const polyline = L.polyline(positions, {
        color: route.color,
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round'
      }).addTo(mapRef.current!);

      polyline.bindPopup(`
        <div style="color: #111827;">
          <div style="font-weight: 600;">${route.id}: ${route.name}</div>
          <div style="font-size: 0.875rem;">${route.description}</div>
        </div>
      `);

      routeLayers.current.set(route.id, polyline);

      route.stops.forEach((stop, idx) => {
        const marker = L.marker([stop.lat, stop.lng]).addTo(mapRef.current!);
        marker.bindPopup(`
          <div style="color: #111827;">
            <div style="font-weight: 600;">${stop.name}</div>
            <div style="font-size: 0.875rem;">Route: ${route.id}</div>
          </div>
        `);
        markerLayers.current.set(`${route.id}-${stop.id}-${idx}`, marker);
      });
    });

    if (filteredRoutes.length > 0) {
      const allCoords = filteredRoutes.flatMap(r =>
        r.stops.map(s => [s.lat, s.lng] as [number, number])
      );
      const bounds = L.latLngBounds(allCoords);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView([8.947864, 125.543641], 13);
    }
  }, [selectedRoutes, roadPaths]);

  return (
    <div className="min-h-screen md:h-screen bg-gradient-to-br from-purple-950 to-purple-800 text-white flex flex-col">
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            className="text-white"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 pt-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-80 md:overflow-y-auto shrink-0 order-2 md:order-1"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-purple-300" />
              <h3 className="font-semibold">Route Filters</h3>
            </div>

            <div className="space-y-4">
              {routeGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer bg-white/5 rounded-lg p-2"
                    onClick={() => toggleGroup(group.routes)}
                  >
                    <Checkbox
                      checked={group.routes.every(id => selectedRoutes.includes(id))}
                      onCheckedChange={() => toggleGroup(group.routes)}
                    />
                    <Label className={`flex-1 cursor-pointer ${group.color}`}>
                      {group.name}
                    </Label>
                  </div>

                  <div className="pl-6 space-y-1">
                    {routes
                      .filter(r => group.routes.includes(r.id))
                      .map((route) => (
                        <div
                          key={route.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-white/5"
                        >
                          <Checkbox
                            checked={selectedRoutes.includes(route.id)}
                            onCheckedChange={() => toggleRoute(route.id)}
                          />
                          <div
                            className="w-12 h-6 rounded flex items-center justify-center text-xs font-semibold"
                            style={{ backgroundColor: route.color }}
                          >
                            {route.id}
                          </div>
                          <Label className="flex-1 text-xs cursor-pointer">
                            {route.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedRoutes(routes.map(r => r.id))}
              >
                Show All Routes
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-[50vh] md:h-auto md:flex-1 relative rounded-lg overflow-hidden shadow-2xl shrink-0 order-1 md:order-2"
        >
          {isLoadingPaths && (
            <div className="absolute top-4 right-4 z-[1000] bg-purple-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-purple-400/30 flex items-center gap-2 shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              Fetching road paths...
            </div>
          )}
          <div ref={mapContainerRef} style={{ height: '100%', width: '100%', minHeight: '300px' }} />
        </motion.div>
      </div>
    </div>
  );
}
