import { Component } from 'horizon/core';
export declare class FountainController extends Component<typeof FountainController> {
    static propsDefinition: {
        soundEffect: {
            type: "Entity";
        };
        particleEffect: {
            type: "Entity";
        };
    };
    private soundGizmo?;
    preStart(): void;
    start(): void;
    private playLoopingSound;
}
