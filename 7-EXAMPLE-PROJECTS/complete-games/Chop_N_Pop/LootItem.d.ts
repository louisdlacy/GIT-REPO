import { Behaviour } from 'Behaviour';
import { Player, Vec3 } from 'horizon/core';
import { ILootTable } from 'ILootTable';
export declare class LootItem<T> extends Behaviour<typeof LootItem & T> {
    static propsDefinition: {
        itemType: {
            type: "string";
        };
        collectSound: {
            type: "Entity";
        };
        enableLootMagnet: {
            type: "boolean";
            default: boolean;
        };
        lootMagnetRadius: {
            type: "number";
            default: number;
        };
        lootMagnetSpeed: {
            type: "number";
            default: number;
        };
        lootMagnetCaptureRadius: {
            type: "number";
            default: number;
        };
        vfx: {
            type: "Entity";
        };
        wobbleHeight: {
            type: "number";
            default: number;
        };
        revolutionTime: {
            type: "number";
            default: number;
        };
    };
    protected isCollected: boolean;
    private lootMagnetRadiusSquared;
    private lootMagnetCaptureRadiusSquared;
    private lootTable;
    protected basePosition: Vec3;
    Start(): void;
    Update(deltaTime: number): void;
    setBasePosition(position: Vec3): void;
    OnPlayerCollision(collidedWith: Player, collisionAt: Vec3, normal: Vec3, relativeVelocity: Vec3, localColliderName: string, otherColliderName: string): void;
    setPosition(position: Vec3): void;
    setLootTable(lootTable: ILootTable): void;
    private collectItem;
}
