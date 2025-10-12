import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Star, Copy, BookOpen } from 'lucide-react';
import { db, Production } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function RecipesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const productions = useLiveQuery(
    () => db.productions.where('status').equals('tested').reverse().toArray(),
    []
  );

  const filteredProductions = productions?.filter((p) => {
    if (filter === 'favorites') return p.isFavorite;
    return true;
  });

  const handleToggleFavorite = async (production: Production) => {
    if (production.id) {
      await db.productions.update(production.id, {
        isFavorite: !production.isFavorite,
        updatedAt: new Date(),
      });
    }
  };

  const handleCopyRecipe = async (productionId: number) => {
    const production = productions?.find(p => p.id === productionId);
    if (!production) return;

    const newProduction = {
      ...production,
      id: undefined,
      name: `${production.name} (Kopya)`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active' as const,
      longevity: undefined,
      sillage: undefined,
      rating: undefined,
      fabricTest: undefined,
      skinTest: undefined,
      occasion: undefined,
      dailyNotes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.productions.add(newProduction);
    alert('Reçete kopyalandı ve yeni üretim başlatıldı!');
    navigate('/workshop');
  };

  const getAverageRating = (production: Production) => {
    const ratings = [production.longevity, production.sillage, production.rating].filter((r): r is number => r !== undefined);
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/workshop')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Reçete Bankası</h1>
                <p className="text-sm text-muted-foreground">Başarılı tarifleriniz</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tümü ({productions?.length || 0})
          </Button>
          <Button
            variant={filter === 'favorites' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('favorites')}
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            Favoriler ({productions?.filter(p => p.isFavorite).length || 0})
          </Button>
        </div>

        {filteredProductions && filteredProductions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductions.map((production) => (
              <Card key={production.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {production.name}
                        {production.isFavorite && (
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{production.essenceName}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(getAverageRating(production))
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Esans:</span>
                      <p className="font-medium">{production.essenceRatio}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Şişe:</span>
                      <p className="font-medium">{production.bottleSize}ml</p>
                    </div>
                  </div>

                  {production.totalCost && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Maliyet:</span>
                      <p className="font-medium">{production.totalCost.toFixed(2)} ₺</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {format(production.createdAt, 'dd MMM yyyy', { locale: tr })}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleToggleFavorite(production)}
                    >
                      <Heart
                        className={`h-4 w-4 ${production.isFavorite ? 'fill-current text-red-500' : ''}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => production.id && handleCopyRecipe(production.id)}
                    >
                      <Copy className="h-4 w-4" />
                      Kopyala
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/production/${production.id}`)}
                    >
                      Detay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border shadow-sm">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'favorites' ? 'Henüz favori reçete yok' : 'Henüz test edilmiş üretim yok'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'favorites'
                ? 'Beğendiğiniz tarifleri favorilere ekleyin'
                : 'Üretimlerinizi tamamlayın ve test edin'}
            </p>
            <Button onClick={() => navigate('/workshop')}>Atölyeye Dön</Button>
          </div>
        )}
      </main>
    </div>
  );
}
