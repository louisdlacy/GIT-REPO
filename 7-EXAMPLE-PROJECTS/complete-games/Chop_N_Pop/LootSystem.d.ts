import { Behaviour } from 'Behaviour';
import { Entity, Quaternion, Vec3 } from 'horizon/core';
export declare class LootSystem extends Behaviour<typeof LootSystem> {
    static propsDefinition: {
        lootMinimumHeight: {
            type: "number";
            default: number;
        };
    };
    static instance: LootSystem | undefined;
    Awake(): void;
    dropLoot(lootTable: Entity, position: Vec3, rotation: Quaternion, force?: boolean): void;
}
