/**
 * Utility to fetch road-following coordinates from OSRM
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

export async function getRoadPath(coords: Coordinate[]): Promise<Coordinate[]> {
  if (coords.length < 2) return coords;

  const coordString = coords.map(c => `${c.lng},${c.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('OSRM request failed');
    }
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return coords; // Fallback to straight lines if OSRM fails
    }

    const geometry = data.routes[0].geometry;
    if (geometry.type === 'LineString') {
      return geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng }));
    }

    return coords;
  } catch (error) {
    console.error('Error fetching road path:', error);
    return coords;
  }
}
