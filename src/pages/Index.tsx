import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Building, Shield, ArrowRight, Award, Satellite, MapPin, BarChart3, Globe, CheckCircle } from 'lucide-react';
import logo from '@/assets/logo.png'; 

export default function WelcomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Leaf,
      title: 'Gestion des Parcelles',
      description: 'Créez et gérez vos parcelles avec le GPS Sizer automatique'
    },
    {
      icon: Users,
      title: 'Multi-Acteurs',
      description: 'Planteurs, Coopératives, État et ONG sur une même plateforme'
    },
    {
      icon: Building,
      title: 'Traçabilité',
      description: 'Suivi complet de la récolte à la certification avec QR codes'
    },
    {
      icon: Shield,
      title: 'Surveillance',
      description: 'Détection des zones interdites et monitoring satellite'
    }
  ];

  const demoAccounts = [
    { email: 'planteur@demo.com', role: 'Planteur', password: 'demo123' },
    { email: 'coop@demo.com', role: 'Coopérative', password: 'demo123' },
    { email: 'etat@demo.com', role: 'État/Bailleurs', password: 'demo123' },
    { email: 'ong@demo.com', role: 'ONG/Certification', password: 'demo123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="Logo AgriSentinel" className="h-16 w-16 mr-3" />

              <div>
                <h1 className="text-2xl font-bold text-green-900">AgriSentinel</h1>
                <p className="text-sm text-gray-500">Surveillance agricole intelligente</p>
              </div>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Connexion
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 font-medium text-sm">
            Surveillance Agricole par Satellite
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Surveillez vos cultures avec
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> l'intelligence satellite</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Plateforme SaaS multi-acteurs pour la traçabilité, la conformité et l'optimisation 
            des rendements agricoles en Afrique de l'Ouest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
              Essayer la démo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Demander un devis
            </Button>
          </div>
        </div>
      </section>

        {/* Problématiques */}
        <section className="py-16 px-4 bg-gray-50 rounded-xl mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Les défis de l'agriculture moderne
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Les producteurs font face à des enjeux complexes de traçabilité, 
                conformité et optimisation des rendements.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Zones interdites</h3>
                <p className="text-gray-600 text-sm">
                  Risque d'incursion dans les aires protégées et forêts classées
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Rendements imprévisibles</h3>
                <p className="text-gray-600 text-sm">
                  Difficultés à prévoir et optimiser la production agricole
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Traçabilité complexe</h3>
                <p className="text-gray-600 text-sm">
                  Manque de transparence dans la chaîne d'approvisionnement
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Notre solution intégrée
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                AgriSentinel combine imagerie satellite, intelligence artificielle 
                et blockchain pour une agriculture durable.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <Leaf className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-semibold mb-2">Gestion des Parcelles</h3>
                <p className="text-gray-600 text-sm">
                  Créez et gérez vos parcelles avec le GPS Sizer automatique
                </p>
              </Card>
              <Card className="p-6">
                <Satellite className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Surveillance NDVI</h3>
                <p className="text-gray-600 text-sm">
                  Monitoring de la santé des cultures par imagerie satellite
                </p>
              </Card>
              <Card className="p-6">
                <Shield className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Géofencing</h3>
                <p className="text-gray-600 text-sm">
                  Détection automatique des zones interdites
                </p>
              </Card>
              <Card className="p-6">
                <Award className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="font-semibold mb-2">Traçabilité </h3>
                <p className="text-gray-600 text-sm">
                  Suivi complet de la récolte à la certification avec QR codes
                </p>
              </Card>
            </div>
          </div>
        </section>
        {/* Avantages */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Pourquoi choisir AgriSentinel ?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-acteurs</h3>
                <p className="text-green-100">
                  Planteurs, coopératives, État et organismes de certification
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Déployé sur GitHub</h3>
                <p className="text-green-100">
                  Solution légère et accessible, optimisée pour l'Afrique
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Agriculture durable</h3>
                <p className="text-green-100">
                  Respect des aires protégées et optimisation des rendements
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à transformer votre agriculture ?
            </h2>
            <p className="text-gray-600 mb-8">
              Rejoignez les producteurs qui utilisent déjà AgriSentinel pour 
              optimiser leurs rendements et assurer leur conformité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
                Commencer maintenant
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Planifier une démo
              </Button>
            </div>
          </div>
        </section>
         
      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AgriSentinel. Plateforme de surveillance agricole intelligente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}