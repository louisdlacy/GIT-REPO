import { Component, PropTypes, Asset, MeshEntity, MaterialAsset } from 'horizon/core';

export class PNGDisplayer extends Component<typeof PNGDisplayer> {
  static propsDefinition = {
    pngAsset: { type: PropTypes.Asset },
  };

  override start() {
    // Apply the material when the script starts.
    this.updateImage();
  }

  /**
   * Applies the material from the 'pngAsset' property to the Trimesh entity.
   * This can be called externally to update the image at runtime.
   */
  public updateImage() {
    if (this.props.pngAsset) {
      const meshEntity = this.entity.as(MeshEntity);
      const materialAsset = this.props.pngAsset.as(MaterialAsset);

      if (meshEntity && materialAsset) {
        meshEntity.setMaterial(materialAsset);
      } else {
        if (!meshEntity) {
          console.error("PNGDisplayer: Script must be attached to a Trimesh entity.");
        }
        if (!materialAsset) {
          console.error("PNGDisplayer: The provided 'pngAsset' is not a valid MaterialAsset.");
        }
      }
    } else {
      console.warn("PNGDisplayer: 'pngAsset' property is not set.");
    }
  }
}

Component.register(PNGDisplayer);