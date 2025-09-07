import { LocalEvent, PropTypes } from "horizon/core";
import { UIComponent, Binding, UINode, View, Text } from "horizon/ui";

// Single Color Display Panel: Listens for "SetColor" event and sets the entire panel background color
// Optionally displays the block number (1, 2, 3, or 4) based on the blockIndex prop, with a toggle to show or hide it
// Created by 13_Chris, modified for color puzzle
// https://bit.ly/ColorOrderPanel for step by step

class colorDisplayPanel extends UIComponent<typeof colorDisplayPanel> {
  static propsDefinition = {
    // The block index (1-4) to determine the displayed number
    blockIndex: { type: PropTypes.Number, required: true },
    // Whether to show the block number
    showText: { type: PropTypes.Boolean, default: true },
    // Panel appearance
    width: { type: PropTypes.Number, default: 500 }, // Updated to 500 as requested
    height: { type: PropTypes.Number, default: 500 }, // Updated to 500 as requested
    borderRadius: { type: PropTypes.Number, default: 8 },
    borderWidth: { type: PropTypes.Number, default: 1 },
    borderColor: { type: PropTypes.Color, default: "#000000" },
    textColor: { type: PropTypes.Color, default: "#000000" },
    textSize: { type: PropTypes.Number, default: 100 },
  };

  private colorBinding = new Binding<string>("#CCCCCC"); // Default gray until event is received

  start() {
    this.connectLocalEvent(
      this.entity,
      new LocalEvent<{ color: string }>("SetColor"),
      (data) => {
        this.colorBinding.set(data.color || "#CCCCCC"); // Update color when event is received
      }
    );
  }

  initializeUI(): UINode {
    const children: UINode[] = [];
    if (this.props.showText) {
      children.push(
        Text({
          text: this.props.blockIndex!.toString(), // Display "1", "2", "3", or "4"
          style: {
            fontSize: this.props.textSize!,
            color: this.props.textColor!,
            textAlign: "center",
          },
        })
      );
    }

    return View({
      style: {
        backgroundColor: this.colorBinding,
        width: this.props.width!,
        height: this.props.height!,
        borderRadius: this.props.borderRadius!,
        borderWidth: this.props.borderWidth!,
        borderColor: this.props.borderColor!,
        alignItems: "center",
        justifyContent: "center", // Centers the text if shown
      },
      children,
    });
  }
}

UIComponent.register(colorDisplayPanel);