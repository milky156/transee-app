import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { calculateFare, PassengerType } from '../utils/routing';

interface FareEstimatorProps {
  onBack: () => void;
}

export function FareEstimator({ onBack }: FareEstimatorProps) {
  const [distance, setDistance] = useState<string>('');
  const [passengerType, setPassengerType] = useState<PassengerType>('regular');
  const [fare, setFare] = useState<number | null>(null);

  const handleCalculate = () => {
    const dist = parseFloat(distance);
    if (!isNaN(dist) && dist > 0) {
      const calculatedFare = calculateFare(dist, passengerType);
      setFare(calculatedFare);
    }
  };

  const getDiscountText = () => {
    if (passengerType === 'regular') return '';
    return '(20% discount applied)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-green-800 text-white p-4">
      <div className="max-w-2xl mx-auto">
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
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-8 h-8 text-green-300" />
              <h2 className="font-semibold" style={{ fontSize: '1.75rem' }}>Fare Estimator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-white mb-2">Distance (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter distance in kilometers"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <Label className="text-white mb-3">Passenger Type</Label>
                <RadioGroup value={passengerType} onValueChange={(v) => setPassengerType(v as PassengerType)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-3">
                      <RadioGroupItem value="regular" id="regular" />
                      <Label htmlFor="regular" className="flex-1 cursor-pointer">Regular Passenger</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-3">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="flex-1 cursor-pointer">Student (20% discount)</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-3">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior" className="flex-1 cursor-pointer">Senior Citizen (20% discount)</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-3">
                      <RadioGroupItem value="pwd" id="pwd" />
                      <Label htmlFor="pwd" className="flex-1 cursor-pointer">PWD (20% discount)</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleCalculate}
                disabled={!distance || parseFloat(distance) <= 0}
              >
                Calculate Fare
              </Button>
            </div>
          </Card>

          {fare !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-center">
                <h3 className="font-semibold mb-2" style={{ fontSize: '1.25rem' }}>Estimated Fare</h3>
                <div className="font-bold text-green-300 mb-2" style={{ fontSize: '3rem' }}>
                  ₱{fare.toFixed(2)}
                </div>
                <p className="text-green-200 text-sm mb-4">{getDiscountText()}</p>

                <div className="bg-white/5 rounded-lg p-4 text-left text-sm space-y-2">
                  <h4 className="font-semibold mb-2">Fare Structure (City Ordinance No. 7194-2024)</h4>
                  <p className="text-blue-200">• Short trips (&lt; 4km): ₱10.00 flat rate</p>
                  <p className="text-blue-200">• Longer trips (≥ 4km): ₱15.00 base + ₱1.80 per km</p>
                  <p className="text-blue-200">• Students, Seniors, PWDs: 20% discount</p>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
