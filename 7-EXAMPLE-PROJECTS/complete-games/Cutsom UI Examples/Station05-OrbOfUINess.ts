/*
  Station 5: The Orb of UINess

  This station demonstrates you can trigger actions based on buttons clicked in a custom UI.

  In this case, the Custom UI is very similar to Station04: GenericYesNoDialog, except that there is
  a bit of code executed within the onClick() function to change the color of an entity that is
  specified in the Properties panel. When you click a button, the ball changes color.

*/

// Imported components from the API.
import {
  Entity,
  Color,
  PropTypes,
  Player,
  MeshEntity
} from "horizon/core";

// Imported components from the UI module.
import {
  UIComponent,
  View,
  Text,
  ViewStyle,
  Callback,
  Pressable,
  Binding,
  UINode,
} from "horizon/ui";

type MyButtonProps = {
  label: string;
  onClick: Callback;
  style: ViewStyle;
  baseColor: string;
};

function MyButton(props: MyButtonProps): UINode {
  const DEFAULT_COLOR = props.baseColor;
  const HOVERED_COLOR = "blue";
  const backgroundColor = new Binding<string>(DEFAULT_COLOR);
  const buttonText = new Binding<string>(props.label);

  return Pressable({
    children: Text({
      text: buttonText,
      style: { color: "white" },
    }),
    onClick: props.onClick,
    onEnter: (player: Player) => {
      console.log("onEnter");
      backgroundColor.set(HOVERED_COLOR, [player]);
      buttonText.set("hovered", [player]);
    },
    onExit: (player: Player) => {
      console.log("onExit");
      backgroundColor.set(DEFAULT_COLOR, [player]);
      buttonText.set(props.label, [player]);
    },
    style: {
      backgroundColor: backgroundColor,
      borderRadius: 8,
      height: 36,
      width: 120,
      alignItems: "center",
      justifyContent: "center",
      // additional styles are spread
      // to override default styles
      ...props.style,
    },
  });
}

const colorOff: Color = new Color(0,0,1)
const colorRed: Color = new Color(0.8, 0, 0)
const colorGreen: Color = new Color(0, 0.8, 0)


class ClickerDialog extends UIComponent<typeof ClickerDialog> {
  static propsDefinition = {
      ball: { type: PropTypes.Entity },
};



  initializeUI() {
    const textPrompt = new Binding<string>(
      "Choose your preferred color for the Orb of UIness."
    );
    const myBall = this.props.ball?.as(MeshEntity)!
    if (myBall) {
      console.log("myBall defined: " + myBall.name.get())
      myBall.style.tintStrength.set(1)
      myBall.style.brightness.set(100)
      myBall.style.tintColor.set(colorOff);
    }

    return View({
      children: [
        Text({
          text: textPrompt,
          style: { color: "black", fontSize: 20 },
        }),
        View({
          children: [
            MyButton({
              label: "Off",
              baseColor: "black",
              onClick: () => {
                console.log("onClick() callback fired for: Off")
                if (myBall) {
                  myBall.style.tintColor.set(colorOff)
                }
              },
              style: {
                marginRight: 24,
              },
            }),
            MyButton({
              label: "Red",
              baseColor: "red",

              onClick: () => {
                // console.log("Pressed Red button.");
                console.log("onClick() callback fired for: Red")
                if (myBall) {
                  myBall.style.tintColor.set(colorRed)
                }
              },
              style: {
                marginRight: 24,
              },
            }),
            MyButton({
              label: "Green",
              baseColor: "green",
              onClick: () => {
                // console.log("Pressed Green button.");
                if (myBall) {
                  console.log("onClick() callback fired for: Green")
                  myBall.style.tintColor.set(colorGreen)

                }
              },
              style: {
              },
            }),
          ],
          style: { flexDirection: "row", marginTop: 12 },
        }),
      ],
      style: {
        backgroundColor: "#EDE2D5",
        borderRadius: 24,
        padding: 24,
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      },
    });
  }
}

UIComponent.register(ClickerDialog);
