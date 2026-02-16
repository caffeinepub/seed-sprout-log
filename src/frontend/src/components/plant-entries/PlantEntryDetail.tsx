import { useState } from 'react';
import { Calendar, Sun, Sprout, Edit, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeletePlantEntry } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { PlantEntry } from '../../backend';
import { formatDate, daysBetween } from '../../utils/time';
import PlantEntryForm from './PlantEntryForm';

interface PlantEntryDetailProps {
  entry: PlantEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlantEntryDetail({ entry, open, onOpenChange }: PlantEntryDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeletePlantEntry();

  const isGerminated = !!entry.germinationDate;
  const daysToGerminate = isGerminated
    ? daysBetween(entry.seedStartDate, entry.germinationDate!)
    : null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(entry.id);
      toast.success('Seed entry deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Seed Entry</DialogTitle>
            <DialogDescription>Update the details of your seed planting</DialogDescription>
          </DialogHeader>
          <PlantEntryForm
            entry={entry}
            onSuccess={() => {
              setIsEditing(false);
              onOpenChange(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl">{entry.name}</DialogTitle>
                <DialogDescription className="mt-2">
                  {isGerminated ? (
                    <Badge variant="default" className="bg-accent text-accent-foreground gap-1">
                      <Sprout className="w-3 h-3" />
                      Germinated
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Sprout className="w-3 h-3" />
                      Growing
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Planting Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Planting Information</h3>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Seed Start Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(entry.seedStartDate)}</p>
                  </div>
                </div>

                {isGerminated && (
                  <div className="flex items-start gap-3">
                    <Sprout className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Germination Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(entry.germinationDate!)}
                        {daysToGerminate !== null && (
                          <span className="ml-2 text-accent">
                            ({daysToGerminate} {daysToGerminate === 1 ? 'day' : 'days'} to germinate)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Growing Conditions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Growing Conditions</h3>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Soil Type</p>
                    <p className="text-sm text-muted-foreground">{entry.soilType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sun className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Daily Light Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.dailyLightHours} {entry.dailyLightHours === 1 ? 'hour' : 'hours'} per day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1 gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="flex-1 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Seed Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{entry.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

