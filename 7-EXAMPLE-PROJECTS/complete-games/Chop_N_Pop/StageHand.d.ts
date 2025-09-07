import { Behaviour } from 'Behaviour';
import { Entity, Quaternion, Vec3 } from 'horizon/core';
export declare class StageHand extends Behaviour<typeof StageHand> {
    static propsDefinition: {};
    private cuePositions;
    static instance: StageHand;
    Awake(): void;
    Start(): void;
    addCuePosition(entity: Entity, position: Vec3, rotation: Quaternion): void;
    disableCueReset(entity: Entity): void;
    private resetToCuePosition;
}
