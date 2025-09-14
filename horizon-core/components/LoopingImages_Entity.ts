import { Asset, Component, MeshEntity, PropTypes, TextureAsset } from "horizon/core";
import { arrayUtils } from "UtilArray_Func";


class AnimatedLogo extends Component<typeof AnimatedLogo> {
  static propsDefinition = {
    speedMs: { type: PropTypes.Number, default: 30 },
    isRandom: { type: PropTypes.Boolean, default: false },
    runOnStart: { type: PropTypes.Boolean, default: false },
    texture0: { type: PropTypes.Asset },
    texture1: { type: PropTypes.Asset },
    texture2: { type: PropTypes.Asset },
    texture3: { type: PropTypes.Asset },
    texture4: { type: PropTypes.Asset },
    texture5: { type: PropTypes.Asset },
    texture6: { type: PropTypes.Asset },
    texture7: { type: PropTypes.Asset },
    texture8: { type: PropTypes.Asset },
    texture9: { type: PropTypes.Asset },
    texture10: { type: PropTypes.Asset },
    texture11: { type: PropTypes.Asset },
    texture12: { type: PropTypes.Asset },
    texture13: { type: PropTypes.Asset },
    texture14: { type: PropTypes.Asset },
    texture15: { type: PropTypes.Asset },
  };

  textures: TextureAsset[] = [];
  index = 0;

  start() {
    this.addTextureToArray(this.props.texture0);
    this.addTextureToArray(this.props.texture1);
    this.addTextureToArray(this.props.texture2);
    this.addTextureToArray(this.props.texture3);
    this.addTextureToArray(this.props.texture4);
    this.addTextureToArray(this.props.texture5);
    this.addTextureToArray(this.props.texture6);
    this.addTextureToArray(this.props.texture7);
    this.addTextureToArray(this.props.texture8);
    this.addTextureToArray(this.props.texture9);
    this.addTextureToArray(this.props.texture10);
    this.addTextureToArray(this.props.texture11);
    this.addTextureToArray(this.props.texture12);
    this.addTextureToArray(this.props.texture13);
    this.addTextureToArray(this.props.texture14);
    this.addTextureToArray(this.props.texture15);

    const meshEntity = this.entity.as(MeshEntity);

    if (meshEntity) {
      if (this.props.runOnStart) {
        this.loop(meshEntity);
      }

      this.async.setInterval(() => { this.loop(meshEntity); }, this.props.speedMs);
    }
    else {
      console.log('AnimatedLogo: meshEntity returned undefined');
    }
  }

  loop(meshEntity: MeshEntity) {
    this.index = (this.index + 1) % this.textures.length;

    const newTexture = this.props.isRandom ?
      arrayUtils.getRandomItemFromArray(this.textures)
      :
      this.textures[this.index];

    if (newTexture) {
      meshEntity.setTexture(newTexture);
    }
  }

  addTextureToArray(prop: Asset | undefined) {
    if (prop) {
      this.textures.push(prop.as(TextureAsset));
    }
  }
}
Component.register(AnimatedLogo);