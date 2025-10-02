import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Download, Search, Settings } from 'lucide-react';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    {
      id: '1',
      name: 'Jean Kouassi',
      email: 'jean.kouassi@email.com',
      role: 'planteur',
      createdAt: '2024-01-10',
      status: 'active'
    },
    {
      id: '2',
      name: 'Coopérative SCAC',
      email: 'contact@scac.ci',
      role: 'coop',
      createdAt: '2024-01-08',
      status: 'active'
    },
    {
      id: '3',
      name: 'Ministère Agriculture',
      email: 'admin@minagri.ci',
      role: 'etat',
      createdAt: '2024-01-05',
      status: 'active'
    }
  ];

  const getRoleLabel = (role: string) => {
    const labels = {
      planteur: 'Planteur',
      coop: 'Coopérative',
      etat: 'État/Bailleurs',
      ong: 'ONG',
      cert: 'Certification'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      planteur: 'bg-green-500',
      coop: 'bg-blue-500',
      etat: 'bg-purple-500',
      ong: 'bg-orange-500',
      cert: 'bg-red-500'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = () => {
    // Mock export functionality
    const csvContent = mockUsers.map(user => 
      `${user.name},${user.email},${user.role},${user.createdAt}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
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
                <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                <p className="text-sm text-gray-500">
                  Gestion des utilisateurs et des données
                </p>
              </div>
            </div>
            <Button onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <p className="text-sm text-gray-600">Utilisateurs totaux</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {mockUsers.filter(u => u.role === 'planteur').length}
              </div>
              <p className="text-sm text-gray-600">Planteurs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {mockUsers.filter(u => u.role === 'coop').length}
              </div>
              <p className="text-sm text-gray-600">Coopératives</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {mockUsers.filter(u => u.role === 'etat').length}
              </div>
              <p className="text-sm text-gray-600">Organismes d'État</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gestion des utilisateurs
            </CardTitle>
            <CardDescription>
              Liste des utilisateurs enregistrés sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users Table */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={`text-white ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;