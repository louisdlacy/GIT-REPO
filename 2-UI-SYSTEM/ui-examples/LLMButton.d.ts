import * as hz from 'horizon/core';
export declare class LLMButton extends hz.Component<typeof LLMButton> {
    static propsDefinition: {
        trigger: {
            type: "Entity";
        };
        npc: {
            type: "Entity";
        };
    };
    static ColorQueryEvent: hz.LocalEvent<{}>;
    preStart(): void;
    start(): void;
}
