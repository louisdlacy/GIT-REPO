import { Quaternion, Vec3 } from 'horizon/core';
import { LootItem } from 'LootItem';
import { IAllocatable } from 'ObjectPool';
export declare class PoolLootItem extends LootItem<typeof PoolLootItem> implements IAllocatable {
    static propsDefinition: any;
    private originalPosition;
    Start(): void;
    onAllocate(position: Vec3, rotation: Quaternion): void;
    onFree(): void;
    private addSelfToPool;
}
