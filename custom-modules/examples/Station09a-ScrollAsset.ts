/*
  Station 9a: Animation - Scrolling assets

  This station demonstrates how to animate images in a custom UI by scaling the X-coordinate of the asset.

*/

import {
  PropTypes,
} from "horizon/core";

import {
  UIComponent,
  View,
  Text,
  AnimatedBinding,
  Animation,
  Easing
} from "horizon/ui";


import { loadImage2 } from 'StationAll-CustomUI-Library'
import { type UITextureProps } from 'StationAll-CustomUI-Library'

/*
  Define variable for the AnimatedBinding that will be used to scale the width of the image. This var
  must be available to both initializeUI() and start() methods.

  Var is a multiple of the original value. Var is initially set to 0, which means that image 
  container initially appears as empty.
*/
let varScaleX: AnimatedBinding = new AnimatedBinding(0);


class FillImage extends UIComponent<UITextureProps> {
  panelHeight = 400;
  panelWidth = 400;

/*
  This property definition defines the textureAsset property to be the value selected from
  the PropTypes.Asset drop-down property on the Properties panel.
*/
  static propsDefinition = {
    textureAsset: { type: PropTypes.Asset },
  };

/*
  This initializeUI() method defines the customUI panel.

*/

initializeUI() {

    // Following captures the Property textureAsset to a local variable for use, which is required for TS v2.0.0 or later.
    let ta: any | undefined = this.props.textureAsset
      return View({
      children: [
        Text({ text: "Animating Width" }),
        View({
          children: [loadImage2(ta, {height: 200, width: 200})], 
          style: {
            transform: [{ scaleX: varScaleX }, ],
            transformOrigin: [0,0],
          },
        }),
      ],
      style: {
        backgroundColor: "black",
        alignItems: "flex-start",
      },
    });
  };

  preStart() {
    /*
        Here, the animated sequence is defined in two animations, timed at 750ms each. One scales the width of the image 
        to 1x the original size, while the other contracts it back to 0. Each is delayed by 250ms, which makes the 
        entire sequence of two animations 2 seconds in duration. The sequence is set to repeat indefinitely.

        We insert the call in the preStart() method to ensure that the animation gets set before other code is executed.

        The setting of the varScaleX binding is wrapped in a Promise that kicks in after a 0.5 second timeout. This is done to allow time
        for the image to be loaded through LoadImage2. If the animation is begun before the image is loaded, it may fail to start.
    */
   const timerPromise = new Promise<string>((resolve, reject) => {
      this.async.setTimeout(() => {
        resolve("timeout 0.5 seconds") 
        varScaleX.set(Animation.repeat(
          Animation.sequence(
            Animation.delay(250,Animation.timing(1,{
              duration: 750,
              easing: Easing.inOut(Easing.ease),
            })),
            Animation.delay(250,Animation.timing(0,{
              duration: 750,
              easing: Easing.inOut(Easing.ease),
            }))
          )
        ))
          }, 500) 
      reject("timeout 0.5 seconds failed")
    })
  }

  start() {

  }
};

UIComponent.register(FillImage);
