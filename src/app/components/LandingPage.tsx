import { motion } from 'motion/react';
import { MapPin, Navigation, DollarSign, Map } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { popularDestinations } from '../data/routes';

interface LandingPageProps {
  onNavigate: (section: 'finder' | 'fare' | 'map') => void;
  onQuickDestination: (stopId: string) => void;
}

export function LandingPage({ onNavigate, onQuickDestination }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-bold mb-2" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
            Transee Butuan
          </h1>
          <p className="text-blue-200" style={{ fontSize: '1.125rem' }}>
            SakaySmart Butuan - Your Multicab Route Guide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => onNavigate('finder')}>
              <Navigation className="w-12 h-12 mb-4 text-blue-300" />
              <h3 className="font-semibold mb-2" style={{ fontSize: '1.25rem' }}>Route Finder</h3>
              <p className="text-blue-200">Find the best multicab route to your destination</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => onNavigate('fare')}>
              <DollarSign className="w-12 h-12 mb-4 text-green-300" />
              <h3 className="font-semibold mb-2" style={{ fontSize: '1.25rem' }}>Fare Estimator</h3>
              <p className="text-blue-200">Calculate your commute fare based on distance</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => onNavigate('map')}>
              <Map className="w-12 h-12 mb-4 text-purple-300" />
              <h3 className="font-semibold mb-2" style={{ fontSize: '1.25rem' }}>Transport Map</h3>
              <p className="text-blue-200">View all routes on an interactive map</p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-semibold mb-4 text-center" style={{ fontSize: '1.5rem' }}>Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest, idx) => (
              <motion.div
                key={dest.stopId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white"
                  onClick={() => onQuickDestination(dest.stopId)}
                >
                  <span style={{ fontSize: '2rem' }}>{dest.icon}</span>
                  <span className="text-xs text-center">{dest.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-blue-200 text-sm"
        >
          <p>Covering Routes R1-R7 • Fare based on City Ordinance No. 7194-2024</p>
        </motion.div>
      </div>
    </div>
  );
}
