
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, Award, BarChart3, Settings, Presentation } from 'lucide-react';
import LiveScoreboard from '@/components/LiveScoreboard';
import EventResults from '@/components/EventResults';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';
import CarouselView from '@/components/CarouselView';
import { useEventContext } from '../components/EventContext';

const Index = () => {
  const [activeView, setActiveView] = useState<'public' | 'admin' | 'carousel' | 'login'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { events } = useEventContext();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setActiveView('admin');
    } else {
      setActiveView('login');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveView('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('public');
  };

  if (activeView === 'login') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (activeView === 'admin') {
    return <AdminDashboard onBack={handleLogout} />;
  }

  if (activeView === 'carousel') {
    return <CarouselView onBack={() => setActiveView('public')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cynosure 2025-'26</h1>
                <p className="text-gray-600">Live Scoring & Results Dashboard</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setActiveView('carousel')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Presentation className="h-4 w-4" />
                <span>Carousel View</span>
              </Button>
              <Button 
                onClick={handleAdminClick}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Live Scoreboard */}
        <LiveScoreboard />
        
        {/* Event Results */}
        <EventResults />
      </main>
    </div>
  );
};

export default Index;
