import * as turf from '@turf/turf';

// Convert meters to degrees approximation
export const metersToDegrees = (lat: number): number => {
  return 1 / (111320 * Math.cos(lat * Math.PI / 180));
};

// Sizer v1: Generate polygon from GPS point
export interface SizerOptions {
  lat: number;
  lon: number;
  surfaceHa: number;
  shape: 'hex' | 'square';
}

export const generatePolygonFromPoint = (options: SizerOptions): GeoJSON.Feature<GeoJSON.Polygon> => {
  const { lat, lon, surfaceHa, shape } = options;
  
  // Convert surface from hectares to square meters
  const surfaceM2 = surfaceHa * 10000;
  
  // Calculate radius based on shape
  let radius: number;
  if (shape === 'hex') {
    // For hexagon: Area = (3√3/2) * r²
    radius = Math.sqrt(surfaceM2 / (3 * Math.sqrt(3) / 2));
  } else {
    // For square: Area = (2r)²
    radius = Math.sqrt(surfaceM2) / 2;
  }
  
  // Convert radius to degrees
  const radiusDeg = radius * metersToDegrees(lat);
  
  // Generate vertices
  const vertices: number[][] = [];
  const numSides = shape === 'hex' ? 6 : 4;
  const angleStep = (2 * Math.PI) / numSides;
  
  for (let i = 0; i < numSides; i++) {
    const angle = i * angleStep;
    const x = lon + radiusDeg * Math.cos(angle);
    const y = lat + radiusDeg * Math.sin(angle);
    vertices.push([x, y]);
  }
  
  // Close the polygon
  vertices.push(vertices[0]);
  
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [vertices]
    }
  };
};

// Calculate area in hectares
export const calculateAreaHa = (geojson: GeoJSON.Feature<GeoJSON.Polygon>): number => {
  const areaM2 = turf.area(geojson);
  return areaM2 / 10000; // Convert to hectares
};

// Check intersection with forbidden zones
export const checkForbiddenZoneIntersection = (
  parcel: GeoJSON.Feature<GeoJSON.Polygon>,
  forbiddenZones: GeoJSON.Feature<GeoJSON.Polygon>[]
): { intersects: boolean; area: number } => {
  let totalIntersectionArea = 0;
  let intersects = false;
  
  forbiddenZones.forEach(zone => {
    try {
      const intersection = turf.intersect(parcel, zone);
      if (intersection) {
        intersects = true;
        totalIntersectionArea += turf.area(intersection);
      }
    } catch (error) {
      console.warn('Error calculating intersection:', error);
    }
  });
  
  return {
    intersects,
    area: totalIntersectionArea / 10000 // Convert to hectares
  };
};