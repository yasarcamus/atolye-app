import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, Trash2, Calendar, DollarSign, Edit, Star, Beaker } from 'lucide-react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { differenceInDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function ProductionDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [newNote, setNewNote] = useState('');

  const production = useLiveQuery(
    () => id ? db.productions.get(Number(id)) : undefined,
    [id]
  );

  if (!production) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Üretim bulunamadı</p>
          <Button onClick={() => navigate('/workshop')} className="mt-4">
            Atölyeye Dön
          </Button>
        </div>
      </div>
    );
  }

  const daysRemaining = differenceInDays(production.endDate, new Date());
  const totalDays = differenceInDays(production.endDate, production.startDate);
  const progress = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));
  const isReady = daysRemaining <= 0;

  const handleToggleFavorite = async () => {
    if (production.id) {
      await db.productions.update(production.id, {
        isFavorite: !production.isFavorite,
        updatedAt: new Date(),
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !production.id) return;

    const dailyNotes = production.dailyNotes || [];
    dailyNotes.push({ date: new Date(), note: newNote });

    await db.productions.update(production.id, {
      dailyNotes,
      updatedAt: new Date(),
    });

    setNewNote('');
  };

  const handleDelete = async () => {
    if (confirm('Bu üretimi silmek istediğinizden emin misiniz?')) {
      if (production.id) {
        await db.productions.delete(production.id);
        navigate('/workshop');
      }
    }
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
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {production.name}
                  {production.isFavorite && <Heart className="h-5 w-5 fill-red-500 text-red-500" />}
                </h1>
                <p className="text-sm text-muted-foreground">{production.essenceName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={production.isFavorite ? 'text-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${production.isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Edit className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            {production.status === 'active' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Dinlenme Süreci
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isReady ? 'Hazır! 🎉' : `${daysRemaining} gün kaldı`}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Başlangıç:</span>
                      <p className="font-medium">{format(production.startDate, 'dd MMMM yyyy', { locale: tr })}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bitiş:</span>
                      <p className="font-medium">{format(production.endDate, 'dd MMMM yyyy', { locale: tr })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Results */}
            {production.status === 'tested' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Test Sonuçları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Kalıcılık</p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (production.longevity || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Silaj</p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (production.sillage || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Beğeni</p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (production.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {production.fabricTest && (
                    <div>
                      <p className="text-sm font-medium mb-1">Kumaşta:</p>
                      <p className="text-sm text-muted-foreground">{production.fabricTest}</p>
                    </div>
                  )}

                  {production.skinTest && (
                    <div>
                      <p className="text-sm font-medium mb-1">Ciltte:</p>
                      <p className="text-sm text-muted-foreground">{production.skinTest}</p>
                    </div>
                  )}

                  {production.occasion && (
                    <div>
                      <p className="text-sm font-medium mb-1">Kullanım:</p>
                      <p className="text-sm text-muted-foreground">{production.occasion}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Daily Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Günlük Notlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Bugünkü gözlemlerinizi yazın..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim()} size="sm">
                    Not Ekle
                  </Button>
                </div>

                {production.dailyNotes && production.dailyNotes.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {production.dailyNotes.map((note, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4 py-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          {format(new Date(note.date), 'dd MMM yyyy, HH:mm', { locale: tr })}
                        </p>
                        <p className="text-sm">{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recipe Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Tarif Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Şişe Boyutu:</span>
                  <span className="font-medium">{production.bottleSize} ml</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Esans Oranı:</span>
                  <span className="font-medium">{production.essenceRatio}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alkol Oranı:</span>
                  <span className="font-medium">{production.alcoholRatio}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alkol Markası:</span>
                  <span className="font-medium">{production.alcoholBrand}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cost Info */}
            {production.totalCost && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Maliyet Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {production.alcoholCost && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Alkol:</span>
                      <span className="font-medium">{production.alcoholCost.toFixed(2)} ₺</span>
                    </div>
                  )}
                  {production.essenceCost && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Esans:</span>
                      <span className="font-medium">{production.essenceCost.toFixed(2)} ₺</span>
                    </div>
                  )}
                  {production.waterCost && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Su:</span>
                      <span className="font-medium">{production.waterCost.toFixed(2)} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t font-semibold">
                    <span>Toplam:</span>
                    <span className="text-lg">{production.totalCost.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>ml başına:</span>
                    <span>{(production.totalCost / production.bottleSize).toFixed(2)} ₺/ml</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {production.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{production.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
