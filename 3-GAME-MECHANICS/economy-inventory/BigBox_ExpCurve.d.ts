import { Component } from 'horizon/core';
export declare class BigBox_ExpCurve extends Component<typeof BigBox_ExpCurve> {
    static propsDefinition: {
        base: {
            type: "number";
            default: number;
        };
        curveSteepness: {
            type: "number";
            default: number;
        };
    };
    static instance: BigBox_ExpCurve;
    ExpToCurrentLevel(exp: number): number;
    ExpToPercentToNextLevel(exp: number): number;
    preStart(): void;
    start(): void;
}
