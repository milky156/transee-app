import { Stop, stops } from '../data/routes';

export interface LocationSuggestion {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isStop: boolean;
}

const BUTUAN_BOUNDS = '125.4,8.8,125.7,9.1';

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 2) return [];

  // 1. Search in local stops
  const stopsList = Object.values(stops);
  const localResults: LocationSuggestion[] = stopsList
    .filter(stop => stop.name.toLowerCase().includes(query.toLowerCase()))
    .map(stop => ({
      id: stop.id,
      name: stop.name,
      lat: stop.lat,
      lng: stop.lng,
      isStop: true
    }));

  // 2. Search via Nominatim (restricted to Butuan)
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' Butuan City')}&format=json&viewbox=${BUTUAN_BOUNDS}&bounded=1&limit=5`
    );
    
    if (response.ok) {
      const data = await response.json();
      const externalResults: LocationSuggestion[] = data.map((item: any) => ({
        id: `ext-${item.place_id}`,
        name: item.display_name.split(',')[0],
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        isStop: false
      }));

      // Combine and remove duplicates based on name
      const combined = [...localResults];
      externalResults.forEach(ext => {
        if (!combined.some(loc => loc.name.toLowerCase() === ext.name.toLowerCase())) {
          combined.push(ext);
        }
      });

      return combined;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  return localResults;
}

export function findNearestStop(lat: number, lng: number): Stop {
  const stopsList = Object.values(stops);
  let closestStop = stopsList[0];
  let minDistance = Infinity;

  stopsList.forEach(stop => {
    const R = 6371;
    const dLat = (stop.lat - lat) * Math.PI / 180;
    const dLng = (stop.lng - lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(stop.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < minDistance) {
      minDistance = distance;
      closestStop = stop;
    }
  });

  return closestStop;
}
