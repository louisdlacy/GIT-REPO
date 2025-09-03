import { Behaviour } from 'Behaviour';
import { Entity, Quaternion, Vec3 } from 'horizon/core';
import { ILootTable } from 'ILootTable';
export declare class LootTableAssets extends Behaviour<typeof LootTableAssets> implements ILootTable {
    static propsDefinition: {
        noItemOdds: {
            type: "number";
            default: number;
        };
        item1: {
            type: "Asset";
        };
        item1Odds: {
            type: "number";
            default: number;
        };
        item2: {
            type: "Asset";
        };
        item2Odds: {
            type: "number";
            default: number;
        };
        item3: {
            type: "Asset";
        };
        item3Odds: {
            type: "number";
            default: number;
        };
        item4: {
            type: "Asset";
        };
        item4Odds: {
            type: "number";
            default: number;
        };
        item5: {
            type: "Asset";
        };
        item5Odds: {
            type: "number";
            default: number;
        };
        item6: {
            type: "Asset";
        };
        item6Odds: {
            type: "number";
            default: number;
        };
        item7: {
            type: "Asset";
        };
        item7Odds: {
            type: "number";
            default: number;
        };
        item8: {
            type: "Asset";
        };
        item8Odds: {
            type: "number";
            default: number;
        };
        item9: {
            type: "Asset";
        };
        item9Odds: {
            type: "number";
            default: number;
        };
        item10: {
            type: "Asset";
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
