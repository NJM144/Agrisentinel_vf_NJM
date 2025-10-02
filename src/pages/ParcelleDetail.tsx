import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Leaf, TrendingUp, Calendar } from 'lucide-react';

const ParcelleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for demo
  const parcelle = {
    id,
    name: 'Parcelle Nord',
    culture: 'cacao',
    surfaceHa: 2.5,
    healthStatus: 'Vert',
    zoneInterdite: false,
    annee: 2020,
    densite: 120,
    lastRainDays: 3,
    predictedYield: 1800
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
                <h1 className="text-2xl font-bold text-gray-900">{parcelle.name}</h1>
                <p className="text-sm text-gray-500">
                  Détails de la parcelle
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Enregistrer récolte
              </Button>
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                Créer un lot
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Culture</span>
                <p className="font-medium">Cacao</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Surface</span>
                <p className="font-medium">{parcelle.surfaceHa} hectares</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Année de plantation</span>
                <p className="font-medium">{parcelle.annee}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Densité</span>
                <p className="font-medium">{parcelle.densite} plants/ha</p>
              </div>
            </CardContent>
          </Card>

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 mr-2" />
                État de santé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Statut actuel</span>
                <Badge className="bg-green-500 text-white">
                  {parcelle.healthStatus}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-500">Dernière pluie</span>
                <p className="font-medium">{parcelle.lastRainDays} jours</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Zone interdite</span>
                <p className="font-medium">
                  {parcelle.zoneInterdite ? 'Oui' : 'Non'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Yield Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Prévision de rendement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Rendement estimé</span>
                <p className="text-2xl font-bold text-green-600">
                  {parcelle.predictedYield} kg
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Par hectare</span>
                <p className="font-medium">
                  {Math.round(parcelle.predictedYield / parcelle.surfaceHa)} kg/ha
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
            <CardDescription>
              Carte de la parcelle et zones environnantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Carte interactive (à implémenter)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParcelleDetail;