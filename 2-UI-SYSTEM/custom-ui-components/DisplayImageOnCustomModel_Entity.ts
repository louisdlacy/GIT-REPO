import { Component, MeshEntity, PropTypes, TextureAsset } from "horizon/core";


class AnimatedLogo extends Component<typeof AnimatedLogo> {
  static propsDefinition = {
    texture: { type: PropTypes.Asset },
  };

  start() {
    if (this.props.texture) {
      this.entity.as(MeshEntity).setTexture(this.props.texture.as(TextureAsset));
    }
  }
}
Component.register(AnimatedLogo);