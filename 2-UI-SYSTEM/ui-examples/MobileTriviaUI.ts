import * as hz from "horizon/core";
import {
  UIComponent,
  View,
  Text,
  Pressable,
  AnimatedBinding,
  Animation,
} from "horizon/ui";

class MobileTriviaUI extends UIComponent {
  panelHeight = 800;
  panelWidth = 600;

  initializeUI() {
    const buttonStyle = {
      height: 70,
      width: 180,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderRadius: 12,
      margin: 8,
      borderWidth: 2,
      borderColor: "#000000", //
    };

    const textStyle = {
      color: "white",
      fontSize: 22,
      fontWeight: "600" as const,
    };

    const infoBoxStyle = {
      backgroundColor: "white",
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#ccc",
    };

    // Reusable animated button creator
    const makeAnimatedButton = (label: string, color: string) => {
      const scale = new AnimatedBinding(1);

      return Pressable({
        children: Text({ text: label, style: textStyle }),
        style: {
          ...buttonStyle,
          backgroundColor: color,
          transform: [{ scale }],
        },
        onClick: () => {
          console.log(`${label} button pressed`);
          // Animate the button: shrink and bounce back
          scale.set(0.9); // quick shrink
          scale.set(Animation.timing(1)); // smooth return to original scale
        },
      });
    };

    return View({
      children: [
        // Question Prompt
        View({
          children: Text({
            text: "Which color do you choose?", // This will replace with the question
            style: {
              fontSize: 28,
              color: "#fff",
              textAlign: "center" as const,
              fontWeight: "bold" as const,
            },
          }),
          style: {
            backgroundColor: "#333",
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            width: "75%",
            marginBottom: 12,
          },
        }),

        // Round and Timer
        View({
          children: [
            View({
              children: Text({
                text: "Round: 0",
                style: { fontSize: 20, color: "#000" },
              }),
              style: { ...infoBoxStyle, marginRight: 12 },
            }),
            View({
              children: Text({
                text: "Timer: 00",
                style: { fontSize: 20, color: "#000" },
              }),
              style: infoBoxStyle,
            }),
          ],
          style: {
            flexDirection: "row" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            marginBottom: 40,
          },
        }),

        // Color Buttons
        View({
          children: [
            makeAnimatedButton("Blue", "#007BFF"),
            makeAnimatedButton("Yellow", "#FFD700"),
            makeAnimatedButton("Red", "#FF4C4C"),
            makeAnimatedButton("Green", "#28A745"),
          ],
          style: {
            flexDirection: "row" as const,
            flexWrap: "wrap" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            marginTop: 250,
          },
        }),
      ],
      style: {
        flexDirection: "column" as const,
        alignItems: "center" as const,
        padding: 20,
        backgroundColor: "transparent",
        borderRadius: 20,
        height: "100%",
        width: "100%",
      },
    });
  }
}

UIComponent.register(MobileTriviaUI);
