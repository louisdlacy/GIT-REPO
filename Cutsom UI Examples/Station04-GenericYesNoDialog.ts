/*
  Station 4: Generic Yes/No Dialog

  This station demonstrates how to set up a dialog box with Yes/No buttons. You can use this to explore
  how you can take local and global action based on the onClick() method triggered when each button is
  pressed.

*/

// Imported components from the API.
import {
  Entity,
  PropTypes,
  Asset,
  Color,
  Player,
} from "horizon/core";

// Imported components from the UI mocdule.
import {
  UIComponent,
  View,
  Text,
  Pressable,
  Callback,
  ViewStyle,
  UINode,
  Binding,
} from "horizon/ui";

/*
  This type definition defines the properties associated with the MyButton object.
    label: defines the value displayed in the button.
    onClick: this callback event is executed when the button is pressed.
    style: defines the style object as a ViewStyle object, which means that the ViewStyle properties
      can be applied to style the button.
    baseColor: this string value is passed in to identify the color to display for the button.
*/
type MyButtonProps = {
  label: string;
  onClick: Callback;
  style: ViewStyle;
  baseColor: string;
};

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
function MyButton(props: MyButtonProps): UINode {
  const DEFAULT_COLOR = props.baseColor;
  const HOVERED_COLOR = "blue";
  const PRESSED_COLOR = "green";
  const backgroundColor = new Binding<string>(DEFAULT_COLOR);
  const buttonText = new Binding<string>(props.label);
  let hovered = false;
    /*
      The Pressable object is defined as a Text() object, styling, and several available
      JavaScript events: onClick, onEnter, onExit, onPress, onRelease.

      Some of these events are defined inline. Others, like onClick() are defined as part of the MyButton
      definition. So, the reference here is to point to the properties definition, where it is defined.

    */
    return Pressable({
    children: Text({
      text: buttonText,
      style: { color: "white" },
    }),
    onClick: props.onClick,
    onEnter: (player: Player) => {
      backgroundColor.set(HOVERED_COLOR, [player]);
      hovered = true;
    },
    onExit: (player: Player) => {
      backgroundColor.set(DEFAULT_COLOR, [player]);
      buttonText.set(props.label, [player]);
      hovered = false;
    },
    onPress: (player: Player) => {
      backgroundColor.set(PRESSED_COLOR, [player]);
    },
    onRelease: (player: Player) => {
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

/*
  This property type definition applies to the MyPrompt function, which creates another UINode that
  contains the two Yes/No buttons.
*/
type MyPromptProps = {
  promptLabel: string;
  onClickYes: Callback;
  onClickNo: Callback;
};

function MyPrompt(props: MyPromptProps): UINode {
  return View({
    children: [
      Text({
        text: "Click the Yes or No button:",
        style: { color: "black", textAlign: "center" },
      }),

      /*
        In this sub-View, the two buttons (Yes and No) are defined.
        Each has a separate onClick event, which is (based on MyPromptProps) a Callback
        function handled as arrow functions in the MyPrompt declaration in the initializeUI() method.

        Those arrow functions, in turn, call out to the public functions doYes() and doNo().
        */
      View({
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

type GenericDialogProps = {}

//  These functions are called from the arrow function for the MyPrompt object, one for each button.
function doYes(): void {
  console.log("Yes");
}
function doNo(): void {
  console.log("No");
}

class DialogYesNo extends UIComponent<GenericDialogProps> {
  static propsDefinition = {};

  initializeUI() {
    return View({
      children: [
        Text({
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

UIComponent.register(DialogYesNo);