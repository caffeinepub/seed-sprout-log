import { useState, useMemo } from 'react';
import { Plus, Loader2, AlertCircle, Sprout } from 'lucide-react';
import { useGetAllPlantEntries } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlantEntryCard from './PlantEntryCard';
import PlantEntryForm from './PlantEntryForm';
import PlantEntryDetail from './PlantEntryDetail';
import type { PlantEntry } from '../../backend';

export default function PlantEntryList() {
  const { data: entries, isLoading, error } = useGetAllPlantEntries();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PlantEntry | null>(null);
  const [selectedSoilType, setSelectedSoilType] = useState<string>('all');

  // Derive unique soil types from entries
  const soilTypes = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    const uniqueSoilTypes = Array.from(
      new Set(entries.map((entry) => entry.soilType).filter((soil) => soil && soil.trim() !== ''))
    ).sort();
    return uniqueSoilTypes;
  }, [entries]);

  // Filter entries based on selected soil type
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    if (selectedSoilType === 'all') return entries;
    return entries.filter((entry) => entry.soilType === selectedSoilType);
  }, [entries, selectedSoilType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load plant entries. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const hasEntries = entries && entries.length > 0;
  const hasFilteredEntries = filteredEntries.length > 0;

  return (
    <div className="space-y-6">
      {/* Header with Add button and filter */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-foreground">Your Seeds</h2>
          <p className="text-muted-foreground mt-1">
            {hasEntries
              ? `Tracking ${filteredEntries.length} seed ${filteredEntries.length === 1 ? 'entry' : 'entries'}`
              : 'Start tracking your seeds'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasEntries && soilTypes.length > 0 && (
            <Select value={selectedSoilType} onValueChange={setSelectedSoilType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All soil types</SelectItem>
                {soilTypes.map((soilType) => (
                  <SelectItem key={soilType} value={soilType}>
                    {soilType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => setIsAddingNew(true)} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Seed
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!hasEntries && !isAddingNew && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-secondary/20 p-6 mb-4">
              <Sprout className="w-12 h-12 text-secondary" />
            </div>
            <CardTitle className="text-xl mb-2">No seeds yet</CardTitle>
            <CardDescription className="text-center max-w-sm mb-6">
              Start tracking your seed planting journey. Record when you plant, what soil you use, and watch them grow!
            </CardDescription>
            <Button onClick={() => setIsAddingNew(true)} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Your First Seed
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add new entry form */}
      {isAddingNew && (
        <Card className="border-primary/50 shadow-garden animate-sprout">
          <CardHeader>
            <CardTitle>Add New Seed Entry</CardTitle>
            <CardDescription>Record details about your newly planted seeds</CardDescription>
          </CardHeader>
          <CardContent>
            <PlantEntryForm
              onSuccess={() => setIsAddingNew(false)}
              onCancel={() => setIsAddingNew(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* No results after filtering */}
      {hasEntries && !hasFilteredEntries && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
            <CardTitle className="text-lg mb-2">No seeds found</CardTitle>
            <CardDescription className="text-center max-w-sm">
              No entries match the selected soil type. Try selecting a different filter.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* List of entries */}
      {hasFilteredEntries && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <PlantEntryCard
              key={entry.id.toString()}
              entry={entry}
              onClick={() => setSelectedEntry(entry)}
            />
          ))}
        </div>
      )}

      {/* Detail dialog */}
      {selectedEntry && (
        <PlantEntryDetail
          entry={selectedEntry}
          open={!!selectedEntry}
          onOpenChange={(open) => !open && setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
