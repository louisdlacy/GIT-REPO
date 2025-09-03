import { Behaviour } from 'Behaviour';
import { Entity, Player, Quaternion, Vec3 } from 'horizon/core';
export interface IAllocatable {
    onAllocate(position: Vec3, rotation: Quaternion, owner: Player | null): void;
    onFree(): void;
}
export declare class ObjectPool extends Behaviour<typeof ObjectPool> {
    static propsDefinition: {};
    private allocatedEntities;
    private freeEntities;
    addEntity(entity: Entity): void;
    allocate(position: Vec3, rotation: Quaternion, owner: Player | null): Entity | null;
    free(entity: Entity | undefined | null): void;
    has(entity: Entity): boolean;
}
