import * as hz from "horizon/core";
import {
  UIComponent,
  View,
  Text,
  Pressable,
  AnimatedBinding,
  Animation,
  Easing,
  Image,
  ImageSource,
  Binding,
} from "horizon/ui";

class StandButtonUI extends UIComponent<typeof StandButtonUI> {
  static propsDefinition = {
    
    spawnPoint: { type: hz.PropTypes.Entity },
  };
  // Set panel size (optional, can be configured as per requirement)
  panelHeight = 300;
  panelWidth = 300;

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
                    new hz.TextureAsset(BigInt(573177275216298))
                  ),
                  style: {
                    width: "90%",
                    height: "95%",
                    alignSelf: "center",
                  },
                }),
              ],
              style: {
                width: "100%", // Directly binding to AnimatedBinding
                height: "100%", // Directly binding to AnimatedBinding
                borderRadius: 150, // To make it a circle
                borderColor: "white",
                borderWidth: this.borderWidth, // Directly binding to AnimatedBinding
              },
            }),
          ],
          // Handle hover enter event (increase circle size)
          onEnter: () => {
            this.borderWidth.set(0);
          },
          // Handle hover exit event (reset circle size)
          onExit: () => {
            this.borderWidth.set(0);
          },
          // Handle click event to send event to code blocks
          onClick: (player) => {
            this.sendEventToCodeBlocks(player); // Call the function to handle code block event
          },
          style: {
            // Style for the pressable view
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        }),
      ],
      style: {
        // Style for the main view
        alignItems: "center",
        justifyContent: "center",
      },
    });
  }

  // Function to send event to code blocks (placeholder)
  sendEventToCodeBlocks(player: hz.Player) {
  
  this.props.spawnPoint!.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
  }
}

UIComponent.register(StandButtonUI);

