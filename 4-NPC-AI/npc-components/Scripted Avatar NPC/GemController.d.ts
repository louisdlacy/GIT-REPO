/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
/**
  This script contains the events and methods for handling interactions with the gems, including moving them to their specified locations on the map.
  
 */
import * as hz from 'horizon/core';
export declare class GemController extends hz.Component<typeof GemController> {
    static propsDefinition: {
        coursePositionRef: {
            type: "Entity";
        };
    };
    private hiddenLocation;
    start(): void;
    private handleCollision;
    private onMoveGemToCourseEvent;
}
