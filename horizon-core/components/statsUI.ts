import * as hz from "horizon/core";
import * as ui from "horizon/ui";

class InteractiveScreenOverlay extends ui.UIComponent<{}> {
  // Define panel dimensions
  panelHeight = 1080;
  panelWidth = 1920;

  // Bindings for dynamic percentages
  private percentageBindings = [
    new ui.Binding<string>("100%"), // Answer A
    new ui.Binding<string>("100%"), // Answer B
    new ui.Binding<string>("100%"), // Answer C
    new ui.Binding<string>("100%"), // Answer D
    new ui.Binding<string>("100%"), // No Answer
  ];

  // Colors for the vertical lines
  private lineColors = ["orange", "yellow", "hotpink", "white", "lightblue"];

  // Labels for the answers
  private answerLabels = [
    "Answer A",
    "Answer B",
    "Answer C",
    "Answer D",
    "No Answer",
  ];

  // Initialize the UI
  initializeUI(): ui.UINode {
    const lineWidth = 300; // Width of each vertical line
    const lineHeight = 500; // Height of each vertical line
    const spacing = 50; // Spacing between lines
    const titleStyle: ui.TextStyle = {
      fontSize: 120,
      color: "orange",
      fontWeight: "bold",
      textAlign: "center",
      textAlignVertical: "center",
    };
    const labelStyle: ui.TextStyle = {
      fontSize: 30,
      color: "white",
      textAlign: "center",
      textAlignVertical: "center",
    };
    const percentageStyle: ui.TextStyle = {
      fontSize: 40,
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      textAlignVertical: "center",
    };

    // Create the main UI layout
    return ui.View({
      children: [
        // Title at the top
        ui.Text({
          text: "Stats",
          style: titleStyle,
        }),
        // Vertical lines with labels and percentages
        ui.View({
          children: this.lineColors.map((color, index) => {
            const translateX = 0 + (index - 2) * spacing; // Center the lines horizontally
            return ui.View({
              children: [
                // Vertical colored line
                ui.View({
                  style: {
                    backgroundColor: color,
                    width: lineWidth,
                    height: lineHeight,
                    borderRadius: 5,
                  },
                }),
                // Percentage text below the line
                ui.Text({
                  text: this.percentageBindings[index],
                  style: percentageStyle,
                }),
                // Label below the percentage
                ui.Text({
                  text: this.answerLabels[index],
                  style: labelStyle,
                }),
              ],
              style: {
                alignItems: "center",
                justifyContent: "flex-start",
                height: 800, // Combined height for line, percentage, and label
              },
            });
          }),
          style: {
            flexDirection: "row", // Arrange the lines horizontally
            justifyContent: "center",
            alignItems: "flex-end", // Align to the bottom
            transform: [{ translate: [0, 200] }], // Move bars lower on the screen
          },
        }),
      ],
      style: {
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        flexDirection: "column", // Arrange title and lines vertically
        justifyContent: "flex-start",
        alignItems: "center",
      },
    });
  }
}

// Register the class properly
ui.UIComponent.register(InteractiveScreenOverlay);
