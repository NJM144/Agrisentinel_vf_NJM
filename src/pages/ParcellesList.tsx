import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Plus, 
  Search, 
  Leaf, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface Parcelle {
  id: string;
  name: string;
  culture: 'cacao' | 'hevea' | 'palmier';
  surfaceHa: number;
  healthStatus: 'Vert' | 'Orange' | 'Rouge';
  zoneInterdite: boolean;
  lastUpdate: string;
}

const ParcellesList: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cultureFilter, setCultureFilter] = useState<string>('all');

  // Mock data for demo
  const mockParcelles: Parcelle[] = [
    {
      id: '1',
      name: 'Parcelle Nord',
      culture: 'cacao',
      surfaceHa: 2.5,
      healthStatus: 'Vert',
      zoneInterdite: false,
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Champ Est',
      culture: 'hevea',
      surfaceHa: 3.2,
      healthStatus: 'Orange',
      zoneInterdite: false,
      lastUpdate: '2024-01-14'
    },
    {
      id: '3',
      name: 'Plantation Sud',
      culture: 'palmier',
      surfaceHa: 1.8,
      healthStatus: 'Rouge',
      zoneInterdite: true,
      lastUpdate: '2024-01-13'
    },
    {
      id: '4',
      name: 'Terrain Ouest',
      culture: 'cacao',
      surfaceHa: 4.1,
      healthStatus: 'Vert',
      zoneInterdite: false,
      lastUpdate: '2024-01-12'
    },
    {
      id: '5',
      name: 'Parcelle Centre',
      culture: 'hevea',
      surfaceHa: 2.9,
      healthStatus: 'Orange',
      zoneInterdite: false,
      lastUpdate: '2024-01-11'
    }
  ];

  useEffect(() => {
    loadParcelles();
  }, [user]);

  const loadParcelles = async () => {
    setLoading(true);
    try {
      // For demo, use mock data
      setTimeout(() => {
        setParcelles(mockParcelles);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading parcelles:', error);
      setLoading(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Vert':
        return 'bg-green-500';
      case 'Orange':
        return 'bg-orange-500';
      case 'Rouge':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'Vert':
        return <CheckCircle className="h-4 w-4" />;
      case 'Orange':
      case 'Rouge':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  const getCultureLabel = (culture: string) => {
    const labels = {
      cacao: 'Cacao',
      hevea: 'Hévéa',
      palmier: 'Palmier'
    };
    return labels[culture as keyof typeof labels] || culture;
  };

  const filteredParcelles = parcelles.filter(parcelle => {
    const matchesSearch = parcelle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCulture = cultureFilter === 'all' || parcelle.culture === cultureFilter;
    return matchesSearch && matchesCulture;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p>Chargement des parcelles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <h1 className="text-2xl font-bold text-gray-900">Mes Parcelles</h1>
                <p className="text-sm text-gray-500">
                  {filteredParcelles.length} parcelle(s) • {parcelles.reduce((sum, p) => sum + p.surfaceHa, 0).toFixed(1)} ha total
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/parcelles/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle parcelle
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une parcelle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={cultureFilter} onValueChange={setCultureFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer par culture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les cultures</SelectItem>
              <SelectItem value="cacao">Cacao</SelectItem>
              <SelectItem value="hevea">Hévéa</SelectItem>
              <SelectItem value="palmier">Palmier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parcelles Grid */}
        {filteredParcelles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune parcelle trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || cultureFilter !== 'all' 
                  ? 'Aucune parcelle ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre première parcelle.'
                }
              </p>
              {!searchTerm && cultureFilter === 'all' && (
                <Button onClick={() => navigate('/parcelles/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer ma première parcelle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredParcelles.map((parcelle) => (
              <Card 
                key={parcelle.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/parcelles/${parcelle.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{parcelle.name}</CardTitle>
                      <CardDescription>
                        {getCultureLabel(parcelle.culture)} • {parcelle.surfaceHa} ha
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${getHealthStatusColor(parcelle.healthStatus)}`}
                      >
                        <div className="flex items-center">
                          {getHealthStatusIcon(parcelle.healthStatus)}
                          <span className="ml-1">{parcelle.healthStatus}</span>
                        </div>
                      </Badge>
                      {parcelle.zoneInterdite && (
                        <Badge variant="destructive" className="text-xs">
                          Zone interdite
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Dernière mise à jour</span>
                    <span>{new Date(parcelle.lastUpdate).toLocaleDateString('fr-FR')}</span>
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

export default ParcellesList;