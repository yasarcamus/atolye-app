import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Production, db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { Star } from 'lucide-react';

interface TestDialogProps {
  production: Production | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestDialog({ production, open, onOpenChange }: TestDialogProps) {
  const { updateProduction } = useStore();
  const [testData, setTestData] = useState({
    longevity: 0,
    sillage: 0,
    rating: 0,
    fabricTest: '',
    skinTest: '',
    occasion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!production?.id) return;

    const updatedProduction = {
      ...testData,
      status: 'tested' as const,
      updatedAt: new Date(),
    };

    await db.productions.update(production.id, updatedProduction);
    updateProduction(production.id, updatedProduction);
    
    setTestData({
      longevity: 0,
      sillage: 0,
      rating: 0,
      fabricTest: '',
      skinTest: '',
      occasion: '',
    });
    
    onOpenChange(false);
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Test Sonuçları - {production?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <StarRating
            label="Kalıcılık"
            value={testData.longevity}
            onChange={(value) => setTestData({ ...testData, longevity: value })}
          />

          <StarRating
            label="Silaj (Yayılım)"
            value={testData.sillage}
            onChange={(value) => setTestData({ ...testData, sillage: value })}
          />

          <StarRating
            label="Genel Beğeni"
            value={testData.rating}
            onChange={(value) => setTestData({ ...testData, rating: value })}
          />

          <div className="space-y-2">
            <Label htmlFor="fabricTest">Kumaşta Nasıl?</Label>
            <Textarea
              id="fabricTest"
              value={testData.fabricTest}
              onChange={(e) => setTestData({ ...testData, fabricTest: e.target.value })}
              placeholder="Kumaş üzerindeki performansı..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skinTest">Ciltte Nasıl?</Label>
            <Textarea
              id="skinTest"
              value={testData.skinTest}
              onChange={(e) => setTestData({ ...testData, skinTest: e.target.value })}
              placeholder="Cilt üzerindeki performansı..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occasion">Kullanım Alanı</Label>
            <Textarea
              id="occasion"
              value={testData.occasion}
              onChange={(e) => setTestData({ ...testData, occasion: e.target.value })}
              placeholder="Günlük, özel gün, gece, vs..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
