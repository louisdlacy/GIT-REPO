"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigBox_ExpManager_1 = require("BigBox_ExpManager");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class BigBox_UI_ExpBarPersistent extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.progressBarPercent = new ui_1.AnimatedBinding(0);
        this.currentLevel = new ui_1.Binding(1);
        this.defaultTextSize = 28;
        this.outlineSizeMult = 0.075; // How large the text outline should be as a fraction of the font size
    }
    start() {
        this.entity.visible.set(true);
        this.connectNetworkBroadcastEvent(BigBox_ExpManager_1.BigBox_ExpEvents.expUpdatedForPlayer, this.OnExpUpdatedForPlayer.bind(this));
        this.sendNetworkBroadcastEvent(BigBox_ExpManager_1.BigBox_ExpEvents.requestInitializeExpForPlayer, { player: this.entity.owner.get() });
    }
    initializeUI() {
        const progressBarFullHeight = 16; // Height of the background bar
        const progressInnerBarPadding = 2;
        const progressBorderRadius = 5;
        const levelTextView = (0, ui_1.View)({
            children: [
                BigBox_ExpManager_1.BigBox_Exp_UI_Utils.outlineText(this.currentLevel.derive(x => "Level " + x.toString()), this.defaultTextSize * this.outlineSizeMult, {
                    fontFamily: "Roboto",
                    color: "white",
                    fontWeight: "700",
                    fontSize: this.defaultTextSize,
                    alignItems: "center",
                    textAlign: "center",
                })
            ]
        });
        const rootPanelStyle = {
            width: "20%",
            height: "20%",
            position: "absolute",
            justifyContent: "flex-end", // Align vertical to the bottom
            alignContent: "center",
            alignSelf: "flex-start", // alight to left of screen
            alignItems: "flex-start", // Align horizontal to the middle
            marginLeft: "5%", // Add space on the left side
        };
        const progressionBarView = (0, ui_1.View)({
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
                width: "80%",
                backgroundColor: "darkolivegreen", // Background
                borderRadius: progressBorderRadius, // Round the edges
                padding: progressInnerBarPadding, // Bring the edges in on all sides slightly
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
        if (data.player === this.entity.owner.get()) {
            this.progressBarPercent.set(x => {
                if (x > data.percentExpToNextLevel) {
                    return 0;
                }
                else {
                    return x;
                }
            });
            this.progressBarPercent.set(ui_1.Animation.timing(data.percentExpToNextLevel, { duration: 100, easing: ui_1.Easing.inOut(ui_1.Easing.ease) }));
            this.currentLevel.set(data.currentLevel);
        }
    }
}
BigBox_UI_ExpBarPersistent.propsDefinition = {};
core_1.Component.register(BigBox_UI_ExpBarPersistent);
