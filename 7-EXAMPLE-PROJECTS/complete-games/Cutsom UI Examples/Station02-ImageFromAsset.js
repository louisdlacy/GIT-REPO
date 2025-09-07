"use strict";
/*
  Station 2: Image from Asset

  This station demonstrates how you can load a PNG image from your Asset Library.
  This asset can be created outside of Horizon Worlds and uploaded as a Texture object.

*/
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
/*
  This import is pulling in the loadImage2 function from the TypeScript file: StationAll-CustomUI-Library.
  This Library file allows you to create single definitions of functions and types and then to
  import them into other scripts so that you use them consistently throughout your project.
*/
const StationAll_CustomUI_Library_1 = require("StationAll-CustomUI-Library");
/*
  This import pulls in the declaration for the base ImageStyle from the Library file.
*/
const StationAll_CustomUI_Library_2 = require("StationAll-CustomUI-Library");
// This class defines the customUI object: SimpleImage2.
class SimpleImage2 extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        //  These are basic properties of the extended UIComponent class. Their values must be literals.
        this.panelHeight = 200;
        this.panelWidth = 200;
    }
    /*
      This CustomUI panel definition is pretty simple:
        Text: a simple text element
        loadImage2: a call to the loadImage2 function with two parameters, which
          have been previously defined.
        style: some style information to apply to the entire panel.
    */
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text: "Image from Asset" }),
                (0, StationAll_CustomUI_Library_1.loadImage2)(this.props.textureAsset, StationAll_CustomUI_Library_2.baseImage2Style),
            ],
            style: { backgroundColor: "black", alignItems: "center" },
        });
    }
}
/*
  This declaration defines the property textureAsset to be of type PropTypes.Asset. "PropTypes" is a
  reference to the properties that are surfaced in the Property panel of the current object. In this
  case, that object is the customUI gizmo instance.
  
  "Asset" is the name of the property in the panel. This reference creates a drop-down in the
  Properties panel, where designers are permitted to select an asset to use with this
  CustomUI gizmo instance.
*/
SimpleImage2.propsDefinition = {
    textureAsset: { type: core_1.PropTypes.Asset },
};
// After the declaration, register the declared class with the abstract UIComponent class.
ui_1.UIComponent.register(SimpleImage2);
