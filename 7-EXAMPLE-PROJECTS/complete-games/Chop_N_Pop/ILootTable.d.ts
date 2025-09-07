import { Entity, Quaternion, Vec3 } from "horizon/core";
export interface ILootTable {
    shouldDropItem(): boolean;
    dropRandomItem(position: Vec3, rotation: Quaternion): void;
    clearItem(item: Entity): void;
    clearItems(): void;
}
