import * as hz from "horizon/core";
import {
  UIComponent,
  View,
  Pressable,
  Image,
  ImageSource,
  Binding,
} from "horizon/ui";

class StandButtonUI extends UIComponent<typeof StandButtonUI> {
  static propsDefinition = {
    PositionCtrl: { type: hz.PropTypes.Entity },
  };
  // Set panel size (optional, can be configured as per requirement)
  panelHeight = 1080;
  panelWidth = 1920;

  // Initialize animated binding for hover state (scale of circle)
  borderWidth = new Binding(0); // No scale initially

  initializeUI() {
    // Return the View containing the button and circle animation
    return View({
      children: [
        Pressable({
          children: [
            // Text that says "Stand"

            // Circle that will scale up on hover
            View({
              children: [
                Image({
                  source: ImageSource.fromTextureAsset(
                    new hz.TextureAsset(BigInt(1153115006401565))
                  ),
                  style: {
                    width: "100%",
                    height: "100%",
                    alignSelf: "center",
                    resizeMode: "cover",
                  },
                }),
              ],
            }),
          ],
          // Handle hover enter event (increase circle size)
        }),
      ],
    });
  }
}

UIComponent.register(StandButtonUI);
