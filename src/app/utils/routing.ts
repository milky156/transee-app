import { routes, stops, Stop } from '../data/routes';

export interface RouteStep {
  route: string;
  routeName: string;
  routeColor: string;
  from: Stop;
  to: Stop;
  instruction: string;
  distance: number;
  path: Stop[];
}

export interface RouteResult {
  steps: RouteStep[];
  totalDistance: number;
  totalFare: number;
  transfers: number;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getStopDistance(stop1: Stop, stop2: Stop): number {
  return calculateDistance(stop1.lat, stop1.lng, stop2.lat, stop2.lng);
}

export function findRoute(fromStopId: string, toStopId: string): RouteResult | null {
  if (fromStopId === toStopId) return null;

  const fromStop = stops[fromStopId];
  const toStop = stops[toStopId];

  if (!fromStop || !toStop) return null;

  const directRoute = findDirectRoute(fromStop, toStop);
  if (directRoute) return directRoute;

  const transferRoute = findTransferRoute(fromStop, toStop);
  return transferRoute;
}

function findDirectRoute(fromStop: Stop, toStop: Stop): RouteResult | null {
  for (const route of routes) {
    const fromIndex = route.stops.findIndex(s => s.id === fromStop.id);
    const toIndex = route.stops.findIndex(s => s.id === toStop.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      const steps: RouteStep[] = [];
      let totalDistance = 0;

      const isForward = fromIndex < toIndex;
      const stopsToTravel = isForward
        ? route.stops.slice(fromIndex, toIndex + 1)
        : route.stops.slice(toIndex, fromIndex + 1).reverse();

      for (let i = 0; i < stopsToTravel.length - 1; i++) {
        totalDistance += getStopDistance(stopsToTravel[i], stopsToTravel[i + 1]);
      }

      steps.push({
        route: route.id,
        routeName: route.name,
        routeColor: route.color,
        from: fromStop,
        to: toStop,
        instruction: `Board ${route.id} (${route.name}) at ${fromStop.name}. Ride until ${toStop.name}.`,
        distance: totalDistance,
        path: stopsToTravel
      });

      return {
        steps,
        totalDistance,
        totalFare: calculateFare(totalDistance, 'regular'),
        transfers: 0
      };
    }
  }

  return null;
}

function findTransferRoute(fromStop: Stop, toStop: Stop): RouteResult | null {
  const routesWithFrom = routes.filter(r => r.stops.some(s => s.id === fromStop.id));
  const routesWithTo = routes.filter(r => r.stops.some(s => s.id === toStop.id));

  let bestRoute: RouteResult | null = null;
  let minDistance = Infinity;

  for (const route1 of routesWithFrom) {
    for (const route2 of routesWithTo) {
      if (route1.id === route2.id) continue;

      const commonStops = route1.stops.filter(s1 =>
        route2.stops.some(s2 => s2.id === s1.id)
      );

      for (const transferStop of commonStops) {
        if (transferStop.id === fromStop.id || transferStop.id === toStop.id) continue;

        const leg1 = findDirectRoute(fromStop, transferStop);
        const leg2 = findDirectRoute(transferStop, toStop);

        if (leg1 && leg2) {
          const totalDistance = leg1.totalDistance + leg2.totalDistance;

          if (totalDistance < minDistance) {
            minDistance = totalDistance;
            bestRoute = {
              steps: [
                {
                  ...leg1.steps[0],
                  instruction: `Board ${route1.id} (${route1.name}) at ${fromStop.name}. Ride until ${transferStop.name}.`
                },
                {
                  ...leg2.steps[0],
                  instruction: `Transfer to ${route2.id} (${route2.name}) at ${transferStop.name}. Ride until ${toStop.name}.`
                }
              ],
              totalDistance,
              totalFare: calculateFare(totalDistance, 'regular'),
              transfers: 1
            };
          }
        }
      }
    }
  }

  return bestRoute;
}

export type PassengerType = 'regular' | 'student' | 'senior' | 'pwd';

export function calculateFare(distanceKm: number, passengerType: PassengerType = 'regular'): number {
  let baseFare = 0;

  if (distanceKm < 4) {
    baseFare = 10.00;
  } else {
    baseFare = 15.00 + (distanceKm - 4) * 1.80;
  }

  if (passengerType === 'student' || passengerType === 'senior' || passengerType === 'pwd') {
    baseFare = baseFare * 0.8;
  }

  return Math.round(baseFare * 100) / 100;
}
