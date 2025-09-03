import { Component } from 'horizon/core';
export declare class PNGDisplayer extends Component<typeof PNGDisplayer> {
    static propsDefinition: {
        pngAsset: {
            type: "Asset";
        };
    };
    start(): void;
    /**
     * Applies the material from the 'pngAsset' property to the Trimesh entity.
     * This can be called externally to update the image at runtime.
     */
    updateImage(): void;
}
