import * as hz from 'horizon/core';
/**
 * Immutable information about an item
 * Can be inherited from to create assets with additional properties
 */
export declare class BigBox_ItemBaseInfo extends hz.Component<typeof BigBox_ItemBaseInfo> {
    static propsDefinition: {
        id: {
            type: "string";
        };
        name: {
            type: "string";
        };
        model: {
            type: "Asset";
        };
        color: {
            type: "Color";
        };
    };
    start(): void;
}
