import { Behaviour } from 'Behaviour';
import { Color, Vec3 } from 'horizon/core';
export declare class FloatingTextManager extends Behaviour<typeof FloatingTextManager> {
    static propsDefinition: {
        floatingTextAsset: {
            type: "Asset";
            default: undefined;
        };
        yPos: {
            type: "number";
            default: number;
        };
        floatSpeed: {
            type: "number";
            default: number;
        };
        rotationSpeed: {
            type: "number";
            default: number;
        };
        duration: {
            type: "number";
            default: number;
        };
        color: {
            type: "Color";
            default: Color;
        };
    };
    static instance: FloatingTextManager | undefined;
    Awake(): void;
    createFloatingText(text: string, position: Vec3, color?: Color): Promise<void>;
}
