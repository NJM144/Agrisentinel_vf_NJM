import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';

const RecoltesForm: React.FC = () => {
  const { parcelleId } = useParams();
  const navigate = useNavigate();
  const [qtyKg, setQtyKg] = useState('');
  const [qualite, setQualite] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate(`/parcelles/${parcelleId}`);
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
                onClick={() => navigate(`/parcelles/${parcelleId}`)}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enregistrer une récolte</h1>
                <p className="text-sm text-gray-500">Parcelle ID: {parcelleId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Nouvelle récolte
            </CardTitle>
            <CardDescription>
              Enregistrez les données de votre récolte mensuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantité récoltée (kg)</Label>
                <Input
                  id="qty"
                  type="number"
                  value={qtyKg}
                  onChange={(e) => setQtyKg(e.target.value)}
                  placeholder="Ex: 150"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualite">Qualité (optionnel)</Label>
                <Input
                  id="qualite"
                  value={qualite}
                  onChange={(e) => setQualite(e.target.value)}
                  placeholder="Ex: Excellente, Bonne, Moyenne"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer la récolte'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecoltesForm;