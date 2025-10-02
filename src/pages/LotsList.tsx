import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Package, QrCode } from 'lucide-react';

const LotsList: React.FC = () => {
  const navigate = useNavigate();

  const mockLots = [
    {
      id: '1',
      parcelleId: '1',
      parcelleName: 'Parcelle Nord',
      poidsEstimeKg: 150,
      status: 'CREATED',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      parcelleId: '2',
      parcelleName: 'Champ Est',
      poidsEstimeKg: 200,
      status: 'RECU_COOP',
      createdAt: '2024-01-10'
    }
  ];

  const getStatusLabel = (status: string) => {
    const labels = {
      'CREATED': 'Créé',
      'RECU_COOP': 'Reçu par coopérative',
      'CERTIFIE': 'Certifié',
      'REJETE': 'Rejeté'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'CREATED': 'bg-blue-500',
      'RECU_COOP': 'bg-orange-500',
      'CERTIFIE': 'bg-green-500',
      'REJETE': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
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
                <h1 className="text-2xl font-bold text-gray-900">Mes Lots</h1>
                <p className="text-sm text-gray-500">
                  {mockLots.length} lot(s) créé(s)
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/lots/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau lot
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mockLots.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun lot créé
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre premier lot de traçabilité.
              </p>
              <Button onClick={() => navigate('/lots/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier lot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockLots.map((lot) => (
              <Card 
                key={lot.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/lots/${lot.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Lot #{lot.id}</CardTitle>
                      <CardDescription>
                        {lot.parcelleName}
                      </CardDescription>
                    </div>
                    <QrCode className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Poids estimé</span>
                      <span className="font-medium">{lot.poidsEstimeKg} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Statut</span>
                      <Badge className={`text-white ${getStatusColor(lot.status)}`}>
                        {getStatusLabel(lot.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Créé le</span>
                      <span>{new Date(lot.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LotsList;