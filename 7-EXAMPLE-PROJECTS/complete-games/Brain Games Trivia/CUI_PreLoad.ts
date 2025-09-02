import { CategorySelectionUI } from "catergorySelectionIU2";
import * as hz from "horizon/core";
import { Image, ImageSource, UIComponent, Binding } from "horizon/ui";
import { images } from "sharedData";
class CUI_PreLoad extends UIComponent<typeof CUI_PreLoad> {
  static propsDefinition = {};
  imagestouse = images;

  bindImage = new Binding(
    ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("99999999")))
  );

  start() {
    this.imagestouse = images;
    let i = 0;
    this.async.setInterval(() => {
      this.bindImage.set(
        ImageSource.fromTextureAsset(
          new hz.TextureAsset(BigInt(this.imagestouse[i].toString()))
        )
      );
      i = (i + 1) % this.imagestouse.length;
    }, 2000);
  }
  initializeUI() {
    return Image({
      source: this.bindImage,
      style: {
        width: "100%",
        height: "100%",
      },
    });
  }
}
UIComponent.register(CUI_PreLoad);
