"use strict";
/*
  Station 4: Generic Yes/No Dialog

  This station demonstrates how to set up a dialog box with Yes/No buttons. You can use this to explore
  how you can take local and global action based on the onClick() method triggered when each button is
  pressed.

*/
Object.defineProperty(exports, "__esModule", { value: true });
// Imported components from the UI mocdule.
const ui_1 = require("horizon/ui");
/*
  The MyButton function defines a UINode object with the listed properties. This structure is used
  when you are building a customUI component that requires special setup and computation. This function
  is not created inline with the MyPrompt function because it needs to be called each time a button is
  added to the UI.

  The objects in CAPS indicate constant values.  The other objects are
  populated based on user actions. When initialized, the hovered state is set to false.

  The function returns a UIINode representing a Pressable object, which is a component available in
  custom UIs. See: https://horizon.meta.com/resources/scripting-api/ui.pressable.md/

*/
function MyButton(props) {
    const DEFAULT_COLOR = props.baseColor;
    const HOVERED_COLOR = "blue";
    const PRESSED_COLOR = "green";
    const backgroundColor = new ui_1.Binding(DEFAULT_COLOR);
    const buttonText = new ui_1.Binding(props.label);
    let hovered = false;
    /*
      The Pressable object is defined as a Text() object, styling, and several available
      JavaScript events: onClick, onEnter, onExit, onPress, onRelease.

      Some of these events are defined inline. Others, like onClick() are defined as part of the MyButton
      definition. So, the reference here is to point to the properties definition, where it is defined.

    */
    return (0, ui_1.Pressable)({
        children: (0, ui_1.Text)({
            text: buttonText,
            style: { color: "white" },
        }),
        onClick: props.onClick,
        onEnter: (player) => {
            backgroundColor.set(HOVERED_COLOR, [player]);
            hovered = true;
        },
        onExit: (player) => {
            backgroundColor.set(DEFAULT_COLOR, [player]);
            buttonText.set(props.label, [player]);
            hovered = false;
        },
        onPress: (player) => {
            backgroundColor.set(PRESSED_COLOR, [player]);
        },
        onRelease: (player) => {
            backgroundColor.set(hovered ? HOVERED_COLOR : DEFAULT_COLOR, [player]);
        },
        style: {
            backgroundColor: backgroundColor,
            borderRadius: 8,
            height: 36,
            width: 120,
            alignItems: "center",
            justifyContent: "center",
            /*
              The following reference causes the default values of non-specified style properties
              to be applied to the created instance of the object.
            */
            ...props.style,
        },
    });
}
function MyPrompt(props) {
    return (0, ui_1.View)({
        children: [
            (0, ui_1.Text)({
                text: "Click the Yes or No button:",
                style: { color: "black", textAlign: "center" },
            }),
            /*
              In this sub-View, the two buttons (Yes and No) are defined.
              Each has a separate onClick event, which is (based on MyPromptProps) a Callback
              function handled as arrow functions in the MyPrompt declaration in the initializeUI() method.
      
              Those arrow functions, in turn, call out to the public functions doYes() and doNo().
              */
            (0, ui_1.View)({
                children: [
                    MyButton({
                        label: "Yes",
                        baseColor: "green",
                        onClick: props.onClickYes,
                        style: {},
                    }),
                    MyButton({
                        label: "No",
                        baseColor: "red",
                        onClick: props.onClickNo,
                        style: {},
                    }),
                ],
                /*
                  This style definition introduces the flexDirection property, which allows you to orient
                  horizontally (row) or vertically (column) related objects. In this case, the buttons are
                  placed side-by-side in a row.
                  */
                style: { flexDirection: "row", alignItems: "center" },
            }),
        ],
        style: { alignItems: "center" },
    });
}
//  These functions are called from the arrow function for the MyPrompt object, one for each button.
function doYes() {
    console.log("Yes");
}
function doNo() {
    console.log("No");
}
class DialogYesNo extends ui_1.UIComponent {
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Generic Yes/No Dialog",
                    style: { color: "black", textAlign: "center" },
                }),
                MyPrompt({
                    promptLabel: "Yes or No?",
                    /*
                      Below, the onClickYes object that is passed to the MyPrompt() function is actually
                      a simple arrow (inline) function, which calls out to the public function doYes().
                      That function writes a simple message to the console.
          
                      These two references are passed to the MyPrompt function, which references the
                      onClickYes property (a function) for the Yes button and the onClickNo property (a function)
                      for the No button.
                    */
                    onClickYes: () => {
                        doYes();
                    },
                    onClickNo: () => {
                        doNo();
                    },
                }),
            ],
            style: {
                alignItems: "center",
                backgroundColor: "#EDE2D5",
                borderRadius: 24,
            },
        });
    }
}
DialogYesNo.propsDefinition = {};
ui_1.UIComponent.register(DialogYesNo);
