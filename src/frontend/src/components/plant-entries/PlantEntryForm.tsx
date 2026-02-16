import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useCreatePlantEntry, useUpdatePlantEntry } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { PlantEntry } from '../../backend';
import { dateStringToTime, timeToDateString } from '../../utils/time';

interface PlantEntryFormProps {
  entry?: PlantEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PlantEntryForm({ entry, onSuccess, onCancel }: PlantEntryFormProps) {
  const isEditing = !!entry;
  const createMutation = useCreatePlantEntry();
  const updateMutation = useUpdatePlantEntry();

  const [formData, setFormData] = useState({
    name: entry?.name || '',
    soilType: entry?.soilType || '',
    seedStartDate: entry ? timeToDateString(entry.seedStartDate) : '',
    dailyLightHours: entry?.dailyLightHours?.toString() || '',
    germinationDate: entry?.germinationDate ? timeToDateString(entry.germinationDate) : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plant name is required';
    }

    if (!formData.soilType.trim()) {
      newErrors.soilType = 'Soil type is required';
    }

    if (!formData.seedStartDate) {
      newErrors.seedStartDate = 'Seed start date is required';
    }

    if (!formData.dailyLightHours) {
      newErrors.dailyLightHours = 'Daily light hours is required';
    } else {
      const hours = parseFloat(formData.dailyLightHours);
      if (isNaN(hours) || hours < 0) {
        newErrors.dailyLightHours = 'Daily light hours must be a non-negative number';
      } else if (hours > 24) {
        newErrors.dailyLightHours = 'Daily light hours cannot exceed 24';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const data = {
      name: formData.name.trim(),
      soilType: formData.soilType.trim(),
      seedStartDate: dateStringToTime(formData.seedStartDate),
      dailyLightHours: parseFloat(formData.dailyLightHours),
      germinationDate: formData.germinationDate ? dateStringToTime(formData.germinationDate) : null,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: entry.id, ...data });
        toast.success('Seed entry updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Seed entry added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update entry' : 'Failed to create entry');
      console.error(error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plant Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Tomato, Basil, Sunflower"
          disabled={isPending}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="soilType">Soil Type *</Label>
        <Input
          id="soilType"
          value={formData.soilType}
          onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
          placeholder="e.g., Potting mix, Seed starting mix"
          disabled={isPending}
        />
        {errors.soilType && <p className="text-sm text-destructive">{errors.soilType}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seedStartDate">Seed Start Date *</Label>
          <Input
            id="seedStartDate"
            type="date"
            value={formData.seedStartDate}
            onChange={(e) => setFormData({ ...formData, seedStartDate: e.target.value })}
            disabled={isPending}
          />
          {errors.seedStartDate && <p className="text-sm text-destructive">{errors.seedStartDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="germinationDate">Germination Date</Label>
          <Input
            id="germinationDate"
            type="date"
            value={formData.germinationDate}
            onChange={(e) => setFormData({ ...formData, germinationDate: e.target.value })}
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">Optional - leave blank if not yet germinated</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dailyLightHours">Daily Light Hours *</Label>
        <Input
          id="dailyLightHours"
          type="number"
          step="0.5"
          min="0"
          max="24"
          value={formData.dailyLightHours}
          onChange={(e) => setFormData({ ...formData, dailyLightHours: e.target.value })}
          placeholder="e.g., 12"
          disabled={isPending}
        />
        {errors.dailyLightHours && <p className="text-sm text-destructive">{errors.dailyLightHours}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEditing ? 'Update Entry' : 'Add Entry'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

