import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, Users, Building, Shield, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@/guards/withRole';

// Mock authentication for demo purposes
const DEMO_USERS = {
  'planteur@demo.com': { password: 'demo123', role: 'planteur' as UserRole, name: 'Jean Kouassi' },
  'coop@demo.com': { password: 'demo123', role: 'coop' as UserRole, name: 'Coopérative SCAC' },
  'etat@demo.com': { password: 'demo123', role: 'etat' as UserRole, name: 'Ministère Agriculture' },
  'ong@demo.com': { password: 'demo123', role: 'ong' as UserRole, name: 'ONG Certification' }
};

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('planteur');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleIcons = {
    planteur: Leaf,
    coop: Users,
    etat: Building,
    ong: Shield,
    cert: Shield
  };

  const roleLabels = {
    planteur: 'Planteur',
    coop: 'Coopérative',
    etat: 'État/Bailleurs',
    ong: 'ONG',
    cert: 'Certification'
  };

  const loginUser = (userData: any) => {
    // Store user data in localStorage
    localStorage.setItem('agrisentinel_user', JSON.stringify(userData));
    
    // Dispatch custom event to notify App component
    window.dispatchEvent(new CustomEvent('agrisentinel-login'));
    
    // Force a re-render by calling the global checkAuth function if available
    if ((window as any).checkAuth) {
      (window as any).checkAuth();
    }
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock authentication
      const user = DEMO_USERS[email as keyof typeof DEMO_USERS];
      
      if (!user || user.password !== password) {
        setError('Email ou mot de passe incorrect.');
        return;
      }

      const userData = {
        uid: 'demo-' + user.role,
        email,
        name: user.name,
        role: user.role
      };

      loginUser(userData);
    } catch (error) {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock user creation
      const userData = {
        uid: 'new-' + Date.now(),
        email,
        name,
        role
      };

      loginUser(userData);
    } catch (error) {
      setError('Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string) => {
    const user = DEMO_USERS[demoEmail as keyof typeof DEMO_USERS];
    if (user) {
      setLoading(true);
      const userData = {
        uid: 'demo-' + user.role,
        email: demoEmail,
        name: user.name,
        role: user.role
      };
      
      setTimeout(() => {
        loginUser(userData);
        setLoading(false);
      }, 500); // Small delay for better UX
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">AgriSentinel</h1>
            </div>
            <p className="text-gray-600">Surveillance agricole intelligente</p>
          </div>
          <div></div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Demo Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Comptes de Démonstration</CardTitle>
              <CardDescription>
                Cliquez sur un compte pour vous connecter rapidement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(DEMO_USERS).map(([email, user]) => {
                const Icon = roleIcons[user.role];
                return (
                  <Button
                    key={email}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => quickLogin(email)}
                    disabled={loading}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{email}</div>
                      <div className="text-xs text-gray-400">{roleLabels[user.role]}</div>
                    </div>
                  </Button>
                );
              })}
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Connexion en cours...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>
                Accédez à votre tableau de bord AgriSentinel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Se connecter</TabsTrigger>
                  <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Mot de passe</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nom complet</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 caractères"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleLabels).map(([key, label]) => {
                            const Icon = roleIcons[key as UserRole];
                            return (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center">
                                  <Icon className="h-4 w-4 mr-2" />
                                  {label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Création...' : 'Créer un compte'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;