// src/components/MapSizer.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import type { Feature, Polygon } from "geojson";
import * as turf from "@turf/turf";

// @ts-ignore - ces libs n'ont pas toujours des types complets
import parseGeoraster from "georaster";
import GeoTIFF from "geotiff";
import GeoRasterLayer from "georaster-layer-for-leaflet";

type Props = {
  lat: number;
  lon: number;
  tifName: string; // ex: "s2_Cocoa_ID_bssI9w_2024_01.tif"
  onPolygonGenerated: (polygon: Feature<Polygon>, areaHa: number) => void;
};

const NDVI_CLASS = (ndvi: number) =>
  ndvi === null || Number.isNaN(ndvi)
    ? { name: "NoData", color: [0, 0, 0, 0] }
    : ndvi < 0.25
    ? { name: "Zone nue", color: [210, 180, 140, 180] } // #D2B48C
    : ndvi < 0.6
    ? { name: "Zone cultivée", color: [0, 255, 0, 180] } // #00FF00
    : { name: "Zone forestière", color: [0, 100, 0, 200] }; // #006400

function useLeafletDraw(onFeature: (f: Feature<Polygon>, areaHa: number) => void) {
  const map = useMap();
  const drawnRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!drawnRef.current) {
      drawnRef.current = new L.FeatureGroup();
      map.addLayer(drawnRef.current);
    }

    const drawControl = new (L.Control as any).Draw({
      draw: {
        polygon: { allowIntersection: false, showArea: true },
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: { showArea: true },
      },
      edit: {
        featureGroup: drawnRef.current,
      },
    });
    map.addControl(drawControl);

    function handleCreated(e: any) {
      drawnRef.current!.clearLayers();
      const layer = e.layer as L.Polygon;
      drawnRef.current!.addLayer(layer);
      const gj = layer.toGeoJSON() as Feature<Polygon>;
      const areaM2 = turf.area(gj);
      onFeature(gj, areaM2 / 10000.0);
    }

    function handleEdited(e: any) {
      const layers = e.layers as L.FeatureGroup;
      layers.eachLayer((layer: any) => {
        const gj = (layer as L.Polygon).toGeoJSON() as Feature<Polygon>;
        const areaM2 = turf.area(gj);
        onFeature(gj, areaM2 / 10000.0);
      });
    }

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.removeControl(drawControl);
      if (drawnRef.current) {
        map.removeLayer(drawnRef.current);
      }
    };
  }, [map, onFeature]);

  return null;
}

const MapSizer: React.FC<Props> = ({ lat, lon, tifName, onPolygonGenerated }) => {
  const [loading, setLoading] = useState(false);
  const position = useMemo(() => [lat, lon] as [number, number], [lat, lon]);
  const rasterLayerRef = useRef<any>(null);

  // Charge le GeoTIFF et pose une couche raster colorée NDVI
  const RasterLoader: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);

          // charge depuis /public/tifs/...
          const url = `/tifs/${tifName}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const arrayBuffer = await response.arrayBuffer();

          const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
          const image = await tiff.getImage(); // première image
          const georaster = await parseGeoraster(await tiff.readRasters({ interleave: false }));

          // On essaye de détecter les indices de bandes (S2: B4=Red, B8=NIR)
          // georaster.values est [bands][rows][cols]
          // Si seulement 3 bandes RGB, on tombera sur un NDVI brouillé (ok pour demo)
          const redIndex = 3 - 1;   // souvent 4 (1-based) => 3 (0-based)
          const nirIndex = 8 - 1;   // souvent 8 => 7
          const hasBand = (i: number) => georaster.values[i] !== undefined;

          const iRed = hasBand(redIndex) ? redIndex : 0;
          const iNir = hasBand(nirIndex) ? nirIndex : Math.min(georaster.values.length - 1, 0);

          // Détruit l’ancienne couche si présente
          if (rasterLayerRef.current) {
            map.removeLayer(rasterLayerRef.current);
            rasterLayerRef.current = null;
          }

          // Couche NDVI colorisée (3 classes)
          const layer = new (GeoRasterLayer as any)({
            georaster,
            resolution: 64, // ↓ augmente pour perf / ↓ qualité
            pixelValuesToColorFn: (values: number[]) => {
              const red = values[iRed];
              const nir = values[iNir];
              if (red == null || nir == null) return "rgba(0,0,0,0)";
              const ndvi = (nir - red) / (nir + red + 1e-6);
              const { color } = NDVI_CLASS(ndvi);
              // rgba array → css string
              return `rgba(${color[0]},${color[1]},${color[2]},${(color[3] ?? 255) / 255})`;
            },
            opacity: 0.6,
          });

          layer.addTo(map);
          rasterLayerRef.current = layer;

          // Fit sur l’emprise du raster si besoin
          const bounds = layer.getBounds?.();
          if (bounds) map.fitBounds(bounds, { maxZoom: 17 });

        } catch (e) {
          console.error("GeoTIFF load error:", e);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [map, tifName]);

    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {loading ? "Chargement/Calcul NDVI…" : "Carte (Leaflet + OSM + NDVI client-side)"}
        </span>
      </div>

      <MapContainer center={position} zoom={15} className="w-full h-[500px]">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>Point ({lat.toFixed(5)}, {lon.toFixed(5)})</Popup>
        </Marker>

        {/* Couche raster NDVI colorisée */}
        <RasterLoader />

        {/* Outil de dessin/édition → remonte GeoJSON + surface */}
        <useLeafletDraw onFeature={onPolygonGenerated} />
      </MapContainer>

      <p className="mt-2 text-xs text-gray-500">
        Astuce : dessine un polygone (outil en haut à gauche) sur la zone de culture.
      </p>
    </div>
  );
};

export default MapSizer;
