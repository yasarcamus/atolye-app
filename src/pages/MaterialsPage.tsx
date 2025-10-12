import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Package, Edit, Trash2 } from 'lucide-react';
import { db, Material } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTheme } from '@/contexts/ThemeContext';

export function MaterialsPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'alcohol' as 'alcohol' | 'water' | 'essence' | 'other',
    pricePerMl: 0,
    unit: 'ml' as 'ml' | 'g' | 'adet',
    stock: 0,
  });

  const materials = useLiveQuery(() => db.materials.orderBy('createdAt').reverse().toArray(), []);
  const settings = useLiveQuery(() => db.settings.toCollection().first(), []);

  const defaultNames = ['Alkol', 'Saf Su', 'Şişe'];
  const customCount = (materials || []).filter(m => !defaultNames.includes(m.name)).length;
  const maxCustomForFree = 2; // default 3 + 2 custom = 5 toplam
  const isPremium = !!settings?.isPremium;
  const canAddMore = isPremium || customCount < maxCustomForFree;

  const handleOpenDialog = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        name: material.name,
        type: material.type,
        pricePerMl: material.pricePerMl,
        unit: material.unit,
        stock: material.stock || 0,
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        name: '',
        type: 'alcohol',
        pricePerMl: 0,
        unit: 'ml',
        stock: 0,
      });
    }
    if (canAddMore || material) {
      setDialogOpen(true);
    } else {
      alert('Ücretsiz hesaplarda en fazla 5 hammadde eklenebilir. Premium’a geçerek sınırı kaldırın.');
    }
  };

  const handleSave = async () => {
    if (editingMaterial?.id) {
      await db.materials.update(editingMaterial.id, {
        ...formData,
        updatedAt: new Date(),
      });
    } else {
      await db.materials.add({
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu hammaddeyi silmek istediğinizden emin misiniz?')) {
      await db.materials.delete(id);
    }
  };

  const handleFocusZeroClear = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '0' || val === '0.00' || val === '' || Number(val) === 0) {
      e.target.value = '';
      e.target.placeholder = '0';
    }
  };
  const handleBlurRestoreZero = (field: keyof typeof formData) => (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFormData({ ...formData, [field]: 0 } as any);
    }
  };
  const handleEnterNext = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const container = formRef.current;
      if (!container) return;
      const elements = Array.from(container.querySelectorAll<HTMLElement>('input, select, button'));
      const idx = elements.findIndex(el => el === e.currentTarget);
      if (idx >= 0 && idx < elements.length - 1) {
        (elements[idx + 1] as HTMLElement).focus();
      }
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'alcohol': return '🍶';
      case 'water': return '💧';
      case 'essence': return '🌸';
      default: return '📦';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'alcohol': return 'Alkol';
      case 'water': return 'Su';
      case 'essence': return 'Esans';
      default: return 'Diğer';
    }
  };

  const groupedMaterials = materials?.reduce((acc, material) => {
    if (!acc[material.type]) acc[material.type] = [];
    acc[material.type].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0D1117]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <header className={`${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/workshop')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Hammadde Yönetimi</h1>
                <p className="text-sm text-muted-foreground">Malzeme ve fiyat takibi</p>
              </div>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2" disabled={!canAddMore} title={!canAddMore ? 'Ücretsiz hesaplarda en fazla 5 hammadde eklenebilir' : undefined}>
              <Plus className="h-4 w-4" />
              Yeni Hammadde
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {materials && materials.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedMaterials || {}).map(([type, items]) => (
              <div key={type}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">{getMaterialIcon(type)}</span>
                  {getTypeName(type)}
                  <span className="text-sm text-muted-foreground font-normal">({items.length})</span>
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                  {items.map((material) => (
                    <Card key={material.id} className="hover:shadow-md transition-shadow min-w-[280px] snap-start flex-shrink-0">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{material.name}</CardTitle>
                            <CardDescription>{getTypeName(material.type)}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(material)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => material.id && handleDelete(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Fiyat:</span>
                          <span className="font-medium">{material.pricePerMl.toFixed(2)} ₺/{material.unit}</span>
                        </div>
                        {material.stock !== undefined && material.stock > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stok:</span>
                            <span className="font-medium">{material.stock} {material.unit}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${darkMode ? 'bg-[#161B22] border-[#30363d]' : 'bg-white'} rounded-xl border shadow-sm`}>
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Henüz hammadde yok</h3>
            <p className="text-muted-foreground mb-6">
              İlk hammaddenizi ekleyin ve maliyet hesaplamalarını kolaylaştırın
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2" disabled={!canAddMore}>
              <Plus className="h-4 w-4" />
              Hammadde Ekle
            </Button>
          </div>
        )}
      </main>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMaterial ? 'Hammadde Düzenle' : 'Yeni Hammadde'}</DialogTitle>
          </DialogHeader>
          <div ref={formRef} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hammadde Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={handleEnterNext}
                placeholder="Örn: Etil Alkol 96%"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tür *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onKeyDown={handleEnterNext}>
                  <option value="alcohol">Alkol</option>
                  <option value="water">Su</option>
                  <option value="essence">Esans</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Birim *</Label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onKeyDown={handleEnterNext}>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="adet">adet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺/{formData.unit}) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerMl}
                  onChange={(e) => setFormData({ ...formData, pricePerMl: Number(e.target.value) })}
                  onFocus={handleFocusZeroClear}
                  onBlur={handleBlurRestoreZero('pricePerMl')}
                  onKeyDown={handleEnterNext}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stok ({formData.unit})</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  onFocus={handleFocusZeroClear}
                  onBlur={handleBlurRestoreZero('stock')}
                  onKeyDown={handleEnterNext}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={!formData.name}>
              {editingMaterial ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

