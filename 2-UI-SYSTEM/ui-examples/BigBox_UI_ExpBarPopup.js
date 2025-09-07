"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigBox_ExpManager_1 = require("BigBox_ExpManager");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class BigBox_UI_ExpBarPopup extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.progressBarPercent = new ui_1.AnimatedBinding(0.8);
        this.currentLevel = new ui_1.Binding(0);
        this.expGained = new ui_1.Binding(0);
        this.verticalPosition = new ui_1.AnimatedBinding(0);
        this.defaultTextSize = 28;
        this.defaultLevelTextSize = 50;
        this.outlineSizeMult = 0.075; // How large the text outline should be as a fraction of the font size
    }
    start() {
        this.entity.visible.set(false);
        this.connectNetworkBroadcastEvent(BigBox_ExpManager_1.BigBox_ExpEvents.expUpdatedForPlayer, this.OnExpUpdatedForPlayer.bind(this));
        this.sendNetworkBroadcastEvent(BigBox_ExpManager_1.BigBox_ExpEvents.requestInitializeExpForPlayer, { player: this.entity.owner.get() });
    }
    initializeUI() {
        const progressBarFullHeight = 16; // Height of the background bar
        const progressInnerBarPadding = 2;
        const progressBorderRadius = 5;
        const levelTextView = (0, ui_1.View)({
            children: [
                BigBox_ExpManager_1.BigBox_Exp_UI_Utils.outlineText(this.currentLevel.derive(x => "Level " + x.toString()), this.defaultLevelTextSize * this.outlineSizeMult, {
                    fontFamily: "Roboto",
                    color: "white",
                    fontWeight: "700",
                    fontSize: this.defaultLevelTextSize,
                    alignItems: "center",
                    textAlign: "center",
                }),
                (0, ui_1.View)({
                    style: {
                        width: "100%",
                        flexDirection: "row",
                        height: 5,
                    }
                }),
            ]
        });
        const rootPanelStyle = {
            width: "30%",
            height: "20%",
            position: "absolute",
            top: this.verticalPosition.interpolate([0, 1], ["-20px", "0px"]),
            justifyContent: "flex-end", // Align vertical to the bottom
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center", // Align horizontal to the middle
        };
        const progressionBarView = (0, ui_1.View)({
            children: [
                // Container for the progress bar
                (0, ui_1.View)({
                    children: [
                        // Top "fill" bar
                        (0, ui_1.View)({
                            style: {
                                height: progressBarFullHeight - progressInnerBarPadding * 2,
                                width: this.progressBarPercent.interpolate([0, 1], ["0%", "100%"]),
                                backgroundColor: "lawngreen", // Fill
                                borderRadius: progressBorderRadius - progressInnerBarPadding, // Round the edges
                            },
                        }),
                    ],
                    style: {
                        height: progressBarFullHeight,
                        width: "100%", // Full width for the background bar
                        backgroundColor: "grey",
                        borderRadius: progressBorderRadius, // Round the edges
                        padding: progressInnerBarPadding, // Bring the edges in on all sides slightly
                        flexDirection: "row",
                    },
                }),
                // Text next to the entire progress bar
                BigBox_ExpManager_1.BigBox_Exp_UI_Utils.outlineText(this.expGained.derive(x => "+" + x.toString() + " xp"), this.defaultTextSize * this.outlineSizeMult, {
                    fontFamily: "Roboto",
                    color: "lawngreen",
                    fontWeight: "700",
                    fontSize: this.defaultTextSize,
                    alignItems: "center",
                    textAlign: "center",
                    marginLeft: 10, // Add some space between the bar and the text
                }),
            ],
            style: {
                flexDirection: "row", // Ensure children are laid out in a row
                alignItems: "center", // Center align vertically
            },
        });
        return (0, ui_1.View)({
            children: [
                levelTextView,
                progressionBarView
            ],
            style: rootPanelStyle,
        });
    }
    OnExpUpdatedForPlayer(data) {
        if (data.player === this.entity.owner.get() && data.gainedExp > 0) {
            this.entity.visible.set(true);
            this.expGained.set(data.gainedExp);
            this.progressBarPercent.set(x => {
                if (x > data.percentExpToNextLevel) {
                    return 0;
                }
                else {
                    return x;
                }
            });
            //this.progressBarPercent.set(data.percentExpToNextLevel);
            this.currentLevel.set(data.currentLevel);
            // Animate the view down
            this.verticalPosition.set((ui_1.Animation.timing(1, { duration: 500, easing: ui_1.Easing.inOut(ui_1.Easing.ease) })));
            this.async.setTimeout(() => {
                this.progressBarPercent.set(ui_1.Animation.timing(data.percentExpToNextLevel, { duration: 100, easing: ui_1.Easing.inOut(ui_1.Easing.ease) }));
            }, 600);
            this.async.setTimeout(() => {
                // Animate the view up
                this.verticalPosition.set((ui_1.Animation.timing(0, { duration: 500, easing: ui_1.Easing.inOut(ui_1.Easing.ease) })));
                this.async.setTimeout(() => {
                    this.entity.visible.set(false);
                }, 500);
            }, 3000);
        }
    }
}
BigBox_UI_ExpBarPopup.propsDefinition = {};
core_1.Component.register(BigBox_UI_ExpBarPopup);
