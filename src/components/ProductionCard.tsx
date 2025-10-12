import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Production } from '@/lib/db';
import { Calendar, Droplet, Beaker, Clock, DollarSign } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ProductionCardProps {
  production: Production;
  onTest: (production: Production) => void;
  onView: (production: Production) => void;
}

export function ProductionCard({ production, onTest, onView }: ProductionCardProps) {
  const daysRemaining = differenceInDays(production.endDate, new Date());
  const totalDays = differenceInDays(production.endDate, production.startDate);
  const progress = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));
  
  const isReady = daysRemaining <= 0;
  const isActive = production.status === 'active';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{production.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{production.essenceName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
              {production.bottleSize}ml
            </span>
            {production.status === 'tested' && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                Test Edildi
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-muted-foreground" />
            <span>Esans: {production.essenceRatio}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Beaker className="h-4 w-4 text-muted-foreground" />
            <span>{production.alcoholBrand}</span>
          </div>
        </div>

        {isActive && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {isReady ? (
                      <span className="text-green-600 font-medium">Hazır! 🎉</span>
                    ) : (
                      <span>{daysRemaining} gün kaldı</span>
                    )}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(production.startDate, 'dd MMM', { locale: tr })} - {format(production.endDate, 'dd MMM', { locale: tr })}
              </span>
            </div>
          </>
        )}

        {production.totalCost && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{production.totalCost.toFixed(2)} ₺</span>
            <span className="text-muted-foreground text-xs">maliyet</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {isReady && isActive && (
            <Button 
              onClick={() => onTest(production)} 
              className="flex-1"
              size="sm"
            >
              Test Et
            </Button>
          )}
          <Button 
            onClick={() => onView(production)} 
            variant="outline"
            className="flex-1"
            size="sm"
          >
            Detay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
