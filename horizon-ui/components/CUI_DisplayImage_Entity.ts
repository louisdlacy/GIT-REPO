import { Component, PropTypes, TextureAsset } from "horizon/core";
import { Image, ImageSource, UIComponent, UINode, View } from "horizon/ui";


class CUI_DisplayImageAsset_Entity extends UIComponent<typeof CUI_DisplayImageAsset_Entity> {
  static propsDefinition = {
    backgroundImageTextureAsset: { type: PropTypes.Asset },
    foregroundImageTextureAsset: { type: PropTypes.Asset },
  };

  initializeUI(): UINode {
    return View({
      children: [
        this.getImage(this.props.backgroundImageTextureAsset?.as(TextureAsset)),
        this.getImage(this.props.foregroundImageTextureAsset?.as(TextureAsset)),
      ],
      style: {
        width: '100%',
        height: '100%',
      },
    });
  }

  getImage(textureAsset: TextureAsset | undefined): UINode {
    if (textureAsset) {
      return Image({
          source: ImageSource.fromTextureAsset(textureAsset),
          style: {
            resizeMode: 'contain',
            width: '100%',
            height: '100%',
            position: 'absolute',
          },
        });
    }
    else {
      return View({});
    }
  }

  start() {

  }
}
Component.register(CUI_DisplayImageAsset_Entity);

