import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Package, MapPin, Clock, Shield } from 'lucide-react';

const PublicLot: React.FC = () => {
  const { lotId } = useParams();

  const mockLot = {
    id: lotId,
    parcelleName: 'Parcelle Nord',
    culture: 'Cacao',
    poidsMesureKg: 148,
    status: 'CERTIFIE',
    createdAt: '2024-01-15',
    region: 'Région de la Marahoué'
  };

  const mockEvents = [
    {
      id: '1',
      type: 'RECOLTE',
      timestamp: '2024-01-15T10:00:00Z',
      location: 'Parcelle Nord, Bouaflé'
    },
    {
      id: '2',
      type: 'RECEPTION_COOP',
      timestamp: '2024-01-16T14:30:00Z',
      location: 'Coopérative SCAC, Bouaflé'
    },
    {
      id: '3',
      type: 'CERTIFICATION_VALIDEE',
      timestamp: '2024-01-18T09:15:00Z',
      location: 'Bureau de certification'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriSentinel</h1>
                <p className="text-sm text-gray-500">Traçabilité agricole</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Lot certifié et traçable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lot Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Informations du lot
              </CardTitle>
              <CardDescription>
                Lot #{mockLot.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Origine</span>
                <p className="font-medium">{mockLot.parcelleName}</p>
                <p className="text-sm text-gray-600">{mockLot.region}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Culture</span>
                  <p className="font-medium">{mockLot.culture}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Poids</span>
                  <p className="font-medium">{mockLot.poidsMesureKg} kg</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Statut</span>
                <div className="mt-1">
                  <Badge className="bg-green-500 text-white">
                    Certifié
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date de création</span>
                <p className="font-medium">
                  {new Date(mockLot.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Traceability Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Traçabilité
              </CardTitle>
              <CardDescription>
                Historique complet du lot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index < mockEvents.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-12 bg-green-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">
                            {event.type === 'RECOLTE' && 'Récolte'}
                            {event.type === 'RECEPTION_COOP' && 'Réception coopérative'}
                            {event.type === 'CERTIFICATION_VALIDEE' && 'Certification validée'}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-green-600 mr-2" />
              <span className="font-medium text-gray-900">AgriSentinel</span>
            </div>
            <p className="text-sm text-gray-600">
              Cette page publique certifie l'authenticité et la traçabilité de ce lot agricole.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Vérification effectuée le {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLot;