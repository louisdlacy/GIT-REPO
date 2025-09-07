"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class ProgressBar extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.animationValueBinding = new ui_1.AnimatedBinding(0);
        this.progressValueBinding = new ui_1.Binding(0);
        this.currentProgress = 0;
        this.maxProgress = 100;
        //These 2 are for testing. They can be removed once you connect this component to an event
        this.incrementAmount = 10;
        this.incrementInterval = 3000; // 3 seconds
    }
    preStart() {
        console.log('Bar component started');
        //Testing increment progress every 3 seconds
        this.async.setInterval(() => {
            this.incrementProgress({ incrementAmount: this.incrementAmount });
        }, this.incrementInterval);
    }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                //Progress bar container
                (0, ui_1.View)({
                    style: {
                        width: '100%',
                        height: 30,
                        backgroundColor: 'white',
                        borderRadius: 5,
                        overflow: 'hidden'
                    },
                    children: [
                        // Progress bar fill
                        (0, ui_1.View)({
                            style: {
                                height: '100%',
                                backgroundColor: 'green',
                                width: this.animationValueBinding.interpolate([0, 1], ['0%', '100%']),
                                borderRadius: 5
                            }
                        })
                    ]
                }),
                // Progress text
                (0, ui_1.Text)({
                    style: {
                        marginTop: 10,
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    },
                    text: this.progressValueBinding.derive(v => `${Math.round(v * 100)}%`),
                })
            ],
            style: {
                flex: 1
            },
        });
    }
    incrementProgress(data) {
        if (this.currentProgress < this.maxProgress) {
            this.currentProgress += data.incrementAmount;
            // Ensure we don't exceed maxProgress
            if (this.currentProgress > this.maxProgress) {
                this.currentProgress = this.maxProgress;
            }
            const progressRatio = this.currentProgress / this.maxProgress;
            // Update the number binding with the current progress ratio
            this.progressValueBinding.set(progressRatio);
            // Animate to the new progress value
            this.animationValueBinding.set(ui_1.Animation.timing(progressRatio, {
                duration: 500,
                easing: ui_1.Easing.inOut(ui_1.Easing.ease)
            }));
        }
    }
}
ProgressBar.propsDefinition = {};
