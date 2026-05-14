import { routes, stops, Stop } from '../data/routes';

export type TransportType = 'multicab' | 'jeepney' | 'tricycle' | 'walking';

export interface RouteStep {
  type: TransportType;
  route?: string;
  routeName: string;
  routeColor: string;
  fromName: string;
  toName: string;
  instruction: string;
  distance: number;
  path: { lat: number; lng: number }[];
}

export interface RouteResult {
  steps: RouteStep[];
  totalDistance: number;
  totalFare: number;
  transfers: number;
  isFallback: boolean;
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

export function findIntelligentRoute(
  fromName: string,
  fromCoords: { lat: number, lng: number },
  toName: string,
  toCoords: { lat: number, lng: number }
): RouteResult | null {
  // 1. Find nearest stops
  const startStop = findNearestStop(fromCoords.lat, fromCoords.lng);
  const endStop = findNearestStop(toCoords.lat, toCoords.lng);

  if (!startStop || !endStop) return null;

  // 2. Check if a transport route is even needed
  const directDistance = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);
  if (directDistance < 0.5) {
    return {
      steps: [{
        type: 'walking',
        routeName: 'Walking',
        routeColor: '#94a3b8',
        fromName,
        toName,
        instruction: `Walk from ${fromName} to ${toName}`,
        distance: directDistance,
        path: [fromCoords, toCoords]
      }],
      totalDistance: directDistance,
      totalFare: 0,
      transfers: 0,
      isFallback: false
    };
  }

  // 3. Find multicab/jeepney route between stops
  const transportRoute = findTransportRoute(startStop, endStop);
  
  const steps: RouteStep[] = [];
  let totalDistance = 0;
  let totalFare = 0;
  let isFallback = false;

  // 4. Add fallback from origin to start stop if needed
  const startDistance = calculateDistance(fromCoords.lat, fromCoords.lng, startStop.lat, startStop.lng);
  if (startDistance > 0.1) {
    isFallback = true;
    const type = startDistance > 0.8 ? 'tricycle' : 'walking';
    steps.push({
      type,
      routeName: type === 'tricycle' ? 'Tricycle' : 'Walking',
      routeColor: type === 'tricycle' ? '#fbbf24' : '#94a3b8',
      fromName,
      toName: startStop.name,
      instruction: type === 'tricycle' 
        ? `Take a tricycle from ${fromName} to ${startStop.name}`
        : `Walk from ${fromName} to ${startStop.name}`,
      distance: startDistance,
      path: [fromCoords, { lat: startStop.lat, lng: startStop.lng }]
    });
    totalDistance += startDistance;
    if (type === 'tricycle') totalFare += 15; // Fixed tricycle base fare
  }

  // 5. Add transport steps
  if (transportRoute) {
    transportRoute.steps.forEach(step => {
      steps.push({
        type: 'multicab', // Most routes in Butuan currently multicab
        route: step.route,
        routeName: step.routeName,
        routeColor: step.routeColor,
        fromName: step.from.name,
        toName: step.to.name,
        instruction: step.instruction,
        distance: step.distance,
        path: step.path.map(s => ({ lat: s.lat, lng: s.lng }))
      });
    });
    totalDistance += transportRoute.totalDistance;
    totalFare += transportRoute.totalFare;
  } else {
    // If no transport route found, just suggest tricycle/walking for the whole trip if it's feasible
    if (directDistance < 5) {
      const type = 'tricycle';
      steps.push({
        type,
        routeName: 'Tricycle',
        routeColor: '#fbbf24',
        fromName,
        toName,
        instruction: `Take a tricycle from ${fromName} to ${toName} (No direct multicab route)`,
        distance: directDistance,
        path: [fromCoords, toCoords]
      });
      totalDistance += directDistance;
      totalFare += 25; // Longer tricycle ride
    } else {
      return null; // Too far for fallback
    }
  }

