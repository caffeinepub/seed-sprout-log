import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlantEntry {
    id: bigint;
    germinationDate?: Time;
    soilType: string;
    name: string;
    seedStartDate: Time;
    dailyLightHours: number;
}
export type Time = bigint;
export interface backendInterface {
    createPlanting(name: string, soilType: string, seedStartDate: Time, dailyLightHours: number, germinationDate: Time | null): Promise<bigint>;
    deletePlantEntry(id: bigint): Promise<void>;
    getAllPlantsSortedByName(): Promise<Array<PlantEntry>>;
    getPlantEntry(id: bigint): Promise<PlantEntry>;
    updatePlantEntry(id: bigint, name: string, soilType: string, seedStartDate: Time, dailyLightHours: number, germinationDate: Time | null): Promise<void>;
}
