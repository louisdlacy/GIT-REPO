"use strict";
/*
  Station 6a: Column View

  This station demonstrates how you can set up column-based and row-based custom UI panels.

  In this one, UI elements are arranged in a simple column.

*/
Object.defineProperty(exports, "__esModule", { value: true });
// Imported components from the UI module.
const ui_1 = require("horizon/ui");
/*
  Same as FillImage:
  The MyButton function defines a UINode object with the listed properties. This structure is used
  when you are building a customUI component that requires special setup and computation. This function
  is not created inline with the MyPrompt function because it needs to be called each time a button is
  added to the UI.

  The items in CAPS indicate constant values.  The other items are
  populated based on user actions. When initialized, the hovered state is set to false.

  The function returns a UIINode representing a Pressable object, which is a component available in
  custom UIs. See: https://horizon.meta.com/resources/scripting-api/ui.pressable.md/

*/
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
            backgroundColor.set(HOVERED_COLOR, [player]);
            buttonText.set("hovered", [player]);
        },
        onExit: (player) => {
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
/*
  Below are a series of View() objects.

  These can be used as the building blocks for building more complex user interfaces.

  The unused ones are commented out (disabled).
*/
/*
  This object creates a simple view that contains a single button.

  The style and onClick parameters that are passed to MyButton are disabled. You can experiment
  with adding style attributes or onClick functionality here.
*/
const viewSimple = (0, ui_1.View)({
    children: [
        (0, ui_1.Text)({ text: "I am a Text child in a View", style: { margin: 10 } }),
        MyButton({
            label: "Button",
            baseColor: "green",
            onClick: () => { },
            style: {},
        }),
    ],
    style: {
        alignItems: "center",
        height: 100,
        backgroundColor: "black",
        margin: 10,
    },
});
/*
  This view creates a stylized text element, which has borders of varying width.

  In this case, the top and left borders are narrow, and the right and bottom are wide. This
  creates a tapered effect.

*/
const viewBorderTaper = (0, ui_1.View)({
    children: [
        (0, ui_1.Text)({
            text: "I can haz Borders!",
            style: {
                margin: 10,
            },
        }),
    ],
    style: {
        alignItems: "center",
        height: 100,
        backgroundColor: "black",
        margin: 10,
        borderColor: "red",
        borderRadius: 29,
        borderTopWidth: 4,
        borderBottomWidth: 18,
        borderLeftWidth: 4,
        borderRightWidth: 18,
    },
});
/*
  This object creates a column of objects, which are defined using the preceding Views.

  flexDirection: This style property defines the orientation of the objects in the View. Setting to
    "column" means that the View objects are stacked vertically.
*/
const viewNestedCol = (0, ui_1.View)({
    children: [
        (0, ui_1.Text)({ text: "Flex Column" }),
        viewSimple,
        viewSimple,
        viewBorderTaper,
    ],
    style: {
        flexDirection: "column",
        borderColor: "pink",
        borderWidth: 8,
    },
});
/*
  This class extends the UIComponent abstract class.

  In this case, the class defines the panel height and width and returns a View() for the
  initializeUI() method.

*/
class UIComponentViewCol extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 800; // default value is 500
        this.panelWidth = 300; // default value is 500
    }
    initializeUI() {
        return (0, ui_1.View)({
            /*
              The definition of the View() object is the viewNestedCol object, which is
              a set of objects, stacked vertically.
            */
            children: [viewNestedCol],
        });
    }
}
// UIComponentViewCol class must be registerd with the UIComponent class.
ui_1.UIComponent.register(UIComponentViewCol);
