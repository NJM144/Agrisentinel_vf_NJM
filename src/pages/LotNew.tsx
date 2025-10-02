import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Package } from 'lucide-react';

const LotNew: React.FC = () => {
  const navigate = useNavigate();
  const [parcelleId, setParcelleId] = useState('');
  const [poidsEstime, setPoidsEstime] = useState('');
  const [loading, setLoading] = useState(false);

  const mockParcelles = [
    { id: '1', name: 'Parcelle Nord' },
    { id: '2', name: 'Champ Est' },
    { id: '3', name: 'Plantation Sud' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/lots');
    }, 1000);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Nouveau Lot</h1>
                <p className="text-sm text-gray-500">
                  Créez un nouveau lot pour la traçabilité
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Informations du lot
            </CardTitle>
            <CardDescription>
              Renseignez les détails de votre nouveau lot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="parcelle">Parcelle d'origine</Label>
                <Select value={parcelleId} onValueChange={setParcelleId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une parcelle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockParcelles.map((parcelle) => (
                      <SelectItem key={parcelle.id} value={parcelle.id}>
                        {parcelle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poids">Poids estimé (kg)</Label>
                <Input
                  id="poids"
                  type="number"
                  value={poidsEstime}
                  onChange={(e) => setPoidsEstime(e.target.value)}
                  placeholder="Ex: 150"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Création...' : 'Créer le lot'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LotNew;