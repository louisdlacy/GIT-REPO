"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.button = exports.PopupResponse = exports.PopupRequest = void 0;
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const UI_SimpleButtonEvent_1 = require("UI_SimpleButtonEvent");
//region Popup Events
// A request/response event pair informs any requesting Entity when the player closes the popup. 
exports.PopupRequest = new core_1.NetworkEvent("PopupRequest");
exports.PopupResponse = new core_1.NetworkEvent("PopupResponse");
/**
 * This asset provides a simple and reusable Popup UI template
 * Features dynamic Title and Message
 * Animated show and hide action
 */
class UI_PopupManager extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 250;
        this.panelWidth = 500;
        //region bindings defined
        this.bndDisplay = new ui_1.Binding("flex");
        this.bndTitle = new ui_1.Binding("New Popup!");
        this.bndContent = new ui_1.Binding("Popup Content");
        this.bndWatermark = new ui_1.Binding(""); // Provide an initial value, e.g., empty string or default image source
        this.animBnd_posY = new ui_1.AnimatedBinding(1);
        //keeps track of which entity by which player requested the popup, so we can respond to the right entity when they close it
        this.requestResponseMap = new Map();
    }
    //region UI Initialization
    initializeUI() {
        if (!this.props.enabled)
            this.entity.visible.set(false);
        const defaultWatermark = ui_1.ImageSource.fromTextureAsset(this.props.defaultWatermark);
        this.bndWatermark.set(defaultWatermark);
        const bndBtnScale = new ui_1.Binding(1);
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Image)({
                    source: this.bndWatermark,
                    style: {
                        position: "absolute",
                        height: "100%",
                        width: "75%",
                        opacity: 0.4,
                        // layoutOrigin: [0.5, 0.5],
                        right: 0,
                        bottom: 5,
                    },
                }),
                //region UI Title
                (0, ui_1.Text)({
                    text: this.bndTitle,
                    style: {
                        fontSize: 50,
                        fontFamily: "Kallisto",
                        color: "rgba(3, 3, 3, 1)",
                        // backgroundColor: "rgba(255, 0, 0, 0.8)",
                        padding: 30,
                        top: "5%",
                        height: 110,
                        textAlignVertical: "center",
                        width: this.panelWidth,
                        position: "absolute",
                    },
                }),
                //region UI Content
                (0, ui_1.Text)({
                    text: this.bndContent,
                    style: {
                        fontSize: 28,
                        fontFamily: "Kallisto",
                        color: "rgba(3, 3, 3, 1)",
                        // backgroundColor: "rgba(51, 255, 0, 0.8)",
                        padding: 30,
                        top: "50%",
                        height: 100,
                        textAlignVertical: "center",
                        width: this.panelWidth,
                        position: "absolute",
                    },
                }),
                //region Pressable 
                (0, ui_1.Pressable)({
                    children: [...(0, exports.button)(new ui_1.Binding("OK!"), new ui_1.Binding(24), bndBtnScale)],
                    //Cancel
                    onPress: (player) => {
                        if (player) {
                            console.log(`Player ${player.name.get()} pressed the button`);
                        }
                        bndBtnScale.set(0.9, [player]);
                        this.async.setTimeout(() => {
                            bndBtnScale.set(1, [player]);
                            this.hidePopup(player);
                        }, 100);
                    },
                    style: {
                        width: 100,
                        height: 50,
                        position: "absolute",
                        //This would center the view
                        layoutOrigin: [0.5, 0],
                        left: "80%",
                        bottom: -20,
                    },
                }),
                //Optional image WIP
                // View({
                //   style: {
                //     backgroundColor: "rgba(255, 255, 255, 1)",
                //     position: "absolute",
                //     width: 150,
                //     height: 150,
                //     top: "90%",
                //     left: "50%",
                //     layoutOrigin: [.5, 0],
                //     borderRadius: 20,
                //     overflow: "visible",
                //     display: "none",
                //   },
                // }),
            ],
            //region UI Style
            style: {
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, 1)",
                height: this.panelHeight,
                width: this.panelWidth,
                layoutOrigin: [0.5, 0.5],
                left: "50%",
                top: "50%",
                position: "absolute",
                transform: [{ translateY: this.animBnd_posY }],
                display: this.bndDisplay,
            },
        });
    }
    //region preStart
    preStart() {
        if (!this.props.enabled)
            return;
        this.connectNetworkEvent(this.entity, exports.PopupRequest, (data) => {
            this.requestResponseMap.set(data.player, data.requester);
            this.showPopup(data.player, data.title, data.message);
        });
        this.connectNetworkEvent(this.entity, UI_SimpleButtonEvent_1.simpleButtonEvent, (data) => {
            this.showPopup(data.player, "Simple Button!", "Try assigning the 'Another Script Example' entity to the Simple Button");
        });
    }
    //region start
    start() {
        if (this.props.hideOnStart) {
            this.entity.visible.set(false);
        }
    }
    //region showPopup()
    showPopup(player, title, message) {
        this.bndTitle.set(title, [player]);
        this.bndContent.set(message, [player]);
        this.bndDisplay.set("flex", [player]);
        const startVal = -900;
        this.animBnd_posY.set(startVal);
        const defaultSequence = ui_1.Animation.sequence(ui_1.Animation.timing(0, {
            duration: 1000,
            easing: ui_1.Easing.elastic(1.0),
        }));
        this.animBnd_posY.set(defaultSequence, undefined, [player]);
    }
    //region hidePopup()
    hidePopup(player) {
        const defaultSequence = ui_1.Animation.sequence(ui_1.Animation.timing(-900, {
            duration: 700,
            easing: ui_1.Easing.sin,
        }));
        this.animBnd_posY.set(defaultSequence, () => {
            this.bndDisplay.set("none", [player]);
        }, [player]);
        const requester = this.requestResponseMap.get(player);
        if (requester) {
            console.log(`Sending popup response to ${requester.name.get()}`);
            this.sendNetworkEvent(requester, exports.PopupResponse, { player: player });
        }
    }
}
UI_PopupManager.propsDefinition = {
    // toggles the visibility of the popup
    enabled: { type: core_1.PropTypes.Boolean, default: true },
    hideOnStart: { type: core_1.PropTypes.Boolean, default: false },
    // the 
    defaultWatermark: { type: core_1.PropTypes.Asset },
};
ui_1.UIComponent.register(UI_PopupManager);
//region UI Button Defined
const button = (bndHeaderText, bndFontSize, bndBtnScale) => {
    return [
        (0, ui_1.Text)({
            text: bndHeaderText,
            style: {
                fontFamily: "Kallisto",
                width: "100%",
                height: "100%",
                alignSelf: "center",
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderRadius: 20,
                color: "rgba(2, 2, 2, 1)",
                fontSize: bndFontSize,
                textAlign: "center",
                textAlignVertical: "center",
                transform: [{ scale: bndBtnScale }],
                borderColor: "rgba(109, 109, 109, 1)",
                borderWidth: 3,
            },
        }),
    ];
};
exports.button = button;
