import * as hz from 'horizon/core';
/**
 * A data container for a single point in an AdvancedPathMover sequence.
 * This script is attached to waypoint entities to define per-segment behavior.
 */
export declare class WaypointNode extends hz.Component<typeof WaypointNode> {
    static propsDefinition: {
        nextWaypoint: {
            type: "Entity";
        };
        isEndPoint: {
            type: "boolean";
            default: boolean;
        };
        durationToHere: {
            type: "number";
            default: number;
        };
        pauseHere: {
            type: "number";
            default: number;
        };
        easingType: {
            type: "string";
            default: string;
        };
    };
    start(): void;
}
