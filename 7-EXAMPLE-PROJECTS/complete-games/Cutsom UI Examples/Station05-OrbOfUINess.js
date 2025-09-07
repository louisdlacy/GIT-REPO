"use strict";
/*
  Station 5: The Orb of UINess

  This station demonstrates you can trigger actions based on buttons clicked in a custom UI.

  In this case, the Custom UI is very similar to Station04: GenericYesNoDialog, except that there is
  a bit of code executed within the onClick() function to change the color of an entity that is
  specified in the Properties panel. When you click a button, the ball changes color.

*/
Object.defineProperty(exports, "__esModule", { value: true });
// Imported components from the API.
const core_1 = require("horizon/core");
// Imported components from the UI module.
const ui_1 = require("horizon/ui");
function MyButton(props) {
    const DEFAULT_COLOR = props.baseColor;
    const HOVERED_COLOR = "blue";
    const backgroundColor = new ui_1.Binding(DEFAULT_COLOR);
    const buttonText = new ui_1.Binding(props.label);
    return (0, ui_1.Pressable)({
        children: (0, ui_1.Text)({
            text: buttonText,
            style: { color: "white" },
        }),
        onClick: props.onClick,
        onEnter: (player) => {
            console.log("onEnter");
            backgroundColor.set(HOVERED_COLOR, [player]);
            buttonText.set("hovered", [player]);
        },
        onExit: (player) => {
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
const colorOff = new core_1.Color(0, 0, 1);
const colorRed = new core_1.Color(0.8, 0, 0);
const colorGreen = new core_1.Color(0, 0.8, 0);
class ClickerDialog extends ui_1.UIComponent {
    initializeUI() {
        const textPrompt = new ui_1.Binding("Choose your preferred color for the Orb of UIness.");
        const myBall = this.props.ball?.as(core_1.MeshEntity);
        if (myBall) {
            console.log("myBall defined: " + myBall.name.get());
            myBall.style.tintStrength.set(1);
            myBall.style.brightness.set(100);
            myBall.style.tintColor.set(colorOff);
        }
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: textPrompt,
                    style: { color: "black", fontSize: 20 },
                }),
                (0, ui_1.View)({
                    children: [
                        MyButton({
                            label: "Off",
                            baseColor: "black",
                            onClick: () => {
                                console.log("onClick() callback fired for: Off");
                                if (myBall) {
                                    myBall.style.tintColor.set(colorOff);
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
                                console.log("onClick() callback fired for: Red");
                                if (myBall) {
                                    myBall.style.tintColor.set(colorRed);
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
                                    console.log("onClick() callback fired for: Green");
                                    myBall.style.tintColor.set(colorGreen);
                                }
                            },
                            style: {},
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
ClickerDialog.propsDefinition = {
    ball: { type: core_1.PropTypes.Entity },
};
ui_1.UIComponent.register(ClickerDialog);
