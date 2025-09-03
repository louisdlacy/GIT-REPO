"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNGDisplayer = void 0;
const core_1 = require("horizon/core");
class PNGDisplayer extends core_1.Component {
    start() {
        // Apply the material when the script starts.
        this.updateImage();
    }
    /**
     * Applies the material from the 'pngAsset' property to the Trimesh entity.
     * This can be called externally to update the image at runtime.
     */
    updateImage() {
        if (this.props.pngAsset) {
            const meshEntity = this.entity.as(core_1.MeshEntity);
            const materialAsset = this.props.pngAsset.as(core_1.MaterialAsset);
            if (meshEntity && materialAsset) {
                meshEntity.setMaterial(materialAsset);
            }
            else {
                if (!meshEntity) {
                    console.error("PNGDisplayer: Script must be attached to a Trimesh entity.");
                }
                if (!materialAsset) {
                    console.error("PNGDisplayer: The provided 'pngAsset' is not a valid MaterialAsset.");
                }
            }
        }
        else {
            console.warn("PNGDisplayer: 'pngAsset' property is not set.");
        }
    }
}
exports.PNGDisplayer = PNGDisplayer;
PNGDisplayer.propsDefinition = {
    pngAsset: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(PNGDisplayer);
