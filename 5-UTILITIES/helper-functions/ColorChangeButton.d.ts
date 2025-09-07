import * as hz from 'horizon/core';
export declare class ColorChangeButton extends hz.Component<typeof ColorChangeButton> {
    static propsDefinition: {
        trigger: {
            type: "Entity";
        };
        color: {
            type: "Color";
        };
        objectDetector: {
            type: "Entity";
        };
        colorReceiver: {
            type: "Entity";
        };
    };
    static ColorChangeEvent: hz.LocalEvent<{
        color: hz.Color;
    }>;
    preStart(): void;
    start(): void;
}
