"use strict";
/*
  Custom UI Library

  This file contains functions or type declarations that are used in multiple places in this world.
  For code maintenance purposes, commonly used objects should be stored in a single, consistent
  manner, so that they can be easily referenced and maintained.

  All declarations in this file that are intended for reuse elsewhere must be prefaced by the word:
  export

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseImage2Style = void 0;
exports.loadImage2 = loadImage2;
/*
  Below declarations are from the UI module of the API.
  As you build out your library of functions related to customUIs, you may need to import these
  components to access customUI features. These references are left here as a palette for future
  use.

  ViewStyle,
  Callback,
  Pressable,
  Binding,
  UINode,
  UIComponent,
  View,
  Text,
*/
/*
  To learn more about these imports from Visual Studio Code, select a text element below. Then,
  right-click and select "Go to Implementations".

  To see where this element is referenced, right-click and select "Go to References". These references
  are across all scripts in your world.
*/
const ui_1 = require("horizon/ui");
/*
  FUNCTIONS

  The loadImage2 function performs the simple act of returning the results of
  calling the Image function, which has been loaded from the Image API component.
  This function pulls in its ImageSource (another component) from the source asset,
  which is specified in the TextureAsset property in the Properties panel.

  A designer selects the asset from the drop-down in the Properties panel, and the code loads it,
  applying the baseImageStyle definitions for it.
*/
function loadImage2(asset, style) {
    return (0, ui_1.Image)({
        source: ui_1.ImageSource.fromTextureAsset(asset),
        style: style,
    });
}
/*
  CONSTANTS

  This constant creates an object called baseImage2Style, which is of ImageStyle type, having the
  specified height and width properties. These values should be no larger than the values declared
  in the class definition for the panelHeight and panelWidth.
*/
exports.baseImage2Style = { height: 200, width: 200 };
