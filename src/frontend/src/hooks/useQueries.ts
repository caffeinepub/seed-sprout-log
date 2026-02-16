import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlantEntry, Time } from '../backend';

export function useGetAllPlantEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<PlantEntry[]>({
    queryKey: ['plantEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlantsSortedByName();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlantEntry(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PlantEntry | null>({
    queryKey: ['plantEntry', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPlantEntry(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreatePlantEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      soilType: string;
      seedStartDate: Time;
      dailyLightHours: number;
      germinationDate: Time | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createPlanting(
        data.name,
        data.soilType,
        data.seedStartDate,
        data.dailyLightHours,
        data.germinationDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantEntries'] });
    },
  });
}

export function useUpdatePlantEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      soilType: string;
      seedStartDate: Time;
      dailyLightHours: number;
      germinationDate: Time | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updatePlantEntry(
        data.id,
        data.name,
        data.soilType,
        data.seedStartDate,
        data.dailyLightHours,
        data.germinationDate
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plantEntries'] });
      queryClient.invalidateQueries({ queryKey: ['plantEntry', variables.id.toString()] });
    },
  });
}

export function useDeletePlantEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deletePlantEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantEntries'] });
    },
  });
}

