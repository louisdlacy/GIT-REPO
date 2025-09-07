"use strict";
/*
  Station 9b: Animation - Start and Stop Animation

  This station demonstrates how to animate images in a custom UI by scaling the Y-coordinate of the asset. You can
  also press the button in the custom UI to toggle start/stop of animation playback.

*/
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const StationAll_CustomUI_Library_1 = require("StationAll-CustomUI-Library");
/*
    Similar to Station09a. Key differences:
    * Instead of setting the animation binding to scale width, we set it to scale height.
    * The animationOn flag gates execution of subsequent animation.
    * animation is started and restarted through the startAnimation() function.
    * animation is stopped using the stopAnimation() method on varScaleY.
*/
// flag to control whether to run the animation or not.
let animationOn = 1;
// for animation, we define the binding variable varScaleY. We initialize it with a value of 0.
const varScaleY = new ui_1.AnimatedBinding(0);
/*
  Following function starts (or restarts) the animated sequence
*/
function startAnimation(myScaleY) {
    myScaleY.set(ui_1.Animation.repeat(ui_1.Animation.sequence(ui_1.Animation.delay(250, ui_1.Animation.timing(1, {
        duration: 750,
        easing: ui_1.Easing.inOut(ui_1.Easing.ease),
    })), ui_1.Animation.delay(250, ui_1.Animation.timing(0, {
        duration: 750,
        easing: ui_1.Easing.inOut(ui_1.Easing.ease),
    })))));
}
function MyButton(props) {
    const DEFAULT_COLOR = "green";
    const HOVERED_COLOR = "blue";
    const backgroundColor = new ui_1.Binding(DEFAULT_COLOR);
    const buttonText = new ui_1.Binding("Stop");
    return (0, ui_1.Pressable)({
        children: (0, ui_1.Text)({
            text: buttonText,
            style: { color: "white" },
        }),
        onClick: () => {
            if (animationOn == 1) {
                varScaleY.stopAnimation();
                animationOn = 0;
                buttonText.set("Start");
            }
            else {
                startAnimation(varScaleY);
                animationOn = 1;
                buttonText.set("Stop");
            }
        },
        onEnter: (player) => {
            backgroundColor.set(HOVERED_COLOR, [player]);
        },
        onExit: (player) => {
            backgroundColor.set(DEFAULT_COLOR, [player]);
        },
        style: {
            backgroundColor: backgroundColor,
            borderRadius: 8,
            height: 36,
            width: 120,
            alignItems: "center",
            justifyContent: "center",
            // additional styles are spread the last
            // to override default styles
            ...props.style,
        },
    });
}
class StartStopAnimation extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 400;
        this.panelWidth = 300;
    }
    /*
      This initializeUI() method defines the customUI panel.
    */
    initializeUI() {
        /*
            Same basic functionality as Station09a.
        */
        // Following captures the Property textureAsset to a local variable for use, which is required for TS v2.0.0 or later.
        let ta = this.props.textureAsset;
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text: "Start and Stop Anim" }),
                (0, ui_1.View)({
                    children: [(0, StationAll_CustomUI_Library_1.loadImage2)(ta, { height: 250, width: 250 })],
                    style: {
                        height: 200, width: 250,
                        transform: [{ scaleY: varScaleY },],
                        transformOrigin: [0, 0],
                    },
                }),
                (0, ui_1.Text)({ text: " " }),
                (0, ui_1.View)({
                    children: [
                        MyButton({
                            label: "Stop",
                            baseColor: "white",
                            onClick: () => {
                            },
                            style: {
                                alignContent: "center",
                            },
                        }),
                    ],
                }),
            ],
            style: {
                backgroundColor: "black",
                alignItems: "center",
            },
        });
    }
    start() {
        /*
            Here, the animated sequence is defined in a separate function.
    
            We insert the call in the start() method to ensure that the animation gets set before other code is executed.
    
            The setting of the varScaleY binding is wrapped in a Promise that kicks in after a 0.5 second timeout. This is done to allow time
            for the image to be loaded through LoadImage2. If the animation is begun before the image is loaded, it may fail to start.
        */
        const timerPromise = new Promise((resolve, reject) => {
            this.async.setTimeout(() => {
                resolve("timeout 0.5 seconds");
                startAnimation(varScaleY);
            }, 500);
            reject("timeout 0.5 seconds failed");
        });
    }
}
/*
  This property definition defines the textureAsset property to be the value selected from
  the PropTypes.Asset drop-down property on the Properties panel.
*/
StartStopAnimation.propsDefinition = {
    textureAsset: { type: core_1.PropTypes.Asset },
};
ui_1.UIComponent.register(StartStopAnimation);
