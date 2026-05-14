import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Locate } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { stops } from '../data/routes';
import { findIntelligentRoute, RouteResult } from '../utils/routing';
import { RouteResultMap } from './RouteResultMap';
import { LocationSearch } from './LocationSearch';
import { findNearestStop } from '../utils/geocoding';
import { MapPin, Footprints, Bike, Bus, Info } from 'lucide-react';

interface RouteFinderProps {
  onBack: () => void;
  initialDestination?: string;
}

export function RouteFinder({ onBack, initialDestination }: RouteFinderProps) {
  const [fromStopId, setFromStopId] = useState<string>('');
  const [toStopId, setToStopId] = useState<string>(initialDestination || '');
  const [fromName, setFromName] = useState<string>('');
  const [toName, setToName] = useState<string>('');
  const [fromCoords, setFromCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [toCoords, setToCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);

  const handleFindRoute = () => {
    if (fromCoords && toCoords) {
      const routeResult = findIntelligentRoute(
        fromName || 'Starting Point',
        fromCoords,
        toName || 'Destination',
        toCoords
      );
      setResult(routeResult);
    }
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const nearest = findNearestStop(lat, lng);
          setFromStopId(nearest.id);
          setFromName('Current Location');
          setFromCoords({ lat, lng });
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

  const getStopName = (id: string) => stops[id]?.name || '';

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
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 mb-6 shadow-2xl relative overflow-visible">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
            
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Find Your Route</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-start gap-6 relative">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-blue-200 text-sm font-medium">Starting Point</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-blue-300 hover:text-white hover:bg-white/10 px-2 text-[10px] uppercase tracking-wider font-bold"
                    onClick={handleGetLocation}
                  >
                    <Locate className="w-3 h-3 mr-1" /> My Location
                  </Button>
                </div>
                <LocationSearch
                  label=""
                  placeholder="Enter area or stop..."
                  value={fromStopId}
                  selectedName={fromName || getStopName(fromStopId)}
                  onSelect={(loc) => {
                    setFromName(loc.name);
                    setFromCoords({ lat: loc.lat, lng: loc.lng });
                    if (loc.isStop) {
                      setFromStopId(loc.id);
                    } else {
                      const nearest = findNearestStop(loc.lat, loc.lng);
                      setFromStopId(nearest.id);
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-center pt-8">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-blue-200 text-sm font-medium">Destination</label>
                <LocationSearch
                  label=""
                  placeholder="Enter destination..."
                  value={toStopId}
                  selectedName={toName || getStopName(toStopId)}
                  onSelect={(loc) => {
                    setToName(loc.name);
                    setToCoords({ lat: loc.lat, lng: loc.lng });
                    if (loc.isStop) {
                      setToStopId(loc.id);
                    } else {
                      const nearest = findNearestStop(loc.lat, loc.lng);
                      setToStopId(nearest.id);
                    }
                  }}
                />
              </div>
            </div>

            <Button
              className="w-full mt-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white h-14 text-lg font-bold shadow-xl shadow-blue-600/20 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
              onClick={handleFindRoute}
              disabled={!fromCoords || !toCoords || fromStopId === toStopId}
            >
              Search Multicab Routes
            </Button>
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
                      <div className="text-[10px] text-green-300/90 font-medium mt-1 border-t border-white/5 pt-1">
                        ₱{(result.totalFare * 0.8).toFixed(2)} (Disc.)
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <div className="text-blue-200">Transfers</div>
                      <div className="font-semibold">{result.transfers}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {result.isFallback && (
                      <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>Some steps involve walking or tricycle transfers to the nearest transport route.</span>
                      </div>
                    )}
                    
                    {result.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 rounded-xl p-5 border border-white/10 relative overflow-hidden"
                      >
                        <div 
                          className="absolute left-0 top-0 w-1.5 h-full" 
                          style={{ backgroundColor: step.routeColor }}
                        />
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-lg"
                            style={{ backgroundColor: step.routeColor }}
                          >
                            {step.type === 'walking' && <Footprints className="w-6 h-6" />}
                            {step.type === 'tricycle' && <Bike className="w-6 h-6" />}
                            {step.type === 'multicab' && (step.route || <Bus className="w-6 h-6" />)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-lg">{step.routeName}</span>
                              <span className="text-xs font-medium text-blue-300 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                {step.distance.toFixed(2)} km
                              </span>
                            </div>
                            <div className="text-blue-100/80 leading-relaxed">{step.instruction}</div>
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
