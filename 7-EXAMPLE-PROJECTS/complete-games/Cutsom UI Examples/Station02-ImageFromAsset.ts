/*
  Station 2: Image from Asset

  This station demonstrates how you can load a PNG image from your Asset Library.
  This asset can be created outside of Horizon Worlds and uploaded as a Texture object.

*/

import {
  PropTypes,
} from "horizon/core";

import {
  UIComponent,
  View,
  Text,
  ImageStyle,
  Image,
  ImageSource,
} from "horizon/ui";

/*
  This import is pulling in the loadImage2 function from the TypeScript file: StationAll-CustomUI-Library.
  This Library file allows you to create single definitions of functions and types and then to
  import them into other scripts so that you use them consistently throughout your project.
*/
import { loadImage2 } from 'StationAll-CustomUI-Library'

/*
  This import pulls in the UI texture properties type declaration from the Library file.
  Note that its structure is slightly different.
*/
import { type UITextureProps } from 'StationAll-CustomUI-Library'

/*
  This import pulls in the declaration for the base ImageStyle from the Library file.
*/
import { baseImage2Style } from 'StationAll-CustomUI-Library'

// This class defines the customUI object: SimpleImage2.
class SimpleImage2 extends UIComponent<UITextureProps> {
//  These are basic properties of the extended UIComponent class. Their values must be literals.
  panelHeight = 200;
  panelWidth = 200;

/*
  This declaration defines the property textureAsset to be of type PropTypes.Asset. "PropTypes" is a
  reference to the properties that are surfaced in the Property panel of the current object. In this 
  case, that object is the customUI gizmo instance. 
  
  "Asset" is the name of the property in the panel. This reference creates a drop-down in the 
  Properties panel, where designers are permitted to select an asset to use with this 
  CustomUI gizmo instance.
*/
static propsDefinition = {
  textureAsset: { type: PropTypes.Asset },
};

/*
  This CustomUI panel definition is pretty simple: 
    Text: a simple text element
    loadImage2: a call to the loadImage2 function with two parameters, which 
      have been previously defined.
    style: some style information to apply to the entire panel.
*/
initializeUI() {
    return View({
      children: [
        Text({ text: "Image from Asset" }),
        loadImage2(this.props.textureAsset, baseImage2Style),
      ],
      style: { backgroundColor: "black", alignItems: "center" },
    });
  }
}

// After the declaration, register the declared class with the abstract UIComponent class.
UIComponent.register(SimpleImage2);
