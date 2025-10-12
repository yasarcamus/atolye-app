import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductionCard } from '@/components/ProductionCard';
import { NewProductionDialog } from '@/components/NewProductionDialog';
import { TestDialog } from '@/components/TestDialog';
import { db, Production } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { Plus, Beaker, Settings, Crown, LogOut, Package, BookOpen, BarChart3 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { startNotificationService } from '@/lib/notifications';
import { signOut } from '@/lib/firebase';

export function WorkshopPage() {
  const navigate = useNavigate();
  const { setProductions, setSettings } = useStore();
  const [newProductionOpen, setNewProductionOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Live query for productions
  const productions = useLiveQuery(
    () => db.productions.orderBy('createdAt').reverse().toArray(),
    []
  );

  const settings = useLiveQuery(
    () => db.settings.toCollection().first(),
    []
  );

  useEffect(() => {
    const name = localStorage.getItem('distil_user_name');
    const email = localStorage.getItem('distil_user_email');
    
    if (name) setUserName(name);
    if (email) setUserEmail(email);
    
    // Check dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to body
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    if (productions) {
      setProductions(productions);
    }
  }, [productions, setProductions]);

  useEffect(() => {
    if (settings) {
      setSettings(settings);
    }
  }, [settings, setSettings]);

  // Start notification service
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    startNotificationService();
  }, []);

  const handleTest = (production: Production) => {
    setSelectedProduction(production);
    setTestDialogOpen(true);
  };

  const handleView = (production: Production) => {
    navigate(`/production/${production.id}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('distil_onboarded');
      localStorage.removeItem('distil_user_name');
      localStorage.removeItem('distil_user_email');
      localStorage.removeItem('distil_user_photo');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredProductions = productions?.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.status === 'active';
    if (filter === 'completed') return p.status === 'tested';
    return true;
  });

  const activeCount = productions?.filter(p => p.status === 'active').length || 0;
  const canAddProduction = settings?.isPremium || activeCount < 5;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0D1117]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 shadow-sm`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#C0A080] to-[#D4B99D] text-[#0D1117] p-2 rounded-lg shadow-md">
                <Beaker className="h-6 w-6" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>
                  {userName}'in Atölyesi
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>{userEmail || 'Parfüm üretim merkezi'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDarkMode}
                title="Tema Değiştir"
                className={darkMode ? 'text-[#8b949e] hover:text-[#e6edf3]' : 'text-gray-600 hover:text-gray-900'}
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
              {!settings?.isPremium && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  onClick={() => navigate('/premium')}
                >
                  <Crown className="h-4 w-4" />
                  Premium
                </Button>
              )}
              {settings?.isPremium && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full border border-yellow-300">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Premium</span>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/settings')}
                className={darkMode ? 'text-[#8b949e] hover:text-[#e6edf3]' : ''}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Çıkış Yap"
                className={darkMode ? 'text-[#8b949e] hover:text-[#e6edf3]' : ''}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-2 border-transparent ${darkMode ? 'text-[#8b949e] hover:text-[#e6edf3] hover:border-[#C0A080]' : 'hover:border-primary'}`}
              onClick={() => navigate('/materials')}
            >
              <Package className="h-4 w-4" />
              Hammaddeler
            </Button>
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-2 border-transparent ${darkMode ? 'text-[#8b949e] hover:text-[#e6edf3] hover:border-[#C0A080]' : 'hover:border-primary'}`}
              onClick={() => navigate('/recipes')}
            >
              <BookOpen className="h-4 w-4" />
              Reçeteler
            </Button>
            <Button
              variant="ghost"
              className={`gap-2 rounded-none border-b-2 border-transparent ${darkMode ? 'text-[#8b949e] hover:text-[#e6edf3] hover:border-[#C0A080]' : 'hover:border-primary'}`}
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="h-4 w-4" />
              Raporlar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow`}>
            <div className={`text-sm ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>Aktif Üretimler</div>
            <div className={`text-3xl font-bold mt-2 ${darkMode ? 'text-[#C0A080]' : 'bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'}`}>
              {activeCount}
            </div>
          </div>
          <div className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow`}>
            <div className={`text-sm ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>Toplam Üretim</div>
            <div className={`text-3xl font-bold mt-2 ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>{productions?.length || 0}</div>
          </div>
          <div className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow`}>
            <div className={`text-sm ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>Test Edilenler</div>
            <div className={`text-3xl font-bold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {productions?.filter(p => p.status === 'tested').length || 0}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Tümü
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Aktif
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Tamamlananlar
            </Button>
          </div>

          <Button 
            onClick={() => setNewProductionOpen(true)}
            disabled={!canAddProduction}
            className="gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Yeni Üretim
          </Button>
        </div>

        {!canAddProduction && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Ücretsiz hesaplarda maksimum 5 aktif üretim olabilir. Premium'a geçerek sınırsız üretim yapabilirsiniz!
            </p>
          </div>
        )}

        {/* Productions Grid */}
        {filteredProductions && filteredProductions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductions.map((production) => (
              <ProductionCard
                key={production.id}
                production={production}
                onTest={handleTest}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} rounded-xl border shadow-sm`}>
            <Beaker className={`h-16 w-16 ${darkMode ? 'text-[#8b949e]' : 'text-gray-400'} mx-auto mb-4 opacity-50`} />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>Henüz üretim yok</h3>
            <p className={`${darkMode ? 'text-[#8b949e]' : 'text-gray-600'} mb-6`}>
              İlk parfüm üretiminizi başlatın!
            </p>
            <Button onClick={() => setNewProductionOpen(true)} className={`gap-2 ${darkMode ? 'bg-[#C0A080] hover:bg-[#D4B99D] text-[#0D1117]' : ''}`}>
              <Plus className="h-4 w-4" />
              Yeni Üretim Başlat
            </Button>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <NewProductionDialog
        open={newProductionOpen}
        onOpenChange={setNewProductionOpen}
      />
      
      <TestDialog
        production={selectedProduction}
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
      />
    </div>
  );
}
