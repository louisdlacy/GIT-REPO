"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class SlidingBoxAnimationUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.animatedValue = new ui_1.AnimatedBinding(0);
    }
    preStart() {
        // Start the animation
        this.animateBox();
    }
    animateBox() {
        this.animatedValue.set(ui_1.Animation.timing(1, {
            duration: 1000,
            easing: ui_1.Easing.inOut(ui_1.Easing.ease)
        }), () => {
            // Reset and repeat
            this.animatedValue.set(ui_1.Animation.timing(0, {
                duration: 1000,
                easing: ui_1.Easing.inOut(ui_1.Easing.ease)
            }), () => this.animateBox());
        });
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    style: {
                        width: 100,
                        height: 100,
                        backgroundColor: 'black',
                        transform: [
                            { translateX: this.animatedValue.interpolate([0, 1], [0, 200]) }
                        ]
                    }
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(SlidingBoxAnimationUI);
