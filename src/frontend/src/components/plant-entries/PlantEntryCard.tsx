import { Calendar, Sun, Sprout, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PlantEntry } from '../../backend';
import { formatDate, daysBetween } from '../../utils/time';

interface PlantEntryCardProps {
  entry: PlantEntry;
  onClick: () => void;
}

export default function PlantEntryCard({ entry, onClick }: PlantEntryCardProps) {
  const isGerminated = !!entry.germinationDate;
  const daysToGerminate = isGerminated
    ? daysBetween(entry.seedStartDate, entry.germinationDate!)
    : null;

  return (
    <Card 
      className="cursor-pointer hover:shadow-garden transition-all hover:border-primary/50 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {entry.name}
          </CardTitle>
          {isGerminated ? (
            <Badge variant="default" className="bg-accent text-accent-foreground gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Germinated
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Sprout className="w-3 h-3" />
              Growing
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Planted {formatDate(entry.seedStartDate)}</span>
        </div>
        
        {isGerminated && daysToGerminate !== null && (
          <div className="flex items-center gap-2 text-sm text-accent">
            <Sprout className="w-4 h-4" />
            <span>Germinated in {daysToGerminate} {daysToGerminate === 1 ? 'day' : 'days'}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sun className="w-4 h-4" />
          <span>{entry.dailyLightHours} hours light/day</span>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Soil: <span className="text-foreground font-medium">{entry.soilType}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

