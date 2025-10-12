import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Crown, Check, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { useLiveQuery } from 'dexie-react-hooks';

export function PremiumPage() {
  const navigate = useNavigate();
  const { setSettings } = useStore();
  const dbSettings = useLiveQuery(() => db.settings.toCollection().first(), []);

  const handleActivatePremium = async () => {
    if (dbSettings?.id) {
      await db.settings.update(dbSettings.id, {
        isPremium: true,
        updatedAt: new Date(),
      });
      
      setSettings({
        ...dbSettings,
        isPremium: true,
        updatedAt: new Date(),
      });
      
      alert('Premium aktif edildi! 🎉');
      navigate('/workshop');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/workshop')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white mb-4">
            <Crown className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Premium'a Geç</h1>
          <p className="text-xl text-muted-foreground">Sınırsız özelliklerle üretimini profesyonelleştir</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ücretsiz</CardTitle>
              <CardDescription>Başlangıç için ideal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">5 aktif üretim</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">3 maliyet hesaplama</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Temel bildirimler</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Premium
              </CardTitle>
              <CardDescription>Profesyoneller için</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Sınırsız üretim</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Sınırsız maliyet hesaplama</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Gelişmiş raporlar</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Öncelikli destek</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={handleActivatePremium} className="gap-2 shadow-xl">
            <Crown className="h-5 w-5" />
            Premium'u Aktif Et (Demo)
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Demo sürümünde ücretsiz aktif edilebilir
          </p>
        </div>
      </main>
    </div>
  );
}
