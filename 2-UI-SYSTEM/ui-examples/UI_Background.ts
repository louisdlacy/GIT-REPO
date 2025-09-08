import { PropTypes, TextureAsset } from "horizon/core";
import { Image, ImageSource, Text, UIComponent, UINode, View } from "horizon/ui";

class UI_Background extends UIComponent<typeof UI_Background> {
  static propsDefinition = {
    backgroundOn: { type: PropTypes.Boolean, default: true },
    texture: { type: PropTypes.Asset },
  };

  initializeUI(): UINode {
    if (!this.props.backgroundOn) {
      this.entity.visible.set(false);
    }

    return View({
      children: [
        Image({
          source: ImageSource.fromTextureAsset(this.props.texture!),
          style: {
            width: "100%",
            height: "100%",
            zIndex: 0,
          },
        }),
      ],
      style: {
        position: "absolute",
        width: "100%",
        aspectRatio: 1,
        layoutOrigin: [0.5, 0.5],
        left: "50%",
        top: "50%",
        zIndex: -1000,
      },
    });
  }
}
UIComponent.register(UI_Background);
