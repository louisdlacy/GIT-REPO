import * as hz from 'horizon/core';
export declare class sysHintHUDEntity extends hz.Component<typeof sysHintHUDEntity> {
    static propsDefinition: {
        Text: {
            type: "Entity";
        };
    };
    start(): void;
    UpdateHintHUDText(text: string): void;
}
