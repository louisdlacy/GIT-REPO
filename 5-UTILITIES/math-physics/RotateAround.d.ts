import { Component, Vec3, Entity } from 'horizon/core';
export declare class RotateAround extends Component<typeof RotateAround> {
    static propsDefinition: {
        rotationSpeed: {
            type: "number";
            default: number;
        };
        pivotEntity: {
            type: Entity;
        };
        axis: {
            type: "Vec3";
            default: Vec3;
        };
    };
    private _initialOffset;
    private _cumulativeAngleRad;
    private _lastPivotId;
    preStart(): void;
    start(): void;
    private onUpdate;
}
