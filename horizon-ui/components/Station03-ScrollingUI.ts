/*
  Station 3: ScrollView UI object

  This station introduces the ScrollView object, which is a scrollable version of the View object.
  ScrollView extends View, with the following properties:
  * contentContainerStyle - a ViewStyle object that defines the ScrollView container styling properties.
  * horizontal - when `true`, children of the ScrollView object are arranged horizontally.

  Scrollbars are automatically inserted on the perimeter of the container based on the `horizontal` property value.
  Scrolling is limited to the `height` or `width` property value set on contentContainerStyle.

  Otherwise, ScrollView behaves very similarly to the View object.
*/

import {
  PropTypes,
} from "horizon/core";

// import entire UI API module under the name "ui".
import * as ui from 'horizon/ui';


/*
  The following import is a different kind of import from the above.
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

// defines the ScrollView object called, "MyScrollView". Referenced in the top-level View definition in the initializeUI() method (see below).
const MyScrollView = ui.ScrollView({
  children: [
    ui.Text({ text: 'This is a line of content about Lorem Ipsum.\n\nThis maybe one, too.\n\nThis is a line of content about Lorem Ipsum.\n\nThis maybe one, too.\n\nThis is a line of content about Lorem Ipsum.\n\nThis maybe one, too.\n\n', style: {fontFamily: "Anton", fontSize: 18, color: "gray"}}),
  ],

  // contentContainerStyle defines properties of the ScrollView object's container.
  contentContainerStyle: { height: 1200, alignItems: 'flex-start' },
  horizontal: false,
  style: {
    height: 300,
    width: 200
  }
});

class Station03ScrollingUI extends ui.UIComponent<UITextureProps> {
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


  // These properties define the display panel of the custom UI.
  // Since the `height` prop of the contentContainerStyle object is larger than `panelHeight`, scrollbars are inserted.
  panelHeight = 800; // default value is 500. These values must be literals.
  panelWidth = 500; // default value is 500. These values must be literals.

  initializeUI() {
    return ui.View({
      children: [
        ui.Text({
          text: "Lord Lorem Ipsum" ,
          style: {
            fontFamily: "Anton",
            color: "blue",
            fontSize: 28,
            fontWeight: "bold",
            alignContent: "center"
          }
        }),
        ui.View({
          children: [
          MyScrollView,
          ui.View({
            children: [
              ui.Text({
              text: "Lorem's Pic" ,
              style: {
                fontFamily: "Anton",
                color: "black",
                fontSize: 24,
                fontWeight: "bold",
                alignContent: "center"
                }
              }),
              loadImage2(this.props.textureAsset, baseImage2Style),
            ],
            style: {
              flexDirection:"column",
              marginBottom: 24,
              paddingRight: 12,
              paddingLeft: 12
            }
          })
          ],
          style: {
            flexDirection:"row",
            padding: 18

          }
        })
      ],
      style: {
        flexDirection: "column",
        backgroundColor: "white",
        paddingTop: 36,
        paddingBottom: 36,
        paddingLeft: 18,
        paddingRight: 18
      }
    })
  }

}
ui.UIComponent.register(Station03ScrollingUI);
