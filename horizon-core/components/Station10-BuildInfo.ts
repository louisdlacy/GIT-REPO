/*
  Station 10b: Build Info in Non-Interactive Overlay

  This station demonstrates use of the non-interactive Screen Overlay for inserting user-defined build
  information on the screen.


  IMPORTANT: When you add the custom UI gizmo,
  make sure to set the value of Display mode to "Screen Overlay"
  for non-interactive screen overlays (HUDs).
*/

import * as hz from 'horizon/core';
import {
  UIComponent,
  View,
  Text,
  Binding,
} from "horizon/ui";

class Station10_BuildInfo extends UIComponent<typeof Station10_BuildInfo> {
  static propsDefinition = {
    enabled: {type: hz.PropTypes.Boolean, default: true},
    buildMessage: {type: hz.PropTypes.String},
    buildNumber: {type: hz.PropTypes.String},
  };

  // Define bindings for the custom UI.
  strBuildMessage = new Binding<string>('Build:');
  strBuildNumber = new Binding<string>('1234.567');
  strDisplay = new Binding<string>('flex')

  /*
  Defines the custom UI
*/
initializeUI() {
  /*
    Define values for bindings.
  */
  if (this.props.enabled == false) {
    this.strDisplay.set('none')
  } else {
    this.strDisplay.set('flex')
  }
  let bM: string | undefined = this.props.buildMessage
  if (bM) {
    this.strBuildMessage.set(bM)
  }
  let bN: string | undefined = this.props.buildNumber
  if (bN) {
    this.strBuildNumber.set(bN)
  }
  /*
    initializeUI() must return a View object. 
  */
  return View({
    children: [
      Text({ text: this.strBuildMessage, style: { 
        fontFamily: "Roboto", 
        color: "black",
        fontWeight: "600", 
        fontSize: 18,
        alignItems: "flex-end",
      } }),
      Text({ text: this.strBuildNumber, style: { 
        fontFamily: "Roboto", 
        color: "black",
        fontWeight: "600", 
        fontSize: 18,
        alignItems: "flex-end",
      } }),

      ],
    // These style elements apply to the entire custom UI panel.
    style: { 
      position: "absolute", // IMPORTANT: This attribute must be set to "absolute" for non-interactive overlays.
      display: this.strDisplay,
      flexDirection: "row",
      alignItems: "flex-end",
      padding: 2,
      left: 4, // IMPORTANT: This value determines the absolute location in pixels of the UI relative to left margin.
      bottom: 4, // IMPORTANT: This value determines the absolute location in pixels of the UI relative to bottom margin.
  },
  });
}
  start() {}
}
hz.Component.register(Station10_BuildInfo);