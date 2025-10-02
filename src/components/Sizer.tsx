import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Hexagon, Square } from 'lucide-react';
import { generatePolygonFromPoint, calculateAreaHa } from '@/lib/geo';

interface SizerProps {
  lat: number;
  lon: number;
  onPolygonGenerated: (polygon: GeoJSON.Feature<GeoJSON.Polygon>, area: number) => void;
}

const Sizer: React.FC<SizerProps> = ({ lat, lon, onPolygonGenerated }) => {
  const [surfaceHa, setSurfaceHa] = useState([2.0]);
  const [shape, setShape] = useState<'hex' | 'square'>('hex');
  const [generatedPolygon, setGeneratedPolygon] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);

  useEffect(() => {
    generatePolygon();
  }, [lat, lon, surfaceHa[0], shape]);

  const generatePolygon = () => {
    try {
      const polygon = generatePolygonFromPoint({
        lat,
        lon,
        surfaceHa: surfaceHa[0],
        shape
      });
      
      const actualArea = calculateAreaHa(polygon);
      
      setGeneratedPolygon(polygon);
      setCalculatedArea(actualArea);
      onPolygonGenerated(polygon, actualArea);
    } catch (error) {
      console.error('Error generating polygon:', error);
    }
  };

  const handleSurfaceChange = (value: number[]) => {
    setSurfaceHa(value);
  };

  const handleShapeChange = (newShape: 'hex' | 'square') => {
    setShape(newShape);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Générateur de Parcelle (Sizer)
        </CardTitle>
        <CardDescription>
          Créez automatiquement un polygone à partir d'un point GPS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GPS Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Latitude</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono">
              {lat.toFixed(6)}°
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Longitude</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono">
              {lon.toFixed(6)}°
            </div>
          </div>
        </div>

        {/* Shape Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Forme du polygone</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={shape === 'hex' ? 'default' : 'outline'}
              onClick={() => handleShapeChange('hex')}
              className="h-16 flex flex-col items-center justify-center"
            >
              <Hexagon className="h-6 w-6 mb-1" />
              <span className="text-xs">Hexagone</span>
            </Button>
            <Button
              variant={shape === 'square' ? 'default' : 'outline'}
              onClick={() => handleShapeChange('square')}
              className="h-16 flex flex-col items-center justify-center"
            >
              <Square className="h-6 w-6 mb-1" />
              <span className="text-xs">Carré</span>
            </Button>
          </div>
        </div>

        {/* Surface Adjustment */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm font-medium">Surface cible</Label>
            <Badge variant="outline">
              {surfaceHa[0].toFixed(1)} ha
            </Badge>
          </div>
          <Slider
            value={surfaceHa}
            onValueChange={handleSurfaceChange}
            min={0.1}
            max={20}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1 ha</span>
            <span>20 ha</span>
          </div>
        </div>

        {/* Generated Polygon Info */}
        {generatedPolygon && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Polygone généré</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Surface calculée:</span>
                <div className="font-medium text-green-900">
                  {calculatedArea.toFixed(2)} ha
                </div>
              </div>
              <div>
                <span className="text-green-700">Nombre de sommets:</span>
                <div className="font-medium text-green-900">
                  {generatedPolygon.geometry.coordinates[0].length - 1}
                </div>
              </div>
            </div>
            
            {Math.abs(calculatedArea - surfaceHa[0]) > 0.1 && (
              <div className="mt-2 text-xs text-green-700">
                <strong>Note:</strong> La surface calculée peut légèrement différer de la surface cible 
                en raison de la projection géographique.
              </div>
            )}
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Le Sizer génère automatiquement un polygone régulier</li>
            <li>• Ajustez la surface avec le curseur</li>
            <li>• Choisissez entre hexagone (recommandé) ou carré</li>
            <li>• Le polygone est centré sur le point GPS fourni</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sizer;