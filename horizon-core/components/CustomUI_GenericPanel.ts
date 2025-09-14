
import * as hz from 'horizon/core';

import {
  UIComponent,
  View,
  Text,
  Binding,
} from "horizon/ui";

/**
 * A generic three part panel for custom UIs consisting of a title, subtitle, and body.
 */
export class CustomUI_GenericPanel extends UIComponent {

  static propsDefinition = {
    title: { type: hz.PropTypes.String },
    subTitle: { type: hz.PropTypes.String },
    body: { type: hz.PropTypes.String }
  };

  // Following are fixed values (no variables permitted) for the height and width of the custom UI panel.
  panelHeight = 1200;
  panelWidth = 1600;

  // Following are special variables (bindings) for applying variable values to custom UIs.
  bndTitleText = new Binding<string>('');
  bndSubTitleText = new Binding<string>('');
  bndbodyText = new Binding<string>('');

  initializeUI() {
    this.bndTitleText.set(this.props.title);
    this.bndSubTitleText.set(this.props.subTitle);

    this.bndbodyText.set(this.props.body);

    // A custom UI is defined as View that is returned from the initializeUI() method.
    return View({
      children: [
        View({
          children: [
            Text({
              text: this.bndTitleText,
              style: {
                color: "black",
                fontSize: 72,
                fontWeight: "800",
              }
            })
          ],
          style: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "flex-end",
            justifyContent: "space-between",
          },
        }),
        View({
          children: [
            Text({
              text: this.bndSubTitleText,
              style: { color: "black", fontSize: 36, fontWeight: "600" }
            }),
            Text({
              text: this.bndbodyText,
              style: { color: "black", fontSize: 36 }
            }),
          ],
          style: {
            flexDirection: "column",
            paddingTop: 18,
          },
        })
      ],
      // These style elements apply to the entire custom UI panel.
      // Note here that the double forward slashes are used for commenting a single line.
      style: {
        backgroundColor: "white",
        borderColor: "#00008B", // dark blue in RGB hex value
        borderWidth: 12,
        borderRadius: 25,
        padding: 20,
        flexDirection: "column",
        alignItems: "stretch",
      },
    });
  };
};
UIComponent.register(CustomUI_GenericPanel);
