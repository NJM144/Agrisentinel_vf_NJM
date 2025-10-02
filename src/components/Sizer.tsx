// src/components/Sizer.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import type { Feature, Polygon as GJPolygon } from "geojson";
import * as turf from "@turf/turf";

// Ces deux libs n'ont pas toujours des types complets → any
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GeoTIFF from "geotiff";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GeoRasterLayer from "georaster-layer-for-leaflet";

type Props = {
  lat: number;
  lon: number;
  onPolygonGenerated: (polygon: GeoJSON.Feature<GeoJSON.Polygon>, areaHa: number) => void;
};

// --- Classes NDVI (simple, client-side)
const NDVI_CLASS = (ndvi: number) =>
  ndvi === null || Number.isNaN(ndvi)
    ? { name: "NoData", color: [0, 0, 0, 0] }
    : ndvi < 0.25
    ? { name: "Zone nue", color: [210, 180, 140, 180] } // #D2B48C
    : ndvi < 0.60
    ? { name: "Zone cultivée", color: [0, 255, 0, 180] } // #00FF00
    : { name: "Zone forestière", color: [0, 100, 0, 200] }; // #006400

/** Contrôles de dessin/édition via Leaflet.Draw */
function DrawControls({
  onFeature,
}: {
  onFeature: (f: Feature<GJPolygon>, areaHa: number) => void;
}) {
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
        rectangle: { showArea: true },
        marker: false,
        polyline: false,
        circle: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawnRef.current },
    });
    map.addControl(drawControl);

    function handleCreated(e: any) {
      drawnRef.current!.clearLayers();
      const layer = e.layer as L.Polygon;
      drawnRef.current!.addLayer(layer);
      const gj = layer.toGeoJSON() as Feature<GJPolygon>;
      const areaHa = turf.area(gj) / 10000.0;
      onFeature(gj, areaHa);
    }

    function handleEdited(e: any) {
      const layers = e.layers as L.FeatureGroup;
      layers.eachLayer((layer: any) => {
        const gj = (layer as L.Polygon).toGeoJSON() as Feature<GJPolygon>;
        const areaHa = turf.area(gj) / 10000.0;
        onFeature(gj, areaHa);
      });
    }

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.removeControl(drawControl);
      if (drawnRef.current) map.removeLayer(drawnRef.current);
    };
  }, [map, onFeature]);

  return null;
}

/** Couche raster NDVI depuis un GeoTIFF servi par /public/tifs/<tifName> */
function NDVIRaster({ tifName }: { tifName: string }) {
  const map = useMap();
  const rasterLayerRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        // 👉 import dynamique : évite les soucis de résolution Vite/Rollup avec georaster
        const { default: parseGeoraster } = await import(
          // Chemin du bundle UMD (plus fiable en build Netlify)
          "georaster/dist/georaster.min.js"
        );

        const url = `/tifs/${tifName}`; // place ton fichier dans public/tifs/
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GeoTIFF HTTP ${res.status}`);
        const buf = await res.arrayBuffer();

        const tiff = await GeoTIFF.fromArrayBuffer(buf);
        const image = await tiff.getImage();
        const rasters = await tiff.readRasters({ interleave: false });

        // parseGeoraster accepte (rasters, image)
        const georaster = await parseGeoraster(rasters, image);

        // Essai indices Sentinel-2 (B4=red, B8=nir). Fallback si indisponible.
        const redIdx = 4 - 1;
        const nirIdx = 8 - 1;
        const hasBand = (i: number) => georaster.values[i] !== undefined;
        const iRed = hasBand(redIdx) ? redIdx : 0;
        const iNir = hasBand(nirIdx) ? nirIdx : Math.min(georaster.values.length - 1, 0);

        if (rasterLayerRef.current) {
          map.removeLayer(rasterLayerRef.current);
          rasterLayerRef.current = null;
        }

        const layer = new (GeoRasterLayer as any)({
          georaster,
          resolution: 64, // augmenter pour qualité (plus lent), baisser pour perf
          pixelValuesToColorFn: (values: number[]) => {
            const red = values[iRed];
            const nir = values[iNir];
            if (red == null || nir == null) return "rgba(0,0,0,0)";
            const ndvi = (nir - red) / (nir + red + 1e-6);
            const { color } = NDVI_CLASS(ndvi);
            return `rgba(${color[0]},${color[1]},${color[2]},${(color[3] ?? 255) / 255})`;
          },
          opacity: 0.6,
        });

        layer.addTo(map);
        rasterLayerRef.current = layer;

        const bounds = layer.getBounds?.();
        if (bounds) map.fitBounds(bounds, { maxZoom: 17 });
      } catch (e) {
        console.error("GeoTIFF/NDVI error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (rasterLayerRef.current) {
        map.removeLayer(rasterLayerRef.current);
        rasterLayerRef.current = null;
      }
    };
  }, [map, tifName]);

  return (
    <div className="absolute left-2 top-2 z-[1000] bg-white/90 rounded px-2 py-1 text-xs">
      NDVI client-side {loading ? "…chargement" : ""}
    </div>
  );
}

const Sizer: React.FC<Props> = ({ lat, lon, onPolygonGenerated }) => {
  const center = useMemo(() => [lat, lon] as [number, number], [lat, lon]);

  // Tu peux remplacer par un Select si plusieurs tiffs :
  const tifName = "s2_Cocoa_ID_bssI9w_2024_01.tif";

  return (
    <div className="w-full">
      <MapContainer center={center} zoom={15} className="w-full h-[500px]">
        {/* Fond OSM libre */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Marqueur au centre saisi */}
        <Marker position={center}>
          <Popup>Centre ({lat.toFixed(5)}, {lon.toFixed(5)})</Popup>
        </Marker>

        {/* Couche raster NDVI colorisée à partir du GeoTIFF */}
        <NDVIRaster tifName={tifName} />

        {/* Outils de dessin/édition → remontent polygon + areaHa */}
        <DrawControls
          onFeature={(f, areaHa) => onPolygonGenerated(f as any, areaHa)}
        />
      </MapContainer>

      <p className="mt-2 text-xs text-gray-500">
        Dessine un polygone (outil en haut à gauche) sur la zone à enregistrer.
      </p>
    </div>
  );
};

export default Sizer;
