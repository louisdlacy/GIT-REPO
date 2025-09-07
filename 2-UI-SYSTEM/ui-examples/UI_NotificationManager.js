"use strict";
// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.easeTypes = exports.NotificationEvent = void 0;
exports.cycleEaseTypesAndVariation = cycleEaseTypesAndVariation;
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const UI_SimpleButtonEvent_1 = require("UI_SimpleButtonEvent");
//region define events
exports.NotificationEvent = new core_1.NetworkEvent("NotificationEvent");
class UI_NotificationManager extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 100;
        this.panelWidth = 400;
        //region bindings defined
        this.bndAlertImg = new ui_1.Binding("");
        this.bndAlertMsg = new ui_1.Binding("Looking good today!");
        this.animBnd_translateX = new ui_1.AnimatedBinding(0);
        //simple button variables
        this.easeTypeIndex = 0;
        this.easeVariation = 0;
    }
    //region Initialize UI
    initializeUI() {
        this.bndAlertImg.set(ui_1.ImageSource.fromTextureAsset(this.props.notificationImg));
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Image)({
                    source: this.bndAlertImg,
                    style: {
                        height: 80,
                        width: 80,
                        alignSelf: "center",
                        margin: 10,
                        borderRadius: 40,
                        // backgroundColor: 'rgba(229, 233, 0, 1)',
                    },
                }),
                (0, ui_1.Text)({
                    text: this.bndAlertMsg,
                    style: {
                        fontSize: 25,
                        color: "rgba(255, 255, 255, 1)",
                        alignSelf: "center",
                        textAlign: "left",
                        textAlignVertical: "center",
                        height: this.panelHeight,
                        width: 280,
                        padding: 10,
                        fontWeight: "bold", // Make text bold
                        // backgroundColor: 'rgba(0, 255, 85, 1)',
                    },
                }),
            ],
            style: {
                flexDirection: "row",
                backgroundColor: "rgba(255, 0, 0, 1)",
                layoutOrigin: [0.5, 0.5],
                left: "50%",
                top: "50%",
                height: this.panelHeight,
                width: this.panelWidth,
                borderRadius: 60,
                transform: [{ translateX: this.animBnd_translateX }],
            },
        });
    }
    //region preStart()
    preStart() {
        this.easing = ui_1.Easing.inOut(ui_1.Easing.cubic);
        this.connectNetworkEvent(this.entity, exports.NotificationEvent, (data) => {
            this.populateNotification(data.message, data.players, data.imageAssetId);
        });
        this.connectNetworkEvent(this.entity, UI_SimpleButtonEvent_1.simpleButtonEvent, (data) => {
            this.simpleButtonPressed(data.player);
        });
    }
    //region start()
    start() {
        if (this.props.hideOnStart) {
            this.entity.visible.set(false);
        }
        else {
            this.showNotification();
        }
    }
    //region populateNotification()
    //Populate notification with required message and optional player & imageAssetId
    populateNotification(message, players, imageAssetId) {
        const asset = imageAssetId ? new core_1.Asset(BigInt(imageAssetId)) : this.props.notificationImg;
        const imgSrc = ui_1.ImageSource.fromTextureAsset(asset);
        let recipients = players.length > 0 ? players : undefined;
        this.bndAlertImg.set(imgSrc, recipients);
        this.bndAlertMsg.set(message, recipients);
        this.showNotification(recipients);
    }
    //region showNotification()
    showNotification(recipients = null) {
        //set the UI alll the way to the right
        this.animBnd_translateX.set(1000);
        const defaultSequence = ui_1.Animation.sequence(
        //Move the UI to the center(0px) over 800ms
        ui_1.Animation.timing(0, {
            duration: 800,
            easing: this.easing,
        }), 
        //wait for 1500ms
        ui_1.Animation.delay(
        //Notice delay wraps the next animation
        1500, 
        //then move the UI alll the way to the left(-1000px) over 1000ms
        ui_1.Animation.timing(-1000, {
            duration: 800,
            easing: this.easing,
        })));
        this.animBnd_translateX.set(
        //apply the animation sequence
        defaultSequence, 
        //this could easily be an arrow function () => {console.log("Anim finished");},
        undefined, 
        //if recipients array has players then only show to those players
        //if recipients array is null, set to undefined == show to all players
        //that's what the ?? is doing
        recipients ?? undefined);
    }
    // region UI Simple Button
    /*
      Import the `UI Simple Button` asset by (RocketTrouble)
      and assign this entity to its -targetEntity- to access
      the functionality below!
    */
    simpleButtonPressed(player) {
        const result = cycleEaseTypesAndVariation(this.easeTypeIndex, this.easeVariation);
        this.easeTypeIndex = result[0];
        this.easeVariation = result[1];
        const easeDisplay = result[2];
        const ease = exports.easeTypes[this.easeTypeIndex][0];
        if (this.easeVariation === 1) {
            this.easing = ui_1.Easing.in(ease);
        }
        else if (this.easeVariation === 2) {
            this.easing = ui_1.Easing.inOut(ease);
        }
        else {
            this.easing = ease;
        }
        this.populateNotification(easeDisplay, [player], null);
    }
}
UI_NotificationManager.propsDefinition = {
    hideOnStart: { type: core_1.PropTypes.Boolean, default: false },
    notificationImg: { type: core_1.PropTypes.Asset },
};
ui_1.UIComponent.register(UI_NotificationManager);
//region CycleEase Logic
function cycleEaseTypesAndVariation(easeTypeIndex, variationIndex) {
    // Cycle through all the ease types, then toggle ease variation after a full cycle
    // 0: normal, 1: in, 2: inOut
    let newEaseTypeIndex = easeTypeIndex;
    let newVariationIndex = variationIndex;
    newEaseTypeIndex++;
    if (newEaseTypeIndex >= exports.easeTypes.length) {
        newEaseTypeIndex = 0;
        newVariationIndex = newVariationIndex + 1 > 2 ? 0 : newVariationIndex + 1;
    }
    console.log(`variation: ${newVariationIndex}, index: ${newEaseTypeIndex}`);
    // Determine the string to display
    let easeLabel = exports.easeTypes[newEaseTypeIndex][1];
    let displayString = "";
    if (newVariationIndex === 1) {
        displayString = `Easing.in(${easeLabel})`;
    }
    else if (newVariationIndex === 2) {
        displayString = `Easing.inOut(${easeLabel})`;
    }
    else {
        displayString = `Easing.${easeLabel}`;
    }
    return [newEaseTypeIndex, newVariationIndex, displayString];
}
//region Easing Types
exports.easeTypes = [
    [ui_1.Easing.linear, "linear"],
    [ui_1.Easing.ease, "ease"],
    [ui_1.Easing.quad, "quad"],
    [ui_1.Easing.cubic, "cubic"],
    [ui_1.Easing.poly(4), "poly(4)"],
    [ui_1.Easing.sin, "sin"],
    [ui_1.Easing.exp, "exp"],
    [ui_1.Easing.circle, "circle"],
    [ui_1.Easing.bounce, "bounce"],
    [ui_1.Easing.back, "back"],
    [ui_1.Easing.elastic(2), "elastic(2)"],
];
