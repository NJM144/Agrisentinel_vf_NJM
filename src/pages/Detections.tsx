import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Map, Filter } from 'lucide-react';

const Detections: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCulture, setSelectedCulture] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const mockDetections = {
    cacao: 1245,
    hevea: 892,
    palmier: 567,
    total: 2704
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Détections de Plantations</h1>
                <p className="text-sm text-gray-500">
                  Analyse par satellite des cultures dans la région
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Culture</label>
                <Select value={selectedCulture} onValueChange={setSelectedCulture}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les cultures</SelectItem>
                    <SelectItem value="cacao">Cacao</SelectItem>
                    <SelectItem value="hevea">Hévéa</SelectItem>
                    <SelectItem value="palmier">Palmier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Région</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    <SelectItem value="marahoue">Marahoué</SelectItem>
                    <SelectItem value="haut-sassandra">Haut-Sassandra</SelectItem>
                    <SelectItem value="goh">Gôh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{mockDetections.total}</div>
              <p className="text-sm text-gray-600">Détections totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">{mockDetections.cacao}</div>
              <p className="text-sm text-gray-600">Plantations de cacao</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{mockDetections.hevea}</div>
              <p className="text-sm text-gray-600">Plantations d'hévéa</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{mockDetections.palmier}</div>
              <p className="text-sm text-gray-600">Plantations de palmier</p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="h-5 w-5 mr-2" />
              Carte des détections
            </CardTitle>
            <CardDescription>
              Visualisation des plantations détectées par analyse satellite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Carte interactive des détections</p>
                <p className="text-sm text-gray-400">
                  Intégration avec les données satellite en cours...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Detections;