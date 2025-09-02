/*
  Custom UI Library

  This file contains functions or type declarations that are used in multiple places in this world.
  For code maintenance purposes, commonly used objects should be stored in a single, consistent
  manner, so that they can be easily referenced and maintained.

  All declarations in this file that are intended for reuse elsewhere must be prefaced by the word:
  export

*/

/*
  The code in these functions (such as loadImage2 function) reference the Asset component from the v1.0.0 API. So, it must be
  imported here. Since the function is executed through this script, this reference does not have to
  be applied in the scripts where the function is called.
*/

/* API v1.0.0:
import {
  Asset,
} from "@early_access_api/v1";
*/
import {
  Asset,
} from "horizon/core";

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

import {
  Image,
  ImageSource,
  ImageStyle,
} from "horizon/ui";

/*
  FUNCTIONS

  The loadImage2 function performs the simple act of returning the results of
  calling the Image function, which has been loaded from the Image API component.
  This function pulls in its ImageSource (another component) from the source asset,
  which is specified in the TextureAsset property in the Properties panel.

  A designer selects the asset from the drop-down in the Properties panel, and the code loads it,
  applying the baseImageStyle definitions for it.
*/
export function loadImage2(asset: Asset, style: ImageStyle) {
  return Image({
    source: ImageSource.fromTextureAsset(asset),
    style: style,
  });
}

/*
  TYPES

  This type declaration for UITextureProps identifies the object textureAsset to be of Asset type.
  Asset type identifies objects that have been uploaded into the Asset Library.

  In other scripts, this typing is applied to PropsType.Asset, which pulls in an asset that the designer
  has selected through the Properties panel of the CustomUI gizmo instance.
*/
export type UITextureProps = {
  textureAsset: Asset;
};

/*
  CONSTANTS

  This constant creates an object called baseImage2Style, which is of ImageStyle type, having the
  specified height and width properties. These values should be no larger than the values declared
  in the class definition for the panelHeight and panelWidth.
*/
export const baseImage2Style: ImageStyle = { height: 200, width: 200 };
