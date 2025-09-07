import { Behaviour } from 'Behaviour';
import { Entity, Quaternion, Vec3 } from 'horizon/core';
import { ILootTable } from 'ILootTable';
export declare class LootTablePool extends Behaviour<typeof LootTablePool> implements ILootTable {
    static propsDefinition: {
        noItemOdds: {
            type: "number";
            default: number;
        };
        item1: {
            type: "Entity";
        };
        item1Odds: {
            type: "number";
            default: number;
        };
        item2: {
            type: "Entity";
        };
        item2Odds: {
            type: "number";
            default: number;
        };
        item3: {
            type: "Entity";
        };
        item3Odds: {
            type: "number";
            default: number;
        };
        item4: {
            type: "Entity";
        };
        item4Odds: {
            type: "number";
            default: number;
        };
        item5: {
            type: "Entity";
        };
        item5Odds: {
            type: "number";
            default: number;
        };
        item6: {
            type: "Entity";
        };
        item6Odds: {
            type: "number";
            default: number;
        };
        item7: {
            type: "Entity";
        };
        item7Odds: {
            type: "number";
            default: number;
        };
        item8: {
            type: "Entity";
        };
        item8Odds: {
            type: "number";
            default: number;
        };
        item9: {
            type: "Entity";
        };
        item9Odds: {
            type: "number";
            default: number;
        };
        item10: {
            type: "Entity";
        };
        item10Odds: {
            type: "number";
            default: number;
        };
    };
    private lootItems;
    private lootDrops;
    Start(): void;
    shouldDropItem(): boolean;
    dropRandomItem(position: Vec3, rotation: Quaternion): void;
    clearItem(item: Entity): void;
    clearItems(): void;
}
