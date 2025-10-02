import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png'; 

import { 
  Leaf, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Users,
  BarChart3,
  Shield,
  Building,
  LogOut
} from 'lucide-react';
import type { UserRole } from '@/guards/withRole';

interface UserData {
  uid: string;
  name: string;
  role: UserRole;
  email: string;
}

interface DashboardStats {
  totalParcels: number;
  totalSurface: number;
  healthyParcels: number;
  warningParcels: number;
  criticalParcels: number;
  totalLots: number;
  predictedYield: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalParcels: 0,
    totalSurface: 0,
    healthyParcels: 0,
    warningParcels: 0,
    criticalParcels: 0,
    totalLots: 0,
    predictedYield: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadDashboardStats();
  }, []);

  const loadUserData = () => {
    const storedUser = localStorage.getItem('agrisentinel_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  };

  const loadDashboardStats = () => {
    setLoading(true);
    // Mock data for demo
    setTimeout(() => {
      setStats({
        totalParcels: 5,
        totalSurface: 12.5,
        healthyParcels: 3,
        warningParcels: 1,
        criticalParcels: 1,
        totalLots: 8,
        predictedYield: 2400
      });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('agrisentinel_user');
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('userLogout'));
    
    // Force refresh auth state if function is available
    if ((window as any).refreshAuth) {
      (window as any).refreshAuth();
    }
    
    // Navigate to home page
    navigate('/', { replace: true });
    
    // Force page reload to ensure clean state
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const getRoleIcon = (role: UserRole) => {
    const icons = {
      planteur: Leaf,
      coop: Users,
      etat: Building,
      ong: Shield,
      cert: Shield
    };
    return icons[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      planteur: 'Planteur',
      coop: 'Coopérative',
      etat: 'État/Bailleurs',
      ong: 'ONG',
      cert: 'Certification'
    };
    return labels[role];
  };

  const renderPlanteurDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Parcelles totales</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalParcels}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalSurface} hectares
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">État de santé</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Badge variant="default" className="bg-green-500">
              {stats.healthyParcels} Saines
            </Badge>
            <Badge variant="secondary" className="bg-orange-500">
              {stats.warningParcels} Attention
            </Badge>
            <Badge variant="destructive">
              {stats.criticalParcels} Critique
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prévision rendement</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.predictedYield} kg</div>
          <p className="text-xs text-muted-foreground">
            Cette saison
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lots créés</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLots}</div>
          <p className="text-xs text-muted-foreground">
            Ce mois
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCoopDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Planteurs affiliés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">24</div>
          <p className="text-muted-foreground">+2 ce mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Surface totale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">156 ha</div>
          <p className="text-muted-foreground">Toutes cultures</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lots collectés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">89</div>
          <p className="text-muted-foreground">Ce mois</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderEtatDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Surface régionale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">2,340 ha</div>
          <p className="text-muted-foreground">Toutes cultures</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zones interdites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">12</div>
          <p className="text-muted-foreground">Infractions détectées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendement moyen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,850 kg/ha</div>
          <p className="text-muted-foreground">+5% vs année précédente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coopératives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">8</div>
          <p className="text-muted-foreground">Actives dans la région</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderOngDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Lots à certifier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">15</div>
          <p className="text-muted-foreground">En attente de validation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications validées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">142</div>
          <p className="text-muted-foreground">Ce mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audits programmés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">6</div>
          <p className="text-muted-foreground">Cette semaine</p>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p>Erreur de chargement des données utilisateur</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  const RoleIcon = getRoleIcon(userData.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="Logo AgriSentinel" className="h-16 w-16 mr-3" />              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriSentinel</h1>
                <p className="text-sm text-gray-500">Tableau de bord</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <RoleIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">{userData.name}</span>
                <Badge variant="outline" className="ml-2">
                  {getRoleLabel(userData.role)}
                </Badge>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {userData.name}
          </h2>
          <p className="text-gray-600">
            Voici un aperçu de vos données AgriSentinel
          </p>
        </div>

        {/* Role-specific dashboard content */}
        {userData.role === 'planteur' && renderPlanteurDashboard()}
        {userData.role === 'coop' && renderCoopDashboard()}
        {userData.role === 'etat' && renderEtatDashboard()}
        {(userData.role === 'ong' || userData.role === 'cert') && renderOngDashboard()}

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {userData.role === 'planteur' && (
              <>
                <Button 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/parcelles/new')}
                >
                  <MapPin className="h-6 w-6 mb-2" />
                  Nouvelle parcelle
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/parcelles')}
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Voir mes parcelles
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/lots')}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Mes lots
                </Button>
              </>
            )}
            {userData.role === 'coop' && (
              <>
                <Button 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/lots')}
                >
                  <Package className="h-6 w-6 mb-2" />
                  Gérer les lots
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/parcelles')}
                >
                  <Users className="h-6 w-6 mb-2" />
                  Voir planteurs
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Rapports
                </Button>
              </>
            )}
            {userData.role === 'etat' && (
              <>
                <Button 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/detections')}
                >
                  <MapPin className="h-6 w-6 mb-2" />
                  Détections satellite
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/admin')}
                >
                  <Users className="h-6 w-6 mb-2" />
                  Administration
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/parcelles')}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Rapports régionaux
                </Button>
              </>
            )}
            {(userData.role === 'ong' || userData.role === 'cert') && (
              <>
                <Button 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/lots')}
                >
                  <Shield className="h-6 w-6 mb-2" />
                  Certifier lots
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate('/detections')}
                >
                  <MapPin className="h-6 w-6 mb-2" />
                  Zones protégées
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;