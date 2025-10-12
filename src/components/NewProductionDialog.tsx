import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db, Production } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { addDays } from 'date-fns';

interface NewProductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProductionDialog({ open, onOpenChange }: NewProductionDialogProps) {
  const { addProduction, settings } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    essenceName: '',
    essenceRatio: 20,
    alcoholRatio: 80,
    alcoholBrand: '',
    bottleSize: 30,
    macerationDays: 15,
    notes: '',
    // Cost calculation
    alcoholCostPerMl: 0,
    waterCostPerMl: 0,
    essenceCostPerMl: 0,
  });
  const [canAddCostCalculation, setCanAddCostCalculation] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date();
    const endDate = addDays(startDate, formData.macerationDays);
    
    // Calculate costs
    const alcoholAmount = (formData.bottleSize * formData.alcoholRatio) / 100;
    const essenceAmount = (formData.bottleSize * formData.essenceRatio) / 100;
    const waterAmount = formData.bottleSize - alcoholAmount - essenceAmount;
    
    const alcoholCost = alcoholAmount * formData.alcoholCostPerMl;
    const essenceCost = essenceAmount * formData.essenceCostPerMl;
    const waterCost = waterAmount * formData.waterCostPerMl;
    const totalCost = alcoholCost + essenceCost + waterCost;

    const production: Omit<Production, 'id'> = {
      name: formData.name,
      essenceName: formData.essenceName,
      essenceRatio: Number(formData.essenceRatio),
      alcoholRatio: 100 - Number(formData.essenceRatio),
      alcoholBrand: formData.alcoholBrand,
      bottleSize: Number(formData.bottleSize),
      startDate,
      endDate,
      daysRemaining: formData.macerationDays,
      notes: formData.notes,
      status: 'active' as const,
      alcoholCost: formData.alcoholCostPerMl ? Number(formData.alcoholCostPerMl) : undefined,
      waterCost: formData.waterCostPerMl ? Number(formData.waterCostPerMl) : undefined,
      essenceCost: formData.essenceCostPerMl ? Number(formData.essenceCostPerMl) : undefined,
      totalCost: totalCost > 0 ? totalCost : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await db.productions.add(production);
    addProduction({ ...production, id: Number(id) });
    
    // Reset form
    setFormData({
      name: '',
      essenceName: '',
      essenceRatio: 20,
      alcoholRatio: 80,
      alcoholBrand: '',
      bottleSize: 30,
      macerationDays: 15,
      notes: '',
      alcoholCostPerMl: 0,
      waterCostPerMl: 0,
      essenceCostPerMl: 0,
    });
    
    onOpenChange(false);
  };

  // Check if user can add cost calculation
  useEffect(() => {
    const checkCostLimit = async () => {
      if (settings?.isPremium) {
        setCanAddCostCalculation(true);
      } else {
        const count = await db.productions.where('alcoholCost').above(0).count();
        setCanAddCostCalculation(count < 3);
      }
    };
    checkCostLimit();
  }, [settings?.isPremium]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Üretim Başlat</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Parfüm Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Kirke"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="essenceName">Esans Adı *</Label>
              <Input
                id="essenceName"
                value={formData.essenceName}
                onChange={(e) => setFormData({ ...formData, essenceName: e.target.value })}
                placeholder="Örn: Ambroxan"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="essenceRatio">Esans Oranı (%) *</Label>
              <Input
                id="essenceRatio"
                type="number"
                min="1"
                max="100"
                value={formData.essenceRatio}
                onChange={(e) => setFormData({ ...formData, essenceRatio: Number(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alcoholRatio">Alkol Oranı (%) *</Label>
              <Input
                id="alcoholRatio"
                type="number"
                min="0"
                max="99"
                value={formData.alcoholRatio}
                onChange={(e) => setFormData({ ...formData, alcoholRatio: Number(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bottleSize">Şişe Boyutu (ml) *</Label>
              <Input
                id="bottleSize"
                type="number"
                min="1"
                value={formData.bottleSize}
                onChange={(e) => setFormData({ ...formData, bottleSize: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alcoholBrand">Alkol Markası *</Label>
              <Input
                id="alcoholBrand"
                value={formData.alcoholBrand}
                onChange={(e) => setFormData({ ...formData, alcoholBrand: e.target.value })}
                placeholder="Örn: Etil Alkol 96%"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="macerationDays">Dinlenme Süresi (gün) *</Label>
              <Input
                id="macerationDays"
                type="number"
                min="1"
                value={formData.macerationDays}
                onChange={(e) => setFormData({ ...formData, macerationDays: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {canAddCostCalculation && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-medium text-sm">Maliyet Hesaplama (İsteğe Bağlı)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alcoholCost">Alkol (₺/ml)</Label>
                  <Input
                    id="alcoholCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.alcoholCostPerMl}
                    onChange={(e) => setFormData({ ...formData, alcoholCostPerMl: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="essenceCost">Esans (₺/ml)</Label>
                  <Input
                    id="essenceCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.essenceCostPerMl}
                    onChange={(e) => setFormData({ ...formData, essenceCostPerMl: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waterCost">Su (₺/ml)</Label>
                  <Input
                    id="waterCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.waterCostPerMl}
                    onChange={(e) => setFormData({ ...formData, waterCostPerMl: Number(e.target.value) })}
                  />
                </div>
              </div>
              {!settings?.isPremium && (
                <p className="text-xs text-muted-foreground">
                  Ücretsiz kullanıcılar için 3 üretimle sınırlı. Premium'a geçin!
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Üretim hakkında notlarınız..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">Üretimi Başlat</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