  // 6. Add fallback from end stop to destination if needed
  const endDistance = calculateDistance(endStop.lat, endStop.lng, toCoords.lat, toCoords.lng);
  if (endDistance > 0.1) {
    isFallback = true;
    const type = endDistance > 0.8 ? 'tricycle' : 'walking';
    steps.push({
      type,
      routeName: type === 'tricycle' ? 'Tricycle' : 'Walking',
      routeColor: type === 'tricycle' ? '#fbbf24' : '#94a3b8',
      fromName: endStop.name,
      toName,
      instruction: type === 'tricycle' 
        ? `Take a tricycle from ${endStop.name} to ${toName}`
        : `Walk from ${endStop.name} to ${toName}`,
      distance: endDistance,
      path: [{ lat: endStop.lat, lng: endStop.lng }, toCoords]
    });
    totalDistance += endDistance;
    if (type === 'tricycle') totalFare += 15;
  }

  return {
    steps,
    totalDistance,
    totalFare,
    transfers: (transportRoute?.transfers || 0) + (isFallback ? 1 : 0),
    isFallback
  };
}

function findNearestStop(lat: number, lng: number): Stop {
  const stopsList = Object.values(stops);
  let closestStop = stopsList[0];
  let minDistance = Infinity;

  stopsList.forEach(stop => {
    const distance = calculateDistance(lat, lng, stop.lat, stop.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestStop = stop;
    }
  });

  return closestStop;
}

// Reusing parts of the old routing logic but adapted
function findTransportRoute(fromStop: Stop, toStop: Stop): { steps: any[], totalDistance: number, totalFare: number, transfers: number } | null {
  const direct = findDirectTransportRoute(fromStop, toStop);
  if (direct) return direct;

  const transfer = findTransferTransportRoute(fromStop, toStop);
  return transfer;
}

function findDirectTransportRoute(fromStop: Stop, toStop: Stop): any | null {
  for (const route of routes) {
    const fromIndex = route.stops.findIndex(s => s.id === fromStop.id);
    const toIndex = route.stops.findIndex(s => s.id === toStop.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      const isForward = fromIndex < toIndex;
      const stopsToTravel = isForward
        ? route.stops.slice(fromIndex, toIndex + 1)
        : route.stops.slice(toIndex, fromIndex + 1).reverse();

      let distance = 0;
      for (let i = 0; i < stopsToTravel.length - 1; i++) {
        distance += calculateDistance(stopsToTravel[i].lat, stopsToTravel[i].lng, stopsToTravel[i+1].lat, stopsToTravel[i+1].lng);
      }

      return {
        steps: [{
          route: route.id,
          routeName: route.name,
          routeColor: route.color,
          from: fromStop,
          to: toStop,
          instruction: `Board ${route.id} (${route.name}) at ${fromStop.name}. Ride until ${toStop.name}.`,
          distance,
          path: stopsToTravel
        }],
        totalDistance: distance,
        totalFare: calculateFare(distance),
        transfers: 0
      };
    }
  }
  return null;
}

function findTransferTransportRoute(fromStop: Stop, toStop: Stop): any | null {
  const routesWithFrom = routes.filter(r => r.stops.some(s => s.id === fromStop.id));
  const routesWithTo = routes.filter(r => r.stops.some(s => s.id === toStop.id));

  let bestRoute: any = null;
  let minDistance = Infinity;

  for (const route1 of routesWithFrom) {
    for (const route2 of routesWithTo) {
      if (route1.id === route2.id) continue;

      const commonStops = route1.stops.filter(s1 =>
        route2.stops.some(s2 => s2.id === s1.id)
      );

      for (const transferStop of commonStops) {
        if (transferStop.id === fromStop.id || transferStop.id === toStop.id) continue;

        const leg1 = findDirectTransportRoute(fromStop, transferStop);
        const leg2 = findDirectTransportRoute(transferStop, toStop);

        if (leg1 && leg2) {
          const totalDistance = leg1.totalDistance + leg2.totalDistance;
          if (totalDistance < minDistance) {
            minDistance = totalDistance;
            bestRoute = {
              steps: [leg1.steps[0], leg2.steps[0]],
              totalDistance,
              totalFare: calculateFare(totalDistance),
              transfers: 1
            };
          }
        }
      }
    }
  }
  return bestRoute;
}

export function calculateFare(distanceKm: number, passengerType: string = 'regular'): number {
  let baseFare = 0;
  if (distanceKm < 4) {
    baseFare = 10.00;
  } else {
    baseFare = 15.00 + (distanceKm - 4) * 1.80;
  }
  if (passengerType !== 'regular') {
    baseFare = baseFare * 0.8;
  }
  return Math.round(baseFare * 100) / 100;
}
