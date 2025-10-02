import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode, Package, Clock } from 'lucide-react';

const LotDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const mockLot = {
    id,
    parcelleId: '1',
    parcelleName: 'Parcelle Nord',
    poidsEstimeKg: 150,
    poidsMesureKg: 148,
    status: 'RECU_COOP',
    createdAt: '2024-01-15',
    currentHash: 'abc123def456'
  };

  const mockEvents = [
    {
      id: '1',
      type: 'RECOLTE',
      timestamp: '2024-01-15T10:00:00Z',
      actorName: 'Jean Kouassi',
      hash: 'abc123'
    },
    {
      id: '2',
      type: 'RECEPTION_COOP',
      timestamp: '2024-01-16T14:30:00Z',
      actorName: 'Coopérative SCAC',
      hash: 'def456'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/lots')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lot #{mockLot.id}</h1>
                <p className="text-sm text-gray-500">
                  Détails et traçabilité du lot
                </p>
              </div>
            </div>
            <Button>
              <QrCode className="h-4 w-4 mr-2" />
              Voir QR Code
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lot Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Informations du lot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Parcelle d'origine</span>
                <p className="font-medium">{mockLot.parcelleName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Poids estimé</span>
                  <p className="font-medium">{mockLot.poidsEstimeKg} kg</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Poids mesuré</span>
                  <p className="font-medium">{mockLot.poidsMesureKg} kg</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Hash actuel</span>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                  {mockLot.currentHash}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timeline de traçabilité
              </CardTitle>
              <CardDescription>
                Historique des événements de ce lot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {event.type === 'RECOLTE' ? 'Récolte' : 'Réception coopérative'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Par {event.actorName}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(event.timestamp).toLocaleDateString('fr-FR')}
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        Hash: {event.hash}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LotDetail;