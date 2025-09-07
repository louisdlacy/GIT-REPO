"use strict";
/*
  Station 9a: Animation - Scrolling assets

  This station demonstrates how to animate images in a custom UI by scaling the X-coordinate of the asset.

*/
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const StationAll_CustomUI_Library_1 = require("StationAll-CustomUI-Library");
/*
  Define variable for the AnimatedBinding that will be used to scale the width of the image. This var
  must be available to both initializeUI() and start() methods.

  Var is a multiple of the original value. Var is initially set to 0, which means that image
  container initially appears as empty.
*/
let varScaleX = new ui_1.AnimatedBinding(0);
class FillImage extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 400;
        this.panelWidth = 400;
    }
    /*
      This initializeUI() method defines the customUI panel.
    
    */
    initializeUI() {
        // Following captures the Property textureAsset to a local variable for use, which is required for TS v2.0.0 or later.
        let ta = this.props.textureAsset;
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text: "Animating Width" }),
                (0, ui_1.View)({
                    children: [(0, StationAll_CustomUI_Library_1.loadImage2)(ta, { height: 200, width: 200 })],
                    style: {
                        transform: [{ scaleX: varScaleX },],
                        transformOrigin: [0, 0],
                    },
                }),
            ],
            style: {
                backgroundColor: "black",
                alignItems: "flex-start",
            },
        });
    }
    ;
    preStart() {
        /*
            Here, the animated sequence is defined in two animations, timed at 750ms each. One scales the width of the image
            to 1x the original size, while the other contracts it back to 0. Each is delayed by 250ms, which makes the
            entire sequence of two animations 2 seconds in duration. The sequence is set to repeat indefinitely.
    
            We insert the call in the preStart() method to ensure that the animation gets set before other code is executed.
    
            The setting of the varScaleX binding is wrapped in a Promise that kicks in after a 0.5 second timeout. This is done to allow time
            for the image to be loaded through LoadImage2. If the animation is begun before the image is loaded, it may fail to start.
        */
        const timerPromise = new Promise((resolve, reject) => {
            this.async.setTimeout(() => {
                resolve("timeout 0.5 seconds");
                varScaleX.set(ui_1.Animation.repeat(ui_1.Animation.sequence(ui_1.Animation.delay(250, ui_1.Animation.timing(1, {
                    duration: 750,
                    easing: ui_1.Easing.inOut(ui_1.Easing.ease),
                })), ui_1.Animation.delay(250, ui_1.Animation.timing(0, {
                    duration: 750,
                    easing: ui_1.Easing.inOut(ui_1.Easing.ease),
                })))));
            }, 500);
            reject("timeout 0.5 seconds failed");
        });
    }
    start() {
    }
}
/*
  This property definition defines the textureAsset property to be the value selected from
  the PropTypes.Asset drop-down property on the Properties panel.
*/
FillImage.propsDefinition = {
    textureAsset: { type: core_1.PropTypes.Asset },
};
;
ui_1.UIComponent.register(FillImage);
