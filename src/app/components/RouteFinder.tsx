import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Locate } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { stops } from '../data/routes';
import { findRoute, RouteResult } from '../utils/routing';
import { RouteResultMap } from './RouteResultMap';

interface RouteFinderProps {
  onBack: () => void;
  initialDestination?: string;
}

export function RouteFinder({ onBack, initialDestination }: RouteFinderProps) {
  const [fromStopId, setFromStopId] = useState<string>('');
  const [toStopId, setToStopId] = useState<string>(initialDestination || '');
  const [result, setResult] = useState<RouteResult | null>(null);

  const handleFindRoute = () => {
    if (fromStopId && toStopId) {
      const routeResult = findRoute(fromStopId, toStopId);
      setResult(routeResult);
    }
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          let closestStopId = '';
          let minDistance = Infinity;

          stopsList.forEach(stop => {
            const R = 6371;
            const dLat = (stop.lat - lat) * Math.PI / 180;
            const dLng = (stop.lng - lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat * Math.PI / 180) * Math.cos(stop.lat * Math.PI / 180) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;

            if (distance < minDistance) {
              minDistance = distance;
              closestStopId = stop.id;
            }
          });

          if (closestStopId) {
            setFromStopId(closestStopId);
          }
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const stopsList = Object.values(stops).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            className="text-white mb-6"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 mb-6">
            <h2 className="font-semibold mb-6" style={{ fontSize: '1.75rem' }}>Find Your Route</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-blue-200">From</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-blue-300 hover:text-white hover:bg-white/10 px-2 py-0 text-xs"
                    onClick={handleGetLocation}
                  >
                    <Locate className="w-3 h-3 mr-1" /> Use Current Location
                  </Button>
                </div>
                <Select value={fromStopId} onValueChange={setFromStopId}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select starting point" />
                  </SelectTrigger>
                  <SelectContent>
                    {stopsList.map((stop) => (
                      <SelectItem key={stop.id} value={stop.id}>
                        {stop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-blue-300" />
              </div>

              <div>
                <label className="block mb-2 text-blue-200">To</label>
                <Select value={toStopId} onValueChange={setToStopId}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {stopsList.map((stop) => (
                      <SelectItem key={stop.id} value={stop.id}>
                        {stop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleFindRoute}
                disabled={!fromStopId || !toStopId || fromStopId === toStopId}
              >
                Find Route
              </Button>
            </div>
          </Card>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
                <h3 className="font-semibold mb-4" style={{ fontSize: '1.5rem' }}>Commuter Guide</h3>

                <div className="space-y-4">
                  <div className="flex gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <div className="text-blue-200">Distance</div>
                      <div className="font-semibold">{result.totalDistance.toFixed(2)} km</div>
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <div className="text-blue-200">Estimated Fare</div>
                      <div className="font-semibold">₱{result.totalFare.toFixed(2)}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <div className="text-blue-200">Transfers</div>
                      <div className="font-semibold">{result.transfers}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {result.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 rounded-lg p-4 border-l-4"
                        style={{ borderColor: step.routeColor }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center font-semibold flex-shrink-0"
                            style={{ backgroundColor: step.routeColor }}
                          >
                            {step.route}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold mb-1">{step.routeName}</div>
                            <div className="text-sm text-blue-200 mb-2">{step.instruction}</div>
                            <div className="text-xs text-blue-300">{step.distance.toFixed(2)} km</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <RouteResultMap result={result} />
                </div>
              </Card>
            </motion.div>
          )}

          {result === null && fromStopId && toStopId && fromStopId !== toStopId && (
            <Card className="bg-red-500/10 backdrop-blur-md border-red-500/20 p-6">
              <p className="text-red-200">No direct or transfer route found between these stops. Please try different locations.</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
