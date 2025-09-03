import { Component, Entity, Quaternion, TextGizmo, Vec3 } from "horizon/core";
export type AnimationParams = {
    entity: Entity;
    targetLocalPosition?: Vec3;
    targetLocalRotation?: Quaternion;
    durationMS: number;
};
/**
 * Represents a class that handles animations over time for a specific component.
 */
export declare class OverTimeLocal {
    private component;
    constructor(component: Component);
    /**
     * Starts an animation over time.
     * @param params - The animation parameters.
     * @returns A promise that resolves when the animation is done.
     * @throws An error if no entity is provided for the animation.
     */
    startAnimation(params: AnimationParams): Promise<void>;
}
export declare class OverTime {
    private readonly owner;
    constructor(owner: Component);
    readonly moveTo: (entity: Entity, value: Vec3, durationSec: number) => void;
    readonly moveBy: (entity: Entity, value: Vec3, durationSec: number) => void;
    readonly rotateTo: (entity: Entity, value: Quaternion, durationSec: number) => void;
    readonly rotateBy: (entity: Entity, value: Quaternion, durationSec: number) => void;
    readonly scaleTo: (entity: Entity, value: Vec3, durationSec: number) => void;
    readonly scaleBy: (entity: Entity, value: Vec3, durationSec: number) => void;
    private fn;
    private interpolations;
    private registerOverTimeAction;
    private tick;
}
export declare class FadeEffect {
    private component;
    private textElement;
    private colors;
    private interval;
    private fadeIndex;
    private fadeDirection;
    private fadeInterval;
    private num;
    constructor(component: Component, textElement: TextGizmo, colors: string[], interval?: number);
    start(): void;
    stop(): void;
}
