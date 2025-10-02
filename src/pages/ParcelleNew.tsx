import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, Save } from 'lucide-react';
import Sizer from '@/components/Sizer';

const ParcelleNew: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [culture, setCulture] = useState<'cacao' | 'hevea' | 'palmier'>('cacao');
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [densite, setDensite] = useState(100);
  const [lat, setLat] = useState(5.3364); // Default to Côte d'Ivoire coordinates
  const [lon, setLon] = useState(-4.0267);
  const [generatedPolygon, setGeneratedPolygon] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);

  // Get user's location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Impossible d\'obtenir votre position. Utilisez les coordonnées par défaut.');
        }
      );
    } else {
      setError('Géolocalisation non supportée par votre navigateur.');
    }
  };

  const handlePolygonGenerated = (polygon: GeoJSON.Feature<GeoJSON.Polygon>, area: number) => {
    setGeneratedPolygon(polygon);
    setCalculatedArea(area);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !generatedPolygon) return;

    setLoading(true);
    setError('');

    try {
      const parcelleData = {
        ownerUid: user.uid,
        name,
        culture,
        annee,
        densite,
        geomGeoJSON: generatedPolygon,
        surfaceHa: calculatedArea,
        lastRainDays: 5, // Default value
        zoneInterdite: false, // Will be calculated later
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'parcelles'), parcelleData);
      navigate('/parcelles');
    } catch (error) {
      console.error('Error creating parcelle:', error);
      setError('Erreur lors de la création de la parcelle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/parcelles')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nouvelle Parcelle</h1>
                <p className="text-sm text-gray-500">
                  Créez une nouvelle parcelle avec le générateur GPS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la parcelle</CardTitle>
              <CardDescription>
                Renseignez les détails de votre nouvelle parcelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la parcelle</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Parcelle Nord"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culture">Type de culture</Label>
                  <Select value={culture} onValueChange={(value: 'cacao' | 'hevea' | 'palmier') => setCulture(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cacao">Cacao</SelectItem>
                      <SelectItem value="hevea">Hévéa</SelectItem>
                      <SelectItem value="palmier">Palmier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annee">Année de plantation</Label>
                    <Input
                      id="annee"
                      type="number"
                      value={annee}
                      onChange={(e) => setAnnee(parseInt(e.target.value))}
                      min={1990}
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="densite">Densité (plants/ha)</Label>
                    <Input
                      id="densite"
                      type="number"
                      value={densite}
                      onChange={(e) => setDensite(parseInt(e.target.value))}
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Coordonnées GPS</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Ma position
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lon">Longitude</Label>
                      <Input
                        id="lon"
                        type="number"
                        step="any"
                        value={lon}
                        onChange={(e) => setLon(parseFloat(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !generatedPolygon}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Création...' : 'Créer la parcelle'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sizer */}
          {/* <Sizer
            lat={lat}
            lon={lon}
            onPolygonGenerated={handlePolygonGenerated}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ParcelleNew;