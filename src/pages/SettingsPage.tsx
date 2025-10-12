import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bell, Clock, User, Crown, Trash2, Moon, Sun } from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTheme } from '@/contexts/ThemeContext';

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, setSettings } = useStore();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userName, setUserName] = useState('');
  const [notificationTime, setNotificationTime] = useState('20:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const dbSettings = useLiveQuery(() => db.settings.toCollection().first(), []);

  useEffect(() => {
    const name = localStorage.getItem('distil_user_name') || '';
    setUserName(name);
    
    if (dbSettings) {
      setNotificationTime(dbSettings.notificationTime);
      setNotificationsEnabled(dbSettings.notificationsEnabled);
    }
  }, [dbSettings]);

  const handleSave = async () => {
    // Save user name
    localStorage.setItem('distil_user_name', userName);

    // Update settings in DB
    if (dbSettings?.id) {
      await db.settings.update(dbSettings.id, {
        notificationTime,
        notificationsEnabled,
        updatedAt: new Date(),
      });
      
      setSettings({
        ...dbSettings,
        notificationTime,
        notificationsEnabled,
        updatedAt: new Date(),
      });
    }

    alert('Ayarlar kaydedildi!');
    navigate('/workshop');
  };

  const handleClearData = async () => {
    if (confirm('Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      await db.productions.clear();
      await db.materials.clear();
      alert('Tüm veriler silindi!');
      navigate('/workshop');
    }
  };

  const productionCount = useLiveQuery(() => db.productions.count(), []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0D1117]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/workshop')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>Ayarlar</h1>
              <p className="text-sm text-muted-foreground">Hesap ve bildirim ayarları</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription>Kişisel bilgilerinizi düzenleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">İsim</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="İsminiz"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Görünüm
              </CardTitle>
              <CardDescription>Tema ayarları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>Karanlık Mod</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? 'Açık' : 'Kapalı'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Bildirim Ayarları
              </CardTitle>
              <CardDescription>Günlük hatırlatma ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bildirimleri Aç</Label>
                  <p className="text-sm text-muted-foreground">
                    Günlük hatırlatmalar al
                  </p>
                </div>
                <Button
                  variant={notificationsEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  {notificationsEnabled ? 'Açık' : 'Kapalı'}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Bildirim Saati
                </Label>
                <Input
                  id="notificationTime"
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  disabled={!notificationsEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Her gün bu saatte hatırlatma alacaksınız
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Premium Status */}
          <Card className={settings?.isPremium ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className={settings?.isPremium ? 'h-5 w-5 text-yellow-600' : 'h-5 w-5'} />
                Premium Durum
              </CardTitle>
              <CardDescription>
                {settings?.isPremium ? 'Premium üyesiniz!' : 'Ücretsiz plan kullanıyorsunuz'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settings?.isPremium ? (
                <div className="space-y-2">
                  <p className="text-sm">✅ Sınırsız aktif üretim</p>
                  <p className="text-sm">✅ Sınırsız maliyet hesaplama</p>
                  <p className="text-sm">✅ Gelişmiş özellikler</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">📦 Maksimum 5 aktif üretim</p>
                    <p className="text-sm">💰 3 üretim için maliyet hesaplama</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/premium')}
                    className="w-full gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Premium'a Geç
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Veri Yönetimi
              </CardTitle>
              <CardDescription>
                Toplam {productionCount || 0} üretim kaydınız var
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive"
                onClick={handleClearData}
                className="w-full"
              >
                Tüm Verileri Sil
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Bu işlem geri alınamaz!
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/workshop')}
              className="flex-1"
            >
              İptal
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1"
            >
              Kaydet
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
