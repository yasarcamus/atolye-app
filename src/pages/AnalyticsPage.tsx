import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Star, Beaker, Award } from 'lucide-react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function AnalyticsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDark = savedDarkMode === null ? true : savedDarkMode === 'true';
    setDarkMode(isDark);
  }, []);

  const productions = useLiveQuery(() => db.productions.toArray(), []);
  const materials = useLiveQuery(() => db.materials.toArray(), []);

  const stats = {
    total: productions?.length || 0,
    active: productions?.filter(p => p.status === 'active').length || 0,
    tested: productions?.filter(p => p.status === 'tested').length || 0,
    favorites: productions?.filter(p => p.isFavorite).length || 0,
    totalCost: productions?.reduce((sum, p) => sum + (p.totalCost || 0), 0) || 0,
    avgCost: 0,
    avgLongevity: 0,
    avgSillage: 0,
    avgRating: 0,
  };

  const testedProductions = productions?.filter(p => p.status === 'tested') || [];
  if (testedProductions.length > 0) {
    stats.avgCost = stats.totalCost / testedProductions.length;
    
    const longevityScores = testedProductions.filter(p => p.longevity).map(p => p.longevity!);
    stats.avgLongevity = longevityScores.length > 0
      ? longevityScores.reduce((a, b) => a + b, 0) / longevityScores.length
      : 0;

    const sillageScores = testedProductions.filter(p => p.sillage).map(p => p.sillage!);
    stats.avgSillage = sillageScores.length > 0
      ? sillageScores.reduce((a, b) => a + b, 0) / sillageScores.length
      : 0;

    const ratingScores = testedProductions.filter(p => p.rating).map(p => p.rating!);
    stats.avgRating = ratingScores.length > 0
      ? ratingScores.reduce((a, b) => a + b, 0) / ratingScores.length
      : 0;
  }

  // Most used essences
  const essenceCount = productions?.reduce((acc, p) => {
    acc[p.essenceName] = (acc[p.essenceName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEssences = Object.entries(essenceCount || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Best rated productions
  const bestRated = testedProductions
    .filter(p => p.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  // Most expensive productions
  const mostExpensive = productions
    ?.filter(p => p.totalCost)
    .sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/workshop')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Raporlar & Analiz</h1>
              <p className="text-sm text-muted-foreground">Üretim istatistikleriniz</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Üretim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Test Edildi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.tested}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favoriler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.favorites}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performans Ortalamaları
              </CardTitle>
              <CardDescription>Test edilmiş üretimler bazında</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Kalıcılık</span>
                  <span className="font-medium">{stats.avgLongevity.toFixed(1)} / 5</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${(stats.avgLongevity / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Silaj</span>
                  <span className="font-medium">{stats.avgSillage.toFixed(1)} / 5</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${(stats.avgSillage / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Genel Beğeni</span>
                  <span className="font-medium">{stats.avgRating.toFixed(1)} / 5</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                    style={{ width: `${(stats.avgRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Maliyet Analizi
              </CardTitle>
              <CardDescription>Finansal özet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Toplam Harcama</p>
                <p className="text-3xl font-bold">{stats.totalCost.toFixed(2)} ₺</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Ortalama Üretim Maliyeti</p>
                <p className="text-2xl font-semibold">{stats.avgCost.toFixed(2)} ₺</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Hammadde Sayısı</p>
                <p className="text-xl font-medium">{materials?.length || 0} adet</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Essences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                En Çok Kullanılan Esanslar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topEssences.length > 0 ? (
                <div className="space-y-3">
                  {topEssences.map(([essence, count], index) => (
                    <div key={essence} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <span className="text-sm">{essence}</span>
                      </div>
                      <span className="text-sm font-medium">{count}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Henüz veri yok</p>
              )}
            </CardContent>
          </Card>

          {/* Best Rated */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                En Başarılı Üretimler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bestRated.length > 0 ? (
                <div className="space-y-3">
                  {bestRated.map((prod, index) => (
                    <div key={prod.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <span className="text-sm">{prod.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{prod.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Henüz veri yok</p>
              )}
            </CardContent>
          </Card>

          {/* Most Expensive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                En Pahalı Üretimler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mostExpensive && mostExpensive.length > 0 ? (
                <div className="space-y-3">
                  {mostExpensive.map((prod, index) => (
                    <div key={prod.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <span className="text-sm">{prod.name}</span>
                      </div>
                      <span className="text-sm font-medium">{prod.totalCost?.toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Henüz veri yok</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
