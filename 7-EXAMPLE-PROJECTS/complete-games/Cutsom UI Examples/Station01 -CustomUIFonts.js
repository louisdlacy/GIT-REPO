"use strict";
/*
  Station 1: CustomUI fonts

  This station demonstrates how you can define text objects and apply different fonts
  and styling to them.

*/
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
/*
  The following is a class declaration, which defines the DisplayFonts class.
  This class extends the abstract UIComponent class, which is used for handling custom UIs.
  This name must be unique among the scripts of your world.

  Similar declarations can be made to extend the more general Component module in other scripts.
  */
class DisplayFonts extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 300; // default value is 500. These values must be literals. 
        this.panelWidth = 300; // default value is 500. These values must be literals.
    }
    /*
      Similar to the start() method used in other scripts, the initializeUI() method is used for
      initializing a new custom UI object.
    */
    initializeUI() {
        /*
          initializeUI() must return a View object.
          
          A View object is composed of a set of child objects,
          which can be text elements, image elements, or other views.
        */
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text: "CUSTOM UI FONTS" }),
                /*
                  Within a text object, you can define a text attribute and a style attribute.
                  A style attribute can consist of one or more attribute name/value pairs,
                  separated by commas (,). For example, you can extend the line below with
                  something like the following:
        
                   Text({ text: "Anton", style: { fontFamily: "Anton", fontSize: 18 } }),
        
                  For more information on the available styling options, please see the documentation
                  for this world: INSERT_LINK
                   */
                (0, ui_1.Text)({ text: "Anton", style: { fontFamily: "Anton" } }),
                (0, ui_1.Text)({ text: "Bangers", style: { fontFamily: "Bangers" } }),
                (0, ui_1.Text)({ text: "Kallisto", style: { fontFamily: "Kallisto" } }),
                (0, ui_1.Text)({ text: "Optimistic", style: { fontFamily: "Optimistic" } }),
                (0, ui_1.Text)({ text: "Oswald", style: { fontFamily: "Oswald" } }),
                (0, ui_1.Text)({ text: "Roboto", style: { fontFamily: "Roboto" } }),
                (0, ui_1.Text)({ text: "Roboto-Mono", style: { fontFamily: "Roboto-Mono", } }),
            ],
            // These style elements apply to the entire custom UI panel.
            // Note here that the double forward slashes are used for commenting a single line.
            style: { backgroundColor: "black" },
        });
    }
}
/*
  After the declaration of the class, you must register it by name with the abstract component
  that it extends: UIComponent.
*/
ui_1.UIComponent.register(DisplayFonts);
